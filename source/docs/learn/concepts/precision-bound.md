---
sidebar_position: 12
---

# The Precision Bound

Every Zeq computation returns a `precisionBound` field in its ZeqState. The bound is the kernel's assertion of the maximum relative error of the result under the operator chain, tier, and KO42 mode actually used. The Zeq operating envelope is **≤ 0.1 % (1 × 10⁻³)** under nominal tier conditions; tighter bounds are available on higher tiers, looser bounds are never returned without an explicit downgrade flag.

## Definition

For a result R(t) recovered from the ZeqState and a reference value R_ref(t) computed under unbounded precision:

```
ε_rel = | R(t) − R_ref(t) | / | R_ref(t) |
precisionBound ≥ ε_rel        (asserted by kernel, bound from above)
```

`precisionBound` is the upper bound the kernel is willing to certify, not the empirical error of any specific run. Empirically the kernel typically lands an order of magnitude below the asserted bound, but verifiers must treat the asserted value as the contract.

## How the Bound Is Computed

The bound is the maximum of three contributions:

1. **Operator floor** — each base operator declares an intrinsic error floor (e.g. QM1 declares 4 × 10⁻⁵ in auto KO42 mode). The CKO inherits the maximum floor across its chain.
2. **Solver residual** — the solver tolerance Step 5 selects when compiling the CKO. On the Free tier the residual is set so that the combined bound lands at exactly 1 × 10⁻³; on higher tiers the residual is tightened.
3. **KO42 modulation residual** — the second-order term in R(t) recovery. With α = 1.29 × 10⁻³ this contributes ≈ 1.7 × 10⁻⁶ in auto mode and is normally negligible. In manual mode (KO42.2) the user-supplied β can dominate; the kernel re-derives the contribution and folds it into the bound.

```
precisionBound = max( ε_operator_floor,
                      ε_solver_residual,
                      ε_ko42_residual )
```

## Tier-Dependent Bounds

| Tier      | Nominal `precisionBound` | Notes                                              |
|-----------|--------------------------|----------------------------------------------------|
| Free      | 1 × 10⁻³                 | Default. Hard ceiling for the public API.          |
| Starter   | 5 × 10⁻⁴                 | Same operators, tighter solver residual.           |
| Builder   | 1 × 10⁻⁴                 | Solver tightened; some long-tail operators unlock. |
| Advanced  | 1 × 10⁻⁵                 | Manual KO42 mode permitted.                        |
| Architect | 1 × 10⁻⁶                 | Custom β; full operator catalog.                   |

The tier ceiling is enforced at Step 5. A request asking for a tighter bound than the tier permits is rejected, not silently clamped — silent clamping would corrupt downstream verifiers that trust the returned `precisionBound`.

## Verifier Contract

Verifiers consuming a ZeqState **must** refuse a result whose `precisionBound` is missing, larger than the verifier's own tolerance, or smaller than the operator chain's published floor. The third check is the one that catches forged envelopes that claim impossible precision: the operator floor table is public, so any verifier can independently lower-bound the legal `precisionBound` for a given chain.

## Why a Hard ≤ 0.1 % Ceiling

The 0.1 % envelope is the tightest bound at which all 42 base operators can co-exist in a single CKO without the solver residual exceeding the operator floor of the loosest contributor. Tightening below 1 × 10⁻³ on the public tier would force the kernel to reject roughly a third of the operator catalog; loosening above it would put Zeq results outside the tolerance band that regulated industries (pharma, aerospace, finance) require for audit-trail acceptance. The ceiling is therefore both a mathematical and a market constraint.

## Cross-References

- **[CKO](./cko.md)** — the compiled object the bound attaches to.
- **[ZeqState](./zeqstate.md)** — where the bound is recorded and sealed.
- **[Degradation Model](./degradation-model.md)** — full tier table including rate limits and operator access.
- **[Seven-Step Protocol](./seven-step-protocol.md)** — Step 4 (precision tuning) and Step 5 (compile).
