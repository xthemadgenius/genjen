// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SubscriptionManager
 * @notice Plan-based subscriptions that mint/renew a UtilityNFT Subscription token.
 *         - Each plan links to a UtilityNFT `id` and default `duration`
 *         - Charges in ETH or ERC20 (optional). If price is 0, it's free (sponsored)
 *         - Calls UtilityNFT.mintSubscription(to, id, 1, duration)
 *
 * Requirements:
 *   - This contract must have ISSUER_ROLE on the UtilityNFT.
 */
interface IUtilityNFT {
    function mintSubscription(address to, uint256 id, uint256 amount, uint64 duration) external;
    function isActive(address account, uint256 id) external view returns (bool);
}

contract SubscriptionManager is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant BILLER_ROLE  = keccak256("BILLER_ROLE"); // can create/edit plans

    IUtilityNFT public immutable utility;

    struct Plan {
        bool    active;
        uint256 utilityId;      // UtilityNFT token id (must be kind Subscription)
        uint64  duration;       // seconds per cycle
        address paymentToken;   // ERC20 token or address(0) for ETH
        uint256 pricePerCycle;  // in smallest unit (wei or ERC20 decimals)
        address payout;         // where funds go (e.g., creator or treasury)
    }

    // planId => Plan
    mapping(uint256 => Plan) public plans;

    event PlanSet(uint256 indexed planId, Plan p);
    event Subscribed(address indexed user, uint256 indexed planId, uint256 cycles, uint256 totalPaid, uint64 totalDuration);

    error InvalidPlan();
    error PaymentMismatch();

    constructor(address admin, address utilityNFT) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(BILLER_ROLE, admin);
        utility = IUtilityNFT(utilityNFT);
    }

    // ------- Admin/Biller -------
    function setPlan(
        uint256 planId,
        bool active,
        uint256 utilityId,
        uint64 duration,
        address paymentToken,
        uint256 pricePerCycle,
        address payout
    ) external onlyRole(BILLER_ROLE) {
        plans[planId] = Plan({
            active: active,
            utilityId: utilityId,
            duration: duration,
            paymentToken: paymentToken,
            pricePerCycle: pricePerCycle,
            payout: payout
        });
        emit PlanSet(planId, plans[planId]);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ------- Subscribe/Renew -------
    /**
     * @param planId   plan to purchase
     * @param cycles   number of cycles (1..N). Total duration = duration * cycles
     */
    function subscribe(uint256 planId, uint256 cycles) external payable whenNotPaused nonReentrant {
        if (cycles == 0) revert InvalidPlan();
        Plan memory p = plans[planId];
        if (!p.active || p.duration == 0) revert InvalidPlan();

        uint256 totalPrice = p.pricePerCycle * cycles;

        if (p.paymentToken == address(0)) {
            // ETH
            if (msg.value != totalPrice) revert PaymentMismatch();
            if (totalPrice > 0) {
                (bool ok, ) = payable(p.payout).call{value: totalPrice}("");
                require(ok, "ETH payout failed");
            }
        } else {
            // ERC20
            if (msg.value != 0) revert PaymentMismatch();
            if (totalPrice > 0) {
                IERC20(p.paymentToken).safeTransferFrom(msg.sender, p.payout, totalPrice);
            }
        }

        uint64 totalDuration = p.duration * uint64(cycles);
        // Mint/extend subscription in UtilityNFT
        utility.mintSubscription(msg.sender, p.utilityId, 1, totalDuration);

        emit Subscribed(msg.sender, planId, cycles, totalPrice, totalDuration);
    }

    // ------- Views -------
    function isActive(address user, uint256 planId) external view returns (bool) {
        Plan memory p = plans[planId];
        if (!p.active) return false;
        return utility.isActive(user, p.utilityId);
    }

    receive() external payable {}
}
