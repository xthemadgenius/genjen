// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ProxyAdmin
 * @notice Admin/owner for OpenZeppelin TransparentUpgradeableProxy instances.
 *         Set this contract as the admin when deploying transparent proxies.
 *         - upgrade(proxy, newImpl)
 *         - upgradeAndCall(proxy, newImpl, data, value)
 *         - changeAdmin(proxy, newAdmin)
 */
interface ITransparentUpgradeableProxy {
    function upgradeTo(address newImplementation) external;
    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable;
    function changeAdmin(address newAdmin) external;
    function admin() external returns (address); // only callable by admin; used off-chain/eth_call
    function implementation() external returns (address); // only by admin
}

contract ProxyAdmin is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event Upgraded(address indexed proxy, address indexed implementation);
    event UpgradedAndCalled(address indexed proxy, address indexed implementation, bytes data, uint256 value);
    event AdminChanged(address indexed proxy, address indexed newAdmin);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function upgrade(address proxy, address newImplementation) external onlyRole(ADMIN_ROLE) {
        ITransparentUpgradeableProxy(proxy).upgradeTo(newImplementation);
        emit Upgraded(proxy, newImplementation);
    }

    function upgradeAndCall(address proxy, address newImplementation, bytes calldata data, uint256 value)
        external
        payable
        onlyRole(ADMIN_ROLE)
    {
        require(value == msg.value, "value mismatch");
        ITransparentUpgradeableProxy(proxy).upgradeToAndCall{value: value}(newImplementation, data);
        emit UpgradedAndCalled(proxy, newImplementation, data, value);
    }

    function changeAdmin(address proxy, address newAdmin) external onlyRole(ADMIN_ROLE) {
        ITransparentUpgradeableProxy(proxy).changeAdmin(newAdmin);
        emit AdminChanged(proxy, newAdmin);
    }
}
