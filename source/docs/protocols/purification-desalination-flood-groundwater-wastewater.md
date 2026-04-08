---
sidebar_position: 28
title: Purification, Desalination, Flood, Groundwater, Wastewater
description: Purification, Desalination, Flood, Groundwater, Wastewater protocols and algorithms
---

# Purification, Desalination, Flood, Groundwater, Wastewater

Complete reference for all Purification, Desalination, Flood, Groundwater, Wastewater protocols in the Zeq SDK.

## Overview

The Purification, Desalination, Flood, Groundwater, Wastewater protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqPurification

**Protocol ID:** `zeq-purification`
**Version:** 1.287.0
**Endpoint:** `/api/water/purification` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Water purification process optimization. Coagulation/flocculation dosing, filtration rate, UV disinfection with HulyaPulse CT value monitoring (C×T).


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| targetStandard | `string` | No |  |

#### Returns

{ treatmentSteps, chemicalDoses, ct_value, outputQuality, complianceStatus, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/water/purification \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDesalination

**Protocol ID:** `zeq-desalination`
**Version:** 1.287.0
**Endpoint:** `/api/water/desalination` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Desalination plant optimization. Reverse osmosis membrane modeling, energy recovery, brine management with R(t)-modulated pressure control.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| feedSalinity_ppm | `number` | Yes | Feed water TDS in ppm. |
| targetCapacity_m3_day | `number` | Yes | Production target. |
| membraneType | `string` | No |  |

#### Returns

{ energyConsumption_kWh_m3, recovery_pct, permeateQuality_ppm, brineDisposal, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/water/desalination \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFlood

**Protocol ID:** `zeq-flood`
**Version:** 1.287.0
**Endpoint:** `/api/water/flood` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Flood prediction and inundation mapping. 2D shallow water equations with R(t) rainfall forcing, breach analysis, evacuation timing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| terrain | `object` | Yes | DEM (digital elevation model) data. |
| infrastructure | `object` | No | Levees, dams, drainage systems. |

#### Returns

{ inundationMap, maxDepth_m, floodExtent_km2, peakFlow_m3s, evacuationTime_hr, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/water/flood \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGroundwater

**Protocol ID:** `zeq-groundwater`
**Version:** 1.287.0
**Endpoint:** `/api/water/groundwater` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Groundwater flow modeling. Darcy


#### Returns

{ waterTable, drawdown_m, flowVectors, contaminantPlume, safeYield_m3_day, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/water/groundwater \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqWastewater

**Protocol ID:** `zeq-wastewater`
**Version:** 1.287.0
**Endpoint:** `/api/water/wastewater` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Wastewater treatment optimization. Activated sludge modeling (ASM1), nutrient removal (N/P), biogas production, effluent quality prediction with Zeqond process control.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| flowRate_m3_day | `number` | Yes | Daily influent flow. |
| process | `string` | No |  |

#### Returns

{ effluentQuality, sludgeProduction_kg_day, biogasYield_m3_day, energyBalance, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/water/wastewater \
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
