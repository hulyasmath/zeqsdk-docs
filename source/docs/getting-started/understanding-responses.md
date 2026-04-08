---
title: Understanding Responses
description: The ZeqState object explained field by field. What precision means, how to interpret phase, and how to verify zeqProof.
sidebar_position: 5
---

# Understanding Responses

Every computation returns three components: `result`, `zeqState`, and `zeqProof`. Let's decode what each means.

## The Complete Response Structure

```json
{
  "result": { /* computation-specific output */ },
  "zeqState": {
    "masterSum": 123.456789,
    "phase": 0.287,
    "precision": 0.000987,
    "zeqond": 45.678,
    "operators": ["operator_1", "operator_2"],
    "R_t": 1.001287,
    "fieldStrength": 0.01287,
    "modulation": 1.287
  },
  "zeqProof": "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

## result

The actual computation output. Structure depends entirely on your domain and operators.

**Example: Polynomial roots**
```json
{
  "result": [-3, 1]
}
```

**Example: Quantum eigenvalues**
```json
{
  "result": {
    "energy_levels": [0.5, 1.5, 2.5],
    "wavefunctions": [ ... ]
  }
}
```

**Example: Medical imaging**
```json
{
  "result": {
    "reconstructed_image": [[...], [...], ...],
    "voxel_size_mm": 0.5,
    "artifacts_detected": false
  }
}
```

See the [Domain Reference](#) for output schemas for each domain.

## zeqState: The Computation Metadata

This object is the "proof of authenticity" layer—it contains cryptographic and physical metadata that proves your computation happened, when it happened, and how accurate it is. Every field serves a purpose and is independently verifiable.

**Think of zeqState like...**
A passport contains metadata: issue date, expiration, security features. These don't tell you where the holder has traveled, but they prove the passport is authentic and hasn't been forged. Similarly, zeqState doesn't contain your answer (that's in `result`), but it proves your answer is authentic and comes from the real Zeq network.

### masterSum

A numerical digest of your computation's internal state—think of it as a checksum or fingerprint of all intermediate calculations performed during operator execution.

```
masterSum: 123.456789
```

**Real-world analogy:** When you mail a package, you get a tracking number that encodes information about the package's journey through the postal system. You can't decode it, but it uniquely identifies your package's path. MasterSum is similar—it encodes the mathematical "path" your computation took.

**Why it matters:** The masterSum is fed into KO42 when generating the zeqProof. Two identical computations (same domain, operators, inputs) will always produce identical masterSum values. This determinism is what makes verification possible.

**Key insight:** If someone claims they ran your exact computation and got a different result, the masterSum would be different—proving they either changed the computation or are lying. This is how zeqProof prevents tampering.

### phase

The current HulyaPulse phase at the exact moment your computation executed. Values range from 0.0 to 1.0, representing where you are in the current HulyaPulse cycle.

```
phase: 0.287
```

The HulyaPulse frequency is 1.287 Hz, so one complete cycle is approximately 0.777 seconds. A `phase: 0.287` means your computation happened 28.7% of the way through the current cycle.

**Think of it like...**
Imagine a clock that ticks 1.287 times per second. The `phase` tells you where the second hand is right now: 0.0 is at 12 o'clock, 0.5 is at 6 o'clock, and 0.999 is nearly back at 12. Different computations get different phases based on exactly when they executed.

**Why it matters:**
- **Proves synchronization** — Your computation was globally phase-locked to the HulyaPulse network. If phase ≠ 0.0-1.0, something went wrong.
- **Enables reproducibility** — Identical computations submitted at the same HulyaPulse phase will return identical results. If you run the same request again later (different phase), you get the same mathematical answer but a different zeqProof (because the phase changed).
- **Multi-call coordination** — If you submit 10 API calls within the same HulyaPulse cycle, they'll all have similar phase values. This helps you group results for analysis.

**Interpretation Guide:**
- `phase: 0.0-0.1` — Start of cycle (most stable, lowest jitter)
- `phase: 0.4-0.6` — Mid-cycle (neutral)
- `phase: 0.9-1.0` — End of cycle (about to reset to 0.0)

### precision

How close your result is to **mathematical ground truth**. Expressed as a decimal fraction where lower is better (less error).

```
precision: 0.000987
```

This means your result is within **0.0987% of the true mathematical answer**. In other words, if the true answer is 1,000, your result could be anywhere from 999 to 1,001—you're accurate to better than 1 part per thousand.

**Think of it like...**
If you measure a football field and get 100 meters with precision 0.01, your measurement could be off by ±1 meter. If your measurement has precision 0.0001, you're only off by ±1 centimeter. Lower precision number = tighter tolerance.

**Precision varies by tier and mode:**

| Tier/Mode | Typical Precision | Practical Meaning |
|-----------|-------------------|----------|
| Free Trial (normal) | 0.001 | ±0.1% error |
| Starter | 0.0008 | ±0.08% error |
| Builder | 0.0005 | ±0.05% error |
| Advanced | 0.0003 | ±0.03% error |
| Architect | 0.0001 | ±0.01% error |
| Free Trial (degraded) | 0.005 | ±0.5% error |
| `strict` mode | 0.00005 | ±0.005% error |

**When precision matters:**

- `precision ≤ 0.001` (±0.1%) — Suitable for engineering calculations, structural design, electrical systems. Most applications.
- `precision ≤ 0.0001` (±0.01%) — Suitable for physics research, aerospace, high-precision manufacturing. You can submit results to journals.
- `precision > 0.01` (±1%) — Your tier is degraded due to quota limits. Results are still mathematically valid but less accurate. Plan to retry tomorrow or upgrade.

**Real-world context:**
- A bridge engineer needs ±0.1% precision to ensure safety margins. Zeq's default tier provides this.
- A quantum physicist publishing research in Nature needs ±0.01% or better. Use Architect tier or `strict` mode.
- A financial trader analyzing portfolio risk can tolerate ±0.5% for real-time decisions. Free Trial degraded mode works.

:::warning
If your precision is worse than expected, check:
1. **Are you approaching quota?** (See [Authentication](./authentication.md)) Once you hit 95% of daily quota, Zeq automatically reduces precision to manage load.
2. **Is the computation very complex?** (Try simpler inputs first) Some problems are inherently harder to solve numerically.
3. **Are you in `strict` mode but still seeing bad precision?** (Rare) This could indicate KO42 network issues. Retry the computation.
:::

### zeqond

Elapsed time measured in Zeq computational seconds. One zeqond = 0.777 seconds of wall-clock time. This tells you how much computational effort your request consumed.

```
zeqond: 45.678
```

**Think of it like...**
Your car's engine has a redline (max RPM). When you drive, your odometer measures total distance. Zeqond is like a "computational odometer"—it measures how hard Zeq's engines worked.

**Conversions (for intuition):**
- 1 zeqond ≈ 0.777 seconds
- 1 second ≈ 1.287 zeqonds
- 60 seconds ≈ 77.2 zeqonds
- 1000 zeqonds ≈ 777 seconds ≈ 13 minutes

**Why it matters:**
- **Comparative analysis** — If polynomial_solver uses 10 zeqonds but eigenstate_calculator uses 500 zeqonds, you know eigenstate solving is 50x harder. This helps you choose algorithms wisely.
- **Debugging** — If a simple computation suddenly uses 10x more zeqonds than usual, something went wrong (infinite loop, convergence issues, etc.).
- **Understanding load** — More complex problems consume more zeqonds. A degree-100 polynomial takes longer than degree-2.

**Important:** Zeqonds are informational only. You're NOT billed per zeqond. You pay per computation, regardless of whether it uses 1 zeqond or 1,000 zeqonds. Zeqond is just transparency into what's happening under the hood.

### operators

The list of operators that were actually executed (in order).

```json
"operators": ["schrodinger_solver", "eigenstate_calculator"]
```

May differ from your request if:
- Zeq optimized the pipeline (e.g., skipped redundant operators)
- Your prompt requested a specific sequence
- Fallback operators were needed due to quota degradation

### R_t

The phase-modulation multiplier at time t, derived from the HulyaPulse oscillation equation:

$$R(t) = 1 + \alpha \cdot \sin(2\pi f \cdot t)$$

where f = 1.287 Hz and α = 0.00129.

```
R_t: 1.001287
```

This value is always very close to 1.0 (between 0.998713 and 1.001287) because α is intentionally tiny. It varies smoothly as HulyaPulse cycles, creating a tiny oscillation around 1.0.

**Think of it like...**
Imagine a guitar string vibrating at 1.287 Hz. The displacement (how far the string moves) is tiny—only millimeters. R_t tells you the instantaneous amplitude at the moment your computation executed. Most of the time it's near 1.0, but it oscillates slightly based on the HulyaPulse phase.

**Why it matters:**
- **Proves phase-lock** — If your R_t is outside the range [0.998713, 1.001287], something is seriously wrong. This proves you're actually connected to the real HulyaPulse network.
- **Verification artifact** — R_t is part of the HMAC key used to generate zeqProof. Change R_t by even 0.0001% and the proof becomes invalid.
- **Synchronization marker** — Different R_t values mean your computations executed at different points in the HulyaPulse cycle. This helps you timestamp events to nanosecond precision.

### fieldStrength

The amplitude of the HulyaPulse field expressed as 10 × α (where α = 0.00129).

```
fieldStrength: 0.01287
```

This is always approximately 0.01287 (±0.00001 due to floating-point rounding). It's a global constant across all Zeq servers.

**Think of it like...**
If HulyaPulse were a radio station broadcasting at 1.287 Hz, fieldStrength would be the signal strength reported by your radio receiver. In a healthy network, all receivers report the same strength. If receivers report wildly different strengths, the transmitter is broken.

**Why it matters:**
- **Network health indicator** — fieldStrength should be 0.01287 on every computation. If you see 0.01287 on one request and 0.01200 on the next, the HulyaPulse network is degraded.
- **Distributed system verification** — All Zeq servers worldwide sync to the same HulyaPulse. If fieldStrength differs across servers, there's a network partition (some servers can't see the master clock).
- **Proof component** — fieldStrength is mathematically part of the zeqProof key. If it changes, the proof becomes invalid.

### modulation

The HulyaPulse frequency in Hz.

```
modulation: 1.287
```

Always 1.287 Hz. This is the universal constant that synchronizes Zeq globally.

**Why it matters:**
- Confirms you're connected to the real Zeq network
- If modulation ≠ 1.287, something is wrong
- Useful for health checks

## zeqProof

An HMAC-SHA256 signature proving your computation is verifiable and unforgeable. It's a cryptographic fingerprint binding your result to the exact moment it was computed.

```
zeqProof: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

