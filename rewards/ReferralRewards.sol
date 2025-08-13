// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ReferralRewards
 * @notice Split a referral pool (ETH) per purchase and mint optional bonus points.
 *
 * Integration pattern:
 *  - Your Marketplace computes a referral pool (e.g., part of protocol fee) and calls:
 *        referral.onPurchase{value: pool}(buyer, collection, grossWei);
 *  - Contract pays the buyer's referrer according to bps settings and sends the remainder to `payout`.
 *  - Optionally mints bonus points to buyer and/or referrer via RewardsProgram.award().
 *
 * Notes:
 *  - "pool" is the ETH amount you want to share for this purchase (can be 0).
 *  - "grossWei" is the purchase price; used only to compute bonus points (not used for ETH split math).
 */
interface IRewardsProgram {
    function award(address to, uint256 amount, string calldata reason) external;
}

contract ReferralRewards is AccessControl {
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // ---- Referral graph ----
    mapping(address => address) public referrerOf; // user => referrer (immutable after set)
    event ReferrerBound(address indexed user, address indexed referrer);

    // ---- ETH split config ----
    uint96 public defaultRefShareBps = 0; // portion of msg.value sent to referrer (0..10000)
    mapping(address => uint96) public collectionRefShareBps; // override per collection
    address payable public payout; // residual destination (e.g., Treasury)
    event RefShareSet(uint96 defaultBps);
    event RefShareForCollectionSet(address indexed collection, uint96 bps);
    event PayoutSet(address indexed payout);

    // ---- Bonus points config (independent of ETH split) ----
    IRewardsProgram public rewards; // optional
    uint96 public buyerPointsPerWeiBps = 0;     // points = grossWei * bps / 10_000
    uint96 public referrerPointsPerWeiBps = 0;  // points = grossWei * bps / 10_000
    mapping(address => uint96) public buyerPointsPerWeiBpsByCollection;
    mapping(address => uint96) public refPointsPerWeiBpsByCollection;
    event RewardsProgramSet(address indexed rewards);
    event BuyerPointsRateSet(uint96 bps);
    event RefPointsRateSet(uint96 bps);
    event BuyerPointsRateForCollectionSet(address indexed collection, uint96 bps);
    event RefPointsRateForCollectionSet(address indexed collection, uint96 bps);

    event PurchaseProcessed(
        address indexed buyer,
        address indexed referrer,
        address indexed collection,
        uint256 grossWei,
        uint256 poolWei,
        uint256 paidToReferrer,
        uint256 paidToPayout,
        uint256 buyerPoints,
        uint256 refPoints
    );

    error AlreadyBound();
    error InvalidReferrer();
    error ZeroAddress();

    constructor(address admin, address payable payout_) {
        if (payout_ == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        payout = payout_;
        emit PayoutSet(payout_);
    }

    // =======================
    // Referral graph
    // =======================

    /// @notice Users call once to bind their referrer. Prevents self‑referrals and zero address.
    function bindReferrer(address referrer) external {
        if (referrer == address(0) || referrer == msg.sender) revert InvalidReferrer();
        if (referrerOf[msg.sender] != address(0)) revert AlreadyBound();
        referrerOf[msg.sender] = referrer;
        emit ReferrerBound(msg.sender, referrer);
    }

    /// @notice Admin can migrate/bind on behalf of a user if not already set.
    function adminBindReferrer(address user, address referrer) external onlyRole(MANAGER_ROLE) {
        if (user == address(0) || referrer == address(0) || user == referrer) revert InvalidReferrer();
        if (referrerOf[user] != address(0)) revert AlreadyBound();
        referrerOf[user] = referrer;
        emit ReferrerBound(user, referrer);
    }

    // =======================
    // Config
    // =======================

    function setPayout(address payable p) external onlyRole(ADMIN_ROLE) {
        if (p == address(0)) revert ZeroAddress();
        payout = p; emit PayoutSet(p);
    }

    function setDefaultRefShareBps(uint96 bps) external onlyRole(MANAGER_ROLE) {
        require(bps <= 10_000, "bps>100%");
        defaultRefShareBps = bps; emit RefShareSet(bps);
    }

    function setCollectionRefShareBps(address collection, uint96 bps) external onlyRole(MANAGER_ROLE) {
        require(bps <= 10_000, "bps>100%");
        collectionRefShareBps[collection] = bps; emit RefShareForCollectionSet(collection, bps);
    }

    function setRewardsProgram(address rp) external onlyRole(ADMIN_ROLE) {
        rewards = IRewardsProgram(rp);
        emit RewardsProgramSet(rp);
    }

    function setBuyerPointsPerWeiBps(uint96 bps) external onlyRole(MANAGER_ROLE) {
        buyerPointsPerWeiBps = bps; emit BuyerPointsRateSet(bps);
    }
    function setReferrerPointsPerWeiBps(uint96 bps) external onlyRole(MANAGER_ROLE) {
        referrerPointsPerWeiBps = bps; emit RefPointsRateSet(bps);
    }
    function setBuyerPointsPerWeiBpsForCollection(address collection, uint96 bps) external onlyRole(MANAGER_ROLE) {
        buyerPointsPerWeiBpsByCollection[collection] = bps; emit BuyerPointsRateForCollectionSet(collection, bps);
    }
    function setReferrerPointsPerWeiBpsForCollection(address collection, uint96 bps) external onlyRole(MANAGER_ROLE) {
        refPointsPerWeiBpsByCollection[collection] = bps; emit RefPointsRateForCollectionSet(collection, bps);
    }

    // =======================
    // Hook from Marketplace
    // =======================

    /**
     * @notice Handle a purchase. Send ETH referral split and mint optional points.
     * @param buyer      purchaser address
     * @param collection NFT collection (for per-collection overrides)
     * @param grossWei   full purchase price in wei (used to compute points)
     *
     * @dev msg.value must be the referral pool to split (e.g., take from protocol fee).
     */
    function onPurchase(address buyer, address collection, uint256 grossWei) external payable {
        address ref = referrerOf[buyer];
        uint256 pool = msg.value;

        // ETH split
        uint96 shareBps = collectionRefShareBps[collection];
        if (shareBps == 0) shareBps = defaultRefShareBps;
        uint256 toRef = (pool * shareBps) / 10_000;
        uint256 toPayout = pool - toRef;

        if (toRef > 0 && ref != address(0)) {
            (bool ok1, ) = payable(ref).call{value: toRef}(""); require(ok1, "ref xfer");
        } else {
            toPayout = pool; // all to payout if no referrer or zero bps
            toRef = 0;
        }
        if (toPayout > 0) {
            (bool ok2, ) = payout.call{value: toPayout}(""); require(ok2, "payout xfer");
        }

        // Optional: bonus points
        uint256 buyerPts = 0; uint256 refPts = 0;
        if (address(rewards) != address(0) && grossWei > 0) {
            uint96 bBps = buyerPointsPerWeiBpsByCollection[collection]; if (bBps == 0) bBps = buyerPointsPerWeiBps;
            uint96 rBps = refPointsPerWeiBpsByCollection[collection];  if (rBps == 0) rBps = referrerPointsPerWeiBps;
            if (bBps > 0) {
                buyerPts = (grossWei * bBps) / 10_000;
                rewards.award(buyer, buyerPts, "referral:buyer");
            }
            if (rBps > 0 && ref != address(0)) {
                refPts = (grossWei * rBps) / 10_000;
                rewards.award(ref, refPts, "referral:referrer");
            }
        }

        emit PurchaseProcessed(buyer, ref, collection, grossWei, pool, toRef, toPayout, buyerPts, refPts);
    }

    receive() external payable {}
}
