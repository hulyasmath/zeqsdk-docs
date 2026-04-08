---
title: "POST /api/zeq/lattice"
sidebar_label: "lattice"
sidebar_position: 2
description: "Run a multi-node ZeqLattice computation across N phase-shifted nodes sharing a single base Zeqond. Returns per-node CKO data plus a coherence score."
---

# `POST /api/zeq/lattice`

Run a **ZeqLattice** — a fan-out of N CKO computations across nodes that all share a single base Zeqond but are phase-shifted by `i · τ / N` (τ = 0.777 s). The response includes per-node `R(t)` values and a **coherenceScore** in `[0, 1]` measuring how tightly the nodes agree.

> **Use this when:** you want a phase-locked snapshot of the same operator stack at multiple synchronized timepoints, e.g. for distributed sensor fusion, multi-sample averaging, or stability measurement.

---

## Authentication

`Authorization: Bearer $ZEQ_API_KEY`

Each node consumes one API call from your daily quota. A 4-node lattice = 4 calls.

---

## Request

```json
{
  "nodeCount": 4,
  "spec": {
    "domain": "physics",
    "operators": ["KO42", "QM1"],
    "inputs": { "x": 1.0 }
  },
  "publish": false
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `nodeCount` | integer | yes | Number of lattice nodes (1 ≤ N ≤ 16). |
| `spec.domain` | string | optional | Domain hint, same semantics as `/zeq/compute`. |
| `spec.operators` | string[] | optional | Operator chain. KO42 auto-prepended. |
| `spec.inputs` | object | optional | Numeric inputs broadcast to every node. |
| `publish` | boolean | optional | Paid tiers only — opt the lattice row into the public feed. |

---

## Response

```json
{
  "protocol": "ZeqLattice",
  "nodeCount": 4,
  "zeqond": 2285084179,
  "sharedZeqond": 2285084179,
  "coherenceScore": 0.9987,
  "latticeEquation": "L(t) = (1/4) Σᵢ Rᵢ(t+Δᵢ)  Δᵢ=i·τ/4  coherence=0.9987",
  "nodes": [
    { "node": 0, "operator": "QM1", "R_t": 1.502, "phase": 0.5432, "value": 1.502 }
  ],
  "callsConsumed": 4,
  "pulseHz": 1.287,
  "zeqondSec": 0.777,
  "computedAt": "2026-04-06T21:30:00.000Z"
}
```

`coherenceScore = max(0, 1 − stdDev(R_t) / mean(R_t))`. A score of `1.0` means every node returned the identical R(t); lower scores indicate phase drift, input noise, or operator instability.

---

## ZeqState publish behavior

A successful lattice publishes **one row** to the [public feed](https://zeq.dev/state/) summarising the whole run, not one row per node. The published row contains:

- `endpoint: "/api/zeq/lattice"`
- `operatorChain`: deduplicated union of `KO42` plus every node's operator
- `resultPreview`: `{ nodeCount, coherenceScore, meanRt, latticeEquation }`
- `proofValue`: `sha256-prefix` digest of the node R(t) array + base Zeqond

Free / Starter tiers publish by default. Paid tiers require `publish: true`.

---

## Examples

### curl

```bash
curl -X POST https://www.zeq.dev/api/zeq/lattice \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "nodeCount": 4,
    "spec": { "domain": "physics", "operators": ["KO42", "QM1"], "inputs": { "x": 1.0 } }
  }'
```

### JavaScript

```javascript
const res = await fetch("https://www.zeq.dev/api/zeq/lattice", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nodeCount: 4,
    spec: { domain: "physics", operators: ["KO42", "QM1"], inputs: { x: 1.0 } },
  }),
});
const lat = await res.json();
console.log("coherence:", lat.coherenceScore, "nodes:", lat.nodes.length);
```

### Python

```python
import httpx, os

r = httpx.post(
    "https://www.zeq.dev/api/zeq/lattice",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={
        "nodeCount": 4,
        "spec": {"domain": "physics", "operators": ["KO42", "QM1"], "inputs": {"x": 1.0}},
    },
)
print(r.json()["coherenceScore"])
```

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_NODE_COUNT` | 400 | `nodeCount` must be an integer in `[1, 16]`. |
| `OPERATOR_LIMIT_EXCEEDED` | 400 | More than 3 non-KO42 operators in `spec.operators`. |
| `DAILY_LIMIT_EXCEEDED` | 429 | Caller would exceed daily quota with N nodes. |
| `INTERNAL_ERROR` | 500 | One or more nodes failed during execution. |

---

## Related

- [`/api/zeq/compute`](./compute) — single-node CKO
- [`/api/zeq/shift`](./shift) — sequential temporal projection (same idea, different time axis)
- [Step 0 Phase concept](../../../learn/concepts/step-0-phase)