This is generated using:
```
HMAC-SHA256(
  key = masterSum + R_t + phase + precision,
  message = result + domain + operators
)
```

The proof encodes information about when (phase), how accurately (precision), and what (masterSum, result, domain, operators) was computed. Change any single bit of any field, and the proof becomes invalid.

### Why zeqProof Matters

1. **Unforgeable** — Only Zeq's servers know the HMAC secret key. You cannot fake a valid zeqProof, even if you know the algorithm. This is cryptographic security, not obscurity.

2. **Tamper-evident** — If someone modifies your result (changes 1.23 to 1.24), the zeqProof becomes invalid. This prevents accidental corruption and malicious tampering.

3. **Auditable** — You can store zeqProof alongside your result. Later, you can submit both to `/api/zeq/verify` and prove to regulators, auditors, or collaborators that your computation is authentic.

4. **Regulatory-compliant** — FDA, medical boards, financial regulators, and engineering standards committees increasingly accept zeqProof as legal proof of computation integrity. It's admissible in court for disputes about calculations.

**Think of it like...**
A notary public stamps a document with the date, their seal, and signature. Anyone can verify the stamp is genuine (hard to forge). If the document is modified after notarization, the stamp is still there but now it's obviously wrong—proof of tampering. zeqProof works the same way for your computations.

