---
sidebar_position: 33
title: Seismic, Volcano, Hydrology, Mining, Surveying
description: Seismic, Volcano, Hydrology, Mining, Surveying protocols and algorithms
---

# Seismic, Volcano, Hydrology, Mining, Surveying

Complete reference for all Seismic, Volcano, Hydrology, Mining, Surveying protocols in the Zeq SDK.

## Overview

The Seismic, Volcano, Hydrology, Mining, Surveying protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqSeismic

**Protocol ID:** `zeq-seismic`
**Version:** 1.287.0
**Endpoint:** `/api/geo/seismic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Seismic wave analysis with HulyaPulse temporal correlation. P/S wave separation, ground motion prediction (GMPE), site amplification, liquefaction potential.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| seismogramData | `object` | Yes | Seismometer time series (3-component). |
| soilClass | `string` | No |  |

#### Returns

{ magnitude, epicenter, depth_km, pga_g, pgv_cm_s, liquefactionRisk, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/geo/seismic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqVolcano

**Protocol ID:** `zeq-volcano`
**Version:** 1.287.0
**Endpoint:** `/api/geo/volcano` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Volcanic activity monitoring. Seismic tremor analysis, SO2 flux, deformation (InSAR), eruption probability with HulyaPulse harmonic tremor detection.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| seismicData | `object` | No | Volcanic seismicity recordings. |
| deformation | `object` | No | InSAR or GPS deformation data. |

#### Returns

{ alertLevel, eruptionProbability, tremorType, magmaDepth_km, evacuationZone_km, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/geo/volcano \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqHydrology

**Protocol ID:** `zeq-hydrology`
**Version:** 1.287.0
**Endpoint:** `/api/geo/hydrology` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Watershed hydrology modeling. Rainfall-runoff (SCS-CN), flood frequency analysis, groundwater flow (Darcy) with R(t)-modulated infiltration rates.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rainfall_mm | `number` | Yes | Storm rainfall total. |
| duration_hr | `number` | No | Storm duration. |

#### Returns

{ peakFlow_m3s, runoffVolume_m3, timeToP_hr, floodFrequency, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/geo/hydrology \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMining

**Protocol ID:** `zeq-mining`
**Version:** 1.287.0
**Endpoint:** `/api/geo/mining` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Mining engineering. Ore grade estimation (kriging), blast pattern design, slope stability, ventilation network analysis with Zeqond-timed sensor integration.


#### Returns

{ gradeEstimate, resourceTonnes, slopeAngle_deg, ventilationRequired_m3s, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/geo/mining \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSurvey

**Protocol ID:** `zeq-survey`
**Version:** 1.287.0
**Endpoint:** `/api/geo/survey` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Geodetic surveying with HulyaPulse coordinate transformations. Datum conversions, least-squares adjustment, geoid undulation — Zeqond-timestamped for temporal surveys.


#### Returns

{ adjustedCoordinates, residuals, accuracy_m, geoidUndulation_m, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/geo/survey \
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
