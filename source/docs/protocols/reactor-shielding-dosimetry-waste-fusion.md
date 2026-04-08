---
sidebar_position: 30
title: Reactor, Shielding, Dosimetry, Waste, Fusion
description: Reactor, Shielding, Dosimetry, Waste, Fusion protocols and algorithms
---

# Reactor, Shielding, Dosimetry, Waste, Fusion

Complete reference for all Reactor, Shielding, Dosimetry, Waste, Fusion protocols in the Zeq SDK.

## Overview

The Reactor, Shielding, Dosimetry, Waste, Fusion protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqReactor

**Protocol ID:** `zeq-reactor`
**Version:** 1.287.0
**Endpoint:** `/api/nuclear/reactor` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Nuclear reactor core simulation. Neutron diffusion, criticality (k-eff), fuel burnup with R(t)-modulated control rod worth and xenon transient modeling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| coreGeometry | `object` | Yes | Fuel assembly layout and enrichment. |
| controlRodPosition_pct | `number` | No | Control rod insertion %. |
| burnup_MWd_t | `number` | No | Current fuel burnup. |

#### Returns

{ keff, neutronFlux, powerDistribution, xenonConcentration, fuelTemperature_C, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nuclear/reactor \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqShielding

**Protocol ID:** `zeq-shielding`
**Version:** 1.287.0
**Endpoint:** `/api/nuclear/shielding` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Radiation shielding design. Gamma attenuation (build-up factors), neutron moderation, dose rate mapping with R(t) source term decay curves.


#### Returns

{ doseRate_mSv_hr, attenuation_factor, buildUpFactor, shieldAdequacy, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nuclear/shielding \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDosimetry

**Protocol ID:** `zeq-dosimetry`
**Version:** 1.287.0
**Endpoint:** `/api/nuclear/dosimetry` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Personal dosimetry and ALARA optimization. Cumulative dose tracking, stay-time calculations, dose-rate contouring with Zeqond exposure logging.


#### Returns

{ cumulativeDose_mSv, remainingAllowance, stayTime_min, alaraRecommendation, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nuclear/dosimetry \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqNuclearWaste

**Protocol ID:** `zeq-nuclear-waste`
**Version:** 1.287.0
**Endpoint:** `/api/nuclear/waste` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Nuclear waste management. Decay heat calculation, isotope inventory tracking, repository thermal modeling with R(t) long-term decay chain simulation.


#### Returns

{ decayHeat_kW, activityTotal_Bq, dominantIsotopes, storageRequirements, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nuclear/waste \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFusion

**Protocol ID:** `zeq-fusion`
**Version:** 1.287.0
**Endpoint:** `/api/nuclear/fusion` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Fusion plasma modeling. Lawson criterion, tokamak confinement (tau_E), plasma beta, heating power balance with HulyaPulse MHD stability analysis.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| magneticField_T | `number` | Yes | Toroidal field strength. |
| heatingPower_MW | `number` | No | Auxiliary heating. |

#### Returns

{ lawsonProduct, confinementTime_s, beta, fusionPower_MW, qFactor, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nuclear/fusion \
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
