---
title: "POST /api/zeq/compute"
sidebar_label: "compute"
sidebar_position: 1
description: "Run a phase-locked computation through the 7-Step Wizard. Returns a full CKO (Canonical Kernel Output) with operator chain, masterSum, R(t), phase, Zeqond, and a ZeqProof HMAC receipt."
---

# `POST /api/zeq/compute`

Execute a phase-locked computation through the 7-Step Wizard Protocol. This is the headline endpoint of the Zeq kernel — every call returns a complete **CKO** (Canonical Kernel Output) bound to the current HulyaPulse phase, plus a **ZeqProof** HMAC receipt for verification.

> **KO42 is mandatory.** Every operator chain must include `KO42` as the ground state. If you omit it, the wizard adds it automatically.
> **Operator limit:** ≤4 total operators (KO42 + up to 3 domain operators).
> **Precision contract:** ≤0.1% error (`precisionBound ≤ 0.001`).

---

## Authentication

`Authorization: Bearer $ZEQ_API_KEY`

Free / Starter tiers count against the daily quota in `X-RateLimit-Limit`. Paid tiers (Builder and above) that exceed quota fall through to **VX ground-state mode** instead of receiving a 429.

---

## Request

```json
{
  "domain": "physics",
  "operators": ["KO42", "QM1", "GR32"],
  "inputs": {
    "x": 1.0,
    "y": 2.0
  },
  "publish": false
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `domain` | string | optional | Domain hint for operator selection (e.g. `physics`, `bio`, `audio`). Defaults to `ZR`. |
| `operators` | string[] | optional | Operator IDs. KO42 is auto-prepended if missing. Max 4 total. |
| `inputs` | object | optional | Numeric inputs (`{ key: number }`). Non-numeric values are dropped. |
| `publish` | boolean | optional | Paid tiers only — opt this row into the public ZeqState feed. Free / Starter rows are always public. |

---

## Response

```json
{
  "zeqState": {
    "operators": ["KO42", "QM1", "GR32"],
    "domainOperators": ["QM1", "GR32"],
    "operatorObjects": [
      { "id": "KO42", "name": "HulyaPulse Ground State", "domain": "Core", "equation": "R(t) = S(t) × [1 + α·sin(2π·1.287·t)]" }
    ],
    "masterSum": 3.14159,
    "masterEquation": "M(physics) = KO42[QM1 · GR32] · R_t",
    "phase": 0.5432,
    "zeqond": 2285084179,
    "domain": "physics",
    "precision": 0.000181
  },
  "result": {
    "S_t": 1.5,
    "R_t": 1.502,
    "value": 1.502,
    "unit": "—",
    "uncertainty": 1.8e-4,
    "inputs": { "x": 1.0, "y": 2.0 }
  },
  "zeqProof": "d56aac2c74c24b065099d911d28a030a4b02a78248d39d0b6656fab45fea490e",
  "_kernelUrl": "https://www.zeq.dev"
}
```

### Response headers

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Daily token allowance for the caller's plan |
| `X-RateLimit-Remaining` | Tokens left in the current Zeqond-aligned UTC day |
| `X-RateLimit-Reset` | ISO timestamp of the next reset |
| `X-RateLimit-Plan` | `free` / `starter` / `builder` / `advanced` / `architect` |

---

## ZeqState publish behavior

Every successful call to `/api/zeq/compute` may publish a row to the public **[ZeqState feed](https://zeq.dev/state/)**. The decision matrix:

| Plan | Default | Override with `publish: true` |
|---|---|---|
| `free`, `starter` | **Public** | n/a |
| `builder` and above | Private | Publishes |

The published row includes `operatorChain`, `zeqondTick`, `phase`, `precisionBound`, the truncated `resultPreview`, and the `zeqProof` HMAC. Full result payloads (`inputs`, `S_t`, `R_t`) are **never** published.

See the [ZeqState object reference](../zeqstate-object) for the full row schema.

---

## Examples

### curl

```bash
curl -X POST https://www.zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "physics",
    "operators": ["KO42", "QM1"],
    "inputs": { "x": 1.0 }
  }'
```

### JavaScript (fetch)

```javascript
const res = await fetch("https://www.zeq.dev/api/zeq/compute", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    domain: "physics",
    operators: ["KO42", "QM1"],
    inputs: { x: 1.0 },
  }),
});
const cko = await res.json();
console.log("R(t) =", cko.result.R_t, "ZeqProof:", cko.zeqProof);
```

### Python (httpx)

```python
import httpx, os

r = httpx.post(
    "https://www.zeq.dev/api/zeq/compute",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={"domain": "physics", "operators": ["KO42", "QM1"], "inputs": {"x": 1.0}},
)
cko = r.json()
print("R(t) =", cko["result"]["R_t"], "ZeqProof:", cko["zeqProof"])
```

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `DAILY_LIMIT_EXCEEDED` | 429 | Free / Starter caller is over daily quota. Upgrade or wait for next Zeqond-aligned UTC day. |
| `OPERATOR_LIMIT_EXCEEDED` | 400 | More than 3 non-KO42 operators provided (max 4 total). |
| `INVALID_INPUTS` | 400 | `inputs` contained non-numeric values. |
| `INTERNAL_ERROR` | 500 | Wizard step failed. Returned with the failing step name. |

See [error codes](../error-codes) for the full table.

---

## Related

- [`/api/zeq/lattice`](./lattice) — multi-node lattice run
- [`/api/zeq/shift`](./shift) — Unix ↔ Zeqond projection
- [`/api/zeq/verify`](./verify) — verify a returned ZeqProof
- [Zeq Explorer](https://zeq.dev/state/) — public feed of every published `/zeq/compute` call
