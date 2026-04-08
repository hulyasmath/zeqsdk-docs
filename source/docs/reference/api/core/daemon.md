---
id: daemon
title: HulyaPulse Daemon
sidebar_label: Daemon
description: The 1.287 Hz pulse, zeqond ticks, and the 7-step wizard protocol that every API call obeys.
---

# HulyaPulse Daemon

Every endpoint in the Zeq API is sequenced by a single global clock — the **HulyaPulse**, running at exactly **f = 1.287 Hz**. One tick of the pulse is one **zeqond**: `T_Z = 0.777 s`.

```
zeqond_tick = floor(unix_time / 0.777)
phase       = (unix_time mod 0.777) / 0.777     // ∈ [0, 1)
```

The daemon does three things:

1. Stamps every request with the current `zeqondTick` and `phase` so events from different nodes can be ordered without negotiation.
2. Enforces the **KO42 ground state** on every CKO — no computation may leave the kernel without `KO42` in its operator chain.
3. Runs the **7-step wizard protocol** as a precondition gate.

---

## The 7-step wizard protocol

Verbatim, applied to every `/api/zeq/compute`, `/api/zeq/lattice`, `/api/zeq/shift`, and `/api/genesis/execute` call:

1. **Prime directive: KO42 is mandatory.** Every chain begins with KO42.
2. **Operator limit: 1–3 additional operators + KO42** (total ≤ 4 unless `allowVxFallback`).
3. **Scale principle: match operators to domain.** QM* for quantum, NM* for newtonian, GR* for relativistic, etc.
4. **Precision imperative: tune to ≤0.1% error.** The CKO carries `precisionBound`.
5. **Compile via the Master Equation** (HULYAS).
6. **Execute via the Functional Equation** `E = P_ϕ · Z(M, R, δ, C, X)`.
7. **Verify & troubleshoot.** Output a `ZeqProof` HMAC over `(operators, masterSum, zeqond, keyPrefix)`.

If any step fails, the request returns `412 PRECONDITION_FAILED` and **no row is published** to ZeqState.

---

## GET /api/zeq/pulse

Public liveness probe. Returns the current zeqond, phase, and HulyaPulse hertz so clients can phase-align without their own clock.

See [Pulse reference](./pulse) for the full schema and SSE streaming variant.

---

## CKO envelope

Every successful compute returns a Canonical Kernel Output:

```json
{
  "operators": ["KO42", "QM1", "GR32"],
  "masterSum": -3.14159265,
  "R_t": 1.00128762,
  "phase": 0.4127,
  "zeqond": 65392856,
  "precisionBound": 0.000181,
  "zeqProof": {
    "alg": "HMAC-SHA256",
    "value": "a1b2c3...",
    "keyPrefix": "zeq_ak_..."
  }
}
```

The R(t) value is the universal proper-time modulation:

```
R(t) = S(t) [1 + α sin(2π · 1.287 · t + φ₀)],   α ≈ 1.29 × 10⁻³
```

Averaging R(t) over one zeqond recovers S(t) exactly — that's the precision guarantee the daemon enforces.

## Related

- [Pulse endpoint](./pulse)
- [Compute endpoint](./compute)
- [Verify endpoint](./verify)
- [Operators catalog](./operators)
