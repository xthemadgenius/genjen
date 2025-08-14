// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FeeController
 * @notice Returns protocol fee (bps) for a sale; supports overrides & promos.
 */
contract FeeController is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint96 public defaultFeeBps; // e.g., 250 = 2.5%

    mapping(address => uint96) public feeByCollection; // 0 => unset
    mapping(address => uint96) public feeBySeller;     // 0 => unset

    struct Promo { uint96 feeBps; uint64 until; }
    mapping(bytes32 => Promo) public promoByKey; // key = keccak256(abi.encode(collection, seller))

    event DefaultFeeSet(uint96 bps);
    event CollectionFeeSet(address indexed collection, uint96 bps);
    event SellerFeeSet(address indexed seller, uint96 bps);
    event PromoSet(address indexed collection, address indexed seller, uint96 bps, uint64 until);

    constructor(address admin, uint96 _defaultFeeBps) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        defaultFeeBps = _defaultFeeBps;
        emit DefaultFeeSet(_defaultFeeBps);
    }

    function setDefault(uint96 bps) external onlyRole(ADMIN_ROLE) { defaultFeeBps = bps; emit DefaultFeeSet(bps); }
    function setCollectionFee(address collection, uint96 bps) external onlyRole(ADMIN_ROLE) { feeByCollection[collection]=bps; emit CollectionFeeSet(collection,bps); }
    function setSellerFee(address seller, uint96 bps) external onlyRole(ADMIN_ROLE) { feeBySeller[seller]=bps; emit SellerFeeSet(seller,bps); }
    function setPromo(address collection, address seller, uint96 bps, uint64 until) external onlyRole(ADMIN_ROLE){
        bytes32 k = keccak256(abi.encode(collection,seller));
        promoByKey[k] = Promo({feeBps:bps, until:until});
        emit PromoSet(collection, seller, bps, until);
    }

    function feeBps(address collection, address seller) external view returns (uint96) {
        // Promo has priority
        Promo memory p = promoByKey[keccak256(abi.encode(collection,seller))];
        if (p.until != 0 && block.timestamp <= p.until) return p.feeBps;
        uint96 s = feeBySeller[seller]; if (s != 0) return s;
        uint96 c = feeByCollection[collection]; if (c != 0) return c;
        return defaultFeeBps;
    }
}
