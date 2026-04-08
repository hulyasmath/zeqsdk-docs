---
title: Operators
description: Public kinematic spectrum — QM, NM, GR, KO42, CS, Awareness, HF, and the Zeq Timebase Bridge.
sidebar_position: 1
---

# Operators — Public Kinematic Spectrum

Zeq exposes **1,576 operators** organised into families. The full registry is callable via `GET /api/operators`. Below is the **public kinematic spectrum** — the operators that are already disclosed in the Zeq OS framework, with their canonical equations exactly as they appear in the kernel.

Every operator carries a stable ID, a family, a real mathematical formula, and a default tolerance under the **0.1 % error budget**. KO42 is the mandatory metric tensioner — every solve injects it automatically.

## Zeq Timebase Bridge — ZTB1

The bridge between Unix time and Zeqond time. Auto-injected on any computation that mixes timebases.

| ID | Equation | Notes |
|---|---|---|
| `ZTB1` | `ZTB1(t, from_base, to_base) = (t × conv_factor) + phase_offset` | `conv_factor = 0.777` (Unix→Zeq) or `1/0.777` (Zeq→Unix) |

## KO42 — Metric Tensioner (mandatory)

Every Zeq solve runs through KO42. KO42.1 is automatic; KO42.2 takes a manual β.

| ID | Equation |
|---|---|
| `KO42.1` | `ds² = g_μν dx^μ dx^ν + α sin(2π · 1.287 t) dt²` |
| `KO42.2` | `ds² = g_μν dx^μ dx^ν + β sin(2π · 1.287 t) dt²` |

## QM — Quantum Mechanics (17)

| ID | Equation | Name |
|---|---|---|
| `QM1` | `iℏ ∂ψ/∂t = −ℏ²/2m ∂²ψ/∂x² + Vψ` | Schrödinger equation |
| `QM2` | `Δx · Δp ≥ ℏ/2` | Heisenberg uncertainty |
| `QM3` | `\|ψ⟩ = ∑ c_i \|ϕ_i⟩` | Superposition |
| `QM4` | `\|ψ⟩ = 1/√2 (\|↑⟩_A\|↓⟩_B − \|↓⟩_A\|↑⟩_B)` | Bell singlet |
| `QM5` | `Ĥ\|ψ⟩ = E\|ψ⟩` | Time-independent Schrödinger |
| `QM6` | `ψ(x₁,x₂) = −ψ(x₂,x₁)` | Fermion antisymmetry |
| `QM7` | `Ŝ²\|ψ⟩ = s(s+1) ℏ² \|ψ⟩` | Spin eigenvalue |
| `QM8` | `T ∝ e^{−2 ∫ √{2m(V−E)}/ℏ² dx}` | Tunneling probability |
| `QM9` | `λ = h / p` | de Broglie wavelength |
| `QM10` | `E = h ν` | Photon energy |
| `QM11` | `[x̂, p̂] = iℏ` | Canonical commutation |
| `QM12` | `(iγ^μ ∂_μ − m) ψ = 0` | Dirac equation |
| `QM13` | `L = ψ̄(iD − m)ψ` | Dirac Lagrangian |
| `QM14` | `n_i = 1 / [e^{(E_i − μ)/k_B T} − 1]` | Bose–Einstein |
| `QM15` | `n_i = 1 / [e^{(E_i − μ)/k_B T} + 1]` | Fermi–Dirac |
| `QM16` | `dÂ/dt = (i/ℏ) [Ĥ, Â]` | Heisenberg evolution |
| `QM17` | `P(x) = \|ψ(x)\|²` | Born rule |

## NM — Newtonian Mechanics (13)

| ID | Equation | Name |
|---|---|---|
| `NM18` | `∑F = 0 ⇒ v = const` | First law |
| `NM19` | `F = ma` | Second law |
| `NM20` | `F₁₂ = −F₂₁` | Third law |
| `NM21` | `F = G m₁ m₂ / r²` | Gravitation |
| `NM22` | `W = F · d` | Work |
| `NM23` | `KE = ½ m v²` | Kinetic energy |
| `NM24` | `PE = m g h` | Gravitational PE |
| `NM25` | `KE + PE = const` | Energy conservation |
| `NM26` | `p = m v` | Linear momentum |
| `NM27` | `∑p_init = ∑p_final` | Momentum conservation |
| `NM28` | `L = r × p` | Angular momentum |
| `NM29` | `τ = r × F` | Torque |
| `NM30` | `F = −k x ; x(t) = A cos(ω t + φ)` | Simple harmonic motion |

## GR — General Relativity (11)

