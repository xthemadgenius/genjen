// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title OffersEscrow
 * @notice Buyers place funded offers; seller accepts to finalize transfer and payouts (royalty + fee).
 * Integrate FeeController for protocol fee bps.
 */
interface IFeeController { function feeBps(address collection, address seller) external view returns (uint96); }

contract OffersEscrow is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IFeeController public feeCtrl;
    address payable public feeRecipient;

    struct Offer {
        address bidder;
        address token;
        uint256 id;
        uint256 amount;   // 1 for ERC721, qty for ERC1155
        uint256 price;    // total in wei
        bool is1155;
        bool active;
    }

    // key = keccak256(token,id,seller,bidder)
    mapping(bytes32 => Offer) public offers;

    event Offered(address indexed bidder, address indexed token, uint256 id, address indexed seller, uint256 amount, uint256 price, bool is1155);
    event Cancelled(address indexed bidder, address indexed token, uint256 id, address indexed seller);
    event Accepted(address indexed seller, address indexed bidder, address indexed token, uint256 id, uint256 amount, uint256 price, uint256 fee, uint256 royalty);

    error NotActive(); error NotOwner(); error BadAmount();

    constructor(address admin, address feeController, address payable _feeRecipient) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        feeCtrl = IFeeController(feeController);
        feeRecipient = _feeRecipient;
    }

    function setFeeController(address f) external onlyRole(ADMIN_ROLE){ feeCtrl = IFeeController(f); }
    function setFeeRecipient(address payable r) external onlyRole(ADMIN_ROLE){ feeRecipient = r; }

    function _key(address token, uint256 id, address seller, address bidder) internal pure returns (bytes32) {
        return keccak256(abi.encode(token,id,seller,bidder));
    }

    function offer721(address token, uint256 id, address seller) external payable {
        require(msg.value > 0, "no funds");
        IERC721 erc = IERC721(token);
        require(erc.ownerOf(id) == seller, "seller not owner");
        bytes32 k = _key(token,id,seller,msg.sender);
        offers[k] = Offer(msg.sender, token, id, 1, msg.value, false, true);
        emit Offered(msg.sender, token, id, seller, 1, msg.value, false);
    }

    function offer1155(address token, uint256 id, address seller, uint256 amount) external payable {
        require(msg.value > 0 && amount>0, "bad");
        IERC1155 erc = IERC1155(token);
        require(erc.balanceOf(seller, id) >= amount, "seller bal");
        bytes32 k = _key(token,id,seller,msg.sender);
        offers[k] = Offer(msg.sender, token, id, amount, msg.value, true, true);
        emit Offered(msg.sender, token, id, seller, amount, msg.value, true);
    }

    function cancel(address token, uint256 id, address seller) external nonReentrant {
        bytes32 k = _key(token,id,seller,msg.sender);
        Offer memory o = offers[k]; require(o.active, "no offer");
        delete offers[k];
        (bool ok,) = payable(msg.sender).call{value: o.price}(""); require(ok,"refund");
        emit Cancelled(msg.sender, token, id, seller);
    }

    function accept(address token, uint256 id, uint256 amount, address bidder) external nonReentrant {
        bytes32 k = _key(token,id,msg.sender,bidder);
        Offer memory o = offers[k]; if (!o.active) revert NotActive();
        if (o.is1155) { if (amount==0 || amount>o.amount) revert BadAmount(); }
        else { if (amount!=1) revert BadAmount(); }

        // Payouts: royalty + fee
        uint256 price = o.price * amount / o.amount;
        (address rcv, uint256 royalty) = _royaltyInfo(token, id, price);
        uint96 bps = feeCtrl.feeBps(token, msg.sender);
        uint256 fee = price * bps / 10_000;
        uint256 toSeller = price - royalty - fee;

        if (royalty>0 && rcv!=address(0)){ (bool rok,) = payable(rcv).call{value: royalty}(""); require(rok,"roy"); }
        if (fee>0){ (bool fok,) = feeRecipient.call{value: fee}(""); require(fok,"fee"); }
        (bool sok,) = payable(msg.sender).call{value: toSeller}(""); require(sok,"seller");

        // Transfer NFT(s)
        if (o.is1155) { IERC1155(token).safeTransferFrom(msg.sender, bidder, id, amount, ""); }
        else { IERC721(token).safeTransferFrom(msg.sender, bidder, id); }

        // Update / clear offer
        if (o.is1155 && amount < o.amount) {
            offers[k].amount = o.amount - amount;
            offers[k].price  = o.price - price;
        } else {
            delete offers[k];
        }

        emit Accepted(msg.sender, bidder, token, id, amount, price, fee, royalty);
    }

    function _royaltyInfo(address token, uint256 id, uint256 salePrice) internal view returns (address, uint256) {
        if (IERC165(token).supportsInterface(type(IERC2981).interfaceId)) {
            return IERC2981(token).royaltyInfo(id, salePrice);
        }
        return (address(0),0);
    }

    receive() external payable {}
}