---
id: dns
title: ZeqDNS — Mathematical addressing
sidebar_label: DNS
description: Resolve domains to mesh-aware mathematical node addresses.
---

# ZeqDNS

ZeqDNS replaces traditional DNS with **mathematical addresses** — a 16-character hex digest derived from a node's identity equation. Domains are bound to addresses with a cryptographic proof, and lookups return the canonical endpoint plus the zeqond tick at which the binding was minted.

Endpoints under `/api/dns/*`:

- `POST /api/dns/resolve` — domain → mathematical address
- `POST /api/dns/register` — bind a domain to a node (auth required)
- `GET  /api/dns/lookup/:address` — address → endpoint
- `GET  /api/dns/status` — registry health

---

## POST /api/dns/resolve

Resolves a human-readable domain to its mathematical address and current endpoint.

**Auth:** None for public domains, API key for private ones
**Rate limit:** 60 / minute / IP

### Request

```json
{ "domain": "alice.zeq" }
```

### Response

```json
{
  "domain": "alice.zeq",
  "address": "7f3a2b91c8d4e0f5",
  "nodeId": "node-014",
  "endpoint": "https://alice.example/zeq",
  "zeqond": 65392841,
  "proofHash": "9c1f2e..."
}
```

### Errors

| Code | Status | Meaning |
|---|---|---|
| `INVALID_DOMAIN` | 400 | Empty or non-string domain |
| `NOT_FOUND` | 404 | No binding registered |
| `RESOLUTION_ERROR` | 500 | Registry failure |

---

## POST /api/dns/register

Binds a domain to a node. The caller must present a proof — currently `HMAC-SHA256(domain || nodeId, ZEQ_NODE_SECRET)` — that demonstrates control of the node.

**Auth:** API key (`x-api-key`)
**Rate limit:** 5 / minute / IP

### Request

```json
{
  "domain": "alice.zeq",
  "nodeId": "node-014",
  "endpoint": "https://alice.example/zeq",
  "proof": "9c1f2e..."
}
```

### Response

```json
{
  "address": "7f3a2b91c8d4e0f5",
  "nodeId": "node-014",
  "endpoint": "https://alice.example/zeq",
  "zeqond": 65392841,
  "proofHash": "9c1f2e..."
}
```

### Errors

| Code | Status | Meaning |
|---|---|---|
| `INVALID_DOMAIN` / `INVALID_NODE_ID` / `INVALID_ENDPOINT` | 400 | Required field missing |
| `INVALID_PROOF` | 403 | Proof does not verify |
| `REGISTRATION_ERROR` | 500 | Registry write failure |

---

## GET /api/dns/lookup/:address

Reverse lookup. Address must be a 16-character lowercase hex string.

**Auth:** None
**Rate limit:** 60 / minute / IP

### Response

```json
{
  "address": "7f3a2b91c8d4e0f5",
  "nodeId": "node-014",
  "endpoint": "https://alice.example/zeq",
  "status": "active",
  "zeqond": 65392841
}
```

### curl

```bash
curl https://zeq.dev/api/dns/lookup/7f3a2b91c8d4e0f5
```

---

## GET /api/dns/status

Public registry health.

```json
{
  "totalAddresses": 248,
  "activeNodes": 219,
  "lastRegistration": 65392855,
  "zeqond": 65392856
}
```

---

## Address derivation

```
address = first 16 hex chars of SHA-256(nodeId || nodeSecret || domain)
```

The address is **stable across registrations** for the same `(nodeId, domain)` pair, so a node that re-registers after downtime keeps its identity.

## Related

- [ZeqMesh](./mesh) — verify identities across nodes
- [Internet infrastructure replacement](../../protocols/internet-infrastructure-replacement/zeq-mesh-discover.md)
