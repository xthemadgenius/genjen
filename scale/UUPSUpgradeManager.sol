// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UUPSUpgradeManager
 * @notice Centralized upgrader for UUPS proxies. Calls `upgradeTo` / `upgradeToAndCall`
 *         on the proxied contract (must implement UUPSUpgradeable).
 *
 * @dev To work, the target's `_authorizeUpgrade` (in the implementation) should grant
 *      permission to THIS manager (or to an admin that delegates to it).
 */
interface IUUPSUpgradeable {
    function upgradeTo(address newImplementation) external;
    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable;
}

contract UUPSUpgradeManager is AccessControl {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    event Upgraded(address indexed proxy, address indexed newImplementation);
    event UpgradedAndCalled(address indexed proxy, address indexed newImplementation, bytes data, uint256 value);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
    }

    function upgrade(address proxy, address newImplementation) external onlyRole(UPGRADER_ROLE) {
        IUUPSUpgradeable(proxy).upgradeTo(newImplementation);
        emit Upgraded(proxy, newImplementation);
    }

    function upgradeAndCall(address proxy, address newImplementation, bytes calldata data, uint256 value)
        external
        payable
        onlyRole(UPGRADER_ROLE)
    {
        require(value == msg.value, "value mismatch");
        IUUPSUpgradeable(proxy).upgradeToAndCall{value: value}(newImplementation, data);
        emit UpgradedAndCalled(proxy, newImplementation, data, value);
    }
}
