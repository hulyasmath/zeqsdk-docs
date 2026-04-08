---
sidebar_position: 9
title: Drug Interaction, Clinical Trial, Dosing, Formulation, Pharmacovigilance
description: Drug Interaction, Clinical Trial, Dosing, Formulation, Pharmacovigilance protocols and algorithms
---

# Drug Interaction, Clinical Trial, Dosing, Formulation, Pharmacovigilance

Complete reference for all Drug Interaction, Clinical Trial, Dosing, Formulation, Pharmacovigilance protocols in the Zeq SDK.

## Overview

The Drug Interaction, Clinical Trial, Dosing, Formulation, Pharmacovigilance protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqDrugInteraction

**Protocol ID:** `zeq-drug-interaction`
**Version:** 1.287.0
**Endpoint:** `/api/pharma/interaction` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Drug-drug interaction checking. CYP450 metabolism prediction, DDI severity scoring, alternative drug suggestions with R(t)-modulated pharmacokinetic modeling.


#### Returns

{ interactions, severity, mechanism, alternatives, cytochromeProfile, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/pharma/interaction \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqClinicalTrial

**Protocol ID:** `zeq-clinical-trial`
**Version:** 1.287.0
**Endpoint:** `/api/pharma/clinical-trial` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Clinical trial design and power analysis. Sample size calculation, randomization, interim analysis boundaries (O


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| endpoint | `string` | Yes |  |
| effectSize | `number` | Yes | Expected treatment effect. |
| alpha | `number` | No | Significance level. |
| power | `number` | No | Statistical power. |

#### Returns

{ sampleSize, enrollmentTarget, interimBoundaries, trialDuration_months, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/pharma/clinical-trial \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDosing

**Protocol ID:** `zeq-dosing`
**Version:** 1.287.0
**Endpoint:** `/api/pharma/dosing` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Individualized drug dosing. Population PK models (NONMEM-style), Bayesian dose adjustment, therapeutic drug monitoring with HulyaPulse sampling schedules.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| drug | `string` | Yes | Drug name or identifier. |

#### Returns

{ recommendedDose, interval_hr, peakPredicted, troughPredicted, auc, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/pharma/dosing \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFormulation

**Protocol ID:** `zeq-formulation`
**Version:** 1.287.0
**Endpoint:** `/api/pharma/formulation` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Drug formulation optimization. Dissolution modeling (Noyes-Whitney), excipient compatibility, stability prediction with R(t) degradation kinetics.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| api | `object` | Yes | Active pharmaceutical ingredient properties. |
| dosageForm | `string` | No |  |

#### Returns

{ dissolutionProfile, shelfLife_months, bioavailability_pct, stability, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/pharma/formulation \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPharmacovigilance

**Protocol ID:** `zeq-pharmacovigilance`
**Version:** 1.287.0
**Endpoint:** `/api/pharma/vigilance` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Adverse event signal detection. Disproportionality analysis (PRR/ROR), Bayesian signal detection, causality assessment with Zeqond-timestamped reporting.


#### Returns

{ signals, prr, ror, confidenceInterval, causalityScore, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/pharma/vigilance \
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
