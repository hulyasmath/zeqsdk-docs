---
sidebar_position: 14
title: Internet infrastructure replacement
description: Internet infrastructure replacement protocols and algorithms
---

# Internet infrastructure replacement

Complete reference for all Internet infrastructure replacement protocols in the Zeq SDK.

## Overview

The Internet infrastructure replacement protocol family enables advanced computational capabilities.

## Protocols (7)

### ZeqSync — Packet Synchronization

**Protocol ID:** `zeq-sync`
**Version:** 1.0
**Endpoint:** `/api/network/sync` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Zeqond-grid packet synchronization. Every packet timestamped to the 0.777s grid — no clock drift, no NTP dependency. The replacement for network time protocols.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientZeqond | `number` | Yes | Client |
| clientPhase | `number` | Yes | Client |

#### Returns

{ serverZeqond, serverPhase, drift, correctionMs, synchronized, R_t }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/sync \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqRoute — Phase-Aware Routing

**Protocol ID:** `zeq-route`
**Version:** 1.0
**Endpoint:** `/api/network/route` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Shortest path weighted by HulyaPulse phase coherence. Nodes that are phase-aligned get priority — naturally selects the most synchronized route through the network.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| source | `string` | Yes | Source node ID or address. |
| destination | `string` | Yes | Destination node ID or address. |
| hops | `number` | No | Max hops allowed (1–32). Default: 8. |

#### Returns

{ route: [{ nodeId, phase, latencyMs, coherenceScore }], totalHops, pathCoherence }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/route \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMesh — Node Discovery

**Protocol ID:** `zeq-mesh-discover`
**Version:** 1.0
**Endpoint:** `/api/network/mesh/discover` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Decentralized mesh networking with lattice-coherence node discovery. Nodes announce themselves with ZeqPulse state — the mesh self-organizes by phase alignment.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| nodeId | `string` | Yes | This node |
| capabilities | `array` | No | Protocol IDs this node supports. |
| radius | `number` | No | Discovery radius in hops (1–16). Default: 4. |

#### Returns

{ peers: [{ nodeId, phase, R_t, capabilities, latencyMs }], meshSize, avgCoherence }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/mesh/discover \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDNS — Equation-Based Resolution

**Protocol ID:** `zeq-dns`
**Version:** 1.0
**Endpoint:** `/api/network/dns/resolve` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Domains are mathematical expressions, not strings. 


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| equation | `string` | Yes | Mathematical expression to resolve (same parser as Zeq Auth). |

#### Returns

{ equation, evaluatedAt, result, address, zeqondResolved, cached }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/dns/resolve \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTransport — Congestion Control

**Protocol ID:** `zeq-transport`
**Version:** 1.0
**Endpoint:** `/api/network/transport/state` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Congestion control using R(t) modulation instead of TCP window sizing. Send rate modulated by HulyaPulse — naturally oscillates to find optimal throughput without packet loss.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| connectionId | `string` | Yes | Transport connection ID. |
| currentRate | `number` | Yes | Current send rate (bytes/sec). |
| packetLoss | `number` | No | Current packet loss ratio (0–1). |

#### Returns

{ recommendedRate, R_t_modulation, phase, backoffMs, congestionState }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/transport/state \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqRelay — Zeqond-Stamped Relay

**Protocol ID:** `zeq-relay`
**Version:** 1.0
**Endpoint:** `/api/network/relay` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Message relay with Zeqond timestamps and ZeqProof integrity. Every relayed message carries proof of its origin time and path — tampering detectable by any node.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| payload | `string` | Yes | Message payload (max 64KB). |
| destination | `string` | Yes | Destination node or ZID. |
| ttlZeqonds | `number` | No | Time-to-live in Zeqonds (1–1000). Default: 100. |

#### Returns

{ relayId, zeqondStamp, proof, hops, estimatedDeliveryZeqonds }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/relay \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBandwidth — Pulse-Modulated Allocation

**Protocol ID:** `zeq-bandwidth`
**Version:** 1.0
**Endpoint:** `/api/network/bandwidth/allocate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Bandwidth allocation modulated by HulyaPulse. High-priority traffic gets the peak of the R(t) cycle; background traffic uses the troughs. Fair by physics.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| streamId | `string` | Yes | Data stream identifier. |
| priority | `number` | Yes | Priority level (1–10). Higher = allocated at R(t) peaks. |
| requestedBps | `number` | Yes | Requested bandwidth (bytes/sec). |

#### Returns

{ allocatedBps, phaseSlot, R_t_at_slot, utilizationPct }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/network/bandwidth/allocate \
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
