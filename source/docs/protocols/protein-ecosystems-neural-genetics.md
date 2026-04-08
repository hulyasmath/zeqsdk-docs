---
sidebar_position: 27
title: Protein, ecosystems, neural, genetics
description: Protein, ecosystems, neural, genetics protocols and algorithms
---

# Protein, ecosystems, neural, genetics

Complete reference for all Protein, ecosystems, neural, genetics protocols in the Zeq SDK.

## Overview

The Protein, ecosystems, neural, genetics protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqProtein — Folding Energy Landscape

**Protocol ID:** `zeq-protein`
**Version:** 1.0
**Endpoint:** `/api/bio/protein/fold` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Protein folding energy landscape via HULYAS functional equation E = P_φ · Z(M,R,δ,C,X). Maps amino acid sequences to energy states using operator coupling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sequence | `string` | Yes | Amino acid sequence (single-letter code, max 500 residues). |

#### Returns

{ energyLandscape, minEnergy, foldedState, secondaryStructure, stabilityScore }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/bio/protein/fold \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEcosystem — Population Dynamics

**Protocol ID:** `zeq-ecosystem`
**Version:** 1.0
**Endpoint:** `/api/bio/ecosystem/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Population dynamics modeling (Lotka-Volterra + operator coupling). Predator-prey, competition, and mutualism simulated with the HULYAS ODE solver.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| tYears | `number` | No | Simulation duration in years. Default: 50. |

#### Returns

{ timeSeries: [{ t, populations }], equilibrium, extinctions, oscillationPeriod }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/bio/ecosystem/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqNeuro — Neural Spike Analysis

**Protocol ID:** `zeq-neuro`
**Version:** 1.0
**Endpoint:** `/api/bio/neuro/analyze` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Neural spike train analysis synchronized to HulyaPulse phase. Correlate neural firing patterns with the 1.287 Hz reference — detect phase-locking in brain activity.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| spikeTimes | `array` | Yes | Array of spike timestamps (seconds). |
| stimulusOnset | `number` | No | Stimulus onset time for PSTH analysis. |

#### Returns

{ firingRate, isi, burstIndex, phaseLocking, hulyaPulseCorrelation, psth }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/bio/neuro/analyze \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGene — Expression Analysis

**Protocol ID:** `zeq-gene-express`
**Version:** 1.0
**Endpoint:** `/api/bio/gene/expression` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Gene expression time-series analysis using ZeqShift projection. Map gene expression oscillations onto the HulyaPulse timescale to detect circadian and ultradian rhythms.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| referenceGenes | `array` | No | Housekeeping genes for normalization. |

#### Returns

{ normalized, oscillatingGenes, periods, phases, clusters, hulyaPulseAlignment }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/bio/gene/expression \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEvolution — Evolutionary Dynamics

**Protocol ID:** `zeq-evolution`
**Version:** 1.0
**Endpoint:** `/api/bio/evolution/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Evolutionary dynamics via replicator equations + mutation-selection balance. Fitness landscapes computed with operator coupling — evolution as a HULYAS field process.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| mutationRate | `number` | No | Mutation rate per generation. Default: 0.001. |
| generations | `number` | No | Number of generations. Default: 1000. |

#### Returns

{ finalFrequencies, fixationProbabilities, diversityIndex, fitnessTrajectory, ess }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/bio/evolution/simulate \
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
