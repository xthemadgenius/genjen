// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RevenueVault
 * @notice Auto-routes ETH/ERC20 revenue (fees/royalties) to destinations.
 *         Supports hierarchical routes:
 *           1) (collection, tag) specific
 *           2) (collection, defaultTag=0x00)
 *           3) (any collection, tag)
 *           4) global default
 *
 *         Splits are basis-points (sum = 10000). Payout happens immediately on deposit.
 *
 * @dev `tag` is an arbitrary bytes32 you define (e.g., keccak256("PROTOCOL_FEE"), "ROYALTY").
 */
contract RevenueVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct Route {
        address[] recipients; // length N
        uint96[]  bps;        // sum to 10000
        bool      exists;
    }

    // keys
    // key(collection, tag). Use collection = address(0) for global or for "any collection".
    mapping(bytes32 => Route) private _route;

    bytes32 public constant DEFAULT_TAG = bytes32(0);

    event RouteSet(address indexed collection, bytes32 indexed tag, address[] recipients, uint96[] bps);
    event DepositedETH(address indexed from, address indexed collection, bytes32 indexed tag, uint256 amount);
    event DepositedERC20(address indexed token, address indexed from, address indexed collection, bytes32 tag, uint256 amount);
    event Paid(address indexed token, address indexed to, uint256 amount);

    error BadRoute();
    error NoRoute();

    constructor(address admin, address[] memory defaultRecipients, uint96[] memory defaultBps) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        _setRoute(address(0), DEFAULT_TAG, defaultRecipients, defaultBps);
    }

    // -------------- Admin --------------
    function setRoute(address collection, bytes32 tag, address[] calldata recipients, uint96[] calldata bps)
        external
        onlyRole(MANAGER_ROLE)
    { _setRoute(collection, tag, recipients, bps); }

    function _setRoute(address collection, bytes32 tag, address[] memory recipients, uint96[] memory bps) internal {
        if (recipients.length == 0 || recipients.length != bps.length) revert BadRoute();
        uint256 sum;
        for (uint256 i = 0; i < bps.length; i++) {
            sum += bps[i];
            require(recipients[i] != address(0), "recipient=0");
        }
        require(sum == 10_000, "sum!=100%");
        bytes32 k = _key(collection, tag);
        _route[k] = Route({recipients: recipients, bps: bps, exists: true});
        emit RouteSet(collection, tag, recipients, bps);
    }

    // -------------- Deposit ETH --------------
    function depositETH(address collection, bytes32 tag) external payable nonReentrant {
        require(msg.value > 0, "no ETH");
        Route memory r = _resolve(collection, tag);
        emit DepositedETH(msg.sender, collection, tag, msg.value);
        _splitETH(r, msg.value);
    }

    // -------------- Deposit ERC20 --------------
    function depositERC20(IERC20 token, uint256 amount, address collection, bytes32 tag) external nonReentrant {
        require(amount > 0, "no amount");
        token.safeTransferFrom(msg.sender, address(this), amount);
        Route memory r = _resolve(collection, tag);
        emit DepositedERC20(address(token), msg.sender, collection, tag, amount);
        _splitERC20(token, r, amount);
    }

    // -------------- Internals --------------
    function _key(address collection, bytes32 tag) internal pure returns (bytes32) {
        return keccak256(abi.encode(collection, tag));
    }

    function _resolve(address collection, bytes32 tag) internal view returns (Route memory r) {
        // 1) (collection, tag)
        r = _route[_key(collection, tag)];
        if (r.exists) return r;
        // 2) (collection, default)
        r = _route[_key(collection, DEFAULT_TAG)];
        if (r.exists) return r;
        // 3) (any, tag)
        r = _route[_key(address(0), tag)];
        if (r.exists) return r;
        // 4) (any, default) => must exist (set in constructor)
        r = _route[_key(address(0), DEFAULT_TAG)];
        if (!r.exists) revert NoRoute();
    }

    function _splitETH(Route memory r, uint256 amount) internal {
        for (uint256 i = 0; i < r.recipients.length; i++) {
            uint256 part = (amount * r.bps[i]) / 10_000;
            (bool ok, ) = payable(r.recipients[i]).call{value: part}("");
            require(ok, "eth xfer");
            emit Paid(address(0), r.recipients[i], part);
        }
    }

    function _splitERC20(IERC20 token, Route memory r, uint256 amount) internal {
        for (uint256 i = 0; i < r.recipients.length; i++) {
            uint256 part = (amount * r.bps[i]) / 10_000;
            token.safeTransfer(r.recipients[i], part);
            emit Paid(address(token), r.recipients[i], part);
        }
    }

    receive() external payable {
        // auto-route to global default for blind transfers
        Route memory r = _route[_key(address(0), DEFAULT_TAG)];
        _splitETH(r, msg.value);
    }
}
