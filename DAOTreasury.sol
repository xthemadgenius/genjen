// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @title DAOTreasury
 * @notice Minimal, safe treasury vault for a DAO.
 *         - Holds ETH, ERC20, ERC721, ERC1155.
 *         - Only EXECUTOR_ROLE can move funds or execute calls (assign to Timelock/Governor).
 *         - Optional pause by ADMIN_ROLE.
 */
contract DAOTreasury is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE     = keccak256("ADMIN_ROLE");
    bytes32 public constant EXECUTOR_ROLE  = keccak256("EXECUTOR_ROLE");

    event Executed(address indexed target, uint256 value, bytes data, bytes result);
    event BatchExecuted(uint256 calls);
    event ERC20Recovered(address indexed token, address indexed to, uint256 amount);
    event ERC721Recovered(address indexed token, address indexed to, uint256 tokenId);
    event ERC1155Recovered(address indexed token, address indexed to, uint256 id, uint256 amount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin); // you will typically transfer this to a Timelock
    }

    // Accept ETH
    receive() external payable {}
    fallback() external payable {}

    // -------------------------
    // Admin
    // -------------------------
    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    function ethBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // -------------------------
    // Fund movements (restricted)
    // -------------------------

    /// @notice Execute an arbitrary call from the treasury (use via Timelock/Governor).
    function execute(address target, uint256 value, bytes calldata data)
        external
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
        nonReentrant
        returns (bytes memory result)
    {
        require(target != address(0), "Target=0");
        (bool ok, bytes memory res) = target.call{value: value}(data);
        require(ok, _getRevertMsg(res));
        emit Executed(target, value, data, res);
        return res;
    }

    /// @notice Batch multiple calls.
    function batchExecute(address[] calldata targets, uint256[] calldata values, bytes[] calldata calldatas)
        external
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
        nonReentrant
        returns (bytes[] memory results)
    {
        require(targets.length == values.length && targets.length == calldatas.length, "length mismatch");
        results = new bytes[](targets.length);
        for (uint256 i = 0; i < targets.length; i++) {
            (bool ok, bytes memory res) = targets[i].call{value: values[i]}(calldatas[i]);
            require(ok, _getRevertMsg(res));
            results[i] = res;
        }
        emit BatchExecuted(targets.length);
    }

    /// @notice Direct ERC20 transfer (optional convenience).
    function transferERC20(address token, address to, uint256 amount)
        external
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
    {
        IERC20(token).safeTransfer(to, amount);
        emit ERC20Recovered(token, to, amount);
    }

    /// @notice Direct ERC721 transfer (optional convenience).
    function transferERC721(address token, address to, uint256 tokenId)
        external
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
    {
        IERC721(token).safeTransferFrom(address(this), to, tokenId);
        emit ERC721Recovered(token, to, tokenId);
    }

    /// @notice Direct ERC1155 transfer (optional convenience).
    function transferERC1155(address token, address to, uint256 id, uint256 amount, bytes calldata data)
        external
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
    {
        IERC1155(token).safeTransferFrom(address(this), to, id, amount, data);
        emit ERC1155Recovered(token, to, id, amount);
    }

    // -------------------------
    // Utils
    // -------------------------

    function _getRevertMsg(bytes memory returnData) internal pure returns (string memory) {
        if (returnData.length < 68) return "Treasury: call failed";
        assembly {
            returnData := add(returnData, 0x04)
        }
        return abi.decode(returnData, (string));
    }

    // AccessControl
    function supportsInterface(bytes4 iid) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(iid);
    }
}
