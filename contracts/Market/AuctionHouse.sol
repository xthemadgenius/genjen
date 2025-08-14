// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title AuctionHouse
 * @notice English (ascending) & Dutch (descending) auctions for ERC721/1155. ETH-only.
 * Integrates FeeController for protocol fee.
 */
interface IFeeController { function feeBps(address collection, address seller) external view returns (uint96); }

contract AuctionHouse is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum Kind { English, Dutch }

    struct Auction {
        address seller;
        address token;
        uint256 id;
        uint256 amount;        // 1 for ERC721
        bool is1155;
        Kind kind;
        uint64 startTime;
        uint64 endTime;
        // English
        uint256 reservePrice;
        address highestBidder;
        uint256 highestBid;
        // Dutch
        uint256 startPrice;
        uint256 endPrice;
        bool settled;
    }

    IFeeController public feeCtrl;
    address payable public feeRecipient;

    // key = keccak256(token,id,seller)
    mapping(bytes32 => Auction) public auctions;

    event Created(address indexed seller, address indexed token, uint256 id, uint256 amount, bool is1155, Kind kind, uint64 startTime, uint64 endTime);
    event Bid(address indexed bidder, address indexed token, uint256 id, address indexed seller, uint256 amount);
    event Settled(address indexed winner, address indexed seller, address indexed token, uint256 id, uint256 amount, uint256 fee, uint256 royalty);
    event Cancelled(address indexed seller, address indexed token, uint256 id);

    error Active(); error NotActive(); error NotSeller(); error BadAmount(); error BidTooLow(); error NotEnded(); error AlreadySettled();

    constructor(address admin, address feeController, address payable _feeRecipient) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        feeCtrl = IFeeController(feeController);
        feeRecipient = _feeRecipient;
    }

    function setFeeController(address f) external onlyRole(ADMIN_ROLE){ feeCtrl = IFeeController(f); }
    function setFeeRecipient(address payable r) external onlyRole(ADMIN_ROLE){ feeRecipient = r; }

    function _key(address token, uint256 id, address seller) internal pure returns (bytes32) {
        return keccak256(abi.encode(token,id,seller));
    }

    // --- Create ---
    function createEnglish(address token, uint256 id, bool is1155, uint256 amount, uint64 start, uint64 end, uint256 reserve) external whenNotPaused {
        if (is1155) { require(amount>0, "amt"); require(IERC1155(token).balanceOf(msg.sender,id)>=amount, "bal"); }
        else { require(amount==1,"1"); require(IERC721(token).ownerOf(id)==msg.sender, "owner"); }
        bytes32 k = _key(token,id,msg.sender); require(auctions[k].seller==address(0), "exists");
        auctions[k] = Auction(msg.sender, token, id, amount, is1155, Kind.English, start, end, reserve, address(0), 0, 0, 0, false);
        emit Created(msg.sender, token, id, amount, is1155, Kind.English, start, end);
    }

    function createDutch(address token, uint256 id, bool is1155, uint256 amount, uint64 start, uint64 end, uint256 startPrice, uint256 endPrice) external whenNotPaused {
        require(startPrice > endPrice, "prices");
        if (is1155) { require(amount>0, "amt"); require(IERC1155(token).balanceOf(msg.sender,id)>=amount, "bal"); }
        else { require(amount==1,"1"); require(IERC721(token).ownerOf(id)==msg.sender, "owner"); }
        bytes32 k = _key(token,id,msg.sender); require(auctions[k].seller==address(0), "exists");
        Auction storage a = auctions[k];
        a.seller=msg.sender; a.token=token; a.id=id; a.amount=amount; a.is1155=is1155; a.kind=Kind.Dutch;
        a.startTime=start; a.endTime=end; a.startPrice=startPrice; a.endPrice=endPrice;
        emit Created(msg.sender, token, id, amount, is1155, Kind.Dutch, start, end);
    }

    // --- Bidding / Buy ---
    function bid(address token, uint256 id, address seller) external payable nonReentrant {
        bytes32 k = _key(token,id,seller); Auction storage a = auctions[k];
        require(a.seller!=address(0) && a.kind==Kind.English, "no auction");
        uint64 nowS = uint64(block.timestamp);
        if (!(nowS >= a.startTime && nowS < a.endTime)) revert NotActive();
        if (msg.value <= a.highestBid || msg.value < a.reservePrice) revert BidTooLow();

        // refund previous
        if (a.highestBidder != address(0)) {
            (bool ok,) = payable(a.highestBidder).call{value: a.highestBid}(""); require(ok,"refund");
        }
        a.highestBidder = msg.sender;
        a.highestBid = msg.value;
        emit Bid(msg.sender, token, id, seller, msg.value);
    }

    function buyDutch(address token, uint256 id, address seller) external payable nonReentrant {
        bytes32 k = _key(token,id,seller); Auction storage a = auctions[k];
        require(a.seller!=address(0) && a.kind==Kind.Dutch, "no auction");
        if (a.settled) revert AlreadySettled();
        uint64 nowS = uint64(block.timestamp);
        if (!(nowS >= a.startTime && nowS <= a.endTime)) revert NotActive();
        uint256 price = currentDutchPrice(a);
        require(msg.value == price, "price");
        _settle(a, msg.sender, price);
    }

    // --- Settle / Cancel ---
    function settleEnglish(address token, uint256 id) external nonReentrant {
        bytes32 k = _key(token,id,msg.sender); Auction storage a = auctions[k];
        require(a.seller==msg.sender && a.kind==Kind.English, "no auction");
        if (a.settled) revert AlreadySettled();
        if (block.timestamp < a.endTime) revert NotEnded();
        require(a.highestBidder != address(0), "no bids");
        _settle(a, a.highestBidder, a.highestBid);
    }

    function cancel(address token, uint256 id) external {
        bytes32 k = _key(token,id,msg.sender); Auction storage a = auctions[k];
        require(a.seller==msg.sender, "not seller");
        if (a.kind==Kind.English && a.highestBidder!=address(0)) revert Active();
        delete auctions[k];
        emit Cancelled(msg.sender, token, id);
    }

    // --- Internal settle ---
    function _settle(Auction storage a, address winner, uint256 price) internal {
        a.settled = true;

        // royalties + fee
        (address rcv, uint256 royalty) = _royaltyInfo(a.token, a.id, price);
        uint96 bps = feeCtrl.feeBps(a.token, a.seller);
        uint256 fee = price * bps / 10_000;
        uint256 toSeller = price - royalty - fee;

        if (royalty>0 && rcv!=address(0)){ (bool rok,) = payable(rcv).call{value: royalty}(""); require(rok,"roy"); }
        if (fee>0){ (bool fok,) = feeRecipient.call{value: fee}(""); require(fok,"fee"); }
        (bool sok,) = payable(a.seller).call{value: toSeller}(""); require(sok,"seller");

        // transfer NFTs
        if (a.is1155) { IERC1155(a.token).safeTransferFrom(a.seller, winner, a.id, a.amount, ""); }
        else { IERC721(a.token).safeTransferFrom(a.seller, winner, a.id); }

        emit Settled(winner, a.seller, a.token, a.id, price, fee, royalty);

        // clean
        bytes32 k = _key(a.token,a.id,a.seller);
        delete auctions[k];
    }

    function currentDutchPrice(Auction memory a) public view returns (uint256) {
        if (block.timestamp <= a.startTime) return a.startPrice;
        if (block.timestamp >= a.endTime) return a.endPrice;
        uint256 dur = a.endTime - a.startTime;
        uint256 elapsed = block.timestamp - a.startTime;
        uint256 diff = a.startPrice - a.endPrice;
        return a.startPrice - (diff * elapsed / dur);
    }

    function _royaltyInfo(address token, uint256 id, uint256 salePrice) internal view returns (address, uint256) {
        if (IERC165(token).supportsInterface(type(IERC2981).interfaceId)) {
            return IERC2981(token).royaltyInfo(id, salePrice);
        }
        return (address(0),0);
    }

    receive() external payable {}
}