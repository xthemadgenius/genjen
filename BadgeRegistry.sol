// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title BadgeRegistry
 * @notice General-purpose registry for on-chain "badges" (e.g., VERIFIED).
 *         - Works for plain addresses and for NFT tokens (contract + tokenId).
 *         - Each badge has: active flag, reason code, evidence URI, setter, and timestamp.
 *         - Supports multiple badge types via bytes32 identifier (e.g., keccak256("VERIFIED")).
 */
contract BadgeRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant BADGER_ROLE  = keccak256("BADGER_ROLE"); // can set/unset badges

    struct Badge {
        bool active;
        uint32 reason;     // application-defined reason code (0 = none)
        uint64 setAt;      // block timestamp when set
        address setter;    // who set it
        string evidence;   // optional URI with proof (IPFS/HTTPS)
    }

    // badgeType => subjectAddress => Badge
    mapping(bytes32 => mapping(address => Badge)) private _addrBadges;

    // badgeType => (nftContract => (tokenId => Badge))
    mapping(bytes32 => mapping(address => mapping(uint256 => Badge))) private _nftBadges;

    event AddressBadgeSet(bytes32 indexed badgeType, address indexed subject, bool active, uint32 reason, string evidence, address indexed setter);
    event TokenBadgeSet(bytes32 indexed badgeType, address indexed tokenContract, uint256 indexed tokenId, bool active, uint32 reason, string evidence, address setter);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(BADGER_ROLE, admin);
    }

    // ------------------------
    // Address badges
    // ------------------------

    function setAddressBadge(
        bytes32 badgeType,
        address subject,
        bool active,
        uint32 reason,
        string calldata evidence
    ) external onlyRole(BADGER_ROLE) {
        _addrBadges[badgeType][subject] = Badge({
            active: active,
            reason: reason,
            setAt: uint64(block.timestamp),
            setter: msg.sender,
            evidence: evidence
        });
        emit AddressBadgeSet(badgeType, subject, active, reason, evidence, msg.sender);
    }

    function getAddressBadge(bytes32 badgeType, address subject)
        external
        view
        returns (Badge memory)
    {
        return _addrBadges[badgeType][subject];
    }

    function hasAddressBadge(bytes32 badgeType, address subject) external view returns (bool) {
        return _addrBadges[badgeType][subject].active;
    }

    // ------------------------
    // NFT token badges
    // ------------------------

    function setTokenBadge(
        bytes32 badgeType,
        address tokenContract,
        uint256 tokenId,
        bool active,
        uint32 reason,
        string calldata evidence
    ) external onlyRole(BADGER_ROLE) {
        _nftBadges[badgeType][tokenContract][tokenId] = Badge({
            active: active,
            reason: reason,
            setAt: uint64(block.timestamp),
            setter: msg.sender,
            evidence: evidence
        });
        emit TokenBadgeSet(badgeType, tokenContract, tokenId, active, reason, evidence, msg.sender);
    }

    function getTokenBadge(bytes32 badgeType, address tokenContract, uint256 tokenId)
        external
        view
        returns (Badge memory)
    {
        return _nftBadges[badgeType][tokenContract][tokenId];
    }

    function hasTokenBadge(bytes32 badgeType, address tokenContract, uint256 tokenId) external view returns (bool) {
        return _nftBadges[badgeType][tokenContract][tokenId].active;
    }
}
