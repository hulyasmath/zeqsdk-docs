---
sidebar_position: 6
title: CNC, Quality, Supply Chain, Digital Twin, Predictive
description: CNC, Quality, Supply Chain, Digital Twin, Predictive protocols and algorithms
---

# CNC, Quality, Supply Chain, Digital Twin, Predictive

Complete reference for all CNC, Quality, Supply Chain, Digital Twin, Predictive protocols in the Zeq SDK.

## Overview

The CNC, Quality, Supply Chain, Digital Twin, Predictive protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqCNC

**Protocol ID:** `zeq-cnc`
**Version:** 1.287.0
**Endpoint:** `/api/mfg/cnc` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

CNC toolpath optimization with Zeqond-quantized feed rates. Chatter detection via R(t) vibration analysis, adaptive feed control, tool wear prediction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| gcode | `string` | Yes | G-code program or reference. |
| material | `string` | No |  |
| toolDiameter_mm | `number` | No | Cutting tool diameter. |

#### Returns

{ optimizedGcode, feedRate_mm_min, chatterRisk, toolLife_min, surfaceFinish_Ra, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/mfg/cnc \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSPC

**Protocol ID:** `zeq-spc`
**Version:** 1.287.0
**Endpoint:** `/api/mfg/spc` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Statistical process control with HulyaPulse sampling intervals. Xbar-R charts, Cp/Cpk, Western Electric rules — Zeqond-stamped control limits for audit traceability.


#### Returns

{ cpk, ppk, controlLimits, outOfControl, westernElectricViolations, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/mfg/spc \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSupplyChain

**Protocol ID:** `zeq-supply-chain`
**Version:** 1.287.0
**Endpoint:** `/api/mfg/supply-chain` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Supply chain optimization. Demand forecasting, inventory optimization (EOQ/safety stock), logistics routing — all Zeqond-synchronized for just-in-time precision.


#### Returns

{ forecast, eoq, safetyStock, reorderPoint, totalCost, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/mfg/supply-chain \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDigitalTwin

**Protocol ID:** `zeq-digital-twin`
**Version:** 1.287.0
**Endpoint:** `/api/mfg/digital-twin` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Factory digital twin synchronization. Real-time virtual factory state mirroring at Zeqond intervals, what-if simulation, downtime prediction.


#### Returns

{ twinState, oee_pct, bottlenecks, downtimePrediction, scenarioResult, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/mfg/digital-twin \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPredictiveMaintenance

**Protocol ID:** `zeq-predictive-maint`
**Version:** 1.287.0
**Endpoint:** `/api/mfg/predictive-maintenance` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Predictive maintenance via HulyaPulse vibration spectral analysis. Bearing fault detection, remaining useful life estimation, maintenance scheduling optimization.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vibrationData | `object` | Yes | Accelerometer time series. |
| assetType | `string` | No |  |
| operatingHours | `number` | No | Total operating hours on asset. |

#### Returns

{ healthIndex, faultType, rul_hours, maintenanceWindow, severity, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/mfg/predictive-maintenance \
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
