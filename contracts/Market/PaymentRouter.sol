// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PaymentRouter
 * @notice Accepts ETH or whitelisted ERC20. Converts a USD price (1e18) to token amount using an oracle.
 * Oracle must return tokenUSD (1e18) i.e., how many USD (1e18) per 1 token (1e18). For ETH, use token=address(0).
 */
interface IPriceOracle { function tokenUsdPrice(address token) external view returns (uint256 usdPerToken1e18); }

contract PaymentRouter is AccessControl {
    using SafeERC20 for IERC20;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IPriceOracle public oracle;
    mapping(address => bool) public acceptedToken; // token => whitelisted; address(0)=ETH
    address public payout; // default payout if none provided

    event OracleSet(address oracle);
    event TokenSet(address token, bool accepted);
    event PayoutSet(address payout);
    event Paid(address payer, address token, uint256 amount, address to);

    constructor(address admin, address oracle_, address payout_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        oracle = IPriceOracle(oracle_);
        payout = payout_;
    }

    function setOracle(address o) external onlyRole(ADMIN_ROLE){ oracle = IPriceOracle(o); emit OracleSet(o); }
    function setToken(address token, bool ok) external onlyRole(ADMIN_ROLE){ acceptedToken[token]=ok; emit TokenSet(token,ok); }
    function setPayout(address p) external onlyRole(ADMIN_ROLE){ payout=p; emit PayoutSet(p); }

    /// @notice Pay `priceUsd1e18` in chosen token to `to` (or default payout if to=0).
    function pay(address token, uint256 priceUsd1e18, address to) external payable returns (uint256 paid) {
        require(acceptedToken[token], "token not accepted");
        address receiver = to==address(0)? payout : to;
        require(receiver!=address(0), "payout=0");

        if (token == address(0)) {
            // ETH path
            uint256 usdPerEth = oracle.tokenUsdPrice(address(0)); // USD/ETH (1e18)
            require(usdPerEth>0, "oracle");
            // amountETH = priceUsd / usdPerEth
            uint256 need = (priceUsd1e18 * 1e18) / usdPerEth;
            require(msg.value == need, "bad ETH");
            (bool ok,) = payable(receiver).call{value: need}("");
            require(ok, "eth xfer");
            paid = need;
        } else {
            uint256 usdPerToken = oracle.tokenUsdPrice(token);
            require(usdPerToken>0, "oracle");
            uint256 decimals = 18; // assume 18; if not, set accepted tokens to 18-decimals or wrap
            uint256 need = (priceUsd1e18 * (10**decimals)) / usdPerToken;
            IERC20(token).safeTransferFrom(msg.sender, receiver, need);
            paid = need;
        }
        emit Paid(msg.sender, token, paid, receiver);
    }

    receive() external payable {}
}
