// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AccessListRegistry
 * @notice Unified blocklist/allowlist with per-target policy:
 *         - Mode.Open: everyone allowed EXCEPT active blocklisted entries.
 *         - Mode.AllowOnly: only active allowlisted entries are allowed (and not blocklisted).
 *
 * Features:
 *   - Global entries (target=address(0)) + per-target entries
 *   - Address subjects + NFT token subjects (contract+tokenId)
 *   - Expiry timestamps (0 = no expiry)
 *   - Reason codes + setter tracking
 *   - Batch set/clear operations
 *
 * Typical usage in target contracts:
 *   registry.enforceAccess(address(this), user);
 *   // or with token gating:
 *   registry.enforceAccessWithToken(address(this), user, token, tokenId);
 */
contract AccessListRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE  = keccak256("ADMIN_ROLE");
    bytes32 public constant LISTER_ROLE = keccak256("LISTER_ROLE"); // can manage entries & modes

    enum Mode { Open, AllowOnly }

    struct TargetConfig {
        bool enabled;  // if false, registry is ignored for this target (fallback to open)
        Mode mode;
    }

    struct Entry {
        bool allow;        // true if allowlist entry
        bool blocklist;    // true if blocklist entry
        uint64 expiry;     // 0 = no expiry
        uint32 reason;     // optional reason code
        address setter;    // who set it last
    }

    // target => config (target can be specific contract; address(0) = global policy+entries)
    mapping(address => TargetConfig) public configOf;

    // ---------- address subjects ----------
    // target => subject => entry
    mapping(address => mapping(address => Entry)) public addrEntries;
    // global: addrEntries[address(0)][subject]

    // ---------- token subjects ----------
    // target => (nft => (id => entry))
    mapping(address => mapping(address => mapping(uint256 => Entry))) public tokenEntries;
    // global: tokenEntries[address(0)][nft][id]

    // ---------- events ----------
    event ConfigSet(address indexed target, bool enabled, Mode mode);
    event AddressSet(address indexed target, address indexed subject, bool allow, bool blocklisted, uint64 expiry, uint32 reason, address setter);
    event AddressCleared(address indexed target, address indexed subject);
    event TokenSet(address indexed target, address indexed token, uint256 indexed tokenId, bool allow, bool blocklisted, uint64 expiry, uint32 reason, address setter);
    event TokenCleared(address indexed target, address indexed token, uint256 indexed tokenId);

    // ---------- errors ----------
    error NotAllowed(address target, address subject);
    error Blocked(address target, address subject, uint32 reason);
    error NotAllowlisted(address target, address subject);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(LISTER_ROLE, admin);

        // default global config: enabled, Open
        configOf[address(0)] = TargetConfig({enabled: true, mode: Mode.Open});
        emit ConfigSet(address(0), true, Mode.Open);
    }

    // =========================================================
    // Admin: configure target policy
    // =========================================================
    function setConfig(address target, bool enabled, Mode mode) external onlyRole(LISTER_ROLE) {
        configOf[target] = TargetConfig({enabled: enabled, mode: mode});
        emit ConfigSet(target, enabled, mode);
    }

    // =========================================================
    // Manage ADDRESS entries (single & batch)
    // =========================================================
    function setAddress(
        address target,
        address subject,
        bool allow,
        bool blocklisted,
        uint64 expiry,
        uint32 reason
    ) public onlyRole(LISTER_ROLE) {
        addrEntries[target][subject] = Entry({
            allow: allow,
            blocklist: blocklisted,
            expiry: expiry,
            reason: reason,
            setter: msg.sender
        });
        emit AddressSet(target, subject, allow, blocklisted, expiry, reason, msg.sender);
    }

    function clearAddress(address target, address subject) public onlyRole(LISTER_ROLE) {
        delete addrEntries[target][subject];
        emit AddressCleared(target, subject);
    }

    function setAddressBatch(
        address target,
        address[] calldata subjects,
        bool[] calldata allows,
        bool[] calldata blocks,
        uint64[] calldata expiries,
        uint32[] calldata reasons
    ) external onlyRole(LISTER_ROLE) {
        uint256 n = subjects.length;
        require(n == allows.length && n == blocks.length && n == expiries.length && n == reasons.length, "len mismatch");
        for (uint256 i = 0; i < n; i++) {
            setAddress(target, subjects[i], allows[i], blocks[i], expiries[i], reasons[i]);
        }
    }

    function clearAddressBatch(address target, address[] calldata subjects) external onlyRole(LISTER_ROLE) {
        for (uint256 i = 0; i < subjects.length; i++) {
            clearAddress(target, subjects[i]);
        }
    }

    // =========================================================
    // Manage TOKEN entries (single & batch)
    // =========================================================
    function setToken(
        address target,
        address token,
        uint256 tokenId,
        bool allow,
        bool blocklisted,
        uint64 expiry,
        uint32 reason
    ) public onlyRole(LISTER_ROLE) {
        tokenEntries[target][token][tokenId] = Entry({
            allow: allow,
            blocklist: blocklisted,
            expiry: expiry,
            reason: reason,
            setter: msg.sender
        });
        emit TokenSet(target, token, tokenId, allow, blocklisted, expiry, reason, msg.sender);
    }

    function clearToken(address target, address token, uint256 tokenId) public onlyRole(LISTER_ROLE) {
        delete tokenEntries[target][token][tokenId];
        emit TokenCleared(target, token, tokenId);
    }

    function setTokenBatch(
        address target,
        address[] calldata tokens,
        uint256[] calldata ids,
        bool[] calldata allows,
        bool[] calldata blocks,
        uint64[] calldata expiries,
        uint32[] calldata reasons
    ) external onlyRole(LISTER_ROLE) {
        uint256 n = tokens.length;
        require(n == ids.length && n == allows.length && n == blocks.length && n == expiries.length && n == reasons.length, "len mismatch");
        for (uint256 i = 0; i < n; i++) {
            setToken(target, tokens[i], ids[i], allows[i], blocks[i], expiries[i], reasons[i]);
        }
    }

    function clearTokenBatch(address target, address[] calldata tokens, uint256[] calldata ids) external onlyRole(LISTER_ROLE) {
        require(tokens.length == ids.length, "len mismatch");
        for (uint256 i = 0; i < tokens.length; i++) {
            clearToken(target, tokens[i], ids[i]);
        }
    }

    // =========================================================
    // Views: evaluate access (address)
    // =========================================================
    function isAllowed(address target, address subject) public view returns (bool ok, uint32 reasonCode) {
        // check enabled config, fallback to global if not set for target
        TargetConfig memory cfg = configOf[target];
        if (!cfg.enabled) {
            // if disabled for target, see if global is enabled; else treat as open
            cfg = configOf[address(0)];
            if (!cfg.enabled) return (true, 0);
        }

        // Gather entries: target-specific and global
        Entry memory t = addrEntries[target][subject];
        Entry memory g = addrEntries[address(0)][subject];

        // 1) Blocklist check (active if expiry==0 or expiry>=now)
        if (_activeBlock(t) || _activeBlock(g)) {
            uint32 reason_ = _activeBlock(t) ? t.reason : g.reason;
            return (false, reason_);
        }

        // 2) Mode check
        if (cfg.mode == Mode.Open) {
            // allowed unless blocked (already checked)
            return (true, 0);
        }

        // Mode.AllowOnly: require an active allow entry in either target or global
        bool allowed = _activeAllow(t) || _activeAllow(g);
        return (allowed, allowed ? 0 : 0);
    }

    /// @notice Evaluate by token (contract+id). Useful for token-gated flows.
    function isAllowedWithToken(address target, address subject, address token, uint256 tokenId)
        public
        view
        returns (bool ok, uint32 reasonCode)
    {
        // First check address-based (blocklist may block outright)
        (bool addrOk, uint32 r) = isAllowed(target, subject);
        if (!addrOk) return (false, r);

        // If there is any active token blocklist entry (target/global), deny.
        Entry memory tt = tokenEntries[target][token][tokenId];
        Entry memory tg = tokenEntries[address(0)][token][tokenId];
        if (_activeBlock(tt) || _activeBlock(tg)) {
            uint32 reason_ = _activeBlock(tt) ? tt.reason : tg.reason;
            return (false, reason_);
        }

        // If target mode is AllowOnly, ALSO require an active token allow (target or global).
        TargetConfig memory cfg = configOf[target];
        if (!cfg.enabled) cfg = configOf[address(0)];
        if (cfg.enabled && cfg.mode == Mode.AllowOnly) {
            bool allowed = _activeAllow(tt) || _activeAllow(tg);
            if (!allowed) return (false, 0);
        }
        return (true, 0);
    }

    // =========================================================
    // Enforcers: revert if not allowed (easy to call from targets)
    // =========================================================
    function enforceAccess(address target, address subject) external view {
        (bool ok, uint32 reason_) = isAllowed(target, subject);
        if (!ok) revert NotAllowed(target, subject);
    }

    function enforceAccessWithToken(address target, address subject, address token, uint256 tokenId) external view {
        (bool ok, uint32 /*reason_*/) = isAllowedWithToken(target, subject, token, tokenId);
        if (!ok) revert NotAllowed(target, subject);
    }

    // =========================================================
    // In
