// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title UtilityNFT
 * @notice ERC-1155 for two utilities:
 *         - Subscription: time-limited access; renewable; per-account expiry.
 *         - Certificate: perpetual (or admin-revocable) achievements/licenses.
 *         Both default to SOULBOUND (non-transferable) per ID, but can be toggled.
 *
 * Token ID policy:
 *   Admin defines each ID's kind (Subscription or Certificate) before minting.
 *   URIs can be set per ID; fallback to baseURI if unset.
 */
contract UtilityNFT is ERC1155, ERC1155Supply, AccessControl, Pausable {
    using Strings for uint256;

    enum TokenKind { Undefined, Subscription, Certificate }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");    // can mint/renew/revoke

    // ID configuration
    mapping(uint256 => TokenKind) public kindOf;            // id => kind
    mapping(uint256 => bool) public transferable;           // id => is transferable (default false = soulbound)
    mapping(uint256 => string) private _tokenURI;           // optional per-id URI

    // Subscriptions: expiry per account per id (unix seconds; 0 = inactive)
    mapping(uint256 => mapping(address => uint64)) public expiryOf; // id => (account => expiry)

    // Events
    event KindSet(uint256 indexed id, TokenKind kind);
    event TransferabilitySet(uint256 indexed id, bool transferable);
    event URISet(uint256 indexed id, string uri);
    event Subscribed(address indexed to, uint256 indexed id, uint64 newExpiry, uint256 amount);
    event Renewed(address indexed to, uint256 indexed id, uint64 newExpiry);
    event Revoked(address indexed from, uint256 indexed id, uint256 amount);

    error InvalidKind();
    error TransfersDisabled();
    error NotSubscription();
    error NotCertificate();
    error NothingToRevoke();

    constructor(address admin, string memory baseURI_) ERC1155(baseURI_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    // ---------------------------
    // Admin configuration
    // ---------------------------

    function setKind(uint256 id, TokenKind k) external onlyRole(ADMIN_ROLE) {
        require(k != TokenKind.Undefined, "Undefined kind");
        kindOf[id] = k;
        emit KindSet(id, k);
    }

    function setTransferable(uint256 id, bool v) external onlyRole(ADMIN_ROLE) {
        transferable[id] = v;
        emit TransferabilitySet(id, v);
    }

    function setURI(uint256 id, string calldata newURI) external onlyRole(ADMIN_ROLE) {
        _tokenURI[id] = newURI;
        emit URISet(id, newURI);
    }

    function setBaseURI(string calldata newBase) external onlyRole(ADMIN_ROLE) {
        _setURI(newBase);
    }

    // ---------------------------
    // Minting / Renewal
    // ---------------------------

    /**
     * @notice Issue a subscription for `duration` seconds. Amount typically 1.
     *         Extends expiry from the later of now or current expiry.
     */
    function mintSubscription(address to, uint256 id, uint256 amount, uint64 duration)
        external
        whenNotPaused
        onlyRole(ISSUER_ROLE)
    {
        if (kindOf[id] != TokenKind.Subscription) revert NotSubscription();
        _mint(to, id, amount, "");
        // Extend expiry
        uint64 nowS = uint64(block.timestamp);
        uint64 base = expiryOf[id][to] > nowS ? expiryOf[id][to] : nowS;
        uint64 newExp = base + duration;
        expiryOf[id][to] = newExp;
        emit Subscribed(to, id, newExp, amount);
    }

    /**
     * @notice Renew an existing subscription by `duration` seconds (no minting).
     */
    function renew(address to, uint256 id, uint64 duration)
        external
        whenNotPaused
        onlyRole(ISSUER_ROLE)
    {
        if (kindOf[id] != TokenKind.Subscription) revert NotSubscription();
        uint64 nowS = uint64(block.timestamp);
        uint64 base = expiryOf[id][to] > nowS ? expiryOf[id][to] : nowS;
        uint64 newExp = base + duration;
        expiryOf[id][to] = newExp;
        emit Renewed(to, id, newExp);
    }

    /**
     * @notice Issue a certificate (typically amount=1). Certificates have no expiry.
     */
    function mintCertificate(address to, uint256 id, uint256 amount)
        external
        whenNotPaused
        onlyRole(ISSUER_ROLE)
    {
        if (kindOf[id] != TokenKind.Certificate) revert NotCertificate();
        _mint(to, id, amount, "");
    }

    /**
     * @notice Admin/Issuer revokes tokens from `from`. For subscriptions, this can be used to disable early.
     */
    function revoke(address from, uint256 id, uint256 amount)
        external
        whenNotPaused
        onlyRole(ISSUER_ROLE)
    {
        uint256 bal = balanceOf(from, id);
        if (bal == 0) revert NothingToRevoke();
        uint256 burnAmt = amount > bal ? bal : amount;
        _burn(from, id, burnAmt);

        // For subscriptions, also zero-out expiry if no balance remains
        if (kindOf[id] == TokenKind.Subscription && balanceOf(from, id) == 0) {
            expiryOf[id][from] = 0;
        }
        emit Revoked(from, id, burnAmt);
    }

    // ---------------------------
    // Views / helpers
    // ---------------------------

    function isActive(address account, uint256 id) public view returns (bool) {
        if (kindOf[id] != TokenKind.Subscription) return false;
        return expiryOf[id][account] >= block.timestamp;
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory perId = _tokenURI[id];
        if (bytes(perId).length != 0) return perId;
        return super.uri(id);
    }

    // ---------------------------
    // Pausing
    // ---------------------------

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ---------------------------
    // Soulbound enforcement (per ID)
    // ---------------------------
    /**
     * @dev OZ v5 ERC1155 uses _update to handle mints/burns/transfers.
     *      Block transfers when both `from` and `to` are non-zero and `transferable[id]` is false.
     *      Mints (from=0) and burns (to=0) are allowed.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                if (!transferable[ids[i]]) revert TransfersDisabled();
            }
        }
        super._update(from, to, ids, amounts);
    }

    // Required override
    function supportsInterface(bytes4 iid)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(iid);
    }
}
