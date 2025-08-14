// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @title RewardsProgram
 * @notice Non-transferable ERC20 "points" + redemption module.
 *
 * Key features:
 *  - Points are ERC20-like but SOULBOUND (non-transferable).
 *  - Award points via ISSUER_ROLE or via trusted PARTNER_ROLE (e.g., Marketplace) using awardOnPurchase().
 *  - Redemption for ETH rebates (burn points -> receive ETH) at configurable rate.
 *  - Redemption for ERC1155 rewards from a catalog; inventory is pre-deposited into this contract.
 *
 * Integrations:
 *  - Marketplace calls awardOnPurchase(buyer, grossWei, collection, id, qty).
 *  - Admins maintain per-collection multipliers and base rate.
 */
contract RewardsProgram is ERC20, AccessControl, Pausable, ReentrancyGuard {
    // --- Roles ---
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE  = keccak256("ISSUER_ROLE");   // manual grants
    bytes32 public constant PARTNER_ROLE = keccak256("PARTNER_ROLE");  // marketplace awarding

    // --- Points awarding config ---
    // Points per 1 wei, in basis-points form: points = wei * baseRateBps / 10_000
    // Example: baseRateBps=100 => 0.01 points per wei.
    uint96 public baseRateBps = 0; // default off
    // Optional per-collection multiplier in bps (10_000 = 1x)
    mapping(address => uint96) public collectionMultiplierBps; // defaults to 0 => treated as 10_000

    // --- ETH redemption config ---
    // How many wei are paid per 1 point burned (18 decimals vs wei 18 decimals)
    // Example: weiPerPoint = 1e12 => 0.000001 ETH per 1e6 points, etc.
    uint256 public weiPerPoint = 0; // default off

    // --- ERC1155 rewards catalog ---
    struct RewardItem {
        bool enabled;
        address token;   // ERC1155 contract
        uint256 id;      // token id
        uint256 cost;    // points cost (18 decimals)
    }
    // rewardId => RewardItem
    mapping(uint256 => RewardItem) public catalog;

    event BaseRateSet(uint96 baseRateBps);
    event MultiplierSet(address indexed collection, uint96 multiplierBps);
    event WeiPerPointSet(uint256 weiPerPoint);

    event Awarded(address indexed to, uint256 amount, string reason);
    event AwardedOnPurchase(address indexed buyer, address indexed collection, uint256 id, uint256 qty, uint256 grossWei, uint256 points);
    event RedeemedETH(address indexed user, uint256 points, uint256 weiAmount);
    event CatalogSet(uint256 indexed rewardId, address token, uint256 id, uint256 cost, bool enabled);
    event RedeemedERC1155(address indexed user, uint256 indexed rewardId, address token, uint256 id, uint256 amount, uint256 pointsBurned);

    error TransfersDisabled();
    error InsufficientPoints();
    error RedemptionDisabled();
    error InvalidConfig();
    error NotEnabled();
    error InsufficientInventory();

    constructor(address admin, string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(PARTNER_ROLE, admin);
    }

    // ========= Awarding =========

    /// @notice Manually award points. Only ISSUER_ROLE.
    function award(address to, uint256 amount, string calldata reason) external whenNotPaused onlyRole(ISSUER_ROLE) {
        _mint(to, amount);
        emit Awarded(to, amount, reason);
    }

    /**
     * @notice Award points from a trusted partner (e.g., Marketplace) on purchase.
     * @param buyer      recipient of points
     * @param grossWei   purchase amount in wei
     * @param collection NFT collection address (used for multiplier)
     * @param id         token id (informational)
     * @param qty        quantity purchased (informational; not used in math beyond grossWei)
     */
    function awardOnPurchase(
        address buyer,
        uint256 grossWei,
        address collection,
        uint256 id,
        uint256 qty
    ) external whenNotPaused onlyRole(PARTNER_ROLE) {
        if (baseRateBps == 0) revert InvalidConfig();

        uint256 rate = uint256(baseRateBps);
        uint256 mult = collectionMultiplierBps[collection] == 0 ? 10_000 : uint256(collectionMultiplierBps[collection]);

        // points = grossWei * rate/10k * mult/10k
        uint256 points = (grossWei * rate * mult) / 10_000 / 10_000;
        if (points > 0) {
            _mint(buyer, points);
            emit AwardedOnPurchase(buyer, collection, id, qty, grossWei, points);
        }
    }

    // ========= Redemption: ETH =========

    /// @notice Redeem `points` for ETH at configured weiPerPoint.
    function redeemETH(uint256 points) external nonReentrant whenNotPaused {
        if (weiPerPoint == 0) revert RedemptionDisabled();
        if (balanceOf(msg.sender) < points) revert InsufficientPoints();

        uint256 amountWei = (points * weiPerPoint);
        require(address(this).balance >= amountWei, "Insufficient ETH in pool");

        _burn(msg.sender, points);
        (bool ok, ) = payable(msg.sender).call{value: amountWei}("");
        require(ok, "ETH transfer failed");
        emit RedeemedETH(msg.sender, points, amountWei);
    }

    // ========= Redemption: ERC1155 =========

    /**
     * @notice Admin defines or updates a reward item in the catalog.
     *         Inventory of the ERC1155 token must be deposited to this contract beforehand.
     */
    function setCatalogItem(uint256 rewardId, address token, uint256 id, uint256 cost, bool enabled)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (token == address(0) || cost == 0) revert InvalidConfig();
        catalog[rewardId] = RewardItem({enabled: enabled, token: token, id: id, cost: cost});
        emit CatalogSet(rewardId, token, id, cost, enabled);
    }

    /**
     * @notice Redeem an ERC1155 reward (transfers from contract inventory).
     * @param rewardId catalog key
     * @param amount   number of units to redeem (must be available in contract inventory)
     */
    function redeemERC1155(uint256 rewardId, uint256 amount) external nonReentrant whenNotPaused {
        RewardItem memory R = catalog[rewardId];
        if (!R.enabled) revert NotEnabled();
        if (amount == 0) revert InvalidConfig();

        uint256 totalCost = R.cost * amount;
        if (balanceOf(msg.sender) < totalCost) revert InsufficientPoints();

        // Check inventory
        uint256 bal = IERC1155(R.token).balanceOf(address(this), R.id);
        if (bal < amount) revert InsufficientInventory();

        // Burn points then transfer item(s)
        _burn(msg.sender, totalCost);
        IERC1155(R.token).safeTransferFrom(address(this), msg.sender, R.id, amount, "");
        emit RedeemedERC1155(msg.sender, rewardId, R.token, R.id, amount, totalCost);
    }

    // ========= Admin config =========

    function setBaseRateBps(uint96 newRateBps) external onlyRole(ADMIN_ROLE) {
        baseRateBps = newRateBps;
        emit BaseRateSet(newRateBps);
    }

    function setCollectionMultiplierBps(address collection, uint96 multiplierBps) external onlyRole(ADMIN_ROLE) {
        // allow 0 to mean "unset" (treated as 10_000 in awardOnPurchase)
        collectionMultiplierBps[collection] = multiplierBps;
        emit MultiplierSet(collection, multiplierBps);
    }

    function setWeiPerPoint(uint256 newWeiPerPoint) external onlyRole(ADMIN_ROLE) {
        weiPerPoint = newWeiPerPoint;
        emit WeiPerPointSet(newWeiPerPoint);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ========= Soulbound ERC20 enforcement =========
    /**
     * @dev Block transfers where both from and to are non-zero.
     *      Mint (from=0) and burn (to=0) are allowed.
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused returns (bool) {
        if (from != address(0) && to != address(0)) revert TransfersDisabled();
        return super._update(from, to, value);
    }

    // ========= ERC1155 receiver hooks (to hold inventory) =========
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    // Accept ETH for rebate pool
    receive() external payable {}
    fallback() external payable {}
}
