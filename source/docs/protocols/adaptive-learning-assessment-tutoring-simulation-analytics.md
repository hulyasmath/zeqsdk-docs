---
sidebar_position: 4
title: Adaptive Learning, Assessment, Tutoring, Simulation, Analytics
description: Adaptive Learning, Assessment, Tutoring, Simulation, Analytics protocols and algorithms
---

# Adaptive Learning, Assessment, Tutoring, Simulation, Analytics

Complete reference for all Adaptive Learning, Assessment, Tutoring, Simulation, Analytics protocols in the Zeq SDK.

## Overview

The Adaptive Learning, Assessment, Tutoring, Simulation, Analytics protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqAdaptiveLearning

**Protocol ID:** `zeq-adaptive-learn`
**Version:** 1.287.0
**Endpoint:** `/api/edu/adaptive` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Adaptive learning engine using R(t)-modulated knowledge state estimation. Item response theory (IRT) with Zeqond-paced mastery gates, spaced repetition scheduling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| studentId | `string` | Yes | Learner identifier. |

#### Returns

{ abilityEstimate, nextItems, masteryLevel, retentionSchedule, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/edu/adaptive \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAssessment

**Protocol ID:** `zeq-assessment`
**Version:** 1.287.0
**Endpoint:** `/api/edu/assessment` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Automated assessment generation and scoring. Bloom


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| topic | `string` | Yes | Assessment topic. |
| difficulty | `string` | No |  |
| questionCount | `number` | No | Number of questions. |

#### Returns

{ questions, rubric, bloomsAlignment, estimatedTime_min, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/edu/assessment \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPhysicsSimulation

**Protocol ID:** `zeq-physics-sim`
**Version:** 1.287.0
**Endpoint:** `/api/edu/physics-sim` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Interactive physics simulation for education. Pendulums, projectiles, orbits, wave tanks — all Zeqond-stepped with R(t) accuracy for classroom demonstrations.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| experiment | `string` | Yes |  |
| parameters | `object` | Yes | Experiment-specific initial conditions. |
| steps | `number` | No | Simulation Zeqond steps. |

#### Returns

{ timeSeries, energyConservation_error, visualization, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/edu/physics-sim \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTutor

**Protocol ID:** `zeq-tutor`
**Version:** 1.287.0
**Endpoint:** `/api/edu/tutor` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Socratic tutoring protocol. Misconception detection, scaffolded hints, knowledge graph traversal — paced at Zeqond intervals for cognitive load management.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| studentQuery | `string` | Yes | Student |
| subject | `string` | Yes | Subject area. |
| level | `string` | No |  |

#### Returns

{ response, hints, misconceptions, nextConcepts, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/edu/tutor \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqLearningAnalytics

**Protocol ID:** `zeq-learning-analytics`
**Version:** 1.287.0
**Endpoint:** `/api/edu/analytics` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Learning analytics dashboard data. Engagement metrics, at-risk prediction, cohort analysis with HulyaPulse temporal patterns for early intervention.


#### Returns

{ atRiskStudents, engagementScores, completionPredictions, interventionSuggestions, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/edu/analytics \
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
