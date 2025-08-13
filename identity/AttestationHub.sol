// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AttestationHub
 * @notice Generic on-chain attestations, inspired by EAS.
 *         - Register schemas (definition string, revocable flag, optional resolver)
 *         - Issue attestations (subject, schemaId, data blob, expiry, optional reference)
 *         - Revoke (if revocable)
 *         - Query validity and metadata on-chain
 *
 * Gas/storage notes:
 *  - We store attestations by UID (bytes32) and track the latest UID per (subject, schema).
 *  - Full indexing (lists) is event-driven; query off-chain via logs if you need history.
 */
contract AttestationHub is AccessControl {
    // ---- Roles ----
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE  = keccak256("ISSUER_ROLE");
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");

    // ---- Schema ----
    struct Schema {
        address registrar;   // who created it
        string  schema;      // human-readable JSON/ABI-like definition
        address resolver;    // optional hook to validate pre/post (can be address(0))
        bool    revocable;   // if false, attestations under this schema cannot be revoked
        bool    active;      // allow disabling a schema
    }
    mapping(bytes32 => Schema) public schemaOf;

    // ---- Attestations ----
    struct Attestation {
        bytes32 schemaId;      // schema key
        address issuer;        // who attested
        address subject;       // who/what is being attested (address)
        bytes32 refUID;        // optional reference UID (e.g., parent attestation)
        bytes   data;          // arbitrary payload (IPFS hash, struct-encoded, etc.)
        uint64  time;          // block.timestamp at creation
        uint64  expiration;    // 0 = never expires; otherwise unix seconds
        bool    revoked;       // true if revoked
    }
    mapping(bytes32 => Attestation) public attestationOf;

    // (subject => (schemaId => latest UID)) quick lookup
    mapping(address => mapping(bytes32 => bytes32)) public latestUID;

    // ---- Resolver interface (optional) ----
    interface IResolver {
        function onAttest(address issuer, address subject, bytes32 schemaId, bytes32 refUID, bytes calldata data) external;
        function onRevoke(address revoker, bytes32 uid) external;
    }

    // ---- Events ----
    event SchemaRegistered(bytes32 indexed schemaId, address indexed registrar, string schema, address resolver, bool revocable);
    event SchemaStatus(bytes32 indexed schemaId, bool active);
    event Attested(bytes32 indexed uid, bytes32 indexed schemaId, address indexed issuer, address subject, uint64 expiration, bytes32 refUID, bytes data);
    event Revoked(bytes32 indexed uid, address indexed revoker);

    // ---- Errors ----
    error SchemaExists();
    error SchemaNotFound();
    error SchemaInactive();
    error NotRevocable();
    error NotIssuerOrRevoker();
    error AlreadyRevoked();
    error Expired();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(REVOKER_ROLE, admin);
    }

    // -----------------------------
    // Schema management
    // -----------------------------

    /**
     * @dev schemaId is user-provided or pre-hashed: keccak256(schema string or bytes)
     */
    function registerSchema(
        bytes32 schemaId,
        string calldata schema,
        address resolver,
        bool revocable
    ) external onlyRole(ADMIN_ROLE) {
        if (schemaOf[schemaId].registrar != address(0)) revert SchemaExists();
        schemaOf[schemaId] = Schema({
            registrar: msg.sender,
            schema: schema,
            resolver: resolver,
            revocable: revocable,
            active: true
        });
        emit SchemaRegistered(schemaId, msg.sender, schema, resolver, revocable);
    }

    function setSchemaActive(bytes32 schemaId, bool active) external onlyRole(ADMIN_ROLE) {
        Schema storage s = schemaOf[schemaId];
        if (s.registrar == address(0)) revert SchemaNotFound();
        s.active = active;
        emit SchemaStatus(schemaId, active);
    }

    // -----------------------------
    // Attest / Revoke
    // -----------------------------

    function attest(
        bytes32 schemaId,
        address subject,
        bytes32 refUID,
        bytes calldata data,
        uint64 expiration // 0 for no expiry
    ) external onlyRole(ISSUER_ROLE) returns (bytes32 uid) {
        Schema memory s = schemaOf[schemaId];
        if (s.registrar == address(0)) revert SchemaNotFound();
        if (!s.active) revert SchemaInactive();

        uid = _deriveUID(schemaId, msg.sender, subject, refUID, data, block.number);
        Attestation storage a = attestationOf[uid];
        // minimal collision guard (extremely unlikely)
        require(a.issuer == address(0), "UID exists");

        a.schemaId = schemaId;
        a.issuer = msg.sender;
        a.subject = subject;
        a.refUID = refUID;
        a.data = data;
        a.time = uint64(block.timestamp);
        a.expiration = expiration;
        a.revoked = false;

        latestUID[subject][schemaId] = uid;

        if (s.resolver != address(0)) {
            IResolver(s.resolver).onAttest(msg.sender, subject, schemaId, refUID, data);
        }

        emit Attested(uid, schemaId, msg.sender, subject, expiration, refUID, data);
    }

    function revoke(bytes32 uid) external {
        Attestation storage a = attestationOf[uid];
        if (a.issuer == address(0)) revert SchemaNotFound(); // using same error for brevity
        Schema memory s = schemaOf[a.schemaId];
        if (!s.revocable) revert NotRevocable();
        if (a.revoked) revert AlreadyRevoked();

        // only original issuer or an authorized revoker can revoke
        if (!(msg.sender == a.issuer || hasRole(REVOKER_ROLE, msg.sender))) revert NotIssuerOrRevoker();

        a.revoked = true;

        if (s.resolver != address(0)) {
            IResolver(s.resolver).onRevoke(msg.sender, uid);
        }

        emit Revoked(uid, msg.sender);
    }

    // -----------------------------
    // Views
    // -----------------------------

    function isValid(bytes32 uid) external view returns (bool) {
        Attestation memory a = attestationOf[uid];
        if (a.issuer == address(0)) return false;
        if (a.revoked) return false;
        if (a.expiration != 0 && a.expiration < block.timestamp) return false;
        return true;
    }

    function remainingValidity(bytes32 uid) external view returns (uint256 secondsLeft) {
        Attestation memory a = attestationOf[uid];
        if (a.issuer == address(0) || a.revoked) return 0;
        if (a.expiration == 0) return type(uint256).max;
        return a.expiration > block.timestamp ? a.expiration - block.timestamp : 0;
    }

    // -----------------------------
    // Utils
    // -----------------------------

    function _deriveUID(
        bytes32 schemaId,
        address issuer,
        address subject,
        bytes32 refUID,
        bytes calldata data,
        uint256 salt
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(schemaId, issuer, subject, refUID, keccak256(data), salt));
    }
}
