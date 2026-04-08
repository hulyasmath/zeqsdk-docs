---
sidebar_position: 13
title: HulyaPulse heartbeat
description: HulyaPulse heartbeat protocols and algorithms
---

# HulyaPulse heartbeat

Complete reference for all HulyaPulse heartbeat protocols in the Zeq SDK.

## Overview

The HulyaPulse heartbeat protocol family enables advanced computational capabilities.

## Protocols (3)

### ZeqPulse

**Protocol ID:** `zeq-pulse`
**Version:** 1.0
**Endpoint:** `/api/zeq/pulse` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Real-time HulyaPulse state — zeqond count, phase [0,1), R(t), field strength. The heartbeat of the framework.


#### Returns

{ zeqond, phase, R_t, fieldStrength, timeToNextZeqond, pulseHz, zeqondSec, alpha, precision, timestamp, modulation }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/zeq/pulse \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPulse SSE Stream

**Protocol ID:** `zeq-pulse-stream`
**Version:** 1.0
**Endpoint:** `/api/zeq/pulse/stream` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Server-Sent Events stream ticking every 777ms (one Zeqond). Each event contains zeqond, phase, R_t, and timestamp.


#### Returns

SSE stream: { zeqond, phase, R_t, pulseHz, timestamp } every 777ms

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/zeq/pulse/stream \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZTB1 Timebase Bridge

**Protocol ID:** `zeq-timebridge`
**Version:** 1.0
**Endpoint:** `/api/zeq/timebridge` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Bidirectional Unix ↔ Zeqond time conversion. Lossless mapping between standard epoch time and HulyaPulse computational time.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| timestamp | `number` | Yes | Unix timestamp (seconds) or Zeqond count. |
| from | `string` | No |  |

#### Returns

{ unix, zeqond, phase, phaseRadians, R_t, direction }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/timebridge \
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
