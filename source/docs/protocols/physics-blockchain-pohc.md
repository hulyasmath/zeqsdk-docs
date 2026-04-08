---
sidebar_position: 23
title: Physics Blockchain, PoHC
description: Physics Blockchain, PoHC protocols and algorithms
---

# Physics Blockchain, PoHC

Complete reference for all Physics Blockchain, PoHC protocols in the Zeq SDK.

## Overview

The Physics Blockchain, PoHC protocol family enables advanced computational capabilities.

## Protocols (6)

### PoHC — Proof of Harmonic Convergence

**Protocol ID:** `pohc-validate`
**Version:** 1.0
**Endpoint:** `/api/chain/pohc/validate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Submit a physics computation for block validation. Validators solve the same equation simultaneously on HulyaPulse cycles — solutions must converge within tolerance. No hash puzzles. Real physics.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| equation | `string` | Yes | Physics equation derived from transaction data. |
| solution | `number` | Yes | Validator |
| syncCycle | `number` | Yes | HulyaPulse cycle this solution was computed for. |
| validatorId | `string` | Yes | Validator |

#### Returns

{ accepted, convergenceRatio, validatorsAgreed, blockCandidate }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/chain/pohc/validate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### PoHC — Consensus Check

**Protocol ID:** `pohc-consensus`
**Version:** 1.0
**Endpoint:** `/api/chain/pohc/consensus` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Check consensus state for the current HulyaPulse cycle. Returns convergence ratio, validator count, and whether a block was finalized.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cycle | `number` | No | Specific cycle to query. Default: current cycle. |

#### Returns

{ cycle, convergenceRatio, validatorCount, blockFinalized, blockHash, equation }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/chain/pohc/consensus \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Physics Chain — Submit Transaction

**Protocol ID:** `chain-submit`
**Version:** 1.0
**Endpoint:** `/api/chain/tx/submit` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Submit a transaction to the Physics Blockchain. Transactions are equation-signed (Zeq Auth) and carry optional physics computation data.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sender | `string` | Yes | Sender ZID. |
| receiver | `string` | Yes | Receiver ZID. |
| data | `object` | Yes | Transaction payload. |
| signature | `string` | Yes | Equation-derived signature. |

#### Returns

{ txId, zeqondStamp, pendingInCycle, estimatedConfirmation }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/chain/tx/submit \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Physics Chain — Get Block

**Protocol ID:** `chain-block`
**Version:** 1.0
**Endpoint:** `/api/chain/block` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Retrieve a finalized block by cycle number or hash. Contains convergence proof, validator list, and all transactions.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cycle | `number` | No | Block cycle number. |
| hash | `string` | No | Block hash. |

#### Returns

{ block: { cycle, hash, previousHash, validators, convergenceRatio, transactions, equation, solution } }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/chain/block \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Physics Chain — Chain State

**Protocol ID:** `chain-state`
**Version:** 1.0
**Endpoint:** `/api/chain/state` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Current state of the Physics Blockchain — head block, chain length, active validators, total transactions, average convergence.


#### Returns

{ headCycle, headHash, chainLength, activeValidators, totalTransactions, avgConvergence, pulseHz }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/chain/state \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Physics Chain — Explorer

**Protocol ID:** `chain-explorer`
**Version:** 1.0
**Endpoint:** `/api/chain/explore` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Search and browse the Physics Blockchain. Query transactions by ZID, explore blocks by range, view validator statistics.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| zid | `string` | No | Filter transactions by ZID. |
| fromCycle | `number` | No | Start cycle. |
| toCycle | `number` | No | End cycle. |
| type | `string` | No |  |

#### Returns

{ results, total, range }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/chain/explore \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


## Common Patterns

### Usage Tips
- Review the endpoint documentation before first use
- Start with simple inputs for testing
- Monitor API quota usage
- Cache results when appropriate for your use case
