# DAO + Creator Marketplace + Rewards + Licensing Stack

This repository contains a complete modular smart contract system for a DAO-governed creator economy.

It covers **identity**, **governance**, **content creation & licensing**, **marketplace sales**, **rewards**, **treasury management**, and **cross-chain integration**.

---

## Overview

**Core Modules:**

| Module Group            | Contracts                                                                                                         | Purpose |
|-------------------------|-------------------------------------------------------------------------------------------------------------------|---------|
| Identity & Compliance   | `DIDRegistry`, `SBTIssuer`, `BadgeRegistry`, `DAOMembershipNFT`, `KycGatekeeper`, `AccessListRegistry`, `AttestationHub` | On-chain identity (DIDs), soulbound tokens, verified badges, DAO membership, compliance/KYC gating, allow/block lists, attestations |
| Governance              | `DAOGovernor`, `DAOTimeLock`                                                                                      | Proposals, voting, and queued execution with delays |
| Treasury & Finance      | `DAOTreasury`, `StreamVesting`, `RevenueVault`                                                                    | DAO-controlled funds, scheduled streaming payouts, and automatic revenue routing/splits |
| Content & Collections   | `CollectionFactory`, `CreatorCollection1155`, `MetadataRenderer`, `LicenseNFT`, `UtilityNFT`, `SubscriptionManager` | Creators launch NFT collections, attach licenses to works, issue utility NFTs (subs/certs), manage subscriptions |
| Marketplace Layer       | `CreatorMarketplace`, `AuctionHouse`, `OffersEscrow`, `LazyMintVoucherVerifier`, `PaymentRouter`, `FeeController`, `PrimarySaleSplitter` | Fixed-price & auction sales, offers, lazy minting, payment handling, fee config, primary sale splitting |
| Rewards & Engagement    | `RewardsProgram`, `ReferralRewards`, `StakeLockerRewards`, `MerkleDistributor`                                   | Points system (soulbound ERC20), referral bonuses, staking rewards, token/NFT airdrops |
| Cross-Chain & UX        | `MinimalForwarder`, `BridgeAdapter`                                                                               | Meta-transaction relaying (gasless UX) and cross-chain message routing |

---

## Contract Relationships

### Identity & Compliance
- `DIDRegistry` maps addresses to DIDs and metadata.
- `SBTIssuer` issues non-transferable identity tokens (can be used for DAO voting).
- `BadgeRegistry` issues badges (e.g., Verified, KYC-Passed).
- `KycGatekeeper` enforces compliance checks for sensitive actions (like license purchases).
- `AccessListRegistry` manages allowlists/blocklists.
- `AttestationHub` provides a generic attestation layer (used by KYC and verification systems).
- `DAOMembershipNFT` tracks DAO membership.

### Governance
- `DAOGovernor` uses SBTIssuer or DAOMembershipNFT for voting.
- `DAOTimeLock` queues and executes governance-approved actions, controls sensitive roles.

### Treasury & Finance
- `DAOTreasury` holds DAO funds; only executes TimeLock-approved actions.
- `StreamVesting` schedules payouts to creators/contributors over time.
- `RevenueVault` routes sales/royalties/fees to the correct recipients based on configured routes.

### Content & Licensing
- `CollectionFactory` deploys new `CreatorCollection1155` contracts for creators.
- `CreatorCollection1155` can reference a `LicenseNFT` in metadata to indicate attached rights.
- `LicenseNFT` represents usage rights to content (can be sold in Marketplace/Auction/Offers).
- `MetadataRenderer` handles on-chain/off-chain metadata logic for collections.
- `UtilityNFT` manages subscriptions and certificates.
- `SubscriptionManager` issues UtilityNFTs and/or LicenseNFTs as part of subscription purchases.

### Marketplace Layer
- `CreatorMarketplace` handles fixed-price sales of ERC1155/ERC721/LicenseNFTs.
- `AuctionHouse` supports auction sales of any supported token.
- `OffersEscrow` holds bid funds until accepted.
- `LazyMintVoucherVerifier` verifies signed vouchers for on-demand minting.
- `PaymentRouter` processes multi-currency payments.
- `FeeController` configures protocol fee basis points.
- `PrimarySaleSplitter` handles initial sale proceeds.

### Rewards & Engagement
- `RewardsProgram` mints non-transferable points for purchases (NFTs, licenses, subscriptions).
- `ReferralRewards` pays ETH splits and points bonuses to referrers.
- `StakeLockerRewards` issues points or tokens to stakers.
- `MerkleDistributor` performs airdrops of ERC20/ERC721/ERC1155 to eligible accounts.

### Cross-Chain & UX
- `MinimalForwarder` enables gasless transactions.
- `BridgeAdapter` routes and verifies cross-chain messages to other instances of this stack.

---

## Purchase → Rewards → Redemption Flow

1. **Buyer purchases** an NFT, LicenseNFT, or Subscription from the Marketplace.
2. **Marketplace**:
   - Checks KYC/AccessList gating if enabled.
   - Calculates and sends royalty to the creator.
   - Sends protocol fee to `RevenueVault`.
   - Sends net proceeds to seller or `PrimarySaleSplitter`.
