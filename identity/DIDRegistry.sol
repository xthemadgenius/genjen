// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DIDRegistry
 * @notice Minimal self-serve DID registry.
 *         DIDs are identified by their string (e.g., "did:example:alice").
 *         The first caller to claim a DID becomes its controller.
 *         Controller can set an off-chain DID Document URI, rotate control, or deactivate.
 */
contract DIDRegistry {
    struct DIDRecord {
        address controller;
        string uri;       // DID Document URI (IPFS/HTTPS/etc.)
        bool active;
    }

    // keccak256(didString) => record
    mapping(bytes32 => DIDRecord) private _records;

    event DIDClaimed(string did, address indexed controller, string uri);
    event DIDURIUpdated(string did, string uri);
    event DIDControllerRotated(string did, address indexed oldController, address indexed newController);
    event DIDDeactivated(string did, bool active);

    error AlreadyClaimed();
    error NotController();
    error InactiveDID();
    error ZeroAddress();

    /// @notice Returns a record for a DID string.
    function getRecord(string calldata did)
        external
        view
        returns (address controller, string memory uri, bool active)
    {
        bytes32 id = _hash(did);
        DIDRecord storage rec = _records[id];
        return (rec.controller, rec.uri, rec.active);
    }

    /// @notice True if `account` controls `did`.
    function isController(string calldata did, address account) public view returns (bool) {
        bytes32 id = _hash(did);
        return _records[id].controller == account && _records[id].active;
    }

    /// @notice Claim an unowned DID. The caller becomes the controller.
    function claim(string calldata did, string calldata uri) external {
        bytes32 id = _hash(did);
        DIDRecord storage rec = _records[id];
        if (rec.controller != address(0)) revert AlreadyClaimed();
        rec.controller = msg.sender;
        rec.uri = uri;
        rec.active = true;
        emit DIDClaimed(did, msg.sender, uri);
    }

    /// @notice Update the DID Document URI.
    function setURI(string calldata did, string calldata uri) external onlyActiveController(did) {
        bytes32 id = _hash(did);
        _records[id].uri = uri;
        emit DIDURIUpdated(did, uri);
    }

    /// @notice Rotate controller to a new address.
    function rotateController(string calldata did, address newController) external onlyActiveController(did) {
        if (newController == address(0)) revert ZeroAddress();
        bytes32 id = _hash(did);
        address old = _records[id].controller;
        _records[id].controller = newController;
        emit DIDControllerRotated(did, old, newController);
    }

    /// @notice Deactivate or reactivate a DID.
    function setActive(string calldata did, bool active_) external onlyController(did) {
        bytes32 id = _hash(did);
        _records[id].active = active_;
        emit DIDDeactivated(did, active_);
    }

    // --- modifiers & utils ---

    modifier onlyController(string calldata did) {
        if (!_isController(did, msg.sender)) revert NotController();
        _;
    }

    modifier onlyActiveController(string calldata did) {
        if (!_isController(did, msg.sender)) revert NotController();
        if (!_isActive(did)) revert InactiveDID();
        _;
    }

    function _isController(string calldata did, address who) internal view returns (bool) {
        bytes32 id = _hash(did);
        return _records[id].controller == who;
    }

    function _isActive(string calldata did) internal view returns (bool) {
        bytes32 id = _hash(did);
        return _records[id].active;
    }

    function _hash(string calldata did) internal pure returns (bytes32) {
        return keccak256(bytes(did));
    }
}
