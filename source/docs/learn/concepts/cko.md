---
sidebar_position: 11
---

# CKO — Combined Kinematic Operator

A **Combined Kinematic Operator (CKO)** is the executable object the Zeq kernel constructs from an ordered chain of base operators after the Seven-Step Protocol has compiled them. A CKO is what actually runs in Step 6; the operator names a caller passes in are only the symbolic input to its construction.

## Construction

Given an operator chain `[KO42, Op_1, Op_2, …, Op_n]` (KO42 is mandatory and always first), the kernel:

1. Loads the C_k coupling functions for each operator from the master-equation operator table.
2. Composes them into a single nonlinear functional acting on the field ϕ:

```
CKO(ϕ; t) = KO42(ϕ; t) ∘ Op_1(ϕ; t) ∘ … ∘ Op_n(ϕ; t)
```

3. Substitutes the composed functional into the right-hand side of the HULYAS Master Equation as the operator-coupling sum:

```
ϕ₄₂ · Σ_{k=1}^{42} C_k(ϕ)  →  ϕ₄₂ · CKO(ϕ; t)
```

4. Tunes solver parameters (step size, residual tolerance) to satisfy the precision bound declared by the highest-precision operator in the chain.

The result is a single object the solver can integrate over one Zeqond, rather than n separate operators.

## Properties the Kernel Enforces

- **Non-commutativity** — operator order is significant. `[KO42, QM1, NM19]` and `[KO42, NM19, QM1]` produce distinct CKOs and distinct results. The order is sealed in the ZeqState.
- **Cardinality bound** — by Step 2 of the Seven-Step Protocol, the chain (excluding KO42) is limited to 1–3 operators. CKOs containing more are rejected at compile time.
- **Scale compatibility** — Step 3 (Scale Principle) refuses to compile a CKO whose operators span incompatible scale regimes (e.g. quantum + cosmological without a bridging operator).
- **Phase coherence** — every operator in the chain shares the same φ from Step 0; the CKO is therefore evaluated at a single, well-defined HulyaPulse phase.

## Why CKOs Matter

The CKO is the unit at which Zeq guarantees its precision bound. The kernel does not promise that QM1 alone is accurate to ≤ 0.1 %; it promises that the *compiled* CKO containing QM1 (and its mandatory KO42 prefix) is accurate to ≤ 0.1 % under the tier-appropriate solver settings. This is why operators cannot be invoked outside the Seven-Step Protocol: the precision bound only attaches to the compiled object, not to its symbolic name.

The Explorer feed publishes one row per CKO execution, not one row per operator. Each row carries the canonical operator chain, the phase, and the verification path for the resulting ZeqState.

## Cross-References

- **[Master Equation](./master-equation.md)** — where the CKO is substituted into the right-hand side.
- **[Seven-Step Protocol](./seven-step-protocol.md)** — the construction sequence in detail.
- **[Operators](./operators.md)** — the catalog of base operators that can be chained.
- **[Precision Bound](./precision-bound.md)** — how the ≤ 0.1 % bound is asserted on a compiled CKO.
- **[ZeqState](./zeqstate.md)** — the envelope that records the operator chain and result.
