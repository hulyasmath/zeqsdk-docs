---
sidebar_position: 21
title: Operators, constants, equations
description: Operators, constants, equations protocols and algorithms
---

# Operators, constants, equations

Complete reference for all Operators, constants, equations protocols in the Zeq SDK.

## Overview

The Operators, constants, equations protocol family enables advanced computational capabilities.

## Protocols (10)

### Operator List

**Protocol ID:** `operators-list`
**Version:** 1.0
**Endpoint:** `/api/operators` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

All operators (1,340+) enriched with canonical LaTeX, founder, tier. Filterable by search, category, domainGroup.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| search | `string` | No | Search by ID, name, description, or domain. |
| category | `string` | No | Filter by domain name. |
| domainGroup | `string` | No | Filter by group: Core Physics, Extended Physics, Applied Sciences, Industry, Frontier. |
| enrich | `string` | No |  |

#### Returns

{ operators, total, filtered, enriched, canonicalRegistrySize, source }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/operators \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Operator Categories

**Protocol ID:** `operators-categories`
**Version:** 1.0
**Endpoint:** `/api/operators/categories` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Domain breakdown with operator counts, colors, and group labels.


#### Returns

{ categories, groups, totalOperators, totalDomains }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/operators/categories \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Canonical Operator Registry

**Protocol ID:** `canonical-registry`
**Version:** 6.3.0
**Endpoint:** `/api/framework/registry` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Full 1,576-operator registry with LaTeX equations, founder attribution, tiers. The verified mathematical canon.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| category | `string` | No | Filter by category slug. |
| search | `string` | No | Search ID, description, equation, or founder. |
| tier | `number` | No | Filter by tier. |

#### Returns

{ total, filtered, version, categories, operators }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/registry \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Canonical Operator Lookup

**Protocol ID:** `canonical-operator`
**Version:** 6.3.0
**Endpoint:** `/api/framework/operator/:id` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Single operator with full LaTeX, founder, tier, and source attribution.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `string` | Yes | Operator ID (e.g.  |

#### Returns

{ id, internalId, category, description, equation, equationLaTeX, equationSource, tier, tierLabel, founder }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/operator/:id \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Physical Constants

**Protocol ID:** `physical-constants`
**Version:** 1.287.6
**Endpoint:** `/api/framework/constants` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

NIST CODATA 2022 physical constants + framework parameters + awareness parameters + master equation coefficients.


#### Returns

{ _meta, framework, fundamental, awareness_params, master_equation, defaults }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/constants \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Single Constant Lookup

**Protocol ID:** `physical-constant`
**Version:** 1.287.6
**Endpoint:** `/api/framework/constants/:key` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Look up a single physical constant by key.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | `string` | Yes | Constant key: c, G, h, h_bar, k_B, e_charge, m_electron, etc. |

#### Returns

{ key, value, unit, name, exact }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/constants/:key \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Framework Parameters

**Protocol ID:** `framework-params`
**Version:** 1.287.6
**Endpoint:** `/api/framework/params` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Core framework tuning — pulse frequency, Zeqond duration, alpha, precision target, max operators.


#### Returns

{ pulse_frequency_hz, zeqond_s, alpha_modulation, precision_target, ko42_mandatory, ... }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/params \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### 7-Step Wizard Protocol

**Protocol ID:** `seven-step-protocol`
**Version:** 1.287.5
**Endpoint:** `/api/framework/protocol` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

The mandatory verification protocol. 7 steps: Prime Directive, Operator Limit, Scale, Precision, Compile, Execute, Verify.


#### Returns

{ name, version, description, steps }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/protocol \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Core Equations

**Protocol ID:** `core-equations`
**Version:** 1.0
**Endpoint:** `/api/framework/equations` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

All 7 core Zeq equations plus the ZTB1 timebase bridge. Master equation coefficients and protocol steps.


#### Returns

{ coreEquations, protocol, version }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/equations \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Premade Experiments

**Protocol ID:** `premade-experiments`
**Version:** 1.0
**Endpoint:** `/api/framework/experiments` 🟢 GET
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

63 pre-built physics experiments with difficulty levels, required data, operator selections.


#### Returns

{ experiments, count }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/framework/experiments \
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
