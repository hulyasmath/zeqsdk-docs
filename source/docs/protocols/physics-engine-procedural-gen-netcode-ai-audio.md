---
sidebar_position: 24
title: Physics Engine, Procedural Gen, Netcode, AI, Audio
description: Physics Engine, Procedural Gen, Netcode, AI, Audio protocols and algorithms
---

# Physics Engine, Procedural Gen, Netcode, AI, Audio

Complete reference for all Physics Engine, Procedural Gen, Netcode, AI, Audio protocols in the Zeq SDK.

## Overview

The Physics Engine, Procedural Gen, Netcode, AI, Audio protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqPhysicsEngine

**Protocol ID:** `zeq-physics-engine`
**Version:** 1.287.0
**Endpoint:** `/api/gaming/physics` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Game physics engine with Zeqond-quantized timestep. Deterministic rigid body simulation at 0.777s tick rate, collision detection, constraint solving — same result on every machine.


#### Returns

{ states: [{ step, bodies, collisions, energy }], deterministic: true, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/gaming/physics \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqProcGen

**Protocol ID:** `zeq-procgen`
**Version:** 1.287.0
**Endpoint:** `/api/gaming/procgen` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Procedural content generation seeded by Zeqond state. Terrain, dungeons, galaxies, loot tables — all deterministic from HulyaPulse phase. Same seed, same world, always.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `string` | Yes |  |
| seed | `number` | No | Zeqond seed. If omitted, uses current Zeqond count. |
| parameters | `object` | No | Type-specific params (size, complexity, rarity). |

#### Returns

{ generated, seed, zeqond, hash, metadata }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/gaming/procgen \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqNetcode

**Protocol ID:** `zeq-netcode`
**Version:** 1.287.0
**Endpoint:** `/api/gaming/netcode` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Deterministic lockstep netcode on Zeqond ticks. 777ms authoritative frames, client-side prediction with R(t) rollback correction. Zero desync guaranteed.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sessionId | `string` | Yes | Game session identifier. |

#### Returns

{ authoritativeState, rollbackFrames, desyncCheck, latency_ms, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/gaming/netcode \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqGameAI

**Protocol ID:** `zeq-game-ai`
**Version:** 1.287.0
**Endpoint:** `/api/gaming/ai` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

NPC behavior trees and pathfinding with HulyaPulse decision cadence. A* on Zeqond grid, GOAP planning, flocking/steering with R(t) randomness injection for organic feel.


#### Returns

{ decisions: [{ agentId, action, path, confidence }], zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/gaming/ai \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSpatialAudio

**Protocol ID:** `zeq-spatial-audio`
**Version:** 1.287.0
**Endpoint:** `/api/gaming/spatial-audio` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

3D spatial audio engine with HulyaPulse-synced HRTF. Zeqond-quantized reverb tails, Doppler simulation, occlusion via R(t)-weighted ray casting.


#### Returns

{ spatializedAudio, hrtfApplied, reverbProfile, dopplerShifts, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/gaming/spatial-audio \
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
