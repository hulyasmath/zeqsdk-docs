---
title: "GET /api/operators"
sidebar_label: "operators"
sidebar_position: 7
description: "Browse the 1,576-operator registry. List operators, fetch a single operator with its formula and family, or list operator categories."
---

# `GET /api/operators`

Browse the **operator registry** — the 1,576 named operators across the QM, NM, GR, CS, Awareness, and Zeq family that the kernel can compose into CKO chains. Public, unauthenticated.

---

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/operators` | Full list of operators (id, name, family, scale) |
| `GET` | `/api/operators/categories` | Operator family categories |
| `GET` | `/api/operator/:id` | Single operator with formula, family, scale, description |

---

## Authentication

**None.** Public endpoint.

---

## `GET /api/operators` — response

```json
{
  "ok": true,
  "count": 1576,
  "operators": [
    {
      "id": "KO42",
      "name": "HulyaPulse Ground State",
      "family": "Core",
      "scale": "universal",
      "equation": "R(t) = S(t) × [1 + α·sin(2π·1.287·t)]"
    },
    {
      "id": "QM1",
      "name": "Schrödinger evolution",
      "family": "QuantumMechanics",
      "scale": "quantum",
      "equation": "iℏ ∂ψ/∂t = −ℏ²/2m ∂²ψ/∂x² + Vψ"
    }
  ]
}
```

---

## `GET /api/operators/categories` — response

```json
{
  "ok": true,
  "categories": [
    { "id": "Core",             "count": 1   },
    { "id": "QuantumMechanics", "count": 17  },
    { "id": "NewtonianMechanics","count": 13 },
    { "id": "GeneralRelativity","count": 11  },
    { "id": "ComputerScience",  "count": 7   },
    { "id": "Awareness",        "count": 14  },
    { "id": "Zeq",              "count": 1513 }
  ]
}
```

---

## `GET /api/operator/:id` — response

```json
{
  "ok": true,
  "id": "QM1",
  "name": "Schrödinger evolution",
  "family": "QuantumMechanics",
  "scale": "quantum",
  "equation": "iℏ ∂ψ/∂t = −ℏ²/2m ∂²ψ/∂x² + Vψ",
  "description": "Time-dependent Schrödinger equation governing the evolution of a quantum state vector under a potential V.",
  "parameters": [
    { "name": "ℏ", "description": "Reduced Planck constant" },
    { "name": "m", "description": "Particle mass" },
    { "name": "V", "description": "Potential energy operator" }
  ]
}
```

---

## ZeqState publish behavior

None of the operator endpoints publish to the ZeqState feed. They are read-only against the registry.

---

## Examples

### curl

```bash
curl https://www.zeq.dev/api/operators | jq '.count'
curl https://www.zeq.dev/api/operator/KO42
```

### JavaScript

```javascript
const ops = await fetch("https://www.zeq.dev/api/operators").then((r) => r.json());
console.log(ops.count, "operators available");
```

### Python

```python
import httpx
print(httpx.get("https://www.zeq.dev/api/operators").json()["count"])
```

---

## Related

- [`/api/zeq/compute`](./compute) — uses these operators in CKO chains
- [`/api/framework`](./framework) — constants, equations, registry, solver
- [Operators concept](../../../learn/concepts/operators)
