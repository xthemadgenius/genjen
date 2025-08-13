// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Votes} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

interface IDIDRegistry {
    function getRecord(string calldata did) external view returns (address controller, string memory uri, bool active);
}

/**
 * @title SBTIssuer
 * @notice Soulbound ERC-721 with vote checkpoints (ERC721Votes) for governance.
 *         Optional DID enforcement: on issue/relink, holder must control an ACTIVE DID in DIDRegistry.
 *         Includes:
 *           - ISSUER_ROLE: can issue/revoke
 *           - BADGE_ROLE:  can mark "verified"
 *           - Non-transferable (soulbound)
 */
contract SBTIssuer is ERC721, ERC721Votes, AccessControl, EIP712 {
    using Strings for uint256;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant BADGE_ROLE  = keccak256("BADGE_ROLE");

    IDIDRegistry public immutable didRegistry; // may be address(0) to disable DID checks

    uint256 private _nextId = 1;
    string public baseTokenURI;

    // tokenId => DID string (optional)
    mapping(uint256 => string) private _didOf;
    // tokenId => verified flag
    mapping(uint256 => bool) private _verified;

    event Issued(address indexed to, uint256 indexed tokenId, string did);
    event Revoked(uint256 indexed tokenId);
    event DIDLinked(uint256 indexed tokenId, string did);
    event VerifiedSet(uint256 indexed tokenId, bool verified);

    error TransferForbidden();
    error NotOwner();
    error InvalidDID();

    constructor(
        address admin,
        address didRegistry_, // pass 0x00 to skip DID checks
        string memory name_,
        string memory symbol_
    )
        ERC721(name_, symbol_)
        EIP712(name_, "1")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(BADGE_ROLE, admin);
        didRegistry = IDIDRegistry(didRegistry_);
    }

    // --------- SBT mint/burn ----------

    /// @notice Issue an SBT to `to`. If DID registry is set, `to` must control `did` and it must be active.
    function issue(address to, string calldata did) external onlyRole(ISSUER_ROLE) returns (uint256 tokenId) {
        _requireValidDIDOwner(to, did);
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        _didOf[tokenId] = did;
        emit Issued(to, tokenId, did);
        // ERC721Votes will checkpoint voting power on mint.
    }

    /// @notice Revoke (burn) an SBT. Callable by ISSUER_ROLE or the token owner.
    function revoke(uint256 tokenId) external {
        if (!(hasRole(ISSUER_ROLE, msg.sender) || ownerOf(tokenId) == msg.sender)) revert NotOwner();
        _burn(tokenId);
        delete _didOf[tokenId];
        delete _verified[tokenId];
        emit Revoked(tokenId);
        // ERC721Votes will checkpoint voting power on burn.
    }

    // --------- DID linking ----------

    /// @notice Relink to a new DID; caller must be token owner and controller of the DID (if registry set).
    function relinkDID(uint256 tokenId, string calldata newDID) external {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        _requireValidDIDOwner(msg.sender, newDID);
        _didOf[tokenId] = newDID;
        emit DIDLinked(tokenId, newDID);
    }

    function didOf(uint256 tokenId) external view returns (string memory) {
        _requireOwned(tokenId);
        return _didOf[tokenId];
    }

    // --------- Verified badge ----------

    function setVerified(uint256 tokenId, bool v) external onlyRole(BADGE_ROLE) {
        _requireOwned(tokenId);
        _verified[tokenId] = v;
        emit VerifiedSet(tokenId, v);
    }

    function isVerified(uint256 tokenId) external view returns (bool) {
        _requireOwned(tokenId);
        return _verified[tokenId];
    }

    // --------- Soulbound enforcement ----------

    /**
     * @dev OZ v5 uses _update; we block any transfer where both from and to are non-zero.
     *      Mint (from=0) and burn (to=0) are allowed.
     */
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert TransferForbidden();
        return super._update(to, tokenId, auth);
    }

    // --------- Metadata ----------

    function setBaseTokenURI(string calldata base_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = base_;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (bytes(baseTokenURI).length == 0) return "";
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }

    // --------- helpers ----------

    function _requireValidDIDOwner(address owner, string calldata did) internal view {
        if (address(didRegistry) == address(0)) return; // no check
        (address controller,, bool active) = didRegistry.getRecord(did);
        if (!active || controller != owner) revert InvalidDID();
    }

    function _requireOwned(uint256 tokenId) internal view {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
    }

    // --------- Overrides (EIP712 / Votes / ERC721) ----------

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721Votes) {
        super._burn(tokenId);
    }

    function nonces(address owner) public view override(ERC721Votes) returns (uint256) {
        return super.nonces(owner);
    }

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function supportsInterface(bytes4 iid) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(iid);
    }
}
