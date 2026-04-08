---
sidebar_position: 20
title: ODE solver, master equation
description: ODE solver, master equation protocols and algorithms
---

# ODE solver, master equation

Complete reference for all ODE solver, master equation protocols in the Zeq SDK.

## Overview

The ODE solver, master equation protocol family enables advanced computational capabilities.

## Protocols (7)

### ZeqCompute

**Protocol ID:** `zeq-compute`
**Version:** 1.0
**Endpoint:** `/api/zeq/compute` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min + daily plan limit

#### Description

Core computation — select domain, resolve operators, compute R(t), build master equation, return ZeqState with ZeqProof HMAC. Supports algebraic, ODE, and strict modes.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| domain | `string` | No | Domain name or prefix (e.g.  |

#### Returns

{ zeqState, result, meta, zeqProof }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqProof Verify

**Protocol ID:** `zeq-verify`
**Version:** 1.0
**Endpoint:** `/api/zeq/verify` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Verify a ZeqProof HMAC-SHA256 binding. Confirms a previous computation


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| proof | `string` | Yes | ZeqProof hex string from a previous /compute response. |
| operatorIds | `array` | Yes | Operator IDs from the original computation. |
| R_t | `number` | Yes | R_t value (6dp). |
| zeqond | `number` | Yes | Zeqond value. |

#### Returns

{ protocol: 

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/verify \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqLattice

**Protocol ID:** `zeq-lattice`
**Version:** 1.0
**Endpoint:** `/api/zeq/lattice` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min + N calls consumed

#### Description

Multi-node cross-domain coherence computation. 2–5 nodes from a shared timestamp with staggered phase offsets. Returns coherence score.


#### Returns

{ protocol: 

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/lattice \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqShift

**Protocol ID:** `zeq-shift`
**Version:** 1.0
**Endpoint:** `/api/zeq/shift` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min + N calls consumed

#### Description

Time-series R(t) projection forward 1–64 Zeqond steps. Shows phase, R_t, and delta per step.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| steps | `number` | No | Zeqond steps to project (1–64). Default: 16. |
| domain | `string` | No | Domain name or prefix. |
| inputs | `object` | No | Named numeric inputs. |

#### Returns

{ protocol: 

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/shift \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### HULYAS ODE Solver

**Protocol ID:** `zeq-solve`
**Version:** 1.0
**Endpoint:** `/api/framework/solve` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Numerically integrates the full HULYAS master equation using RK4. Parses prompt for object/location/medium, applies operator weights.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| prompt | `string` | Yes | Natural language experiment (e.g.  |
| alpha | `number` | No | KO42.1 auto modulation. Default: 1.0 |
| beta | `number` | No | KO42.2 manual modulation. Default: 0.0 |
| koSettings | `object` | No | Operator ID → weight map. |
| tMax | `number` | No | Simulation duration (0.1–30s). Default: 5.0 |
| dt | `number` | No | Time step (0.001–0.1s). Default: 0.01 |

#### Returns

{ ckoId, errorPct, energy, tEval, solution, koSettings, mode, object, location, mass, masterEquationTerms }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/framework/solve \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### HULYAS Strict Solver

**Protocol ID:** `zeq-solve-strict`
**Version:** 1.0
**Endpoint:** `/api/framework/solve/strict` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Auto-tunes β parameter iteratively until error ≤ 0.1% or max iterations. The 7-Step Wizard


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| prompt | `string` | Yes | Experiment description. |
| koSettings | `object` | No | Operator weights. |
| maxIterations | `number` | No | Max β-tuning iterations (1–20). |

#### Returns

{ ...solverResult, betaFinal, tuneIterations, tuneStatus }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/framework/solve/strict \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Master Equation Builder

**Protocol ID:** `zeq-master-equation`
**Version:** 1.0
**Endpoint:** `/api/zeq/master-equation` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Builds the synthesized HULYAS master equation for a given domain and operator set without executing the solver. Returns the full equation string and term breakdown.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| domain | `string` | No | Domain name. |
| operators | `array` | No | Operator IDs. |
| inputs | `object` | No | Named inputs for variable substitution. |

#### Returns

{ masterEquation, operators, domain, terms, ko42Applied }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/master-equation \
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
