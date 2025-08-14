// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @title LazyMintVoucherVerifier
 * @notice Verifies creator-signed vouchers to mint ERC1155 to buyer on purchase.
 * Requires this contract to have mint privileges on the target collection.
 * Voucher hash: keccak256("Voucher(address collection,uint256 id,uint256 amount,uint256 priceUsd1e18,address payout,uint256 nonce,uint64 deadline)")
 */
interface ICreatorMintable1155 is IERC1155 { function mint(address to, uint256 id, uint256 amount, bytes calldata data) external; }
interface IPaymentRouter { function pay(address token, uint256 priceUsd1e18, address to) external payable returns (uint256); }

contract LazyMintVoucherVerifier is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE"); // creators

    IPaymentRouter public router;
    mapping(bytes32 => bool) public used; // used voucher key

    bytes32 public constant VOUCHER_TYPEHASH = keccak256("Voucher(address collection,uint256 id,uint256 amount,uint256 priceUsd1e18,address payout,uint256 nonce,uint64 deadline)");
    bytes32 private immutable _DOMAIN_SEPARATOR;
    uint256 private immutable _CACHED_CHAIN;

    event Redeemed(address indexed buyer, address indexed collection, uint256 id, uint256 amount, uint256 paid, address payout);

    constructor(address admin, address router_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        router = IPaymentRouter(router_);
        _CACHED_CHAIN = block.chainid;
        _DOMAIN_SEPARATOR = _domainSeparator();
    }

    function setRouter(address r) external onlyRole(ADMIN_ROLE) { router = IPaymentRouter(r); }

    struct Voucher {
        address collection;
        uint256 id;
        uint256 amount;
        uint256 priceUsd1e18;
        address payout;
        uint256 nonce;
        uint64  deadline;
    }

    function redeem(Voucher calldata v, address payToken, bytes calldata sig) external payable returns (uint256 paid) {
        require(block.timestamp <= v.deadline, "expired");
        bytes32 key = keccak256(abi.encode(v.collection,v.id,v.amount,v.priceUsd1e18,v.payout,v.nonce,v.deadline));
        require(!used[key], "used");
        address signer = _recover(_hashTypedData(_hashVoucher(v)), sig);
        require(hasRole(SIGNER_ROLE, signer), "bad signer");

        // collect payment
        paid = router.pay{value: msg.value}(payToken, v.priceUsd1e18, v.payout);

        // mint to buyer
        ICreatorMintable1155(v.collection).mint(msg.sender, v.id, v.amount, "");
        used[key] = true;
        emit Redeemed(msg.sender, v.collection, v.id, v.amount, paid, v.payout);
    }

    // --- EIP-712 helpers ---
    function DOMAIN_SEPARATOR() external view returns (bytes32) { return _domainSeparator(); }

    function _hashVoucher(Voucher calldata v) internal pure returns (bytes32) {
        return keccak256(abi.encode(VOUCHER_TYPEHASH, v.collection, v.id, v.amount, v.priceUsd1e18, v.payout, v.nonce, v.deadline));
    }
    function _hashTypedData(bytes32 structHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
    }
    function _domainSeparator() internal view returns (bytes32) {
        if (block.chainid == _CACHED_CHAIN) return _DOMAIN_SEPARATOR;
        return keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("LazyMintVoucherVerifier")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        ));
    }
    function _recover(bytes32 digest, bytes calldata sig) internal pure returns (address) {
        if (sig.length != 65) return address(0);
        bytes32 r; bytes32 s; uint8 v;
        assembly { r := calldataload(sig.offset) s := calldataload(add(sig.offset,32)) v := byte(0, calldataload(add(sig.offset,64))) }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        return ecrecover(digest, v, r, s);
    }
}