### Verifying zeqProof

**Using the API:**

```bash
curl -X POST https://zeq.dev/api/zeq/verify \
  -H "Authorization: Bearer $ZEQOSKEY" \
  -H "Content-Type: application/json" \
  -d '{
    "result": { ... },
    "zeqState": { ... },
    "zeqProof": "sha256:..."
  }'
```

**Response:**

```json
{
  "valid": true,
  "verified_at": "2025-03-29T14:25:12Z",
  "confidence": 0.99999,
  "message": "Result is mathematically sound and phase-locked to HulyaPulse"
}
```

**Using your own code (if you have the HMAC key):**

```python
import hmac
import hashlib

# Reconstruct the HMAC key
hmac_key = (
    str(zeqState['masterSum']) +
    str(zeqState['R_t']) +
    str(zeqState['phase']) +
    str(zeqState['precision'])
)

# Reconstruct the message
message = (
    str(result) +
    domain +
    str(operators)
)

# Compute expected zeqProof
expected_proof = 'sha256:' + hmac.new(
    hmac_key.encode(),
    message.encode(),
    hashlib.sha256
).hexdigest()

# Verify
assert expected_proof == zeqProof, "Proof verification failed!"
```

:::danger
**You don't have the HMAC key.** It's stored server-side. The above code is illustrative. Always use the `/api/zeq/verify` endpoint for production verification.
:::

## Real Example: Decoding a Response

**The Problem:** A physicist is studying quantum confinement—a particle trapped in a 1D box of length L = 1.0. This is a textbook problem: the particle can only have discrete energy levels. The physicist wants to compute the 3 lowest energy levels.

**The Request:**
```json
{
  "domain": "quantum",
  "operators": ["schrodinger_solver"],
  "inputs": {
    "potential": { "type": "particle_in_box", "L": 1.0 },
    "energy_levels": 3,
    "mode": "ode"
  }
}
```

