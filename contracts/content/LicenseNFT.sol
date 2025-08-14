// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title LicenseNFT
 * @notice ERC-721 license token for courses/content/memorabilia rights.
 *         - Each token binds to a set of license terms (by termsId)
 *         - Optional soulbound mode (non-transferable)
 *         - Optional expiry (0 = perpetual)
 *         - Revocation (if the terms are revocable)
 *         - Per-collection baseURI; optional per-token metadata via off-chain renderer
 *
 * Terms model:
 *   - Admin defines reusable terms (name, uri, hash, flags)
 *   - Each token references a termsId + optional expiry
 */
contract LicenseNFT is ERC721, AccessControl, Pausable {
    using Strings for uint256;

    // ------- Roles -------
    bytes32 public constant ADMIN_ROLE  = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // ------- Config -------
    bool public transferable; // default false => soulbound
    string public baseTokenURI;

    // ------- Counters -------
    uint256 private _nextId = 1;

    // ------- License Terms -------
    struct Terms {
        string  name;          // human-readable label (e.g., "Personal-NonCommercial-v1")
        string  uri;           // full license text (IPFS/HTTPS)
        bytes32 termsHash;     // off-chain canonical hash of the text
        bool    commercialUse; // true if commercial use permitted
        bool    derivatives;   // true if derivatives permitted
        bool    revocable;     // true if issuer can revoke
        bool    active;        // admin can deactivate terms (no new issues)
    }

    // termsId => Terms
    mapping(uint256 => Terms) public termsOf;
    uint256 public termsCount;

    // tokenId => license data
    mapping(uint256 => uint256) public termsIdOf;  // which terms are attached
    mapping(uint256 => uint64)  public expiryOf;   // 0 = perpetual
    mapping(uint256 => bool)    public revoked;    // if token was revoked

    // ------- Events -------
    event TermsCreated(uint256 indexed termsId, string name, string uri, bytes32 termsHash, bool commercialUse, bool derivatives, bool revocable);
    event TermsUpdated(uint256 indexed termsId, string name, string uri, bytes32 termsHash, bool active);
    event Issued(address indexed to, uint256 indexed tokenId, uint256 indexed termsId, uint64 expiry);
    event Revoked(uint256 indexed tokenId);
    event TransferabilitySet(bool transferable);
    event BaseURISet(string baseURI);

    // ------- Errors -------
    error TransferForbidden();
    error NonexistentToken();
    error TermsInactive();
    error NotOwnerOrIssuer();
    error NotRevocable();

    constructor(address admin, string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        transferable = false; // soulbound by default
    }

    // ==================
    // Admin: Terms & URI
    // ==================

    function createTerms(
        string calldata name_,
        string calldata uri_,
        bytes32 termsHash_,
        bool commercialUse_,
        bool derivatives_,
        bool revocable_
    ) external onlyRole(ADMIN_ROLE) returns (uint256 termsId) {
        termsId = ++termsCount;
        termsOf[termsId] = Terms({
            name: name_,
            uri: uri_,
            termsHash: termsHash_,
            commercialUse: commercialUse_,
            derivatives: derivatives_,
            revocable: revocable_,
            active: true
        });
        emit TermsCreated(termsId, name_, uri_, termsHash_, commercialUse_, derivatives_, revocable_);
    }

    function updateTerms(
        uint256 termsId,
        string calldata name_,
        string calldata uri_,
        bytes32 termsHash_,
        bool active_
    ) external onlyRole(ADMIN_ROLE) {
        Terms storage T = termsOf[termsId];
        require(bytes(T.name).length != 0, "Terms: not found");
        T.name = name_;
        T.uri = uri_;
        T.termsHash = termsHash_;
        T.active = active_;
        emit TermsUpdated(termsId, name_, uri_, termsHash_, active_);
    }

    function setBaseTokenURI(string calldata base_) external onlyRole(ADMIN_ROLE) {
        baseTokenURI = base_;
        emit BaseURISet(base_);
    }

    function setTransferable(bool v) external onlyRole(ADMIN_ROLE) {
        transferable = v;
        emit TransferabilitySet(v);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ==================
    // Issue / Revoke
    // ==================

    /**
     * @param to recipient
     * @param termsId must exist and be active
     * @param expiry unix seconds; 0 = perpetual
     */
    function issue(address to, uint256 termsId, uint64 expiry) external whenNotPaused onlyRole(ISSUER_ROLE) returns (uint256 tokenId) {
        Terms memory T = termsOf[termsId];
        require(T.active, "Terms inactive");
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        termsIdOf[tokenId] = termsId;
        expiryOf[tokenId] = expiry;
        emit Issued(to, tokenId, termsId, expiry);
    }

    /// @notice Revoke a license token (burn or mark as revoked) if the attached terms allow revocation.
    function revoke(uint256 tokenId) external whenNotPaused {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        if (!(hasRole(ISSUER_ROLE, msg.sender) || msg.sender == ownerOf(tokenId))) revert NotOwnerOrIssuer();
        uint256 tid = termsIdOf[tokenId];
        if (!termsOf[tid].revocable) revert NotRevocable();

        // Choose behavior: mark revoked (preserve history) + burn (optional)
        revoked[tokenId] = true;
        _burn(tokenId);
        delete termsIdOf[tokenId];
        delete expiryOf[tokenId];
        emit Revoked(tokenId);
    }

    // ==================
    // Views
    // ==================

    function isValid(uint256 tokenId) public view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        if (revoked[tokenId]) return false;
        uint64 exp = expiryOf[tokenId];
        return (exp == 0) || (exp >= block.timestamp);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        if (bytes(baseTokenURI).length == 0) return "";
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }

    // ==================
    // Soulbound enforcement
    // ==================
    /**
     * @dev Block transfers when soulbound mode is ON (transferable=false).
     *      Mint (from=0) and burn (to=0) are always allowed.
     */
    function _update(address to, uint256 tokenId, address auth) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (!transferable && from != address(0) && to != address(0)) {
            revert TransferForbidden();
        }
        return super._update(to, tokenId, auth);
    }

    // ==================
    // Interfaces
    // ==================
    function supportsInterface(bytes4 iid) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(iid);
    }
}
