// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title CreatorMarketplace
 * @notice Simple fixed-price marketplace for ERC-1155 and ERC-721.
 *         - ETH-only for payments
 *         - Protocol fee in bps to a fee recipient
 *         - Honors EIP-2981 royalties on sale
 *         - Non-custodial: seller must approve the marketplace as operator
 */
contract CreatorMarketplace is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Listing {
        address seller;
        address token;
        uint256 id;
        uint256 amount;        // 1 for ERC721
        uint256 pricePerUnit;  // in wei
        bool is1155;
    }

    uint96 public feeBps;              // e.g., 250 = 2.5%
    address payable public feeRecipient;

    // key = keccak256(token, id, seller)
    mapping(bytes32 => Listing) public listings;

    event Listed(address indexed seller, address indexed token, uint256 indexed id, uint256 amount, uint256 pricePerUnit, bool is1155);
    event Updated(address indexed seller, address indexed token, uint256 indexed id, uint256 newAmount, uint256 newPricePerUnit);
    event Canceled(address indexed seller, address indexed token, uint256 indexed id);
    event Purchased(address indexed buyer, address indexed seller, address indexed token, uint256 id, uint256 quantity, uint256 totalPaid, address royaltyRecipient, uint256 royaltyPaid, uint256 protocolFee);

    error NotOwnerOrInsufficientBalance();
    error NotApprovedForMarketplace();
    error InvalidQuantity();
    error NotListed();
    error ZeroAddress();
    error ZeroPrice();

    constructor(address admin, address payable feeRecipient_, uint96 feeBps_) {
        if (feeRecipient_ == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        feeRecipient = payable(feeRecipient_);
        feeBps = feeBps_;
    }

    // -------- Admin --------
    function setFees(address payable recipient, uint96 bps) external onlyRole(ADMIN_ROLE) {
        if (recipient == address(0)) revert ZeroAddress();
        feeRecipient = recipient;
        feeBps = bps;
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // -------- Listing --------

    function list721(address token, uint256 id, uint256 pricePerUnit) external whenNotPaused {
        if (pricePerUnit == 0) revert ZeroPrice();
        // ownership + approval
        IERC721 erc721 = IERC721(token);
        if (erc721.ownerOf(id) != msg.sender) revert NotOwnerOrInsufficientBalance();
        if (!(erc721.getApproved(id) == address(this) || erc721.isApprovedForAll(msg.sender, address(this)))) {
            revert NotApprovedForMarketplace();
        }

        bytes32 key = _key(token, id, msg.sender);
        listings[key] = Listing({
            seller: msg.sender,
            token: token,
            id: id,
            amount: 1,
            pricePerUnit: pricePerUnit,
            is1155: false
        });
        emit Listed(msg.sender, token, id, 1, pricePerUnit, false);
    }

    function list1155(address token, uint256 id, uint256 amount, uint256 pricePerUnit) external whenNotPaused {
        if (pricePerUnit == 0) revert ZeroPrice();
        if (amount == 0) revert InvalidQuantity();
        IERC1155 erc1155 = IERC1155(token);
        if (erc1155.balanceOf(msg.sender, id) < amount) revert NotOwnerOrInsufficientBalance();
        if (!erc1155.isApprovedForAll(msg.sender, address(this))) revert NotApprovedForMarketplace();

        bytes32 key = _key(token, id, msg.sender);
        listings[key] = Listing({
            seller: msg.sender,
            token: token,
            id: id,
            amount: amount,
            pricePerUnit: pricePerUnit,
            is1155: true
        });
        emit Listed(msg.sender, token, id, amount, pricePerUnit, true);
    }

    function update(address token, uint256 id, uint256 newAmount, uint256 newPricePerUnit) external whenNotPaused {
        if (newPricePerUnit == 0) revert ZeroPrice();
        bytes32 key = _key(token, id, msg.sender);
        Listing storage L = listings[key];
        if (L.seller == address(0)) revert NotListed();
        if (L.is1155) {
            // keep listed amount <= balance
            IERC1155 erc1155 = IERC1155(token);
            if (erc1155.balanceOf(msg.sender, id) < newAmount) revert NotOwnerOrInsufficientBalance();
            L.amount = newAmount;
        } else {
            if (newAmount != 1) revert InvalidQuantity();
            // ensure still owner & approved
            IERC721 erc721 = IERC721(token);
            if (erc721.ownerOf(id) != msg.sender) revert NotOwnerOrInsufficientBalance();
            if (!(erc721.getApproved(id) == address(this) || erc721.isApprovedForAll(msg.sender, address(this)))) {
                revert NotApprovedForMarketplace();
            }
        }
        L.pricePerUnit = newPricePerUnit;
        emit Updated(msg.sender, token, id, newAmount, newPricePerUnit);
    }

    function cancel(address token, uint256 id) external {
        bytes32 key = _key(token, id, msg.sender);
        Listing storage L = listings[key];
        if (L.seller == address(0)) revert NotListed();
        delete listings[key];
        emit Canceled(msg.sender, token, id);
    }

    // -------- Purchase --------

    function buy(address token, uint256 id, address seller, uint256 quantity)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        bytes32 key = _key(token, id, seller);
        Listing storage L = listings[key];
        if (L.seller == address(0)) revert NotListed();
        if (!L.is1155 && quantity != 1) revert InvalidQuantity();
        if (L.is1155 && (quantity == 0 || quantity > L.amount)) revert InvalidQuantity();

        uint256 totalPrice = L.pricePerUnit * quantity;
        require(msg.value == totalPrice, "Incorrect ETH sent");

        // Royalty calc (EIP-2981): compute on totalPrice
        (address royaltyRecv, uint256 royaltyAmt) = _royaltyInfo(token, id, totalPrice);

        // Protocol fee
        uint256 protocolFee = (totalPrice * feeBps) / 10_000;

        // Payouts
        uint256 toSeller = totalPrice - royaltyAmt - protocolFee;
        if (royaltyAmt > 0 && royaltyRecv != address(0)) {
            (bool rOk, ) = payable(royaltyRecv).call{value: royaltyAmt}("");
            require(rOk, "Royalty transfer failed");
        }
        if (protocolFee > 0) {
            (bool fOk, ) = feeRecipient.call{value: protocolFee}("");
            require(fOk, "Fee transfer failed");
        }
        (bool sOk, ) = payable(L.seller).call{value: toSeller}("");
        require(sOk, "Seller transfer failed");

        // Transfer NFT(s)
        if (L.is1155) {
            IERC1155(token).safeTransferFrom(L.seller, msg.sender, id, quantity, "");
            L.amount -= quantity;
            if (L.amount == 0) delete listings[key];
        } else {
            IERC721(token).safeTransferFrom(L.seller, msg.sender, id);
            delete listings[key];
        }

        emit Purchased(msg.sender, L.seller, token, id, quantity, totalPrice, royaltyRecv, royaltyAmt, protocolFee);
    }

    // -------- Utils --------

    function _key(address token, uint256 id, address seller) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(token, id, seller));
    }

    function _royaltyInfo(address token, uint256 id, uint256 salePrice) internal view returns (address, uint256) {
        if (IERC165(token).supportsInterface(type(IERC2981).interfaceId)) {
            return IERC2981(token).royaltyInfo(id, salePrice);
        }
        return (address(0), 0);
    }

    // To receive ERC1155
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
