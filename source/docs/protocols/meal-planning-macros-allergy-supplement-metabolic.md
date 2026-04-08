---
sidebar_position: 17
title: Meal Planning, Macros, Allergy, Supplement, Metabolic
description: Meal Planning, Macros, Allergy, Supplement, Metabolic protocols and algorithms
---

# Meal Planning, Macros, Allergy, Supplement, Metabolic

Complete reference for all Meal Planning, Macros, Allergy, Supplement, Metabolic protocols in the Zeq SDK.

## Overview

The Meal Planning, Macros, Allergy, Supplement, Metabolic protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqMealPlan

**Protocol ID:** `zeq-meal-plan`
**Version:** 1.287.0
**Endpoint:** `/api/nutrition/meal-plan` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Personalized meal planning with HulyaPulse circadian nutrition timing. Macro/micro nutrient targets, meal prep scheduling, grocery list optimization.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| goal | `string` | No |  |

#### Returns

{ mealPlan, dailyMacros, groceryList, circadianTiming, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nutrition/meal-plan \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMacros

**Protocol ID:** `zeq-macros`
**Version:** 1.287.0
**Endpoint:** `/api/nutrition/macros` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Macro and micronutrient analysis. Harris-Benedict/Mifflin-St Jeor BMR, TDEE calculation, nutrient density scoring with R(t) metabolic rate variation.


#### Returns

{ calories, protein_g, carbs_g, fat_g, fiber_g, micronutrients, nutrientDensityScore, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nutrition/macros \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAllergy

**Protocol ID:** `zeq-allergy`
**Version:** 1.287.0
**Endpoint:** `/api/nutrition/allergy` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Food allergen detection and cross-contamination risk assessment. FDA Big 9 allergen scanning, alternative ingredient suggestions, restaurant safety scoring.


#### Returns

{ detected, crossContaminationRisk, alternatives, safetyScore, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nutrition/allergy \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSupplement

**Protocol ID:** `zeq-supplement`
**Version:** 1.287.0
**Endpoint:** `/api/nutrition/supplement` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Supplement interaction and optimization. Nutrient absorption timing, synergies (vitamin D + K2), antagonisms (calcium vs iron), bioavailability forms.


#### Returns

{ optimalTiming, interactions, synergies, antagonisms, bioavailabilityNotes, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nutrition/supplement \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMetabolic

**Protocol ID:** `zeq-metabolic`
**Version:** 1.287.0
**Endpoint:** `/api/nutrition/metabolic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Metabolic rate and body composition modeling. Indirect calorimetry estimation, RQ analysis, lean mass prediction with R(t) circadian metabolic cycling.


#### Returns

{ bmr_kcal, tdee_kcal, leanMass_kg, fatMass_kg, rq, metabolicAge, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/nutrition/metabolic \
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
