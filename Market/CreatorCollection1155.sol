// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CreatorCollection1155
 * @notice Multi-token creator collection for courses/content/memorabilia.
 *         - ERC-1155 w/ per-ID URI (or baseURI)
 *         - EIP-2981 royalties (default per-collection; optional per-ID)
 *         - Minting gated to CREATOR_ROLE (you/your team/your backend)
 */
contract CreatorCollection1155 is ERC1155, ERC1155Supply, ERC2981, AccessControl, Pausable {
    using Strings for uint256;

    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");

    string public name;
    string public symbol;

    // Optional per-id URI override
    mapping(uint256 => string) private _tokenURI;

    event URISet(uint256 indexed id, string newURI);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address admin,
        address creator,
        address royaltyReceiver,
        uint96 royaltyBps // e.g., 500 = 5.00%
    ) ERC1155(baseURI_) {
        name = name_;
        symbol = symbol_;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(CREATOR_ROLE, admin);
        if (creator != address(0)) _grantRole(CREATOR_ROLE, creator);

        if (royaltyReceiver != address(0) && royaltyBps > 0) {
            _setDefaultRoyalty(royaltyReceiver, royaltyBps);
        }
    }

    // -------- Admin --------

    function setBaseURI(string calldata newBase) external onlyRole(ADMIN_ROLE) {
        _setURI(newBase);
    }

    function setTokenURI(uint256 id, string calldata newURI) external onlyRole(ADMIN_ROLE) {
        _tokenURI[id] = newURI;
        emit URISet(id, newURI);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyRole(ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setTokenRoyalty(uint256 id, address receiver, uint96 feeNumerator) external onlyRole(ADMIN_ROLE) {
        _setTokenRoyalty(id, receiver, feeNumerator);
    }

    function deleteTokenRoyalty(uint256 id) external onlyRole(ADMIN_ROLE) {
        _resetTokenRoyalty(id);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // -------- Creator minting --------

    function mint(address to, uint256 id, uint256 amount, bytes calldata data)
        external
        whenNotPaused
        onlyRole(CREATOR_ROLE)
    {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data)
        external
        whenNotPaused
        onlyRole(CREATOR_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    // -------- Views / overrides --------

    function uri(uint256 id) public view override returns (string memory) {
        string memory perId = _tokenURI[id];
        if (bytes(perId).length != 0) return perId;
        return super.uri(id);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._update(from, to, ids, amounts);
    }

    function supportsInterface(bytes4 iid)
        public
        view
        override(ERC1155, AccessControl, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(iid);
    }
}
