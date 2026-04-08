---
sidebar_position: 3
title: ADAS, Battery, V2X, Crash, Autonomous
description: ADAS, Battery, V2X, Crash, Autonomous protocols and algorithms
---

# ADAS, Battery, V2X, Crash, Autonomous

Complete reference for all ADAS, Battery, V2X, Crash, Autonomous protocols in the Zeq SDK.

## Overview

The ADAS, Battery, V2X, Crash, Autonomous protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqADAS

**Protocol ID:** `zeq-adas`
**Version:** 1.287.0
**Endpoint:** `/api/auto/adas` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Advanced driver assistance — sensor fusion (camera/radar/LiDAR) on Zeqond frames, lane keeping, adaptive cruise control, collision avoidance with R(t) reaction timing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sensorFusion | `object` | Yes | Fused sensor detections: objects, lanes, signs. |
| mode | `string` | No |  |

#### Returns

{ steeringCmd_deg, throttle_pct, brakeCmd_pct, warnings, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auto/adas \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEVBattery

**Protocol ID:** `zeq-ev-battery`
**Version:** 1.287.0
**Endpoint:** `/api/auto/ev-battery` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

EV battery management with HulyaPulse cell balancing. State of charge/health estimation, thermal runaway prediction, optimal charging curves via R(t) electrochemistry.


#### Returns

{ soc_pct, soh_pct, thermalRunawayRisk, chargingCurve, cellImbalance_mV, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auto/ev-battery \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqV2X

**Protocol ID:** `zeq-v2x`
**Version:** 1.287.0
**Endpoint:** `/api/auto/v2x` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Vehicle-to-everything communication on Zeqond frames. V2V collision warnings, V2I traffic signal priority, V2P pedestrian alerts — all synchronized to HulyaPulse clock.


#### Returns

{ alerts, signalPriority, collisionRisk, platooning, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auto/v2x \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCrashSim

**Protocol ID:** `zeq-crash-sim`
**Version:** 1.287.0
**Endpoint:** `/api/auto/crash` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Vehicle crash simulation with HulyaPulse FEA. Deformation modeling, occupant kinematics, airbag timing optimization, NCAP rating prediction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vehicleModel | `object` | Yes | Vehicle FE mesh and material properties. |
| impactScenario | `string` | Yes |  |
| speed_kmh | `number` | No | Impact speed. |

#### Returns

{ deformation_mm, occupantForces_kN, airbagTiming_ms, ncapPrediction, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auto/crash \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAutonomous

**Protocol ID:** `zeq-autonomous`
**Version:** 1.287.0
**Endpoint:** `/api/auto/autonomous` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Full autonomous driving stack — perception/planning/control pipeline on Zeqond cycle. Behavior planning, trajectory optimization, safety envelope monitoring.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| perception | `object` | Yes | Fused 3D scene with tracked objects. |
| route | `array` | Yes | Planned route waypoints. |
| safetyLevel | `string` | No |  |

#### Returns

{ trajectory, steeringPlan, speedProfile, safetyScore, fallbackMode, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auto/autonomous \
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
