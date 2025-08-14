// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PrimarySaleSplitter
 * @notice Splits incoming ETH/ERC20 by percentages. Use as payout receiver in sales/mints.
 */
contract PrimarySaleSplitter is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address[] public recipients;
    uint96[] public sharesBps; // sum to 10000

    event SplitConfigured(address[] recipients, uint96[] shares);
    event Paid(address token, uint256 amount);

    constructor(address admin, address[] memory recips, uint96[] memory shares) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _setSplit(recips, shares);
    }

    function setSplit(address[] calldata recips, uint96[] calldata shares) external onlyRole(ADMIN_ROLE) {
        _setSplit(recips, shares);
    }

    function _setSplit(address[] memory recips, uint96[] memory shares) internal {
        require(recips.length == shares.length && recips.length>0, "len");
        uint256 sum;
        for (uint256 i=0;i<shares.length;i++){ sum += shares[i]; require(recips[i]!=address(0),"rcp0"); }
        require(sum == 10_000, "sum!=100%");
        recipients = recips; sharesBps = shares;
        emit SplitConfigured(recips, shares);
    }

    // Pull-based: anyone can trigger distribution of current ETH / token balance
    function distributeETH() public {
        uint256 bal = address(this).balance;
        _splitETH(bal);
        emit Paid(address(0), bal);
    }

    function distributeToken(IERC20 token) public {
        uint256 bal = token.balanceOf(address(this));
        _splitERC20(token, bal);
        emit Paid(address(token), bal);
    }

    function _splitETH(uint256 amount) internal {
        if (amount == 0) return;
        for (uint256 i=0;i<recipients.length;i++){
            uint256 part = amount * sharesBps[i] / 10_000;
            (bool ok,) = payable(recipients[i]).call{value: part}("");
            require(ok, "eth xfer");
        }
    }

    function _splitERC20(IERC20 token, uint256 amount) internal {
        if (amount == 0) return;
        for (uint256 i=0;i<recipients.length;i++){
            uint256 part = amount * sharesBps[i] / 10_000;
            token.safeTransfer(recipients[i], part);
        }
    }

    receive() external payable { distributeETH(); }
}
