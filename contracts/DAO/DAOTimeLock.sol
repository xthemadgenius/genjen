// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title DAOTimeLock
 * @notice Thin wrapper around OZ TimelockController to give your contract a clear name.
 *
 * @dev Typical wiring after deployment:
 *      1) Deploy DAOTimeLock with a minDelay (in seconds) and initial proposers/executors/admins.
 *      2) Deploy DAOGovernor, passing this timelock.
 *      3) Grant PROPOSER_ROLE and EXECUTOR_ROLE on the timelock to DAOGovernor.
 *      4) Transfer timelock admin to itself (or a safety multisig), then revoke your deployer.
 */
contract DAOTimeLock is TimelockController {
    /**
     * @param minDelay   Minimum delay for operations (seconds).
     * @param proposers  Initial accounts that can propose operations (can be empty then added later).
     * @param executors  Who can execute queued ops. Use address(0) for "open".
     * @param admin      Admin that can grant/revoke roles initially (often a multisig).
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
