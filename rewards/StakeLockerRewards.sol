// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title StakeLockerRewards
 * @notice Time-lock Membership/SBT NFTs to accrue reward points over time (no custody).
 *         Users lock their NFT (by tokenId) for a duration; while locked, they can harvest
 *         points from RewardsProgram at a rate proportional to "weight".
 *
 * Design highlights:
 *  - No custody: we don't transfer NFTs (works with soulbound tokens). We verify ownership on lock/claim/unlock.
 *  - Per-collection config: base weight & multipliers; optional per-token fixed weight via manager.
 *  - Rewards minted via RewardsProgram.award().
 */
interface IRewardsProgram {
    function award(address to, uint256 amount, string calldata reason) external;
}
interface IERC721View {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract StakeLockerRewards is AccessControl {
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct CollConfig {
        bool allowed;
        uint96 weightPerToken;     // base weight for any token in this collection (1e18 scale recommended)
        uint96 boostBps;           // optional global boost for the collection (0..10000)
    }
    mapping(address => CollConfig) public configOf;

    IRewardsProgram public rewards;
    uint256 public ratePerSecondPerWeight; // points per second per 1 weight unit (1e18-based), e.g., 1e9

    struct Position {
        address owner;
        address collection;
        uint256 tokenId;
        uint64  lockedUntil;       // unix seconds
        uint64  lastAccrued;       // last harvest timestamp
        uint256 weight;            // immutable per lock (snapshot at lock time)
        uint256 unclaimed;         // points accrued but not yet minted
        bool    active;
    }

    // collection => tokenId => position
    mapping(address => mapping(uint256 => Position)) public positionOf;

    event CollectionConfigured(address indexed collection, bool allowed, uint96 weightPerToken, uint96 boostBps);
    event RewardsProgramSet(address indexed rewards);
    event RateSet(uint256 ratePerSecondPerWeight);

    event Locked(address indexed user, address indexed collection, uint256 indexed tokenId, uint64 until, uint256 weight);
    event DurationExtended(address indexed user, address indexed collection, uint256 indexed tokenId, uint64 newUntil);
    event Harvested(address indexed user, address indexed collection, uint256 indexed tokenId, uint256 points);
    event Unlocked(address indexed user, address indexed collection, uint256 indexed tokenId);

    error NotAllowed();
    error NotOwner();
    error AlreadyLocked();
    error LockActive();
    error NoPosition();

    constructor(address admin, address rewardsProgram, uint256 _ratePerSecondPerWeight) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        rewards = IRewardsProgram(rewardsProgram);
        ratePerSecondPerWeight = _ratePerSecondPerWeight;
        emit RewardsProgramSet(rewardsProgram);
        emit RateSet(_ratePerSecondPerWeight);
    }

    // ------------- Admin config -------------

    function setRewardsProgram(address rp) external onlyRole(ADMIN_ROLE) {
        rewards = IRewardsProgram(rp);
        emit RewardsProgramSet(rp);
    }

    function setRate(uint256 r) external onlyRole(MANAGER_ROLE) {
        ratePerSecondPerWeight = r;
        emit RateSet(r);
    }

    function setCollection(address collection, bool allowed, uint96 weightPerToken, uint96 boostBps) external onlyRole(MANAGER_ROLE) {
        require(boostBps <= 10_000, "boost>100%");
        configOf[collection] = CollConfig({allowed: allowed, weightPerToken: weightPerToken, boostBps: boostBps});
        emit CollectionConfigured(collection, allowed, weightPerToken, boostBps);
    }

    // ------------- Lock lifecycle -------------

    /**
     * @param collection NFT contract address
     * @param tokenId    token to lock (must be owned by caller)
     * @param duration   seconds to lock; if 0, treated as "until now" (no lock, just enable harvesting)
     */
    function lock(address collection, uint256 tokenId, uint64 duration) external {
        CollConfig memory cfg = configOf[collection];
        if (!cfg.allowed) revert NotAllowed();

        if (IERC721View(collection).ownerOf(tokenId) != msg.sender) revert NotOwner();
        Position storage p = positionOf[collection][tokenId];
        if (p.active) revert AlreadyLocked();

        // snapshot weight
        uint256 weight = cfg.weightPerToken;
        if (cfg.boostBps > 0) {
            weight = (weight * (10_000 + cfg.boostBps)) / 10_000;
        }

        uint64 nowS = uint64(block.timestamp);
        uint64 until = duration == 0 ? nowS : nowS + duration;

        positionOf[collection][tokenId] = Position({
            owner: msg.sender,
            collection: collection,
            tokenId: tokenId,
            lockedUntil: until,
            lastAccrued: nowS,
            weight: weight,
            unclaimed: 0,
            active: true
        });

        emit Locked(msg.sender, collection, tokenId, until, weight);
    }

    /// @notice Extend the lock; can only push `lockedUntil` forward.
    function extend(address collection, uint256 tokenId, uint64 extraSeconds) external {
        Position storage p = positionOf[collection][tokenId];
        if (!p.active) revert NoPosition();
        if (p.owner != msg.sender) revert NotOwner();
        _accrue(p);

        p.lockedUntil += extraSeconds;
        emit DurationExtended(msg.sender, collection, tokenId, p.lockedUntil);
    }

    /// @notice Harvest accrued points to caller.
    function harvest(address collection, uint256 tokenId) public returns (uint256 points) {
        Position storage p = positionOf[collection][tokenId];
        if (!p.active) revert NoPosition();
        if (p.owner != msg.sender) revert NotOwner();
        _accrue(p);

        points = p.unclaimed;
        if (points > 0) {
            p.unclaimed = 0;
            rewards.award(msg.sender, points, "stake:harvest");
            emit Harvested(msg.sender, collection, tokenId, points);
        }
    }

    /// @notice Unlock after the lock expires; optional auto-harvest.
    function unlock(address collection, uint256 tokenId, bool harvestFirst) external {
        Position storage p = positionOf[collection][tokenId];
        if (!p.active) revert NoPosition();
        if (p.owner != msg.sender) revert NotOwner();

        if (block.timestamp < p.lockedUntil) revert LockActive();
        if (harvestFirst) { harvest(collection, tokenId); }

        delete positionOf[collection][tokenId];
        emit Unlocked(msg.sender, collection, tokenId);
    }

    // ------------- Internal accrual -------------

    function _accrue(Position storage p) internal {
        uint64 nowS = uint64(block.timestamp);
        uint64 from = p.lastAccrued;
        if (nowS <= from) return;

        // Only accrue while locked (no accrual after expiry)
        uint64 end = nowS;
        if (end > p.lockedUntil) end = p.lockedUntil;
        if (end > from) {
            uint256 dt = uint256(end - from);
            uint256 addPoints = dt * p.weight * ratePerSecondPerWeight / 1e18;
            p.unclaimed += addPoints;
            p.lastAccrued = end;
        } else {
            p.lastAccrued = nowS; // if lock already expired, just bump timestamp
        }
    }

    // ------------- Views -------------

    function pending(address collection, uint256 tokenId) external view returns (uint256) {
        Position memory p = positionOf[collection][tokenId];
        if (!p.active) return 0;
        uint64 nowS = uint64(block.timestamp);
        uint64 from = p.lastAccrued;
        uint64 end = nowS;
        if (end > p.lockedUntil) end = p.lockedUntil;
        uint256 add = end > from ? (uint256(end - from) * p.weight * ratePerSecondPerWeight / 1e18) : 0;
        return p.unclaimed + add;
    }
}
