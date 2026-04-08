---
sidebar_position: 5
title: Biosignals, pharma, diagnostics, genomics
description: Biosignals, pharma, diagnostics, genomics protocols and algorithms
---

# Biosignals, pharma, diagnostics, genomics

Complete reference for all Biosignals, pharma, diagnostics, genomics protocols in the Zeq SDK.

## Overview

The Biosignals, pharma, diagnostics, genomics protocol family enables advanced computational capabilities.

## Protocols (7)

### ZeqVitals — Biosignal Processing

**Protocol ID:** `zeq-vitals`
**Version:** 1.0
**Endpoint:** `/api/health/vitals/process` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Biosignal processing synchronized to HulyaPulse. ECG, EEG, SpO2 waveforms aligned to the 1.287 Hz grid — universal temporal reference for all physiological data.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| signalType | `string` | Yes |  |
| samples | `array` | Yes | Array of numeric sample values. |
| sampleRateHz | `number` | Yes | Sample rate of input signal. |

#### Returns

{ processed, pulseAligned, features: { heartRate?, dominantFreq?, peaks? }, zeqondSync }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/vitals/process \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPharma — Pharmacokinetics

**Protocol ID:** `zeq-pharma`
**Version:** 1.0
**Endpoint:** `/api/health/pharma/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Drug absorption, distribution, metabolism, and excretion modeling via the HULYAS ODE solver. Compartmental PK models integrated with RK4 on the Zeqond timebase.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| drugName | `string` | Yes | Drug identifier. |
| doseAmount | `number` | Yes | Dose in mg. |
| route | `string` | No |  |
| bodyMassKg | `number` | No | Patient body mass. Default: 70. |
| tMaxHours | `number` | No | Simulation duration in hours. Default: 24. |

#### Returns

{ concentration: [{ t, plasma, tissue }], tMax, cMax, halfLife, auc, clearance }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/pharma/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDiagnostic — Pattern Recognition

**Protocol ID:** `zeq-diagnostic`
**Version:** 1.0
**Endpoint:** `/api/health/diagnostic/analyze` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Cross-domain pattern recognition using operator coupling. Feed in multi-modal biosignal data — the framework identifies anomalies by coherence deviation from healthy baselines.


#### Returns

{ anomalies, coherenceMap, deviationScore, confidence, operators }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/diagnostic/analyze \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGenome — Sequence Analysis

**Protocol ID:** `zeq-genome`
**Version:** 1.0
**Endpoint:** `/api/health/genome/align` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Genomic sequence alignment using the spectral-topological kernel K(x,x


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sequence | `string` | Yes | DNA/RNA sequence (ACGT characters, max 10,000 bp). |
| reference | `string` | No | Reference sequence or genome ID. |

#### Returns

{ alignment, score, spectralSimilarity, mutations, coverage }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/genome/align \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTrial — Clinical Data Integrity

**Protocol ID:** `zeq-trial`
**Version:** 1.0
**Endpoint:** `/api/health/trial/record` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Clinical trial data integrity with ZeqProof-chained observations. Every data point carries a cryptographic proof binding it to the exact Zeqond it was recorded — tamper-evident by design.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| trialId | `string` | Yes | Clinical trial identifier. |
| observation | `object` | Yes | Observation data payload. |
| subjectId | `string` | Yes | Subject identifier (hashed). |

#### Returns

{ recordId, zeqProof, zeqond, chainPosition, previousProof, integrity }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/trial/record \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqHeart — Cardiac Modeling

**Protocol ID:** `zeq-heartmodel`
**Version:** 1.0
**Endpoint:** `/api/health/heart/model` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Cardiac electrophysiology modeling using coupled oscillator equations synced to HulyaPulse. Simulates action potential propagation and arrhythmia detection.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| heartRateBpm | `number` | No | Resting heart rate. Default: 72. |
| ecgData | `array` | No | ECG sample data for analysis. |
| modelType | `string` | No |  |

#### Returns

{ actionPotential, rhythmClassification, anomalies, qrsIntervals, pulseSync }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/heart/model \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEpi — Epidemic Modeling

**Protocol ID:** `zeq-epidemiology`
**Version:** 1.0
**Endpoint:** `/api/health/epidemic/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

SIR/SEIR epidemic modeling via ODE solver with HulyaPulse temporal resolution. Model disease spread with real-time R(t)-modulated transmission rates.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| model | `string` | No |  |
| population | `number` | Yes | Total population. |
| infectedInitial | `number` | Yes | Initial infected count. |
| R0 | `number` | Yes | Basic reproduction number. |
| tDays | `number` | No | Simulation duration in days. Default: 180. |

#### Returns

{ timeSeries: [{ day, S, E?, I, R }], peakDay, peakInfected, totalInfected, herdImmunityThreshold }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/health/epidemic/simulate \
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