3. **Marketplace** calls `RewardsProgram.awardOnPurchase`:
   - Awards points to buyer based on purchase value and configured multipliers.
4. **ReferralRewards** (if used) pays ETH split and/or bonus points to referrer.
5. **RevenueVault** routes fees/royalties to the correct treasury or payout streams.
6. **Buyer** redeems points later for:
   - ETH rebates (`redeemETH`)
   - ERC1155 rewards (`redeemERC1155`)
   - Subscription/Certificate NFTs (`UtilityNFT`)
   - Content usage rights (`LicenseNFT`)

---

## Governance Control

The DAO (via `DAOGovernor` + `DAOTimeLock`) can:
- Adjust reward rates, multipliers, and catalog in `RewardsProgram`
- Change protocol fee and fee recipient in `FeeController` / `CreatorMarketplace`
- Update roles and configurations in identity/compliance contracts
- Execute transfers and calls from `DAOTreasury`
- Configure royalty defaults in `CollectionFactory`
- Pause/unpause marketplace and rewards modules
- Manage `RevenueVault` routes and `StreamVesting` schedules

---

## Roles Table

| Contract               | Key Roles / Permissions                                       | Typical Holder(s)                           |
|------------------------|---------------------------------------------------------------|----------------------------------------------|
| **DAOGovernor/TL**     | `PROPOSER_ROLE`, `EXECUTOR_ROLE`, `ADMIN_ROLE`                 | Governor, Timelock self-admin                |
| **SBTIssuer**          | `ISSUER_ROLE`, `DEFAULT_ADMIN_ROLE`                            | Ops multisig, DAO TimeLock                   |
| **DAOMembershipNFT**   | `ISSUER_ROLE`, `ADMIN_ROLE`                                    | Ops multisig, DAO TimeLock                   |
| **BadgeRegistry**      | `BADGER_ROLE`, `ADMIN_ROLE`                                    | Verification team, DAO TimeLock              |
| **KycGatekeeper**      | `ADMIN_ROLE`                                                   | Compliance team, DAO TimeLock                |
| **AccessListRegistry** | `ADMIN_ROLE`                                                   | Ops, DAO TimeLock                            |
| **AttestationHub**     | `ISSUER_ROLE`, `REVOKER_ROLE`, `ADMIN_ROLE`                    | KYC service, DAO TimeLock                    |
| **CollectionFactory**  | `ADMIN_ROLE`                                                   | Ops multisig, DAO TimeLock                   |
| **CreatorCollections** | `CREATOR_ROLE`, `ADMIN_ROLE`                                   | Creator, DAO TimeLock                        |
| **LicenseNFT**         | `MINTER_ROLE`, `ADMIN_ROLE`                                    | SubscriptionManager, Marketplace, DAO        |
| **Marketplace**        | `ADMIN_ROLE`                                                   | Ops multisig, DAO TimeLock                   |
| **RewardsProgram**     | `PARTNER_ROLE` (Marketplace), `ISSUER_ROLE`, `ADMIN_ROLE`      | Marketplace, Ops, DAO TimeLock               |
| **ReferralRewards**    | `ADMIN_ROLE`                                                   | Ops, DAO TimeLock                            |
| **StakeLockerRewards** | `ADMIN_ROLE`                                                   | Ops, DAO TimeLock                            |
| **MerkleDistributor**  | `ADMIN_ROLE`                                                   | Ops, DAO TimeLock                            |
| **DAOTreasury**        | `EXECUTOR_ROLE`, `ADMIN_ROLE`                                  | DAO TimeLock (executor), Ops multisig admin  |
| **StreamVesting**      | `FUNDER_ROLE`, `ADMIN_ROLE`                                    | Treasury, DAO TimeLock                       |
| **RevenueVault**       | `MANAGER_ROLE`, `ADMIN_ROLE`                                   | Ops, DAO TimeLock                            |
| **MinimalForwarder**   | `ADMIN_ROLE`                                                   | Ops, DAO TimeLock                            |
| **BridgeAdapter**      | `ADMIN_ROLE`, `EXECUTOR_ROLE`                                  | Ops, DAO TimeLock                            |

---

## Wiring Checklist

- Give **Marketplace** the `PARTNER_ROLE` on **RewardsProgram**
- Assign multipliers in `RewardsProgram` for collections or LicenseNFT categories you want to promote
- Configure royalties (EIP-2981) in each collection
- Set license sale routes in `RevenueVault` for `LicenseNFT`
- Give **DAO TimeLock** `EXECUTOR_ROLE` on **DAOTreasury**
- Transfer sensitive roles (`ADMIN_ROLE`/`DEFAULT_ADMIN_ROLE`) to DAO TimeLock or secure multisig

---

## Summary

This system provides:
- DAO-controlled governance and treasury
- On-chain creator identity, verification, and compliance checks
- NFT collections with attachable usage rights via LicenseNFT
- Non-custodial marketplace with royalties, license sales, and subscriptions
- Reward points for purchases, redeemable for ETH, NFTs, subscriptions, and licenses
- Upgradeable, modular, and role-based for security
- Cross-chain compatibility and gasless UX
