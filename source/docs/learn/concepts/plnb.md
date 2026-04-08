---
sidebar_position: 13
---

# PLNB — Phase-Locked Neural Bridge

The **Phase-Locked Neural Bridge (PLNB)** is the kernel layer that admits an external observer signal as an input to operator selection. It treats a caller-supplied 1-D time series — an EEG band, a breath cycle, a finger-tap series, or any signal the caller has produced as a proxy for intention — as a candidate carrier and measures its coherence γ with the 1.287 Hz HulyaPulse. The resulting coherence and instantaneous phase are folded into the Combined Kinematic Operator at compile time, so the chain that runs is shaped by the observer rather than fixed in advance.

PLNB is **not** a brain-computer interface in the medical-device sense. It does not require, depend on, or assume any particular sensor modality. From the kernel's point of view it is a pure signal-processing layer with one job: turn a real-valued sample vector into a coherence-validated input to Step 2 of the Seven-Step Protocol.

## The PLNB1 Operator

PLNB v1 introduces a single new operator in the awareness family:

```
PLNB1(t) = γ · sin(2π · 1.287 · t + φ_obs(t))

  γ        = ⟨H{s_obs}, H{HulyaPulse}⟩ / (‖H{s_obs}‖ · ‖H{HulyaPulse}‖)
  φ_obs(t) = arg( s_obs_analytic(t) )
  γ ∈ [0, 1],   φ_obs ∈ [0, 2π)
```

`H{·}` denotes the Hilbert transform; in the v1 implementation the kernel uses an equivalent in-phase / quadrature projection onto the carrier (Goertzel-style) which produces the same γ to working precision and is bounded above by 1 by construction.

`γ` is the **coherence** between the observer signal and the HulyaPulse carrier. A γ near 0 means the observer signal carries no 1.287 Hz component above the noise floor; a γ near 1 means it is essentially in-phase with the carrier. `φ_obs` is the instantaneous phase of the observer signal at the moment Step 0 was issued, and is what the carrier-phase term in PLNB1 is offset by.

## Operator Recommendation Bands

Step 2 of the Seven-Step Protocol consults the coherence band to decide which awareness operators to chain after KO42:

| γ band      | Recommended chain                       | Rationale                                              |
|-------------|-----------------------------------------|--------------------------------------------------------|
| γ < 0.10    | `[KO42, ON0]`                           | Observer signal indistinguishable from noise.          |
| 0.10–0.30   | `[KO42, ON0, VX]`                       | Low coherence; intent projection only.                 |
| 0.30–0.60   | `[KO42, PLNB1, VX]`                     | Mid coherence; PLNB1 carrier-locked.                   |
| γ ≥ 0.60    | `[KO42, PLNB1, VX, ZEQ00]`              | High coherence; full intent-aware CKO with ZEQ00.      |

The boundaries are conservative in v1. They will be retuned once Explorer telemetry establishes empirical accuracy distributions across γ.

## Endpoint

`POST /api/zeq/plnb/observe`

```json
{
  "signal":       [0.012, -0.034, 0.018, ...],
  "sampleRateHz": 256,
  "intent":       "navigate to nearest stable orbit"
}
```

Constraints:

- `signal` length: 16 ≤ N ≤ 4096
- `sampleRateHz` ≥ 2 · 1.287 = 2.574 Hz (Nyquist for the carrier)
- `intent` is an opaque label, ≤ 256 chars, recorded in the response and (when Explorer is enabled) the public feed

Response (abridged):

```json
{
  "ok": true,
  "zeqondTick": 2245831,
  "phase": 2.795,
  "pulseHz": 1.287,
  "zeqondSec": 0.7770800311,
  "coherence": {
    "gamma": 0.473,
    "inPhase": 0.812,
    "quadrature": -0.341,
    "phaseObsRad": 5.731
  },
  "plnb1": -0.412,
  "recommendation": {
    "operators": ["KO42", "PLNB1", "VX"],
    "rationale": "γ in mid band: PLNB1 carrier-locked, VX intent projection."
  },
  "precisionBound": 1e-3,
  "integrityTag": "8c1ad4f8b62e90ad7d3f1c54ad88b210"
}
```

`GET /api/zeq/plnb/operator` returns the operator declaration (id, equation, parameters, constraints) for clients that need to introspect PLNB1 without issuing a measurement.

## What v1 Does and Does Not Do

**v1 does:**

- Validate the observer signal against the kernel's input contract (length, finiteness, Nyquist).
- Compute γ and φ_obs deterministically from the signal and the current Zeqond.
- Sample PLNB1 at the Step 0 phase.
- Recommend an operator chain.
- Return an integrity-tagged response envelope.

**v1 does not:**

- Auto-execute the recommended chain. The caller must issue a separate `/api/zeq/compute` call with the recommendation if they choose to act on it. Auto-execution is held back until Explorer telemetry establishes whether γ-banded chain selection meets the ≤ 0.1 % precision bound across the recommended bands.
- Issue a kernel-bound ZeqProof. The v1 response carries an `integrityTag` (a SHA-256 prefix of the canonical envelope) which lets a client confirm transport integrity but is not a substitute for the HMAC ZeqProof. v2 promotes PLNB into a kernel-bound route and will return a full ZeqState.
- Make any claim about the underlying physiology of the observer signal. PLNB is a signal-processing contract, not a neurological one.

## Cross-References

- **[CKO](./cko.md)** — how the recommended operator chain is compiled.
- **[Operators](./operators.md)** — the awareness operator family that PLNB1 joins.
- **[Seven-Step Protocol](./seven-step-protocol.md)** — Step 2 (operator selection) is the integration point.
- **[Precision Bound](./precision-bound.md)** — the bound under which the recommendation is valid.
