---
sidebar_position: 38
title: Water, Traffic, Bridge, Power Grid, Smart City
description: Water, Traffic, Bridge, Power Grid, Smart City protocols and algorithms
---

# Water, Traffic, Bridge, Power Grid, Smart City

Complete reference for all Water, Traffic, Bridge, Power Grid, Smart City protocols in the Zeq SDK.

## Overview

The Water, Traffic, Bridge, Power Grid, Smart City protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqWater

**Protocol ID:** `zeq-water`
**Version:** 1.287.0
**Endpoint:** `/api/infra/water` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Water treatment and distribution network optimization. HulyaPulse-modulated flow control, contaminant detection via R(t) spectral analysis, pressure zone balancing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| networkTopology | `object` | Yes | Pipe network graph with node pressures. |

#### Returns

{ optimalPressures, qualityAlerts, leakProbability, demandCurve, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/infra/water \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTraffic

**Protocol ID:** `zeq-traffic`
**Version:** 1.287.0
**Endpoint:** `/api/infra/traffic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Traffic signal optimization and flow modeling. Zeqond-timed green wave synchronization, congestion prediction, accident probability scoring using R(t) vehicle density.


#### Returns

{ signalTimings, greenWaveSpeed_kmh, congestionScore, accidentRisk, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/infra/traffic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBridge

**Protocol ID:** `zeq-bridge`
**Version:** 1.287.0
**Endpoint:** `/api/infra/bridge` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Structural health monitoring for bridges. HulyaPulse resonance analysis on accelerometer data, fatigue cycle counting, load distribution with R(t) stress amplification.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sensorData | `object` | Yes | Accelerometer/strain gauge readings. |
| bridgeType | `string` | No |  |
| designLoad_kN | `number` | No | Design load capacity in kN. |

#### Returns

{ naturalFrequency_Hz, fatigueIndex, loadFactor, damageIndicator, maintenanceUrgency, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/infra/bridge \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSmartGrid

**Protocol ID:** `zeq-smart-grid`
**Version:** 1.287.0
**Endpoint:** `/api/infra/smart-grid` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Smart city power grid management. Zeqond-synchronized load balancing across distributed generation, demand response, and storage with R(t) frequency regulation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| gridTopology | `object` | Yes | Grid node graph with generation/load data. |
| storageCapacity_kWh | `number` | No | Total battery storage available. |

#### Returns

{ loadAllocation, frequencyDeviation_Hz, renewablePenetration_pct, storagePlan, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/infra/smart-grid \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSmartCity

**Protocol ID:** `zeq-smart-city`
**Version:** 1.287.0
**Endpoint:** `/api/infra/smart-city` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Integrated smart city sensor fusion. Combines traffic, air quality, noise, energy, waste into one HulyaPulse-synchronized dashboard with anomaly detection.


#### Returns

{ cityHealthScore, anomalies, trends, predictions, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/infra/smart-city \
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
