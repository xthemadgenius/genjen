// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MinimalForwarder
 * @notice ERC-2771 style meta-transaction forwarder.
 *         - Verifies EIP-712 signatures over a ForwardRequest
 *         - Increments nonces per signer
 *         - For ERC2771Context-aware targets, appends `from` to calldata
 *
 * @dev Targets that wish to read the original sender should inherit OpenZeppelin's ERC2771Context
 *      and trust this forwarder address.
 */
contract MinimalForwarder {
    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data; // calldata for target
    }

    bytes32 private constant TYPEHASH = keccak256(
        "ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)"
    );

    mapping(address => uint256) private _nonces;

    // EIP-712 domain separator
    bytes32 private immutable _DOMAIN_SEPARATOR;
    uint256 private immutable _CACHED_CHAIN_ID;

    event Executed(address indexed from, address indexed to, bool success, bytes returndata);
    event NonceUsed(address indexed from, uint256 nonce);

    constructor() {
        _CACHED_CHAIN_ID = block.chainid;
        _DOMAIN_SEPARATOR = _buildDomainSeparator();
    }

    // ---------- Views ----------

    function getNonce(address from) external view returns (uint256) {
        return _nonces[from];
    }

    function domainSeparator() public view returns (bytes32) {
        return (block.chainid == _CACHED_CHAIN_ID) ? _DOMAIN_SEPARATOR : _buildDomainSeparator();
    }

    // Verifies signature for a ForwardRequest without changing state
    function verify(ForwardRequest calldata req, bytes calldata signature) public view returns (bool) {
        address signer = _recoverSigner(req, signature);
        return _nonces[req.from] == req.nonce && signer == req.from;
    }

    // ---------- Execute ----------

    function execute(ForwardRequest calldata req, bytes calldata signature)
        external
        payable
        returns (bool success, bytes memory returndata)
    {
        require(verify(req, signature), "Forwarder: invalid signature");
        _nonces[req.from] = req.nonce + 1;
        emit NonceUsed(req.from, req.nonce);

        // Append the original sender to calldata for ERC2771Context
        bytes memory callData = abi.encodePacked(req.data, req.from);

        // solhint-disable-next-line avoid-low-level-calls
        (success, returndata) = req.to.call{gas: req.gas, value: req.value}(callData);

        // If the call used all gas, we bubble an OOG (let it revert)
        // Ensure forwarded call can't return with more gas than provided
        assert(gasleft() > req.gas / 63);

        emit Executed(req.from, req.to, success, returndata);
        if (!success) {
            // Bubble revert reason
            assembly {
                revert(add(returndata, 0x20), mload(returndata))
            }
        }
    }

    // ---------- Internal: EIP-712 ----------

    function _hash(ForwardRequest calldata req) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                TYPEHASH,
                req.from,
                req.to,
                req.value,
                req.gas,
                req.nonce,
                keccak256(req.data)
            )
        );
    }

    function _recoverSigner(ForwardRequest calldata req, bytes calldata signature)
        internal
        view
        returns (address)
    {
        bytes32 structHash = _hash(req);
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator(), structHash));
        return _ecdsaRecover(digest, signature);
    }

    function _buildDomainSeparator() private view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("MinimalForwarder")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    // Lightweight ECDSA recover (to avoid importing a full lib)
    function _ecdsaRecover(bytes32 digest, bytes calldata sig) private pure returns (address) {
        if (sig.length != 65) return address(0);
        bytes32 r;
        bytes32 s;
        uint8 v;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        return ecrecover(digest, v, r, s);
    }
}