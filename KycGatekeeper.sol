// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title KycGatekeeper
 * @notice Gates actions based on badges set in a BadgeRegistry (e.g., "KYC_PASS").
 *         Works for addresses; can be toggled per target contract (allowlist).
 */
interface IBadgeRegistry {
    function hasAddressBadge(bytes32 badgeType, address subject) external view returns (bool);
}

contract KycGatekeeper is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GUARD_ROLE = keccak256("GUARD_ROLE"); // can manage target allowlist

    IBadgeRegistry public badgeRegistry;
    bytes32 public kycBadgeType; // e.g., keccak256("KYC_PASS")

    // Optional: restrict enforcement to specific target contracts (when msg.sender == target)
    mapping(address => bool) public kycRequiredForTarget;

    event RegistrySet(address registry);
    event BadgeTypeSet(bytes32 badgeType);
    event TargetKycRequired(address indexed target, bool required);

    error KycRequired();

    constructor(address admin, address registry, bytes32 badgeType) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(GUARD_ROLE, admin);
        badgeRegistry = IBadgeRegistry(registry);
        kycBadgeType = badgeType;
        emit RegistrySet(registry);
        emit BadgeTypeSet(badgeType);
    }

    // ---------- Admin ----------
    function setRegistry(address registry) external onlyRole(ADMIN_ROLE) {
        badgeRegistry = IBadgeRegistry(registry);
        emit RegistrySet(registry);
    }

    function setKycBadgeType(bytes32 badgeType) external onlyRole(ADMIN_ROLE) {
        kycBadgeType = badgeType;
        emit BadgeTypeSet(badgeType);
    }

    function setTargetKycRequired(address target, bool required) external onlyRole(GUARD_ROLE) {
        kycRequiredForTarget[target] = required;
        emit TargetKycRequired(target, required);
    }

    // ---------- Checks ----------
    function isKycPassed(address user) public view returns (bool) {
        return badgeRegistry.hasAddressBadge(kycBadgeType, user);
    }

    /**
     * @notice Call this from your app/marketplace before critical actions.
     *         Reverts if user lacks KYC and the caller is an enforced target.
     */
    function enforceKyc(address user) external view {
        if (!kycRequiredForTarget[msg.sender]) return;
        if (!isKycPassed(user)) revert KycRequired();
    }
}
