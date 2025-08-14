// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {CreatorCollection1155} from "./CreatorCollection1155.sol";

/**
 * @title CollectionFactory
 * @notice Deploys new CreatorCollection1155 instances for creators.
 */
contract CollectionFactory is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event CollectionCreated(address indexed collection, address indexed creator, string name, string symbol);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function createCollection(
        string calldata name_,
        string calldata symbol_,
        string calldata baseURI_,
        address creator,
        address royaltyReceiver,
        uint96 royaltyBps
    ) external onlyRole(ADMIN_ROLE) returns (address collection) {
        CreatorCollection1155 c = new CreatorCollection1155(
            name_,
            symbol_,
            baseURI_,
            address(this), // factory is admin initially
            creator,
            royaltyReceiver,
            royaltyBps
        );
        // Hand off ADMIN_ROLE to creator (optional; or keep shared control)
        c.grantRole(c.ADMIN_ROLE(), creator);
        c.revokeRole(c.ADMIN_ROLE(), address(this)); // factory relinquishes admin (safer)

        emit CollectionCreated(address(c), creator, name_, symbol_);
        return address(c);
    }
}
