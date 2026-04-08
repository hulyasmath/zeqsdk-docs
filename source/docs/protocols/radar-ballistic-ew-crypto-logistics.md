---
sidebar_position: 29
title: Radar, Ballistic, EW, Crypto, Logistics
description: Radar, Ballistic, EW, Crypto, Logistics protocols and algorithms
---

# Radar, Ballistic, EW, Crypto, Logistics

Complete reference for all Radar, Ballistic, EW, Crypto, Logistics protocols in the Zeq SDK.

## Overview

The Radar, Ballistic, EW, Crypto, Logistics protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqRadar

**Protocol ID:** `zeq-radar`
**Version:** 1.287.0
**Endpoint:** `/api/defense/radar` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Radar system modeling. Radar range equation, Doppler processing, clutter rejection, CFAR detection with HulyaPulse-timed pulse repetition interval optimization.


#### Returns

{ snr_dB, detectionProbability, dopplerShift_Hz, maxRange_km, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/defense/radar \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBallistic

**Protocol ID:** `zeq-ballistic`
**Version:** 1.287.0
**Endpoint:** `/api/defense/ballistic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

External ballistics with R(t) atmospheric modeling. 6-DOF projectile trajectory, wind deflection, Coriolis correction, terminal energy computation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| angle_deg | `number` | Yes | Launch angle. |

#### Returns

{ trajectory, range_m, timeOfFlight_s, terminalVelocity_ms, drop_m, drift_m, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/defense/ballistic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEW

**Protocol ID:** `zeq-ew`
**Version:** 1.287.0
**Endpoint:** `/api/defense/ew` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Electronic warfare analysis. Jammer effective range, ECCM strategies, signal intercept probability with HulyaPulse frequency-hopping synchronization.


#### Returns

{ burnThroughRange_km, jamToSignal_dB, interceptProbability, eccmEffectiveness, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/defense/ew \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMilCrypto

**Protocol ID:** `zeq-mil-crypto`
**Version:** 1.287.0
**Endpoint:** `/api/defense/crypto` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Military-grade encryption with Zeqond key rotation. AES-256-GCM + HulyaPulse entropy injection, forward secrecy, key escrow with split-knowledge.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| operation | `string` | Yes |  |
| data | `string` | No | Data to encrypt/decrypt. |
| classification | `string` | No |  |

#### Returns

{ result, keyId, algorithm, zeqondRotation, forwardSecrecy, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/defense/crypto \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMilLogistics

**Protocol ID:** `zeq-mil-logistics`
**Version:** 1.287.0
**Endpoint:** `/api/defense/logistics` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Military logistics optimization. Supply chain routing under contested conditions, ammunition expenditure forecasting, force sustainment modeling.


#### Returns

{ supplyRoutes, sustainmentDays, criticalShortages, alternateRoutes, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/defense/logistics \
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
