---
sidebar_position: 19
title: Navigation, Hull, Cargo, Ballast, Port
description: Navigation, Hull, Cargo, Ballast, Port protocols and algorithms
---

# Navigation, Hull, Cargo, Ballast, Port

Complete reference for all Navigation, Hull, Cargo, Ballast, Port protocols in the Zeq SDK.

## Overview

The Navigation, Hull, Cargo, Ballast, Port protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqMaritimeNav

**Protocol ID:** `zeq-maritime-nav`
**Version:** 1.287.0
**Endpoint:** `/api/maritime/nav` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Ship navigation with HulyaPulse great-circle routing. Weather routing optimization, ECA compliance, current/wind set and drift compensation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vesselType | `string` | No |  |

#### Returns

{ route, distance_nm, eta, fuelConsumption_mt, ecaCompliant, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/maritime/nav \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqHullStress

**Protocol ID:** `zeq-hull-stress`
**Version:** 1.287.0
**Endpoint:** `/api/maritime/hull` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Hull structural analysis with R(t) wave loading. Hogging/sagging moments, fatigue at critical sections, slamming impact estimation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hullGeometry | `object` | Yes | Hull section modulus and geometry. |
| seaState | `number` | Yes | Sea state 1–9 (Douglas scale). |
| loadCondition | `object` | No | Cargo/ballast distribution. |

#### Returns

{ bendingMoment_kNm, shearForce_kN, hoggingSag_mm, fatigueLife_years, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/maritime/hull \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCargoOptimize

**Protocol ID:** `zeq-cargo-optimize`
**Version:** 1.287.0
**Endpoint:** `/api/maritime/cargo` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Container/cargo stowage optimization. Weight distribution, stability (GM), dangerous goods segregation, port rotation planning.


#### Returns

{ stowagePlan, gm_m, trim_m, dangerousSegregation, craneSequence, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/maritime/cargo \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBallast

**Protocol ID:** `zeq-ballast`
**Version:** 1.287.0
**Endpoint:** `/api/maritime/ballast` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Ballast water management with HulyaPulse exchange timing. BWM Convention compliance, invasive species risk, stability during exchange operations.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| currentBallast | `object` | Yes | Tank levels and salinity readings. |
| targetCondition | `object` | Yes | Desired draft and trim. |

#### Returns

{ exchangePlan, stabilitySequence, complianceStatus, invasiveRisk, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/maritime/ballast \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPortOps

**Protocol ID:** `zeq-port`
**Version:** 1.287.0
**Endpoint:** `/api/maritime/port` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Port operations optimization. Berth allocation, crane scheduling, truck appointment systems — Zeqond-synchronized for terminal-wide coordination.


#### Returns

{ berthAllocation, craneAssignment, turnaroundTime_hr, yardPlan, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/maritime/port \
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
