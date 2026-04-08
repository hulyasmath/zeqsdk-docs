---
sidebar_position: 36
title: Stress, Composites, Nano, Corrosion, 3D Print
description: Stress, Composites, Nano, Corrosion, 3D Print protocols and algorithms
---

# Stress, Composites, Nano, Corrosion, 3D Print

Complete reference for all Stress, Composites, Nano, Corrosion, 3D Print protocols in the Zeq SDK.

## Overview

The Stress, Composites, Nano, Corrosion, 3D Print protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqStressAnalysis

**Protocol ID:** `zeq-stress-analysis`
**Version:** 1.287.0
**Endpoint:** `/api/materials/stress` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

FEA stress analysis with R(t)-modulated loading. Von Mises, Tresca, principal stresses, safety factor computation. Linear and nonlinear static solvers.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| mesh | `object` | Yes | FE mesh with element types and nodes. |

#### Returns

{ vonMises_MPa, displacement_mm, safetyFactor, criticalElement, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/materials/stress \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqComposite

**Protocol ID:** `zeq-composite`
**Version:** 1.287.0
**Endpoint:** `/api/materials/composite` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Composite laminate analysis. Classical lamination theory (CLT) with HulyaPulse failure criteria (Tsai-Wu, Hashin). Ply-by-ply stress, first-ply failure prediction.


#### Returns

{ plyStresses, firstPlyFailure, abd_matrix, strengthRatio, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/materials/composite \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqNano

**Protocol ID:** `zeq-nano`
**Version:** 1.287.0
**Endpoint:** `/api/materials/nano` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Nanomaterial property prediction. Quantum confinement effects, surface-to-volume ratios, bandgap tuning with R(t) size distribution modeling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| material | `string` | Yes | Material composition (e.g.  |
| size_nm | `number` | Yes | Particle/feature size in nm. |
| shape | `string` | No |  |

#### Returns

{ bandgap_eV, surfaceArea_m2_g, quantumYield, meltingPoint_C, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/materials/nano \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCorrosion

**Protocol ID:** `zeq-corrosion`
**Version:** 1.287.0
**Endpoint:** `/api/materials/corrosion` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Corrosion rate prediction and cathodic protection design. Tafel analysis with HulyaPulse electrochemical impedance, pitting probability, sacrificial anode sizing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| material | `string` | Yes | Alloy designation. |
| protectionType | `string` | No |  |

#### Returns

{ corrosionRate_mm_yr, pittingProbability, anodeLifeYears, protectionCurrent_A_m2, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/materials/corrosion \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAdditiveMfg

**Protocol ID:** `zeq-additive-mfg`
**Version:** 1.287.0
**Endpoint:** `/api/materials/additive` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

3D printing / additive manufacturing optimization. Layer-by-layer thermal simulation, support structure generation, distortion prediction with R(t) cooling models.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| stlModel | `object` | Yes | STL mesh or reference. |
| process | `string` | No |  |
| material | `string` | No | Print material. |
| layerHeight_mm | `number` | No | Layer thickness. |

#### Returns

{ printTime_hr, materialUsage_g, supportVolume_cm3, distortion_mm, optimalOrientation, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/materials/additive \
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
