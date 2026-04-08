---
sidebar_position: 2
title: 911, Triage, Ambulance, Disaster, Search & Rescue
description: 911, Triage, Ambulance, Disaster, Search & Rescue protocols and algorithms
---

# 911, Triage, Ambulance, Disaster, Search & Rescue

Complete reference for all 911, Triage, Ambulance, Disaster, Search & Rescue protocols in the Zeq SDK.

## Overview

The 911, Triage, Ambulance, Disaster, Search & Rescue protocol family enables advanced computational capabilities.

## Protocols (5)

### Zeq911

**Protocol ID:** `zeq-911`
**Version:** 1.287.0
**Endpoint:** `/api/emergency/911` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Emergency dispatch optimization. Zeqond-stamped incident logging, nearest-resource allocation using R(t)-weighted distance metrics, priority queuing by severity.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| incidentType | `string` | Yes |  |
| severity | `number` | Yes | Severity 1-5 (5 = life-threatening). |

#### Returns

{ incidentId, dispatchedUnits, eta_min, priority, zeqond, auditTrail }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/emergency/911 \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTriage

**Protocol ID:** `zeq-triage`
**Version:** 1.287.0
**Endpoint:** `/api/emergency/triage` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Mass casualty triage using START/JumpSTART with HulyaPulse scoring. Automated color classification (black/red/yellow/green) with Zeqond timestamps per assessment.


#### Returns

{ triageResults: [{ patientId, color, priority, zeqond }], summary }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/emergency/triage \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAmbulance

**Protocol ID:** `zeq-ambulance`
**Version:** 1.287.0
**Endpoint:** `/api/emergency/ambulance` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Ambulance routing with HulyaPulse traffic-aware optimization. Dynamic rerouting every Zeqond cycle, hospital capacity checking, golden hour countdown.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| patientCondition | `string` | No |  |

#### Returns

{ route, eta_min, hospitalCapacity, goldenHourRemaining_min, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/emergency/ambulance \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDisaster

**Protocol ID:** `zeq-disaster`
**Version:** 1.287.0
**Endpoint:** `/api/emergency/disaster` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Disaster response coordination. Multi-agency resource allocation, evacuation zone modeling, supply chain logistics with Zeqond-synchronized command timeline.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| disasterType | `string` | Yes |  |
| populationDensity | `number` | No | People per sq km in affected zone. |

#### Returns

{ evacuationZones, resourceAllocation, shelterCapacity, supplyRoutes, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/emergency/disaster \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSearch & Rescue

**Protocol ID:** `zeq-sar`
**Version:** 1.287.0
**Endpoint:** `/api/emergency/sar` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Search and rescue probability mapping. Bayesian search theory with HulyaPulse-timed sweep patterns, terrain analysis, survival probability decay curves.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| terrain | `string` | No |  |
| timeSinceLost_hours | `number` | Yes | Hours since last contact. |

#### Returns

{ probabilityMap, searchPattern, survivalProbability, resourceNeeded, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/emergency/sar \
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
