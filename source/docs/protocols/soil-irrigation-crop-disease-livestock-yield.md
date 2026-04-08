---
sidebar_position: 34
title: Soil, Irrigation, Crop Disease, Livestock, Yield
description: Soil, Irrigation, Crop Disease, Livestock, Yield protocols and algorithms
---

# Soil, Irrigation, Crop Disease, Livestock, Yield

Complete reference for all Soil, Irrigation, Crop Disease, Livestock, Yield protocols in the Zeq SDK.

## Overview

The Soil, Irrigation, Crop Disease, Livestock, Yield protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqSoil

**Protocol ID:** `zeq-soil`
**Version:** 1.287.0
**Endpoint:** `/api/agri/soil` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Soil composition and nutrient analysis. NPK levels, pH mapping, organic matter content, microbial activity index — all HulyaPulse-timestamped for temporal tracking.


#### Returns

{ npkRatio, phLevel, organicMatter_pct, fertilizerRecommendation, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/agri/soil \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqIrrigation

**Protocol ID:** `zeq-irrigation`
**Version:** 1.287.0
**Endpoint:** `/api/agri/irrigation` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Precision irrigation scheduling. Penman-Monteith ET₀ with R(t) solar radiation modulation, soil water balance, deficit irrigation strategies for water conservation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fieldArea_ha | `number` | Yes | Field area in hectares. |
| cropType | `string` | Yes | Crop for water requirement lookup. |
| soilMoisture_pct | `number` | No | Current soil moisture. |
| weatherForecast | `object` | No | Next 7 days forecast. |

#### Returns

{ irrigationSchedule, waterNeeded_mm, et0_mm_day, savingsVsFlood_pct, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/agri/irrigation \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCropDisease

**Protocol ID:** `zeq-crop-disease`
**Version:** 1.287.0
**Endpoint:** `/api/agri/disease` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Crop disease detection and prediction. Spectral index analysis (NDVI/NDRE) with HulyaPulse phenology tracking, pathogen risk modeling from humidity/temperature.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cropType | `string` | Yes | Crop type for disease library matching. |
| weather | `object` | No | Recent temp/humidity for pathogen modeling. |

#### Returns

{ diseaseRisk, detectedAnomalies, treatment, applicationWindow, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/agri/disease \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqLivestock

**Protocol ID:** `zeq-livestock`
**Version:** 1.287.0
**Endpoint:** `/api/agri/livestock` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Livestock health monitoring. Activity patterns, rumination cycles, heat detection, body condition scoring with HulyaPulse circadian alignment.


#### Returns

{ healthScores, alerts, heatDetection, feedOptimization, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/agri/livestock \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqYield

**Protocol ID:** `zeq-yield`
**Version:** 1.287.0
**Endpoint:** `/api/agri/yield` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Crop yield prediction via R(t)-modulated growth models. Integrates soil, weather, satellite imagery, and historical data for field-level harvest estimates.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cropType | `string` | Yes | Crop to predict. |
| fieldArea_ha | `number` | Yes | Field area. |
| plantingDate | `string` | Yes | ISO date of planting. |
| ndviTimeSeries | `array` | No | Historical NDVI readings. |

#### Returns

{ predictedYield_tonnes_ha, confidence_pct, optimalHarvestDate, riskFactors, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/agri/yield \
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
