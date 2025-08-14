// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BridgeAdapter
 * @notice Minimal cross-chain routing shim. Plug your bridge executor into `inbound()`,
 *         and use `outbound()` to emit an event your off-chain relayer/bridge SDK listens to.
 *
 * Security model:
 *  - Only trusted executors may call `inbound()` (e.g., official LayerZero/Wormhole/Axelar receiver).
 *  - Only configured "remotes" (per chainId) are accepted as message sources.
 *  - Replay protection via per-source nonce.
 *
 * App integration:
 *  - Your app contracts implement IBridgeReceiver and register themselves as receivers.
 *  - On destination chain, adapter calls receiver.onBridgeMessage(...)
 */
interface IBridgeReceiver {
    /**
     * @dev app-level callback invoked by the adapter on inbound messages
     */
    function onBridgeMessage(
        uint32 srcChainId,
        address srcApp,
        bytes calldata payload
    ) external;
}

contract BridgeAdapter is AccessControl, ReentrancyGuard {
    // ---- Roles ----
    bytes32 public constant ADMIN_ROLE    = keccak256("ADMIN_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE"); // authorized inbound callers (bridge executors)

    // ---- Remotes & Receivers ----
    // chainId => remote adapter/app address trusted as source
    mapping(uint32 => address) public trustedRemote;
    // local apps allowed to receive callbacks
    mapping(address => bool) public isReceiverApproved;

    // ---- Replay protection ----
    // (srcChainId => srcApp => nonce) last-processed nonce; messages must come strictly increasing
    mapping(uint32 => mapping(address => uint64)) public lastNonce;

    // ---- Events ----
    event RemoteSet(uint32 indexed chainId, address indexed remote);
    event ReceiverApproved(address indexed app, bool approved);
    event OutboundQueued(uint32 indexed dstChainId, address indexed dstApp, address indexed fromApp, uint64 nonce, bytes payload);
    event InboundDelivered(uint32 indexed srcChainId, address indexed srcApp, address indexed toApp, uint64 nonce, bytes payload);

    // ---- Errors ----
    error NotExecutor();
    error RemoteMismatch();
    error ReceiverNotApproved();
    error NonceOutOfOrder();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);
    }

    // =========================
    // Admin configuration
    // =========================
    function setTrustedRemote(uint32 chainId, address remote) external onlyRole(ADMIN_ROLE) {
        trustedRemote[chainId] = remote;
        emit RemoteSet(chainId, remote);
    }

    function approveReceiver(address app, bool approved) external onlyRole(ADMIN_ROLE) {
        isReceiverApproved[app] = approved;
        emit ReceiverApproved(app, approved);
    }

    // =========================
    // Outbound (emit message)
    // =========================
    /**
     * @notice Enqueue an outbound message. Your off-chain bridge agent should read this
     *         event and deliver the payload via the underlying bridge to the remote adapter.
     */
    function outbound(uint32 dstChainId, address dstApp, bytes calldata payload) external nonReentrant {
        require(isReceiverApproved[msg.sender], "sender not approved");
        // We emit an event instead of doing bridge-specific logic to keep this adapter generic.
        uint64 nonce = ++lastNonce[dstChainId][msg.sender];
        emit OutboundQueued(dstChainId, dstApp, msg.sender, nonce, payload);
    }

    // =========================
    // Inbound (deliver message)
    // =========================
    /**
     * @notice Bridge executor calls this on the destination chain to deliver a message.
     * @param srcChainId source chain id (domain identifier you use off-chain consistently)
     * @param srcApp     source app/adapter on the origin chain (must match trustedRemote[srcChainId])
     * @param toApp      local receiver contract (must be approved)
     * @param nonce      strictly increasing per (srcChainId, srcApp)
     * @param payload    opaque bytes delivered to receiver
     */
    function inbound(
        uint32 srcChainId,
        address srcApp,
        address toApp,
        uint64 nonce,
        bytes calldata payload
    ) external nonReentrant {
        if (!hasRole(EXECUTOR_ROLE, msg.sender)) revert NotExecutor();
        if (trustedRemote[srcChainId] != srcApp) revert RemoteMismatch();
        if (!isReceiverApproved[toApp]) revert ReceiverNotApproved();

        uint64 expected = lastNonce[srcChainId][srcApp] + 1;
        if (nonce != expected) revert NonceOutOfOrder();
        lastNonce[srcChainId][srcApp] = nonce;

        IBridgeReceiver(toApp).onBridgeMessage(srcChainId, srcApp, payload);
        emit InboundDelivered(srcChainId, srcApp, toApp, nonce, payload);
    }
}