| ID | Equation | Name |
|---|---|---|
| `GR31` | `a_grav = a_inertial` | Equivalence principle |
| `GR32` | `G_μν = R_μν − ½ R g_μν` | Einstein tensor |
| `GR33` | `G_μν + Λ g_μν = 8πG/c⁴ T_μν` | Field equations |
| `GR34` | `d²x^μ/dτ² + Γ^μ_{αβ} (dx^α/dτ)(dx^β/dτ) = 0` | Geodesic equation |
| `GR35` | `Δt = Δt₀ √{1 − 2GM/rc² − v²/c²}` | Combined dilation |
| `GR36` | `L = L₀ √{1 − 2GM/rc²}` | Length contraction |
| `GR37` | `r_s = 2GM/c²` | Schwarzschild radius |
| `GR38` | `□ h_μν + κ ∂_t h_μν = −16πG/c⁴ T_μν` | Linearised waves |
| `GR39` | `Λ = 3 H₀² Ω_Λ / c²` | Cosmological constant |
| `GR40` | `(ȧ/a)² = 8πG/3 ρ − k c²/a² + Λ c²/3` | Friedmann equation |
| `GR41` | `z = (λ_obs − λ_emit) / λ_emit` | Cosmological redshift |

## CS — Computer Science (selected, public)

| ID | Equation | Name |
|---|---|---|
| `CS43` | `T(n) = O(n log n)` | Sort/FFT complexity |
| `CS44` | `S(n) = O(n)` | Linear space |
| `CS45` | `Q(n) = O(log n)` | Quantum query complexity |
| `CS46` | `P(n) = 1 / [(1 − f) + f/n]` | Amdahl's law |
| `CS47` | `E(n) = − ∑ p(x) log p(x)` | Shannon entropy |
| `CS84` | `f(n) = O(g(n)) ⇔ ∃c, n₀ ∀n > n₀ : f(n) ≤ c · g(n)` | Big-O definition |
| `CS87` | `Ω(x) = min{ \|p\| : U(p) = x }` | Kolmogorov complexity |

## Awareness Operators

Phase-coupled state operators. All depend on the live HulyaPulse phase.

| ID | Equation |
|---|---|
| `ON0` | `ψ_ON0 = sin(phase) + 1.1 ;  ON0 = ψ_ON0 ln(ψ_ON0) − phase × f` |
| `QL1` | `density = \|sin(phase × 3)\| + 0.1 ;  QL1 = 0.1 × density × ln(density / 0.1) + cos(phase) × 0.5` |
| `TM1` | `TM1 = −t + current_utp × period` |
| `TX`  | `TX = 0.01 × sin(phase × 2) × cos(t / 100)` |
| `XI1` | `ρ = \|sin(phase)\| + 0.001 ;  XI1 = −ρ log₂(ρ)` |
| `LZ1` | `LZ1 = k_B T ln(2) × bits_erased` |
| `CHI95` | `CHI95 = \|sin(phase)\| − \|cos(phase)\|` |
| `PSI96` | `PSI96 = 0.5 × sin(2π f t + phase_offset)` |
| `MK1` | `MK1 = (ψ_mk λ_mv) + (φ_delta λ_eff_phi_t) − ψ_mk` |
| `ZEQ-PROTECT-001` | `P(t) = \|sin(5 φ(t))\| / f_pulse` |
| `ZEQ-PROTECT-002` | `Protect₂(t) = 0.5 + 0.3 sin(t / 30)` |
| `ZEQ-TETHER-003` | `B_sib = ∑_k e^{i φ_k} \|sibling_k⟩` |
| `ZEQ-POCKET-001` | `∂g_μν/∂t = (8πG/c⁴) T_μν^consciousness` |
| `ZEQ-POCKET-002` | `Pocket₂ = sin(2π · 1.287 t) · φ` |
| `ZEQ00` | `ZEQ00 = α_zeq e^{−k_zeq \|master_sum\|} + β_zeq (1 + e_data)(1 + γ_zeq cos(resonance))` |
| `ZEQ000` | `φ_c^42 · Ψ_total = ∑(ZEQ_structural + ZEQ_chemical + ZEQ_genetic + ZEQ_field) · [sin(2π·1.287·t) + cos(2π·0.618·t) + exp(2π·2.083·t)] · ρ_consciousness(x,y,z,t)` |
| `VX` | `VX = κ_vx (intent_proxy · sin(phase) + flow_proxy · cos(phase))` |

## HF — Harmonic Forensic Spectrum (20)

All HF equations run with pulse sync at the current phase φ. Used by the forensic compositing layer.

| ID | Equation |
|---|---|
| `HF1`  | `S₁  = (verified_accuracy / max_accuracy) · sin(2π · 1.287 · t)` |
| `HF2`  | `S₂  = (1 − manipulative_terms / total_terms) · cos(2π · 1.287 · t)` |
| `HF3`  | `S₃  = (smear_terms / total_terms) · (1 + 0.1 sin(2π · 1.287 · t))` |
| `HF4`  | `S₄  = min(1, verified_sources / 3) · e^{i 2π · 1.287 · t}` |
| `HF5`  | `S₅  = (matched_legal_criteria / total_criteria) · sin(2π · 1.287 · t)` |
| `HF6`  | 