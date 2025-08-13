// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title StreamVesting
 * @notice Sablier-style linear streaming with optional cliff, for ETH or ERC-20.
 *         - Funded upfront on creation (ETH by msg.value, ERC20 by transferFrom).
 *         - Beneficiary withdraws accrued funds over time.
 *         - Optional cancelation returns unaccrued funds to payer.
 */
contract StreamVesting is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FUNDER_ROLE = keccak256("FUNDER_ROLE");

    struct Stream {
        address payer;
        address payee;
        address token;     // address(0) for ETH
        uint128 total;     // total amount funded
        uint128 withdrawn; // amount already withdrawn
        uint64  start;     // unix seconds
        uint64  cliff;     // earliest withdraw time (>= start). 0 => no cliff
        uint64  end;       // unix seconds (> start)
        bool    cancelable;
        bool    canceled;  // if canceled early
    }

    uint256 public nextId = 1;
    mapping(uint256 => Stream) public streams;

    event StreamCreated(
        uint256 indexed id,
        address indexed payer,
        address indexed payee,
        address token,
        uint128 total,
        uint64 start,
        uint64 cliff,
        uint64 end,
        bool cancelable
    );
    event Withdrawn(uint256 indexed id, address indexed to, uint256 amount);
    event Canceled(uint256 indexed id, uint256 paidToPayee, uint256 returnedToPayer);
    event PausedGlobal();
    event UnpausedGlobal();

    error BadParams();
    error NotPayerOrAdmin();
    error NotPayee();
    error NotCancelable();
    error NothingToWithdraw();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(FUNDER_ROLE, admin);
    }

    // --------- Admin ---------
    function pause() external onlyRole(ADMIN_ROLE) { _pause(); emit PausedGlobal(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); emit UnpausedGlobal(); }

    // --------- Create ---------
    /**
     * @param payee      beneficiary
     * @param token      ERC20 address or address(0) for ETH
     * @param total      total stream amount (must equal msg.value for ETH)
     * @param start      start timestamp (>= now)
     * @param cliff      cliff timestamp (0=no cliff). If non-zero, must be >= start
     * @param end        end timestamp (> start)
     * @param cancelable payer/admin can cancel before end
     */
    function create(
        address payee,
        address token,
        uint128 total,
        uint64 start,
        uint64 cliff,
        uint64 end,
        bool cancelable
    ) external payable whenNotPaused onlyRole(FUNDER_ROLE) returns (uint256 id) {
        if (payee == address(0) || total == 0 || end <= start) revert BadParams();
        if (cliff != 0 && cliff < start) revert BadParams();

        id = nextId++;
        streams[id] = Stream({
            payer: msg.sender,
            payee: payee,
            token: token,
            total: total,
            withdrawn: 0,
            start: start,
            cliff: cliff,
            end: end,
            cancelable: cancelable,
            canceled: false
        });

        // fund
        if (token == address(0)) {
            require(msg.value == total, "ETH value mismatch");
        } else {
            require(msg.value == 0, "no ETH for ERC20");
            IERC20(token).safeTransferFrom(msg.sender, address(this), total);
        }

        emit StreamCreated(id, msg.sender, payee, token, total, start, cliff, end, cancelable);
    }

    // --------- Withdraw ---------
    function withdraw(uint256 id, uint128 amount) external nonReentrant whenNotPaused {
        Stream storage s = streams[id];
        if (msg.sender != s.payee) revert NotPayee();

        uint128 avail = uint128(_accrued(s) - s.withdrawn);
        if (amount == 0 || amount > avail) revert NothingToWithdraw();

        s.withdrawn += amount;
        _payout(s.token, s.payee, amount);
        emit Withdrawn(id, s.payee, amount);
    }

    /// @notice Convenience: withdraw ALL currently available
    function withdrawAll(uint256 id) external {
        Stream storage s = streams[id];
        uint256 avail = _accrued(s) - s.withdrawn;
        if (avail == 0) revert NothingToWithdraw();
        withdraw(id, uint128(avail));
    }

    // --------- Cancel ---------
    function cancel(uint256 id) external nonReentrant whenNotPaused {
        Stream storage s = streams[id];
        if (!(msg.sender == s.payer || hasRole(ADMIN_ROLE, msg.sender))) revert NotPayerOrAdmin();
        if (!s.cancelable || s.canceled) revert NotCancelable();

        uint256 accruedAmt = _accrued(s);
        uint256 toPayee = accruedAmt > s.withdrawn ? accruedAmt - s.withdrawn : 0;
        uint256 unaccrued = s.total - accruedAmt;

        s.canceled = true;
        s.withdrawn = uint128(accruedAmt); // mark full accrued as withdrawn

        if (toPayee > 0) _payout(s.token, s.payee, toPayee);
        if (unaccrued > 0) _payout(s.token, s.payer, unaccrued);

        emit Canceled(id, toPayee, unaccrued);
    }

    // --------- Views ---------
    function accrued(uint256 id) external view returns (uint256) {
        return _accrued(streams[id]);
    }

    function withdrawable(uint256 id) external view returns (uint256) {
        Stream memory s = streams[id];
        uint256 a = _accrued(s);
        return a > s.withdrawn ? a - s.withdrawn : 0;
    }

    // --------- Internals ---------
    function _accrued(Stream memory s) internal view returns (uint256) {
        uint64 nowS = uint64(block.timestamp);
        if (s.canceled) {
            // if canceled, nothing accrues beyond the cancel moment (we stored by marking withdrawn)
            // return min(total, withdrawn)
            if (s.withdrawn > s.total) return s.total;
            return s.withdrawn;
        }
        if (nowS <= s.start) return 0;
        if (s.cliff != 0 && nowS < s.cliff) return 0;

        uint64 effectiveNow = nowS >= s.end ? s.end : nowS;
        uint256 elapsed = effectiveNow - s.start;
        uint256 duration = s.end - s.start;
        // linear
        return (uint256(s.total) * elapsed) / duration;
    }

    function _payout(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            (bool ok, ) = payable(to).call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    receive() external payable {}
}
