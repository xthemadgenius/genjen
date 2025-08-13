// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title AccessControlRegistry
 * @notice Batch grant/revoke roles across many AccessControl-compatible contracts.
 *         Use this from a multisig or DAO Timelock to simplify role ops.
 */
contract AccessControlRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    event Granted(address indexed target, bytes32 indexed role, address indexed account);
    event Revoked(address indexed target, bytes32 indexed role, address indexed account);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
    }

    // -------- Single ops --------
    function grant(address target, bytes32 role, address account) public onlyRole(MANAGER_ROLE) {
        IAccessControl(target).grantRole(role, account);
        emit Granted(target, role, account);
    }

    function revoke(address target, bytes32 role, address account) public onlyRole(MANAGER_ROLE) {
        IAccessControl(target).revokeRole(role, account);
        emit Revoked(target, role, account);
    }

    // -------- Batch ops --------
    function grantBatch(address[] calldata targets, bytes32[] calldata roles, address[] calldata accounts)
        external
        onlyRole(MANAGER_ROLE)
    {
        uint256 n = targets.length;
        require(n == roles.length && n == accounts.length, "len mismatch");
        for (uint256 i = 0; i < n; i++) {
            IAccessControl(targets[i]).grantRole(roles[i], accounts[i]);
            emit Granted(targets[i], roles[i], accounts[i]);
        }
    }

    function revokeBatch(address[] calldata targets, bytes32[] calldata roles, address[] calldata accounts)
        external
        onlyRole(MANAGER_ROLE)
    {
        uint256 n = targets.length;
        require(n == roles.length && n == accounts.length, "len mismatch");
        for (uint256 i = 0; i < n; i++) {
            IAccessControl(targets[i]).revokeRole(roles[i], accounts[i]);
            emit Revoked(targets[i], roles[i], accounts[i]);
        }
    }

    // -------- Migrations helpers --------
    /// @notice Grant a role to `newAccount` on `target`, then revoke from `oldAccount` (role handover).
    function migrateRole(address target, bytes32 role, address oldAccount, address newAccount)
        external
        onlyRole(MANAGER_ROLE)
    {
        IAccessControl(target).grantRole(role, newAccount);
        IAccessControl(target).revokeRole(role, oldAccount);
        emit Granted(target, role, newAccount);
        emit Revoked(target, role, oldAccount);
    }
}