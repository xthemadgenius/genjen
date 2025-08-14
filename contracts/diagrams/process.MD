# DAO + Creator Marketplace + Rewards Stack

This repository contains a complete modular smart contract system for a DAO-governed creator economy.  
It covers **identity**, **governance**, **content creation**, **marketplace sales**, **rewards**, and **treasury management**.

---

## Overview

**Core Modules:**

| Module Group        | Contracts                                                                 | Purpose |
|---------------------|---------------------------------------------------------------------------|---------|
| Identity            | `DIDRegistry`, `SBTIssuer`, `BadgeRegistry`, `DAOMembershipNFT`           | On-chain identity (DIDs), soulbound tokens, verified badges, and DAO membership |
| Governance          | `DAOGovernor`, `DAOTimeLock`                                               | Proposals, voting, and queued execution with delays |
| Treasury            | `DAOTreasury`                                                             | Secure custody of ETH, tokens, and NFTs; executes only approved proposals |
| Content & Collections | `CollectionFactory`, `CreatorCollection1155`                            | Creators launch their own NFT collections for courses, content, memorabilia |
| Marketplace         | `CreatorMarketplace`                                                      | Non-custodial NFT sales with royalties and protocol fees |
| Rewards             | `RewardsProgram`, `UtilityNFT`                                            | Points system (soulbound ERC20) + redeemable subscriptions/certificates |

---

## Contract Relationships

- **DIDRegistry** stores decentralized identifiers and metadata.
- **SBTIssuer** issues non-transferable identity tokens linked to DIDs (also used for governance voting power).
- **BadgeRegistry** assigns badges (e.g., “verified”) to addresses or NFTs.
- **DAOMembershipNFT** tracks DAO membership; can be tiered and expirable.
- **DAOGovernor** uses SBTIssuer or DAOMembershipNFT as the voting token, executes via DAOTimeLock.
- **DAOTimeLock** holds governance execution logic and manages sensitive roles.
- **DAOTreasury** is controlled by the DAOTimeLock for all fund transfers and contract calls.
- **CollectionFactory** lets creators deploy their own ERC1155 collections with royalties.
- **CreatorMarketplace** lists and sells NFTs (ERC1155 or ERC721) with fixed prices; handles royalty + protocol fee payments.
- **RewardsProgram** mints non-transferable points for purchases via the Marketplace; supports ETH rebates and ERC1155 reward redemptions.
- **UtilityNFT** manages subscription and certificate NFTs that can be used as rewards or standalone offerings.

---

## Purchase → Rewards → Redemption Flow

1. **Buyer purchases an NFT** from the Marketplace.
2. **Marketplace**:
   - Validates ownership and approvals.
   - Calculates and sends royalty to the creator.
   - Sends protocol fee to the fee recipient.
   - Sends net proceeds to the seller.
3. **Marketplace** calls `RewardsProgram.awardOnPurchase`:
   - Awards points to the buyer based on:
     - Base rate (`baseRateBps`)
     - Optional collection multiplier
4. **Buyer** redeems points later for:
   - ETH rebate (`redeemETH`)
   - ERC1155 reward items (`redeemERC1155`) from preloaded inventory

---

## Governance Control

The DAO (via `DAOGovernor` + `DAOTimeLock`) can:

- Adjust reward rates, multipliers, and redemption catalog in `RewardsProgram`
- Change protocol fee and fee recipient in `CreatorMarketplace`
- Update roles and configurations in identity contracts (`SBTIssuer`, `BadgeRegistry`, `DAOMembershipNFT`)
- Execute transfers and calls from `DAOTreasury`
- Configure CollectionFactory default royalties
- Pause/unpause critical contracts

---

## Roles Table

| Contract              | Key Roles / Permissions                           | Typical Holder(s)                           |
|-----------------------|---------------------------------------------------|----------------------------------------------|
| **DAOGovernor/TL**    | `PROPOSER_ROLE`, `EXECUTOR_ROLE`, `ADMIN_ROLE`     | Governor, Timelock self-admin                |
| **SBTIssuer**         | `ISSUER_ROLE`, `BADGE_ROLE`, `DEFAULT_ADMIN_ROLE`  | Ops multisig, DAO TimeLock                   |
| **DAOMembershipNFT**  | `ISSUER_ROLE`, `ADMIN_ROLE`                        | Ops multisig, DAO TimeLock                   |
| **BadgeRegistry**     | `BADGER_ROLE`, `ADMIN_ROLE`                        | Verification team, DAO TimeLock              |
| **CollectionFactory** | `ADMIN_ROLE`                                       | Ops multisig, DAO TimeLock                   |
| **CreatorCollections**| `CREATOR_ROLE`, `ADMIN_ROLE`                       | Individual creator, DAO TimeLock (optional)  |
| **Marketplace**       | `ADMIN_ROLE`                                       | Ops multisig, DAO TimeLock                   |
| **RewardsProgram**    | `PARTNER_ROLE` (Marketplace), `ISSUER_ROLE`, `ADMIN_ROLE` | Marketplace, Ops, DAO TimeLock       |
| **DAOTreasury**       | `EXECUTOR_ROLE`, `ADMIN_ROLE`                      | DAO TimeLock (executor), Ops multisig admin  |
| **UtilityNFT**        | `ISSUER_ROLE`, `ADMIN_ROLE`                        | Ops, Partners, DAO TimeLock                  |

---

## Wiring Checklist

- Give **Marketplace** the `PARTNER_ROLE` on **RewardsProgram**
- Assign multipliers in `RewardsProgram` for specific collections you want to promote
- Configure royalties via EIP-2981 in each collection
- Give **DAO TimeLock** `EXECUTOR_ROLE` on **DAOTreasury**
- Transfer sensitive roles (`ADMIN_ROLE`/`DEFAULT_ADMIN_ROLE`) to the DAO TimeLock or a secure multisig

---

## Summary

This system provides:
- DAO-controlled governance and treasury
- On-chain creator identity and verification
- Creator-friendly NFT collections
- Non-custodial marketplace with royalties
- Reward points for purchases, redeemable for ETH or NFTs
- Upgradeable and role-based access for security
