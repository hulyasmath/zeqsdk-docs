---
title: "POST /api/genesis/*"
sidebar_label: "genesis"
sidebar_position: 6
description: "ZeqGenesis self-generating protocol engine. Analyse a plain-text query for protocol gaps, auto-generate a new operator chain, and execute it through the 7-Step Wizard."
---

# `POST /api/genesis/*`

**ZeqGenesis** is the self-generating protocol engine. It takes a plain-text query, analyses it for gaps in the existing 234+ protocol catalogue, and — if a gap is found — generates a brand-new operator chain on the fly and executes it through the same 7-Step Wizard that powers `/api/zeq/compute`.

> **Use this when:** the user's intent doesn't map to an existing protocol and you want the kernel to invent one rather than failing.

---

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/genesis/analyze` | Analyse a query and report which existing protocols (if any) cover it |
| `POST` | `/api/genesis/generate` | Generate a new protocol if `analyze` reports a gap |
| `POST` | `/api/genesis/execute` | Execute a generated (or inline) protocol through the 7-Step Wizard |
| `GET` | `/api/genesis/protocols` | List protocols generated in the current session |
| `GET` | `/api/genesis/protocol/:id` | Fetch a single generated protocol |
| `POST` | `/api/genesis/promote/:id` | Promote a generated protocol to the permanent catalogue |
| `GET` | `/api/genesis/gaps` | View the gap log |
| `GET` | `/api/genesis/stats` | Engine statistics |
| `POST` | `/api/genesis/query-to-equation` | Convert a query to its mathematical form |

---

## Authentication

All Genesis endpoints require `Authorization: Bearer $ZEQ_API_KEY`.

---

## Quickstart: end-to-end Genesis call

### 1. Analyse the query for gaps

```bash
curl -X POST https://www.zeq.dev/api/genesis/analyze \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "query": "predict mango ripening from skin colour and ambient temperature" }'
```

### 2. Generate a protocol if a gap was found

```bash
curl -X POST https://www.zeq.dev/api/genesis/generate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "query": "predict mango ripening from skin colour and ambient temperature" }'
```

Returns a `protocolId` and the auto-generated operator chain.

### 3. Execute it

```bash
curl -X POST https://www.zeq.dev/api/genesis/execute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "protocolId": "genesis-1775510398395",
    "inputs": { "hue": 0.18, "tempC": 22.0 },
    "precisionTarget": 0.001,
    "mode": "precise"
  }'
```

---

## `POST /api/genesis/execute` — request

```json
{
  "protocolId": "genesis-1775510398395",
  "operators": ["KO42", "QM1"],
  "domain": "bio",
  "inputs": { "hue": 0.18, "tempC": 22.0 },
  "precisionTarget": 0.001,
  "mode": "precise",
  "publish": false
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `protocolId` | string | one of these two | Lookup mode — execute a previously generated protocol |
| `operators` + `domain` | string[] + string | one of these two | Inline mode — execute an ad-hoc chain |
| `inputs` | object | optional | Numeric inputs |
| `precisionTarget` | number | optional | Required precision (default `0.001` = 0.1%) |
| `mode` | string | optional | `"precise"` or `"vx"` (ground-state fallback) |
| `publish` | boolean | optional | Paid tiers only — opt the row into the public feed |

---

## `POST /api/genesis/execute` — response

```json
{
  "protocol": {
    "id": "genesis-1775510398395",
    "operators": ["KO42", "QM1"],
    "domain": "bio"
  },
  "execution": {
    "mode": "precise",
    "status": "completed",
    "precisionTarget": 0.001,
    "precisionActual": 0.000181,
    "precisionMet": true
  },
  "computation": {
    "value": 0.74,
    "unit": "ripeness",
    "uncertainty": 1.8e-4,
    "S_t": 0.738,
    "R_t": 0.74
  },
  "zeqState": { "operators": ["KO42","QM1"], "masterSum": 1.234, "phase": 0.5432, "zeqond": 2285084179 },
  "protocol_steps": [],
  "meta": { "computedAt": "2026-04-06T21:30:00.000Z", "totalMs": 12 }
}
```

---

## ZeqState publish behavior

`/api/genesis/execute` publishes one row per successful execution:

- `endpoint: "/api/genesis/execute"`
- `operatorChain`: the (auto-generated or inline) operator chain
- `resultPreview`: `{ protocolId, domain, value, unit, R_t, precisionMet }`
- `proofValue`: `sha256-prefix` digest of `{ ops, domain, R_t, zeqond }`

The other Genesis endpoints (`analyze`, `generate`, `promote`, `gaps`, `stats`) do **not** publish.

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_PAYLOAD` | 400 | Neither `protocolId` nor (`operators` + `domain`) was supplied |
| `PROTOCOL_NOT_FOUND` | 404 | `protocolId` does not exist |
| `OPERATOR_LIMIT_EXCEEDED` | 400 | More than 3 non-KO42 operators |
| `INVALID_PRECISION_TARGET` | 400 | `precisionTarget` outside `[0, 1]` |

---

## Related

- [`/api/zeq/compute`](./compute) — for protocols that already exist in the catalogue
- [`/api/operators`](./operators) — browse the operator registry Genesis draws from
- [Seven-step protocol concept](../../../learn/concepts/seven-step-protocol)
