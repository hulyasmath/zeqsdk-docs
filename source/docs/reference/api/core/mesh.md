---
id: mesh
title: ZeqMesh — Distributed identity & coherence
sidebar_label: Mesh
description: Verify identities and gossip events across the Zeq mesh layer.
---

# ZeqMesh

The mesh layer lets independent Zeq nodes verify identities (ZIDs) against each other and exchange coherence events. It is the substrate for distributed trust without a central authority — every node carries a fragment of state and the "earlier zeqond wins" rule resolves conflicts deterministically.

Three endpoints live under `/api/mesh/*`:

- `POST /api/mesh/verify` — verify a ZID across N peer nodes
- `POST /api/mesh/gossip` — receive a gossip event from a peer (node-to-node)
- `GET  /api/mesh/status` — public mesh health

---

## POST /api/mesh/verify

Verifies that a ZID is recognized by a quorum of mesh peers. Returns coherence score, consensus flag, and the per-node verification trail.

**Auth:** API key (`x-api-key` header)
**Rate limit:** 30 / minute / IP
**Publishes to ZeqState:** Yes (free tier auto-publish, anonymous, intent `mesh-verify`)

### Request

```json
{
  "zid": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "nodes": ["node-001", "node-002", "node-003"]
}
```

`nodes` is optional — if omitted, the local mesh's known peers are queried.

### Response

```json
{
  "zid": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "verified": true,
  "consensusReached": true,
  "coherenceScore": 0.94,
  "quorum": 3,
  "meshNodes": [
    { "nodeId": "node-001", "verified": true, "zeqond": 65392841 },
    { "nodeId": "node-002", "verified": true, "zeqond": 65392842 },
    { "nodeId": "node-003", "verified": true, "zeqond": 65392841 }
  ]
}
```

### curl

```bash
curl -X POST https://zeq.dev/api/mesh/verify \
  -H "x-api-key: $ZEQ_API_KEY" \
  -H "content-type: application/json" \
  -d '{"zid":"a1b2c3d4e5f60718293a4b5c6d7e8f90"}'
```

### Errors

| Code | Status | Meaning |
|---|---|---|
| `INVALID_ZID` | 400 | `zid` missing or not 32 hex chars |
| `UNAUTHORIZED` | 401 | Missing/invalid API key |
| `VERIFICATION_ERROR` | 500 | Mesh internal failure |

---

## POST /api/mesh/gossip

Node-to-node endpoint. Receives a signed event from a peer, applies the "earlier zeqond wins" conflict rule, and folds it into the local mesh state. Not intended for end-user calls.

**Auth:** Node handshake (`x-node-id` + signature)
**Rate limit:** 60 / minute / IP

### Request

```json
{
  "event": {
    "type": "identity.assert",
    "sourceNodeId": "node-002",
    "zeqond": 65392841,
    "payload": { "zid": "a1b2..." },
    "signature": "..."
  }
}
```

### Response

```json
{ "status": "received", "eventType": "identity.assert" }
```

---

## GET /api/mesh/status

Public read-only mesh health.

**Auth:** None
**Rate limit:** Built-in (per IP)

### Response

```json
{
  "meshSize": 12,
  "activeNodes": 11,
  "coherenceScore": 0.91,
  "lastGossip": 65392855,
  "zeqond": 65392856,
  "phase": 0.412
}
```

### curl

```bash
curl https://zeq.dev/api/mesh/status
```

---

## Conflict resolution: earlier zeqond wins

When two nodes assert conflicting state for the same ZID, the assertion with the **lower zeqond tick** is kept. Because zeqond is anchored to the Unix epoch via `t_Zeq = t_Unix / 0.777`, this is a globally-monotonic ordering — no clock-skew negotiation required.

## Related

- [ZeqAuth identity (ZID)](../../protocols/zeq-auth-equation-based-identity/zeq-identity-mesh.md)
- [ZeqState Explorer](https://zeq.dev/state/) — see live mesh-verify events
- [ZeqDNS](./dns) — mesh-aware mathematical addressing
