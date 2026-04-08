---
title: "GET /api/framework"
sidebar_label: "framework"
sidebar_position: 8
description: "Framework introspection — constants, equations, registry, parameters, experiments, and the /solve wizard endpoint."
---

# `GET /api/framework`

Framework introspection — fetch the canonical constants, master equations, operator registry, tunable parameters, and pre-built example computations the kernel runs on. Most endpoints are public; `/solve` requires an API key.

---

## Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/registry` | public | Canonical operator + constant registry |
| `GET` | `/api/registry/categories` | public | Registry categories |
| `GET` | `/api/constants` | public | All physical and Zeq constants |
| `GET` | `/api/constants/:key` | public | Single constant value |
| `GET` | `/api/params` | public | Tunable framework parameters |
| `GET` | `/api/equations` | public | Master equations (HULYAS, KO42, R(t), Functional, Spectral) |
| `GET` | `/api/protocol` | public | Active protocol manifest |
| `GET` | `/api/experiments` | public | Pre-built example computations |
| `POST` | `/api/solve` | bearer | Run a computation through the 7-Step Wizard |
| `POST` | `/api/solve/strict` | bearer | Strict-mode solve (≤0.1% error gate enforced) |

---

## `GET /api/constants` — response

```json
{
  "ok": true,
  "constants": {
    "HULYAPULSE_HZ": 1.287,
    "ZEQOND_SEC":    0.7770800311,
    "ALPHA":         0.00129,
    "PHI_C":         42,
    "C":             299792458,
    "HBAR":          1.054571817e-34,
    "G":             6.67430e-11,
    "K_B":           1.380649e-23
  }
}
```

---

## `GET /api/equations` — response (truncated)

```json
{
  "ok": true,
  "equations": [
    {
      "id": "KO42.1",
      "name": "ZEQ42 Metric Tensioner (Automatic)",
      "form": "ds² = g_{μν} dx^μ dx^ν + α sin(2π · 1.287 t) dt²"
    },
    {
      "id": "R_t",
      "name": "Universal Proper-Time Modulation",
      "form": "R(t) = S(t) [1 + α sin(2π f t + φ₀)]"
    },
    {
      "id": "HULYAS_master",
      "name": "HULYAS Master Equation",
      "form": "□ϕ − μ²(r)ϕ − λϕ³ − e^{-ϕ/ϕ_c} + ϕ₄₂ ∑_{k=1}^{42} C_k(ϕ) = T^μ_μ + β F_{μν} F^{μν} + J_ext"
    }
  ]
}
```

---

## `POST /api/solve` — request

```json
{
  "domain": "physics",
  "operators": ["KO42", "QM1"],
  "inputs": { "x": 1.0 },
  "publish": false
}
```

This is the same wizard call as `/api/zeq/compute` but exposed under the framework namespace for symmetry with the other framework endpoints. Same response shape, same publish semantics, same daily quota.

`POST /api/solve/strict` rejects with `PRECISION_NOT_MET` if the wizard's `precisionActual` exceeds `0.001` (0.1%). Use this when you cannot tolerate a degraded result.

---

## ZeqState publish behavior

- `/api/solve` and `/api/solve/strict` follow the **same** publish rules as `/api/zeq/compute`: free / starter publish by default, paid tiers require `publish: true`.
- All other framework endpoints are read-only and never publish.

---

## Examples

### curl

```bash
curl https://www.zeq.dev/api/constants | jq '.constants.HULYAPULSE_HZ'
curl https://www.zeq.dev/api/equations | jq '.equations | length'

curl -X POST https://www.zeq.dev/api/solve \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "operators": ["KO42","QM1"], "inputs": { "x": 1.0 } }'
```

### JavaScript

```javascript
const c = await fetch("https://www.zeq.dev/api/constants").then((r) => r.json());
console.log("HulyaPulse:", c.constants.HULYAPULSE_HZ, "Hz");
```

### Python

```python
import httpx
print(httpx.get("https://www.zeq.dev/api/constants").json()["constants"]["HULYAPULSE_HZ"])
```

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `CONSTANT_NOT_FOUND` | 404 | `/api/constants/:key` — unknown key |
| `PRECISION_NOT_MET` | 422 | `/api/solve/strict` — `precisionActual > 0.001` |
| `DAILY_LIMIT_EXCEEDED` | 429 | `/api/solve` — caller is over quota |

---

## Related

- [`/api/zeq/compute`](./compute) — equivalent compute endpoint
- [`/api/operators`](./operators) — operator registry
- [Master equation concept](../../../learn/concepts/master-equation)
