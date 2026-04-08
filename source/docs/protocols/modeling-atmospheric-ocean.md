---
sidebar_position: 18
title: Modeling, atmospheric, ocean
description: Modeling, atmospheric, ocean protocols and algorithms
---

# Modeling, atmospheric, ocean

Complete reference for all Modeling, atmospheric, ocean protocols in the Zeq SDK.

## Overview

The Modeling, atmospheric, ocean protocol family enables advanced computational capabilities.

## Protocols (9)

### ZeqClimate — Global Modeling

**Protocol ID:** `zeq-climate-model`
**Version:** 1.0
**Endpoint:** `/api/climate/model/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Climate modeling using atmospheric physics + fluid dynamics operator coupling. Energy balance, radiative forcing, and temperature projection via HULYAS solver.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| scenario | `string` | Yes |  |
| baseYear | `number` | No | Simulation start year. Default: 2025. |
| projectionYears | `number` | No | Years to project. Default: 75. |

#### Returns

{ tempAnomaly, co2Ppm, seaLevelRiseMm, radiativeForcing, feedbacks, timeSeries }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/climate/model/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAtmosphere — Atmospheric Physics

**Protocol ID:** `zeq-atmosphere`
**Version:** 1.0
**Endpoint:** `/api/climate/atmosphere/profile` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Atmospheric modeling — pressure, temperature, density profiles computed from first principles. Supports standard atmosphere, tropical, polar, and custom profiles.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| altitudeKm | `number` | Yes | Altitude in km (0–100). |
| profile | `string` | No |  |

#### Returns

{ pressure, temperature, density, speedOfSound, meanFreePath, scaleHeight }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/climate/atmosphere/profile \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqOcean — Ocean Current Modeling

**Protocol ID:** `zeq-ocean`
**Version:** 1.0
**Endpoint:** `/api/climate/ocean/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Ocean circulation modeling using fluid dynamics and geophysics operators. Thermohaline circulation, surface currents, and heat transport.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| region | `string` | Yes | Ocean region:  |
| depth | `number` | No | Depth layer in meters. Default: 0 (surface). |

#### Returns

{ currentVelocity, temperature, salinity, heatTransport, upwellingRate }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/climate/ocean/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCarbon — Carbon Cycle

**Protocol ID:** `zeq-carbon`
**Version:** 1.0
**Endpoint:** `/api/climate/carbon/model` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Carbon cycle modeling — atmospheric CO2, ocean absorption, terrestrial sinks. Coupled ODE system tracking carbon flux between reservoirs.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| emissionsGtPerYear | `number` | Yes | Annual CO2 emissions in gigatonnes. |
| projectionYears | `number` | No | Years to project. Default: 100. |

#### Returns

{ atmosphericCo2, oceanUptake, terrestrialSink, accumulatedGt, timeSeries }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/climate/carbon/model \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### 7-Step Wizard — Interactive Run

**Protocol ID:** `wizard-run`
**Version:** 1.0
**Endpoint:** `/api/framework/solve` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Execute the 7-Step Wizard: parse prompt → select operators → tensor (KO42) → compile → execute → verify → output CKO.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| prompt | `string` | Yes | Physics experiment description. |
| koSettings | `object` | No | Operator weights. |
| beta | `number` | No | KO42.2 manual tensioner. |

#### Returns

{ ckoId, errorPct, energy, solution, koSettings, mode, masterEquationTerms }

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


### 7-Step Wizard — Strict Auto-Tune

**Protocol ID:** `wizard-strict`
**Version:** 1.0
**Endpoint:** `/api/framework/solve/strict` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Strict mode: auto-tunes β until error ≤ 0.1%.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| prompt | `string` | Yes | Experiment description. |
| koSettings | `object` | No | Operator weights. |

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


### Operator Database Browser

**Protocol ID:** `operator-database`
**Version:** 1.0
**Endpoint:** `/api/framework/registry` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Paginated, searchable operator database combining generated (1,340+) and canonical (1,576) operators.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| category | `string` | No | Category filter. |
| search | `string` | No | Full-text search. |

#### Returns

{ total, filtered, operators }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/registry \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### 3D Physics Simulator

**Protocol ID:** `physics-simulator`
**Version:** 1.0
**Endpoint:** `/api/zeq/pulse/stream` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Real-time physics simulation synced to HulyaPulse. API provides pulse stream + computation; frontend renders.


#### Returns

SSE stream of { zeqond, phase, R_t } + on-demand /solve calls

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/zeq/pulse/stream \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### SDK Playground

**Protocol ID:** `sdk-playground`
**Version:** 1.0
**Endpoint:** `/api/playground/compute` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Interactive API playground. Demo key for testing compute, lattice, shift, and solve without authentication.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| domain | `string` | No | Domain name. |
| operators | `array` | No | Operator IDs. |
| inputs | `object` | No | Numeric inputs. |

#### Returns

{ zeqState, result, meta, zeqProof }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/playground/compute \
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
