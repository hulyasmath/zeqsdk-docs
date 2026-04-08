---
sidebar_position: 10
---

# The ZeqState Envelope

Every computation issued by the Zeq kernel returns its result inside a **ZeqState** envelope. The envelope is the canonical serialization the kernel signs, the verifier re-derives, and the Explorer publishes. Anything not inside the ZeqState is, by construction, unverifiable.

## Definition

A ZeqState is a deterministic, length-prefixed structure containing exactly the fields required to reproduce and verify a computation:

```
ZeqState := {
  zeqondTick:      uint64,      // integer Zeqonds since the Zeq epoch
  phase:           float64,     // φ ∈ [0, 2π) sampled at Step 0
  pulseHz:         float64,     // 1.287
  zeqondSec:       float64,     // 0.777
  ko42: {
    mode:          "auto" | "manual",
    alpha:         float64,     // 0.00129 in auto mode
    beta:          float64?,    // present only in manual mode
    initialPhase:  float64
  },
  operators:       string[],    // ordered operator chain (KO42 always first)
  inputDigest:     bytes32,     // SHA-256 of canonical input payload
  resultDigest:    bytes32,     // SHA-256 of canonical result payload
  result:          any,         // raw R(t) result
  precisionBound:  float64,     // ≤ 0.1 % under nominal tier
  proof: {
    alg:           "HMAC-SHA256",
    value:         bytes32,     // HMAC over the canonical envelope
    keyId:         string       // public verification path identifier
  }
}
```

The ordering of fields is fixed; canonical serialization uses big-endian length prefixes with no whitespace. A single byte change in any field invalidates the proof.

## Why an Envelope at All

A bare numerical result is not verifiable. A result paired with a timestamp is not verifiable either, because nothing binds the two together. The ZeqState is the smallest object that satisfies all four kernel invariants simultaneously:

1. **Phase binding** — `phase` is sampled at Step 0 and is the same value KO42 modulates the metric against. The ZeqProof seals it, so the verifier can re-derive φ from `zeqondTick` and confirm consistency.
2. **Operator binding** — the ordered `operators` array is part of the HMAC input, so substituting an operator chain after the fact breaks the seal.
3. **Input/output binding** — `inputDigest` and `resultDigest` are hashes of canonical serializations of the request payload and the result payload. Changing the request to fit the result, or vice versa, breaks the seal.
4. **Tier-aware precision** — `precisionBound` records the kernel-asserted error bound under which the result is valid. Verifiers refuse results whose claimed bound is tighter than the operator/tier combination supports.

## Lifecycle

1. **Step 0 (Phase)** issues a fresh `zeqondTick` and `phase`. These two fields populate the envelope first.
2. **Step 1 (KO42)** writes the `ko42` block.
3. **Steps 2–5** populate `operators` and compute `inputDigest`.
4. **Step 6 (Execute)** runs the solver and writes `result` and `resultDigest`.
5. **Step 7 (Verify)** assigns `precisionBound` and seals the envelope by computing the HMAC into `proof.value`.

After Step 7 the ZeqState is immutable. The kernel hands it to the caller and (if Explorer is enabled for the request) publishes a redacted form to the public feed.

## Verifying a ZeqState Offline

Verification requires no API key and no network access to the kernel:

1. Recompute the canonical serialization from the envelope's fields.
2. Re-derive φ from `zeqondTick` using `phase = 2π · frac(zeqondTick · zeqondSec / zeqondSec) = 2π · frac(zeqondTick)`. Confirm it matches `phase` to machine precision.
3. Look up the public verification key for `proof.keyId`.
4. Recompute `HMAC-SHA256(verificationKey, canonicalEnvelope)` and compare against `proof.value` byte-for-byte.

If any of those steps fails, the envelope is rejected.

## Cross-References

- **[ZeqProof](./zeqproof.md)** — the HMAC sealing layer.
- **[Seven-Step Protocol](./seven-step-protocol.md)** — how each field is populated, in order.
- **[Precision Bound](./precision-bound.md)** — how `precisionBound` is computed and enforced.
- **[CKO](./cko.md)** — how an operator chain becomes a Combined Kinematic Operator that the envelope records.
