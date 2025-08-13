// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {GovernorPreventLateQuorum} from "@openzeppelin/contracts/governance/extensions/GovernorPreventLateQuorum.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title DAOGovernor
 * @notice On-chain governance for your DAO:
 *         - Simple For/Against/Abstain counting
 *         - Configurable voting delay/period/threshold (in blocks)
 *         - Quorum as % of total voting supply (checkpointed)
 *         - Timelock-enforced execution
 *         - Prevent-late-quorum: extends the voting period if quorum is reached near the end
 *
 * @dev Give PROPOSER+EXECUTOR roles on the Timelock to this governor, then
 *      set the Timelock itself as its own admin (standard OZ pattern).
 */
contract DAOGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    GovernorPreventLateQuorum
{
    /**
     * @param token               IVotes token (ERC20Votes or ERC721Votes)
     * @param timelock            Timelock controller instance
     * @param votingDelayBlocks   delay before voting starts (in blocks)
     * @param votingPeriodBlocks  voting duration (in blocks)
     * @param proposalThreshold_  minimum votes to create a proposal
     * @param quorumPercent       quorum numerator as a percent (e.g., 4 for 4%)
     * @param lateQuorumExtensionBlocks number of blocks to extend if quorum is reached near the end
     */
    constructor(
        IVotes token,
        TimelockController timelock,
        uint256 votingDelayBlocks,
        uint256 votingPeriodBlocks,
        uint256 proposalThreshold_,
        uint256 quorumPercent,
        uint256 lateQuorumExtensionBlocks
    )
        Governor("DAOGovernor")
        GovernorSettings(votingDelayBlocks, votingPeriodBlocks, proposalThreshold_)
        GovernorVotes(token)
        GovernorVotesQuorumFraction(quorumPercent)
        GovernorTimelockControl(timelock)
        GovernorPreventLateQuorum(lateQuorumExtensionBlocks)
    {}

    // -------- Required overrides --------

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    { return super.votingDelay(); }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    { return super.votingPeriod(); }

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    { return super.quorum(blockNumber); }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl, GovernorPreventLateQuorum)
        returns (ProposalState)
    { return super.state(proposalId); }

    function proposalDeadline(uint256 proposalId)
        public
        view
        override(Governor, GovernorPreventLateQuorum)
        returns (uint256)
    { return super.proposalDeadline(proposalId); }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
    { super._execute(proposalId, targets, values, calldatas, descriptionHash); }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    { return super._cancel(targets, values, calldatas, descriptionHash); }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    { return super._executor(); }

    function supportsInterface(bytes4 iid)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    { return super.supportsInterface(iid); }
}
