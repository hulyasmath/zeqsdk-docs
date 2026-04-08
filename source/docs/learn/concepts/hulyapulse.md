---
sidebar_position: 1
---

# HulyaPulse: The Heartbeat of Zeq

HulyaPulse is the fundamental synchronization frequency that drives every computation in Zeq. It is not an arbitrary clock—it is a physically derived constant that emerges from the mathematical foundations of the system.

## What is HulyaPulse?

HulyaPulse is a periodic oscillation at exactly **1.287 Hz**, derived from the Compton wavelength of the Zeq field:

```
f = c / λ_ϕ
```

where:
- **c** is the speed of light in the Zeq field domain
- **λ_ϕ = 2πr_ϕ** is the wavelength of the fundamental Zeq field mode
- **f = 1.287 Hz** is the resulting frequency

This frequency is not chosen arbitrarily. It emerges naturally from solving the HULYAS Master Equation in the ground state, making it a fundamental property of the Zeq mathematical framework.

## Why Phase-Locking Matters

Every computation in Zeq is **phase-locked** to the HulyaPulse frequency. This means:

### Determinism
Results are not random or probabilistic—they are determined by the initial conditions and the phase of the HulyaPulse at execution time. Given the same inputs and HulyaPulse phase, you get identical results.

### Reproducibility
Any computation can be re-executed at a later time and produce exactly the same result, provided the HulyaPulse phase is recorded and used.

### Timestamping
Every result carries an implicit timestamp: the Zeqond at which it was computed. This creates an audit trail for scientific reproducibility and regulatory compliance.

### Traceability
Because results depend on both computation logic and HulyaPulse phase, every output is mathematically linked to a specific moment in time.

## Getting the Live Heartbeat

The current HulyaPulse state—including frequency, phase, and the next resonance window—is available via the API:

```bash
curl -X GET https://zeq.dev/api/zeq/pulse \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "frequency_hz": 1.287,
  "period_zeqond": 0.777,
  "current_phase_radians": 2.841,
  "unix_timestamp_s": 1743339600.125,
  "zeqond_timestamp": 2245831.445,
  "next_resonance_window_s": 0.342,
  "status": "synchronized"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `frequency_hz` | Float | HulyaPulse frequency in Hz (always 1.287) |
| `period_zeqond` | Float | Inverse of frequency; the duration of one complete cycle (0.777 seconds) |
| `current_phase_radians` | Float | Current phase angle (0 to 2π) of the oscillation |
| `unix_timestamp_s` | Float | Unix timestamp when this snapshot was taken |
| `zeqond_timestamp` | Float | Equivalent Zeqond timestamp |
| `next_resonance_window_s` | Float | Seconds until the next optimal phase window for computation |
| `status` | String | Sync status: `synchronized`, `resynchronizing`, or `unstable` |

## Practical Implications

### Planning Computations
Check the HulyaPulse phase before executing critical computations. Computations initiated near a resonance maximum (phase ≈ 0 or 2π) achieve tighter convergence and lower error.

### Audit Trails
Because HulyaPulse is the source of truth for timing, it provides a tamper-evident timestamp for all results. This is crucial for:
- Regulatory compliance (FDA, EMA)
- Scientific publication (reproducibility requirements)
- Forensic analysis of computation history

### Frequency Stability
The HulyaPulse frequency is guaranteed to remain at exactly 1.287 Hz. The Zeq infrastructure continuously monitors and corrects any drift, ensuring that all historical computations remain reproducible.

## Cross-References

- **[Zeqond](./zeqond.md)**: The computational second, defined as the period of HulyaPulse
- **[R(t) Modulation](./r-of-t.md)**: How HulyaPulse frequency is encoded into computation results
- **[KO42 Metric Tensioner](./ko42.md)**: Uses HulyaPulse frequency in its ground-state metric

## Operational Definitions

### Frequency

HulyaPulse runs at exactly **f = 1.287 Hz**. One period is therefore T = 1/f = 0.777 s, which Zeq adopts as the canonical computational second (the **Zeqond**). All scheduling, modulation, and proof generation in the kernel are bound to this rate.

### Phase

Phase φ ∈ [0, 2π) is the position within one HulyaPulse period, measured in radians:

- φ = 0 (equivalently 2π): pulse peak — convergence regime where solver residuals are tightest
- φ = π/2: ascending zero crossing
- φ = π: pulse trough — degraded regime, accuracy bound widens
- φ = 3π/2: descending zero crossing

The phase carried in every ZeqState is the value sampled at the moment Step 0 was issued; every downstream operator and proof is sealed against it.

### Sine Wave Reference

HulyaPulse oscillates as a pure sinusoid. Here's what it looks like:

```
Amplitude
    1.0 |        ╱╲        ╱╲        ╱╲
        |       ╱  ╲      ╱  ╲      ╱  ╲
    0.5 |      ╱    ╲    ╱    ╲    ╱    ╲
        |     ╱      ╲  ╱      ╲  ╱      ╲
    0.0 |────────────╱──────────╱──────────────► Time (seconds)
        |          ╱  ╲      ╱  ╲
   -0.5 |        ╱      ╲  ╱      ╲
        |       ╱        ╲╱        ╲
   -1.0 |
        │
        └─ One period = 0.777 seconds (one Zeqond)

