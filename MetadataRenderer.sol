// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MetadataRenderer
 * @notice Lightweight on-chain metadata builder for ERC-721 / ERC-1155 collections.
 *         - Per-collection base URI + suffix (e.g., ".json")
 *         - Optional per-token URI override
 *         - Optional on-chain JSON (name/desc/image/attributes JSON string)
 *
 * Usage:
 *   string uri = renderer.tokenURIFor(address(this), tokenId);
 *   // For 1155: renderer.uriFor(address(this), id);
 */
contract MetadataRenderer is AccessControl {
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE"); // creators/backends

    struct CollectionConfig {
        string baseURI;     // e.g., ipfs://CID/
        string suffix;      // e.g., ".json"
        string namePrefix;  // optional "My Collection #"
        string description; // optional default description
        bool   allowOnchainJson; // when true produce data:application/json URI if per-token JSON is set
    }

    struct TokenOverride {
        string uri;         // if set, returned directly
        // On-chain JSON pieces (used only if allowOnchainJson)
        string name;        // overrides name
        string description; // overrides description
        string image;       // full image URI
        string attributes;  // raw JSON array string, e.g., `[{"trait_type":"Tier","value":"Gold"}]`
    }

    // collection => config
    mapping(address => CollectionConfig) public configOf;
    // collection => tokenId => overrides
    mapping(address => mapping(uint256 => TokenOverride)) public overrideOf;

    event ConfigSet(address indexed collection, CollectionConfig cfg);
    event TokenOverrideSet(address indexed collection, uint256 indexed id, TokenOverride ov);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
    }

    // --------- Admin/Manager ---------
    function setCollectionConfig(address collection, CollectionConfig calldata cfg)
        external
        onlyRole(MANAGER_ROLE)
    {
        configOf[collection] = cfg;
        emit ConfigSet(collection, cfg);
    }

    function setTokenOverride(address collection, uint256 id, TokenOverride calldata ov)
        external
        onlyRole(MANAGER_ROLE)
    {
        overrideOf[collection][id] = ov;
        emit TokenOverrideSet(collection, id, ov);
    }

    // --------- Views ---------
    function tokenURIFor(address collection, uint256 tokenId) external view returns (string memory) {
        return _build(collection, tokenId, true);
    }

    function uriFor(address collection, uint256 id) external view returns (string memory) {
        return _build(collection, id, false);
    }

    // --------- Internal builder ---------
    function _build(address collection, uint256 id, bool is721) internal view returns (string memory) {
        TokenOverride memory ov = overrideOf[collection][id];
        if (bytes(ov.uri).length != 0) return ov.uri;

        CollectionConfig memory cfg = configOf[collection];

        // On-chain JSON path
        if (cfg.allowOnchainJson && (
            bytes(ov.name).length != 0 ||
            bytes(ov.description).length != 0 ||
            bytes(ov.image).length != 0 ||
            bytes(ov.attributes).length != 0
        )) {
            string memory nameStr = bytes(ov.name).length != 0
                ? ov.name
                : _fallbackName(cfg.namePrefix, id, is721);
            string memory descStr = bytes(ov.description).length != 0
                ? ov.description
                : cfg.description;

            string memory json = string.concat(
                "{",
                    '"name":"', _escape(nameStr), '",',
                    '"description":"', _escape(descStr), '",',
                    bytes(ov.image).length != 0 ? string.concat('"image":"', ov.image, '",') : "",
                    bytes(ov.attributes).length != 0 ? string.concat('"attributes":', ov.attributes) : string('"attributes":[]'),
                "}"
            );
            return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
        }

        // Default: base + id + suffix
        if (bytes(cfg.baseURI).length == 0) return "";
        return string.concat(cfg.baseURI, id.toString(), cfg.suffix);
    }

    function _fallbackName(string memory prefix, uint256 id, bool /*is721*/) internal pure returns (string memory) {
        if (bytes(prefix).length == 0) return string.concat("Token #", id.toString());
        return string.concat(prefix, id.toString());
    }

    // minimal string escaper for quotes/backslashes
    function _escape(string memory s) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        bytes memory out = new bytes(b.length * 2);
        uint256 j;
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 c = b[i];
            if (c == '"' || c == '\\') {
                out[j++] = "\\";
                out[j++] = c;
            } else {
                out[j++] = c;
            }
        }
        assembly { mstore(out, j) }
        return string(out);
    }
}
