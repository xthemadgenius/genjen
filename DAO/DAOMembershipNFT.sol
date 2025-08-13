// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DAOMembershipNFT
 * @notice ERC-721 membership NFT.
 *         - Soulbound by default (non-transferable), toggleable by admin.
 *         - Optional per-token expiry (0 = permanent).
 *         - Optional per-token tier (uint8).
 *         - Mint/Revoke/Renew gated by roles.
 */
contract DAOMembershipNFT is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE  = keccak256("ISSUER_ROLE");

    uint256 private _nextId = 1;
    bool public transferable;                 // global switch; default = false (soulbound)

    // tokenId => expiry timestamp (0 = no expiry)
    mapping(uint256 => uint64) public expiryOf;
    // tokenId => tier (0 = none/basic; define tiers off-chain)
    mapping(uint256 => uint8)  public tierOf;

    string public baseTokenURI;

    event Issued(address indexed to, uint256 indexed tokenId, uint8 tier, uint64 expiry);
    event Renewed(uint256 indexed tokenId, uint64 newExpiry);
    event Revoked(uint256 indexed tokenId);
    event TransferabilitySet(bool transferable);
    event TierSet(uint256 indexed tokenId, uint8 newTier);

    error TransferForbidden();
    error NotOwner();

    constructor(address admin, string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        transferable = false; // soulbound by default
    }

    // -----------------------
    // Admin / Config
    // -----------------------

    function setTransferable(bool v) external onlyRole(ADMIN_ROLE) {
        transferable = v;
        emit TransferabilitySet(v);
    }

    function setBaseTokenURI(string calldata base_) external onlyRole(ADMIN_ROLE) {
        baseTokenURI = base_;
    }

    // -----------------------
    // Issue / Renew / Revoke
    // -----------------------

    /**
     * @notice Mint a membership NFT.
     * @param to recipient
     * @param tier membership tier (0..255)
     * @param expiry unix seconds; 0 = permanent
     */
    function issue(address to, uint8 tier, uint64 expiry) external onlyRole(ISSUER_ROLE) returns (uint256 tokenId) {
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        tierOf[tokenId] = tier;
        expiryOf[tokenId] = expiry;
        emit Issued(to, tokenId, tier, expiry);
    }

    /// @notice Extend expiry (or set if was 0). Only ISSUER_ROLE or token owner.
    function renew(uint256 tokenId, uint64 newExpiry) external {
        address owner = ownerOf(tokenId);
        if (!(hasRole(ISSUER_ROLE, msg.sender) || msg.sender == owner)) revert NotOwner();
        // Set to max(old, new) to avoid shortening accidentally.
        uint64 old = expiryOf[tokenId];
        uint64 latest = newExpiry > old ? newExpiry : old;
        expiryOf[tokenId] = latest;
        emit Renewed(tokenId, latest);
    }

    /// @notice Update the tier. Only ISSUER_ROLE.
    function setTier(uint256 tokenId, uint8 newTier) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent");
        tierOf[tokenId] = newTier;
        emit TierSet(tokenId, newTier);
    }

    /// @notice Burn (revoke) a membership. ISSUER_ROLE or token owner.
    function revoke(uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        if (!(hasRole(ISSUER_ROLE, msg.sender) || msg.sender == owner)) revert NotOwner();
        _burn(tokenId);
        delete expiryOf[tokenId];
        delete tierOf[tokenId];
        emit Revoked(tokenId);
    }

    // -----------------------
    // Views
    // -----------------------

    function isActive(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent");
        uint64 exp = expiryOf[tokenId];
        return (exp == 0) || (exp >= block.timestamp);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent");
        if (bytes(baseTokenURI).length == 0) return "";
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }

    // -----------------------
    // Soulbound enforcement
    // -----------------------
    /**
     * @dev Disallow transfers when both `from` and `to` are non-zero and transferable=false.
     *      Mint (from=0) and burn (to=0) are allowed.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (!transferable && from != address(0) && to != address(0)) {
            revert TransferForbidden();
        }
        return super._update(to, tokenId, auth);
    }

    // AccessControl + ERC721
    function supportsInterface(bytes4 iid) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(iid);
    }
}
