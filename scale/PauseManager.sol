// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PauseManager
 * @notice Emergency guardian that can pause/unpause any OZ Pausable-compatible target.
 *         Give this contract a PAUSER/ADMIN role on the targets you want controlled,
 *         or make target functions call `onlyGuardianAllowed` if you prefer soft‑gating.
 */
interface IPausable {
    function pause() external;
    function unpause() external;
    function paused() external view returns (bool);
}

contract PauseManager is AccessControl {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE"); // can trigger pauses
    bytes32 public constant ADMIN_ROLE    = keccak256("ADMIN_ROLE");

    event Paused(address indexed target);
    event Unpaused(address indexed target);
    event BulkPaused(uint256 count);
    event BulkUnpaused(uint256 count);

    constructor(address admin, address[] memory initialGuardians) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRoles(GUARDIAN_ROLE, initialGuardians);
    }

    function _grantRoles(bytes32 role, address[] memory addrs) internal {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (addrs[i] != address(0)) _grantRole(role, addrs[i]);
        }
    }

    // ---- Single target ----
    function pause(address target) public onlyRole(GUARDIAN_ROLE) {
        IPausable(target).pause();
        emit Paused(target);
    }

    function unpause(address target) public onlyRole(GUARDIAN_ROLE) {
        IPausable(target).unpause();
        emit Unpaused(target);
    }

    // ---- Bulk targets ----
    function pauseMany(address[] calldata targets) external onlyRole(GUARDIAN_ROLE) {
        for (uint256 i = 0; i < targets.length; i++) {
            IPausable(targets[i]).pause();
            emit Paused(targets[i]);
        }
        emit BulkPaused(targets.length);
    }

    function unpauseMany(address[] calldata targets) external onlyRole(GUARDIAN_ROLE) {
        for (uint256 i = 0; i < targets.length; i++) {
            IPausable(targets[i]).unpause();
            emit Unpaused(targets[i]);
        }
        emit BulkUnpaused(targets.length);
    }
}