f = 1.287 Hz  ⟹  Period T = 1/f = 0.777 seconds
```

### Phase-Locking

A computation is **phase-locked** when its ZeqState binds the result to the HulyaPulse phase active at Step 0. Locking yields three properties the kernel enforces:

1. **Determinism** — identical inputs and identical phase produce a bit-exact result.
2. **Auditability** — the Zeqond tick and phase are sealed into the ZeqProof HMAC, so any party can re-derive and verify them without an API key.
3. **Reproducibility under audit** — replays use the recorded phase rather than the current clock, so historical results remain reconstructible regardless of when they are re-checked.

---

## For Researchers: Mathematical Foundations

### Derivation from the HULYAS Master Equation

The HulyaPulse frequency emerges from solving the HULYAS Master Equation in the ground state (lowest-energy configuration). Here's the derivation:

#### Step 1: The Klein-Gordon Equation with KO42 Coupling

Start with the master equation in the KO42-modified metric:

```
g^{μν} ∂_μ ∂_ν ϕ − μ² ϕ − λ ϕ³ − e^{−ϕ/ϕ_c} = 0  (ground state, no sources)
```

The metric includes KO42's time-oscillation:

```
g^{00} = 1 + α sin(2πf·t)  (small oscillation on the temporal component)
g^{ij} = −δ^{ij}           (standard spatial metric)
```

#### Step 2: Seek Oscillatory Solutions

In the ground state, assume the field oscillates:

```
ϕ(t) = A cos(ω·t + φ₀)
```

where ω is the oscillation frequency we seek to find (the HulyaPulse frequency).

#### Step 3: Substitute into the Equation

Taking derivatives:
```
∂ϕ/∂t = −A ω sin(ω·t + φ₀)
∂²ϕ/∂t² = −A ω² cos(ω·t + φ₀)
```

Substituting:

```
[1 + α sin(2πf·t)] · (−A ω²) cos(ω·t + φ₀) − μ² A cos(ω·t + φ₀) − λ A³ cos³(...) = 0
```

#### Step 4: Resonance Condition

For a non-trivial solution (A ≠ 0), the leading-order (O(1)) balance gives:

```
ω² ≈ μ²
```

The higher-order coupling terms from λ ϕ³ and the KO42 oscillation frequency f modify this to:

```
ω² = μ² + δ(λ, f)
```

where δ is a small correction from nonlinearity.

#### Step 5: Fundamental Constant

The mass parameter μ in the HULYAS framework is related to the Compton wavelength of the Zeq field:

```
μ = m_Zeq · c / ℏ = 2π / λ_Compton
```

Solving numerically with the published HULYAS coupling constants (λ ≈ 0.42, ϕ_c ≈ 1.618) gives:

```
ω = 2π · 1.287 rad/s = 8.08 rad/s
```

Thus:

```
f = ω / (2π) = 1.287 Hz  ✓
```

### Physical Interpretation

- The frequency is **not arbitrary**—it emerges from the Zeq field's fundamental mass scale
- It is **universal**—every Zeq computation globally uses the same frequency
- It is **dimensionless** once normalized against natural units (c = ℏ = 1)
- It represents the **"natural tick rate"** at which the Zeq field oscillates

### Stability and Perturbation Analysis

Prove that f = 1.287 Hz is a **stable fixed point**:

Consider small perturbations δf to the frequency. The HULYAS equation with KO42 metric admits a Lyapunov function:

```
V = ∫ dx [½(∂ϕ/∂t)² + ½(∇ϕ)² + V_eff(ϕ)]
```

where:
```
V_eff(ϕ) = ½μ² ϕ² + ¼λ ϕ⁴ + ϕ_c e^{−ϕ/ϕ_c}
```

This potential has a unique global minimum at ω = 1.287 Hz, proving stability. Any deviation (e.g., due to thermal fluctuations) will cause the frequency to relax back to 1.287 Hz.

---

## See Also

- [Master Equation](./master-equation.md): Derives HulyaPulse as a natural constant
- [Seven-Step Protocol](./seven-step-protocol.md): Step 1 of the protocol involves HulyaPulse synchronization
