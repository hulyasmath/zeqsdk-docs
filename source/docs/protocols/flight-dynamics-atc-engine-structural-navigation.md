---
sidebar_position: 11
title: Flight Dynamics, ATC, Engine, Structural, Navigation
description: Flight Dynamics, ATC, Engine, Structural, Navigation protocols and algorithms
---

# Flight Dynamics, ATC, Engine, Structural, Navigation

Complete reference for all Flight Dynamics, ATC, Engine, Structural, Navigation protocols in the Zeq SDK.

## Overview

The Flight Dynamics, ATC, Engine, Structural, Navigation protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqFlightDynamics

**Protocol ID:** `zeq-flight-dynamics`
**Version:** 1.287.0
**Endpoint:** `/api/aviation/flight-dynamics` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

6-DOF flight dynamics with HulyaPulse integration. Lift/drag/thrust/weight balance, stability derivatives, control surface response at Zeqond timestep.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| aircraftConfig | `object` | Yes | Mass, inertia, aero coefficients. |

#### Returns

{ forces, moments, angularRates, flightPath, stallMargin_deg, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/aviation/flight-dynamics \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqATC

**Protocol ID:** `zeq-atc`
**Version:** 1.287.0
**Endpoint:** `/api/aviation/atc` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Air traffic control conflict detection and resolution. Zeqond-timed separation analysis, 4D trajectory prediction, holding pattern optimization.


#### Returns

{ conflicts, resolutions, separationMinimum_nm, delays, holdingPatterns, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/aviation/atc \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqJetEngine

**Protocol ID:** `zeq-jet-engine`
**Version:** 1.287.0
**Endpoint:** `/api/aviation/jet-engine` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Gas turbine performance modeling. Brayton cycle with R(t) compressor map interpolation, turbine inlet temperature, SFC optimization, creep life prediction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| engineModel | `object` | Yes | Compressor/turbine maps, geometry. |

#### Returns

{ thrust_kN, sfc_kg_kN_hr, egt_C, compressorSurge_margin, creepLife_cycles, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/aviation/jet-engine \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAirframeFatigue

**Protocol ID:** `zeq-airframe-fatigue`
**Version:** 1.287.0
**Endpoint:** `/api/aviation/fatigue` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Airframe structural fatigue analysis. Miner


#### Returns

{ damageAccumulation, remainingCycles, crackGrowthRate_mm_cycle, inspectionInterval, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/aviation/fatigue \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGNSS

**Protocol ID:** `zeq-nav-gnss`
**Version:** 1.287.0
**Endpoint:** `/api/aviation/gnss` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

GNSS positioning with HulyaPulse integrity monitoring. RAIM fault detection, multi-constellation (GPS/Galileo/GLONASS/BeiDou), ionospheric correction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| observables | `object` | Yes | GNSS pseudoranges and carrier phases. |

#### Returns

{ position, velocity, accuracy_m, integrityAlert, ionoDelay_m, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/aviation/gnss \
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
