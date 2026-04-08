---
sidebar_position: 12
title: Forecast, Severe, Marine, Agricultural, Solar
description: Forecast, Severe, Marine, Agricultural, Solar protocols and algorithms
---

# Forecast, Severe, Marine, Agricultural, Solar

Complete reference for all Forecast, Severe, Marine, Agricultural, Solar protocols in the Zeq SDK.

## Overview

The Forecast, Severe, Marine, Agricultural, Solar protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqWeather Forecast

**Protocol ID:** `zeq-weather-forecast`
**Version:** 1.287.0
**Endpoint:** `/api/weather/forecast` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Numerical weather prediction with HulyaPulse temporal interpolation. GFS/ECMWF model fusion, R(t)-weighted ensemble averaging, hourly to 14-day forecasts.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hours | `number` | No | Forecast hours (1–336). |
| model | `string` | No |  |

#### Returns

{ hourly: [{ temp_C, humidity, windSpeed_ms, precipitation_mm, pressure_hPa }], zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/weather/forecast \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSevereWeather

**Protocol ID:** `zeq-severe-weather`
**Version:** 1.287.0
**Endpoint:** `/api/weather/severe` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Severe weather detection and alerting. Tornado vortex signatures, hail probability, lightning prediction using R(t) convective instability indices (CAPE/CIN).


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| radarData | `object` | No | Reflectivity/velocity data from weather radar. |

#### Returns

{ alerts, tornadoProbability, cape_J_kg, cin_J_kg, hailSize_cm, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/weather/severe \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMarineWeather

**Protocol ID:** `zeq-marine-weather`
**Version:** 1.287.0
**Endpoint:** `/api/weather/marine` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Marine weather and wave prediction. Significant wave height, swell period, current vectors with HulyaPulse tidal harmonics — critical for shipping and fishing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hours | `number` | No | Forecast hours. |

#### Returns

{ waveHeight_m, swellPeriod_s, currentSpeed_kn, tidalPrediction, visibility_nm, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/weather/marine \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAgriWeather

**Protocol ID:** `zeq-agri-weather`
**Version:** 1.287.0
**Endpoint:** `/api/weather/agriculture` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Agricultural weather intelligence. Growing degree days, frost probability, soil moisture estimation, evapotranspiration — Zeqond-timed for precision farming.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cropType | `string` | No | Crop name for GDD base temperature. |
| soilType | `string` | No |  |

#### Returns

{ gdd, frostRisk_pct, soilMoisture_pct, evapotranspiration_mm, sprayWindow, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/weather/agriculture \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSolarWeather

**Protocol ID:** `zeq-solar-weather`
**Version:** 1.287.0
**Endpoint:** `/api/weather/solar` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Space weather monitoring. Solar flare probability, geomagnetic storm index (Kp), aurora forecast, satellite drag estimation with HulyaPulse solar wind correlation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| forecast_hours | `number` | No | Hours ahead. |

#### Returns

{ kpIndex, solarFlareProb, auroraLatitude, protonFlux, satelliteDrag, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/weather/solar \
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
