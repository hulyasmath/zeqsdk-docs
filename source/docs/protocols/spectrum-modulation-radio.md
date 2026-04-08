---
sidebar_position: 35
title: Spectrum, modulation, radio
description: Spectrum, modulation, radio protocols and algorithms
---

# Spectrum, modulation, radio

Complete reference for all Spectrum, modulation, radio protocols in the Zeq SDK.

## Overview

The Spectrum, modulation, radio protocol family enables advanced computational capabilities.

## Protocols (6)

### ZeqSpectrum — Phase-Locked Allocation

**Protocol ID:** `zeq-spectrum`
**Version:** 1.0
**Endpoint:** `/api/telecom/spectrum/allocate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Spectrum allocation using phase-locked frequency assignment. Frequencies assigned as harmonics of 1.287 Hz — no collisions when all transmitters sync to HulyaPulse.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| bandMhz | `number` | Yes | Center frequency in MHz. |
| bandwidthKhz | `number` | Yes | Required bandwidth in kHz. |
| region | `string` | No | Geographic region code. |

#### Returns

{ allocatedFreqMhz, harmonicNumber, phaseSlot, interferenceRisk, expiresZeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/spectrum/allocate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqModulate — Carrier Synchronization

**Protocol ID:** `zeq-modulate`
**Version:** 1.0
**Endpoint:** `/api/telecom/modulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

QAM/OFDM modulation with HulyaPulse carrier sync. Symbol timing derived from Zeqond boundaries — receivers lock to the same phase without preamble overhead.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| scheme | `string` | Yes |  |
| data | `string` | Yes | Data to modulate (hex or base64). |
| carrierHz | `number` | Yes | Carrier frequency in Hz. |

#### Returns

{ symbols, symbolRate, bandwidth, spectralEfficiency, syncZeqond, constellation }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/modulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqChannel — Error Correction

**Protocol ID:** `zeq-channel-code`
**Version:** 1.0
**Endpoint:** `/api/telecom/channel/encode` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Channel coding using operator coupling weights as error correction coefficients. The mathematical structure of operator relationships provides redundancy patterns.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| data | `string` | Yes | Data to encode (hex). |
| codeRate | `string` | No | Code rate:  |
| operators | `array` | No | Operator IDs for coefficient derivation. |

#### Returns

{ encoded, codeRate, redundancyPct, correctionCapability, operatorsUsed }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/channel/encode \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAntenna — Pattern Optimization

**Protocol ID:** `zeq-antenna`
**Version:** 1.0
**Endpoint:** `/api/telecom/antenna/optimize` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Antenna radiation pattern optimization via spectral-topological kernel. Beam shaping and null steering computed from wave physics operators.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| elements | `number` | Yes | Number of antenna elements. |
| frequencyMhz | `number` | Yes | Operating frequency in MHz. |
| targetAzimuth | `number` | No | Target beam direction (degrees). |
| nullAzimuths | `array` | No | Directions to place nulls (degrees). |

#### Returns

{ pattern: [{ azimuth, gainDb }], mainLobeWidth, sideLobeLevel, directivity }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/antenna/optimize \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDetect — Signal Detection

**Protocol ID:** `zeq-signal-detect`
**Version:** 1.0
**Endpoint:** `/api/telecom/detect` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Weak signal detection using HulyaPulse phase correlation. Signals buried in noise become detectable when correlated against the known 1.287 Hz reference.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| samples | `array` | Yes | Raw signal samples. |
| sampleRateHz | `number` | Yes | Sample rate. |
| targetFreqHz | `number` | No | Expected signal frequency. |

#### Returns

{ detected, snrDb, frequency, phase, amplitude, correlationPeak }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/detect \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPropagation — RF Path Loss

**Protocol ID:** `zeq-propagation`
**Version:** 1.0
**Endpoint:** `/api/telecom/propagation` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

RF propagation modeling using electromagnetic operators. Free-space path loss, atmospheric absorption, and multipath fading computed from first principles.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| frequencyMhz | `number` | Yes | Operating frequency. |
| distanceKm | `number` | Yes | Path distance. |
| environment | `string` | No |  |

#### Returns

{ pathLossDb, receivedPowerDbm, fresnelRadius, fadeMargin, linkBudget }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/telecom/propagation \
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
