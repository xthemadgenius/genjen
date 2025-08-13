// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

interface IDIDRegistry {
    function isController(string calldata did, address account) external view returns (bool);
    function getRecord(string calldata did) external view returns (address controller, string memory uri, bool active);
}

/**
 * @title IdentitySBT
 * @notice Non-transferable ERC-721 "identity card" linked to a DID in DIDRegistry.
 *         - Soulbound (cannot transfer)
 *         - Issuer-controlled mint & revoke
 *         - Optional "verified" badge, assignable by a separate role
 *         - Per-token DID string (e.g., "did:example:alice")
 */
contract IdentitySBT is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant BADGE_ROLE  = keccak256("BADGE_ROLE"); // can mark/unmark as verified

    IDIDRegistry public immutable didRegistry;

    uint256 private _nextId = 1;

    // tokenId => DID string
    mapping(uint256 => string) private _didOf;
    // tokenId => verified status
    mapping(uint256 => bool) private _verified;

    // Optional base tokenURI (e.g., IPFS folder); metadata can also be derived from DID URI off-chain
    string public baseTokenURI;

    event Issued(address indexed to, uint256 indexed tokenId, string did);
    event Revoked(uint256 indexed tokenId);
    event DIDLinked(uint256 indexed tokenId, string did);
    event VerifiedSet(uint256 indexed tokenId, bool verified);

    error NotOwner();
    error InvalidDID();
    error TransferForbidden();

    constructor(address admin, address didRegistry_, string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(BADGE_ROLE, admin);
        didRegistry = IDIDRegistry(didRegistry_);
    }

    // ----------------------------
    // Mint / Revoke (issuer only)
    // ----------------------------

    /// @notice Issue an SBT to `to` and link it to `did`. `did` must be controlled by `to` in the registry.
    function issue(address to, string calldata did) external onlyRole(ISSUER_ROLE) returns (uint256 tokenId) {
        _requireValidDIDOwner(to, did);
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        _didOf[tokenId] = did;
        emit Issued(to, tokenId, did);
    }

    /// @notice Burn (revoke) an SBT. Only issuer role or token owner.
    function revoke(uint256 tokenId) external {
        if (!(hasRole(ISSUER_ROLE, msg.sender) || ownerOf(tokenId) == msg.sender)) revert NotOwner();
        _burn(tokenId);
        delete _didOf[tokenId];
        delete _verified[tokenId];
        emit Revoked(tokenId);
    }

    // ----------------------------
    // DID Linking
    // ----------------------------

    /// @notice Relink the token's DID (e.g., after controller rotation). Caller must be token owner.
    function relinkDID(uint256 tokenId, string calldata newDID) external {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        _requireValidDIDOwner(msg.sender, newDID);
        _didOf[tokenId] = newDID;
        emit DIDLinked(tokenId, newDID);
    }

    /// @notice Reads the DID string for a token.
    function didOf(uint256 tokenId) external view returns (string memory) {
        _requireOwned(tokenId);
        return _didOf[tokenId];
    }

    /// @notice Convenience: returns (controller, uri, active) directly from registry for this token's DID.
    function didRecord(uint256 tokenId)
        external
        view
        returns (address controller, string memory uri, bool active)
    {
        _requireOwned(tokenId);
        string memory did = _didOf[tokenId];
        return didRegistry.getRecord(did);
    }

    // ----------------------------
    // Verified Badge
    // ----------------------------

    function setVerified(uint256 tokenId, bool v) external onlyRole(BADGE_ROLE) {
        _requireOwned(tokenId);
        _verified[tokenId] = v;
        emit VerifiedSet(tokenId, v);
    }

    function isVerified(uint256 tokenId) external view returns (bool) {
        _requireOwned(tokenId);
        return _verified[tokenId];
    }

    // ----------------------------
    // Soulbound enforcement
    // ----------------------------

    /**
     * @dev OpenZeppelin v5 uses _update hook. Disallow any transfer except mint (from 0) and burn (to 0).
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            // neither mint nor burn => transfer attempt
            revert TransferForbidden();
        }
        return super._update(to, tokenId, auth);
    }

    // ----------------------------
    // Metadata
    // ----------------------------

    function setBaseTokenURI(string calldata base_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = base_;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (bytes(baseTokenURI).length == 0) return "";
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }

    // ----------------------------
    // Internal helpers
    // ----------------------------

    function _requireValidDIDOwner(address owner, string calldata did) internal view {
        // Ensure DID is active and controlled by `owner`
        (address controller,, bool active) = didRegistry.getRecord(did);
        if (!active || controller != owner) revert InvalidDID();
    }

    function _requireOwned(uint256 tokenId) internal view {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
    }

    // AccessControl + ERC721 interfaces
    function supportsInterface(bytes4 iid) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(iid);
    }
}