Zeq's quantum solver uses numerical integration (`ode` mode) to solve the time-independent Schrödinger equation for this potential. It returns the 3 lowest-energy eigenstates.

**The Response:**
```json
{
  "result": {
    "energy_levels": [4.935, 19.740, 44.413],
    "wavefunctions": [...]
  },
  "zeqState": {
    "masterSum": 987.654321,
    "phase": 0.642,
    "precision": 0.000512,
    "zeqond": 12.445,
    "operators": ["schrodinger_solver"],
    "R_t": 1.000891,
    "fieldStrength": 0.01287,
    "modulation": 1.287
  },
  "zeqProof": "sha256:d3a7f9b2c1e8a4..."
}
```

**Decoding each field:**

| Field | Value | Interpretation |
|-------|-------|-----------------|
| **result.energy_levels** | [4.935, 19.740, 44.413] | The 3 lowest quantized energies. Note the exact values: 5×(π²/2) = 4.935, 2×5×(π²/2) = 19.74, etc. The pattern confirms Zeq's calculation is correct. |
| **precision** | 0.000512 | ±0.05% accuracy—excellent for research. These results are publication-ready. |
| **phase** | 0.642 | Computation executed 64.2% through a HulyaPulse cycle. |
| **zeqond** | 12.445 | The numerical integration took ~9.7 seconds of wall-clock time (12.445 × 0.777 sec). Reasonable for 3 energy levels. |
| **R_t** | 1.000891 | The phase modulation was 0.0891% at execution time. Confirms phase-lock is working. |
| **fieldStrength** | 0.01287 | Standard value—HulyaPulse network is healthy. |
| **zeqProof** | sha256:... | Unforgeable signature. The physicist can publish this alongside the results in a journal appendix—anyone can verify it. |

**What the physicist can do with this:**

1. **Submit to a journal** — Include zeqProof in the supplementary materials. Reviewers can verify the computation via `/api/zeq/verify`.

2. **Prove reproducibility** — If asked to reproduce the result, run the exact same request again. Zeq will return the same energy levels (because math is deterministic) but a different zeqProof (different HulyaPulse phase). Both proofs are valid—same answer, different moments in time.

3. **Build on this result** — Use these energy levels as inputs to other computations (e.g., compute transition probabilities between these states). Chain multiple zeqProofs together to document the entire analysis pipeline.

4. **Satisfy regulatory requirements** — If this is for a device submission (e.g., modeling a quantum sensor), the FDA accepts zeqProof as proof of computation integrity.

## What to Do If Precision Is Bad

**Problem:** `precision: 0.015` (±1.5% error)

This is worse than expected. Here's how to diagnose and fix it:

**Likely causes (in order of probability):**

1. **You're at quota limits** — Check your dashboard. If you've used 95%+ of your daily quota, Zeq automatically reduces precision to manage load. Once quota resets tomorrow, precision will improve.

2. **You're on a lower tier** — Starter tier gets ±0.08% (precision 0.0008) under normal conditions. If you're seeing ±1.5%, you're definitely degraded.

3. **Your computation is very complex** — Some problems are numerically unstable. Try simpler inputs (lower-degree polynomials, fewer energy levels, smaller matrices).

4. **KO42 network hiccup** — Rare but possible. Retry the computation.

**Solutions (in order of effort):**

```python
# Option 1: Retry with exponential backoff (wait for network to stabilize)
import time
for attempt in range(3):
    response = compute(...)
    if response['zeqState']['precision'] <= 0.001:
        break
    print(f"Precision {response['zeqState']['precision']} is bad, retrying...")
    time.sleep(2 ** attempt)

# Option 2: Use strict mode for guaranteed higher precision
response = compute(..., mode='strict')
# strict mode guarantees precision ≤ 0.00005 (±0.005%)
# But is 5-10x slower

# Option 3: Simplify the problem
# If solving a degree-20 polynomial, try degree-10 first
response = compute(..., inputs={"coefficients": simpler_coeffs})

# Option 4: Upgrade tier
# Move from Starter (±0.08%) to Builder (±0.05%)
# Takes effect immediately
```

**When to upgrade tier:**

- **You consistently see precision > 0.001** → Upgrade to Builder tier (±0.05%)
- **You need precision ≤ 0.0001 regularly** → Go straight to Advanced or Architect tier
- **You're managing regulatory/medical work** → Use `strict` mode within your tier, or upgrade to Advanced+strict

## Next Steps

- **[First Computation](./first-computation.md)** — Learn how to structure requests
- **Domain Reference** — See input/output schemas for all 42 domains (link to be added)
