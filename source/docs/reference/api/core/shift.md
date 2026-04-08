---
title: "POST /api/zeq/shift"
sidebar_label: "shift"
sidebar_position: 3
description: "Project an operator chain forward (or backward) across N Zeqond steps from a base time. Returns a per-step R(t) trajectory bound to HulyaPulse."
---

# `POST /api/zeq/shift`

Project an operator chain across **N sequential Zeqond steps** starting from a base time. Each step advances `t` by exactly one Zeqond (`τ = 0.777 s`) and re-runs the 7-Step Wizard, giving you a clean R(t) trajectory along the HulyaPulse carrier.

> **Use this when:** you need a time series of CKO outputs for the same operator stack — e.g. forecast a phase-locked signal, replay a computation across history, or measure operator drift over multiple Zeqonds.

---

## Authentication

`Authorization: Bearer $ZEQ_API_KEY`

Each step consumes one API call from your daily quota.

---

## Request

```json
{
  "stepCount": 8,
  "baseZeqond": 2285084179,
  "domain": "physics",
  "operators": ["KO42", "QM1"],
  "inputs": { "x": 1.0 },
  "publish": false
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `stepCount` | integer | yes | Number of forward Zeqond steps (1 ≤ N ≤ 32). |
| `baseZeqond` | number | optional | Starting Zeqond. Defaults to `now`. |
| `domain` | string | optional | Domain hint, same semantics as `/zeq/compute`. |
| `operators` | string[] | optional | Operator chain. KO42 auto-prepended. |
| `inputs` | object | optional | Numeric inputs broadcast to every step. |
| `publish` | boolean | optional | Paid tiers only — opt the row into the public feed. |

---

## Response

```json
{
  "protocol": "ZeqShift",
  "domain": "physics",
  "baseZeqond": 2285084179,
  "stepCount": 8,
  "callsConsumed": 8,
  "zeqondSec": 0.777,
  "pulseHz": 1.287,
  "summary": { "minRt": 1.499, "maxRt": 1.504, "meanRt": 1.5018 },
  "projection": [
    { "step": 0, "delta": 0,     "R_t": 1.502, "phase": 0.5432, "operator": "QM1" },
    { "step": 1, "delta": 0.777, "R_t": 1.503, "phase": 0.5494, "operator": "QM1" }
  ],
  "computedAt": "2026-04-06T21:30:00.000Z",
  "equation": "R_t(step) = S(t) × [1 + α·sin(2π·f·(t₀ + step·τ))]  f=1.287 Hz, α=0.00129, τ=0.777 s"
}
```

---

## ZeqState publish behavior

A successful shift publishes **one row** summarising the whole projection (not one row per step). Published fields:

- `endpoint: "/api/zeq/shift"`
- `operatorChain`: deduplicated union of `KO42` plus every step's operator
- `resultPreview`: `{ stepCount, minRt, maxRt, meanRt, domain }`
- `proofValue`: `sha256-prefix` digest of the R(t) trajectory + base Zeqond

Free / Starter publish by default. Paid tiers require `publish: true`.

---

## Examples

### curl

```bash
curl -X POST https://www.zeq.dev/api/zeq/shift \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "stepCount": 8, "operators": ["KO42", "QM1"], "inputs": { "x": 1.0 } }'
```

### JavaScript

```javascript
const res = await fetch("https://www.zeq.dev/api/zeq/shift", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ stepCount: 8, operators: ["KO42", "QM1"], inputs: { x: 1.0 } }),
});
const data = await res.json();
console.log(data.summary, data.projection.length, "steps");
```

### Python

```python
import httpx, os

r = httpx.post(
    "https://www.zeq.dev/api/zeq/shift",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={"stepCount": 8, "operators": ["KO42", "QM1"], "inputs": {"x": 1.0}},
)
print(r.json()["summary"])
```

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_STEP_COUNT` | 400 | `stepCount` must be in `[1, 32]`. |
| `OPERATOR_LIMIT_EXCEEDED` | 400 | More than 3 non-KO42 operators. |
| `DAILY_LIMIT_EXCEEDED` | 429 | Caller would exceed daily quota with N steps. |
| `INTERNAL_ERROR` | 500 | One or more steps failed during execution. |

---

## Related

- [`/api/zeq/lattice`](./lattice) — parallel multi-node version of the same idea
- [`/api/zeq/pulse`](./pulse) — current HulyaPulse phase / Zeqond
- [Zeqond concept](../../../learn/concepts/zeqond)
