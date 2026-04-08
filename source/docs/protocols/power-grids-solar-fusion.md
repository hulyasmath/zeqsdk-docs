---
sidebar_position: 25
title: Power grids, solar, fusion
description: Power grids, solar, fusion protocols and algorithms
---

# Power grids, solar, fusion

Complete reference for all Power grids, solar, fusion protocols in the Zeq SDK.

## Overview

The Power grids, solar, fusion protocol family enables advanced computational capabilities.

## Protocols (11)

### ZeqGrid — Power Grid Balancing

**Protocol ID:** `zeq-grid`
**Version:** 1.0
**Endpoint:** `/api/energy/grid/balance` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Power grid load balancing using R(t) modulation. Demand response synchronized to HulyaPulse — loads shift to phase troughs, generation peaks match consumption peaks.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| loadMw | `number` | Yes | Current grid load in megawatts. |
| generationMw | `number` | Yes | Current generation capacity. |
| renewablePct | `number` | No | Renewable energy percentage (0–100). |

#### Returns

{ balanceState, R_t_modulation, shiftRecommendation, frequencyDeviation, stability }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/grid/balance \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSolar — Solar Prediction

**Protocol ID:** `zeq-solar`
**Version:** 1.0
**Endpoint:** `/api/energy/solar/predict` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Solar irradiance prediction using astrophysics operators + R(t) modulation. Forecasts energy output synced to Zeqond intervals.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| latitude | `number` | Yes | Installation latitude. |
| longitude | `number` | Yes | Installation longitude. |
| panelAreaM2 | `number` | Yes | Total panel area in m². |
| efficiency | `number` | No | Panel efficiency (0–1). Default: 0.20. |
| forecastHours | `number` | No | Forecast horizon (1–72h). Default: 24. |

#### Returns

{ forecast: [{ hour, irradianceWm2, outputKw, R_t }], totalKwh, peakHour, capacity }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/solar/predict \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFusion — Plasma Confinement

**Protocol ID:** `zeq-fusion`
**Version:** 1.0
**Endpoint:** `/api/energy/fusion/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Fusion plasma confinement modeling using plasma physics operators. Tokamak equilibrium, MHD stability, and Lawson criterion calculation via the HULYAS solver.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| plasmaTemp | `number` | Yes | Plasma temperature in keV. |
| density | `number` | Yes | Plasma density (particles/m³). |
| confinementTime | `number` | No | Energy confinement time (seconds). |
| magneticFieldT | `number` | No | Magnetic field strength (Tesla). Default: 5.0. |

#### Returns

{ lawsonProduct, tripleProduct, ignitionReached, fusionPowerMw, betaLimit, mhdStable }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/fusion/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBattery — Storage Optimization

**Protocol ID:** `zeq-battery`
**Version:** 1.0
**Endpoint:** `/api/energy/battery/optimize` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Battery charge/discharge optimization synchronized to grid R(t). Charge during generation surplus (R_t peaks), discharge during demand peaks (R_t troughs).


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| capacityKwh | `number` | Yes | Battery capacity in kWh. |
| currentSoc | `number` | Yes | Current state of charge (0–1). |
| gridPriceProfile | `array` | No | 24-hour price profile array. |

#### Returns

{ schedule: [{ hour, action, ratekW, soc }], savingsEstimate, cyclesUsed }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/battery/optimize \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqWind — Wind Power Modeling

**Protocol ID:** `zeq-wind`
**Version:** 1.0
**Endpoint:** `/api/energy/wind/predict` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Wind power prediction using fluid dynamics operators. Weibull distribution + turbine power curve modulated by atmospheric operators.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| windSpeedMs | `number` | Yes | Mean wind speed (m/s). |
| hubHeightM | `number` | No | Turbine hub height. Default: 80. |
| rotorDiameterM | `number` | No | Rotor diameter. Default: 120. |

#### Returns

{ powerOutputKw, capacityFactor, weibullK, weibullLambda, cutInSpeed, ratedSpeed }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/wind/predict \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGrid Fault Detection

**Protocol ID:** `zeq-grid-fault`
**Version:** 1.0
**Endpoint:** `/api/energy/grid/fault` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Grid fault detection using operator anomaly coupling. Phase deviation beyond tolerance triggers fault isolation — HulyaPulse provides the reference clock for fault timing.


#### Returns

{ faults: [{ nodeId, type, severity, zeqondDetected }], gridHealth, isolationRecommendation }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/energy/grid/fault \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqIoT — Device Synchronization

**Protocol ID:** `zeq-iot-sync`
**Version:** 1.0
**Endpoint:** `/api/iot/sync` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Synchronize thousands of IoT devices to the Zeqond grid. Every sensor reads at the same phase — no clock skew, no time disagreements. Microsecond alignment at global scale.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceId | `string` | Yes | Device identifier. |
| deviceClock | `number` | Yes | Device |
| sensorType | `string` | No | Sensor type for calibration. |

#### Returns

{ correctedTime, driftMs, nextSyncZeqond, devicePhase, networkPhase }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/iot/sync \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSCADA — Secure Industrial Control

**Protocol ID:** `zeq-scada`
**Version:** 1.0
**Endpoint:** `/api/iot/scada/command` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Secure industrial control using TESC ephemeral channels. Every command encrypted with a PLAT valid for one Zeqond (0.777s) — replay attacks physically impossible.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| controllerId | `string` | Yes | SCADA controller identifier. |
| command | `object` | Yes | Control command payload. |
| priority | `string` | No |  |

#### Returns

{ commandId, encrypted, plat, zeqondSent, acknowledged, latencyMs }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/iot/scada/command \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMeter — Smart Metering

**Protocol ID:** `zeq-meter`
**Version:** 1.0
**Endpoint:** `/api/iot/meter/aggregate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Smart meter data aggregation with lattice coherence scoring. Meters report on Zeqond boundaries — aggregation detects tampering by coherence deviation.


#### Returns

{ aggregate, meterCount, coherenceScore, anomalies, zeqondRange }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/iot/meter/aggregate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFusion — Sensor Fusion

**Protocol ID:** `zeq-sensor-fusion`
**Version:** 1.0
**Endpoint:** `/api/iot/fusion` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Multi-sensor data fusion using ZeqLattice coherence. Combine readings from diverse sensors — the framework weights them by phase alignment and measurement quality.


#### Returns

{ fusedValue, confidence, sensorWeights, coherenceScore, outliers }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/iot/fusion \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFleet — Device Fleet Management

**Protocol ID:** `zeq-iot-fleet`
**Version:** 1.0
**Endpoint:** `/api/iot/fleet/status` 🟢 GET
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Fleet-wide IoT device management. Monitor health, sync status, and firmware across thousands of devices — all coordinated on the Zeqond grid.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fleetId | `string` | No | Fleet group identifier. |

#### Returns

{ devices, online, synced, avgDriftMs, alertCount, lastSyncZeqond }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/iot/fleet/status \
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
