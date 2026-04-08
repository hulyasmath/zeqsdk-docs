---
sidebar_position: 3
---

# R(t): Phase-Locked Modulation

The **R(t) equation** is the core mathematical mechanism by which Zeq encodes the HulyaPulse frequency into every computation result. It is what makes Zeq results verifiable, reproducible, and traceable.

## The Equation

```
R(t) = S(t) [1 + α·sin(2πf·t + φ₀)]
```

where:
- **S(t)** is your raw signal (the unmodulated computation result)
- **α ≈ 1.29 × 10⁻³** is the modulation amplitude (small, to preserve accuracy)
- **f = 1.287 Hz** is the HulyaPulse frequency
- **φ₀** is the initial phase at computation start
- **R(t)** is the phase-locked result (what you receive)

## Understanding the Components

### Raw Signal: S(t)
This is what a traditional calculator would return. For example, if you compute the integral of a quantum wavefunction, S(t) is the raw numerical integral.

### The Modulation Factor: `[1 + α·sin(2πf·t + φ₀)]`
This sinusoidal envelope is centered at 1.0 with small oscillations around it. The amplitude α is chosen such that:
- It is small enough (0.00129) to preserve the accuracy of S(t) to ≤0.1% error
- It is large enough to carry sufficient phase information for verification

### The Result: R(t)
The returned value contains both S(t) and the HulyaPulse fingerprint. You can recover the raw result and verify the computation was performed at the correct phase.

## Verifiability: Recovering S(t)

The elegance of R(t) is that you can recover S(t) exactly by averaging R(t) over one HulyaPulse period (1 Zeqond = 0.777 seconds):

```
S(t) = (1 / T_Z) ∫₀^{T_Z} R(t') dt'
     = (1 / 0.777) ∫₀^{0.777} S(t') [1 + α·sin(2πf·t' + φ₀)] dt'
     = S(t) · [1 + α·(average of sin over one period)]
     = S(t) · [1 + 0]  (since the average of sine over a complete period is zero)
     = S(t)
```

This mathematical property means:
1. **No precision loss**: The modulation is invisible to any post-processing that averages over a Zeqond or longer
2. **Perfect traceability**: The phase information is embedded in R(t), not encoded separately
3. **Tamper detection**: Any attempt to strip the phase modulation or modify R(t) will be detected by ZeqProof verification

## Practical Implications

### Computation Results
When you call an API endpoint that returns a numerical result, you receive R(t), not S(t). For example:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1", "KO42"],
    "parameters": {"energy_level": 5},
    "zeqond_timestamp": 2245831.0
  }'
```

**Response:**
```json
{
  "result": {
    "raw_value": 8.472194128,
    "modulated_value": 8.471076453,
    "modulation_factor": 0.9998676,
    "alpha": 0.00129,
    "phase_radians": 1.523,
    "zeqond_timestamp": 2245831.0
  },
  "metadata": {
    "operators_used": ["QM1", "KO42"],
    "computation_time_ms": 42.3,
    "precision_error_percent": 0.087
  }
}
```

### Reading the Response
- **`modulated_value`**: This is R(t), the actual computation output
- **`raw_value`**: This is an estimate of S(t) for your reference (not officially the ground truth)
- **`modulation_factor`**: `[1 + α·sin(2πf·t + φ₀)]`, the envelope
- **`phase_radians`**: The HulyaPulse phase at computation time

### Using the Result
If you need S(t) for downstream calculations, you have two options:

**Option 1: Use R(t) directly**
Most scientific use cases are robust to the ≤0.1% modulation. The statistical noise in real experiments is typically much larger.

**Option 2: Average Multiple Computations**
Execute the same computation multiple times and average R(t) over the results. This reduces the modulation factor further and recovers S(t) to arbitrary precision.

## Phase Sensitivity

The choice of α = 1.29 × 10⁻³ is not arbitrary. It satisfies two competing requirements:

| Requirement | Why | Value |
|---|---|---|
| **Accuracy Preservation** | Must not degrade scientific results | α < 0.001 (0.1% error) |
| **Phase Information Capacity** | Must carry enough signal for ZeqProof verification | α > 0.0001 (SNR ≥ 100 dB) |
| **Zeq Standard** | Globally synchronized across all servers | α = 1.29 × 10⁻³ (exact) |

## Advanced: Phase Reconstruction

For advanced use cases (e.g., cryptographic verification of computation timing), you can reconstruct the HulyaPulse phase from R(t):

```
phase_reconstructed = arcsin( (R(t)/S(t) - 1) / α ) - 2πf·t
```

This phase should match the `phase_radians` field in the response metadata. Mismatches indicate either:
- A computational error
- Network latency skewing the timestamp
- A potential security issue (tampering)

See [ZeqProof](./zeqproof.md) for cryptographic verification of the phase.

## Cross-References

- **[HulyaPulse](./hulyapulse.md)**: The frequency f = 1.287 Hz and phase φ₀
- **[Zeqond](./zeqond.md)**: The period T_Z = 1/f = 0.777 s
- **[KO42](./ko42.md)**: Uses α (alpha modulation) in the metric tensor
- **[ZeqProof](./zeqproof.md)**: Verifies the phase embedded in R(t)

## Recovery Property

R(t) is constructed so that the modulation term is **mean-zero over one Zeqond**. The raw signal S(t) is therefore recoverable to first order by integrating over a single HulyaPulse period:

`(1/T_Z) ∫_{t}^{t+T_Z} R(t') dt' = S(t) + O(α²)`

with α ≈ 1.29 × 10⁻³, the second-order residual is bounded below 1.7 × 10⁻⁶ — well inside the Zeq 0.1 % precision envelope. Operationally this means R(t) can be transmitted, stored, and verified as the canonical observable without sacrificing access to S(t): any holder can recover the underlying value by averaging, while the modulation continues to encode the phase that the ZeqProof HMAC seals against.

---

## What Happens When You Average Over One Cycle

The mathematical proof is elegant:

```
Average of R(t) over one period T_Z:

⟨R⟩ = (1/T_Z) ∫₀^{T_Z} R(t') dt'
    = (1/T_Z) ∫₀^{T_Z} S(t') [1 + α·sin(2πf·t' + φ₀)] dt'
    = S(t) · (1/T_Z) ∫₀^{T_Z} [1 + α·sin(2πf·t' + φ₀)] dt'

Since ∫₀^{T_Z} 1 dt' = T_Z:
    First part = 1

Since ∫₀^{T_Z} sin(2πf·t' + φ₀) dt' = 0  (integral of sine over complete period)
    Second part = 0

Result:
⟨R⟩ = S(t) · [1 + 0] = S(t)  ✓
```

### Practical Consequence

If your data processor (for example, a scientific instrument) naturally averages measurements over ~1 second, the modulation vanishes automatically. Your instrument doesn't even know the modulation is there—it receives R(t), processes it, and when it averages, out pops S(t).

This is why α is so small (0.00129): the modulation is "invisible" to any reasonable post-processing that operates on timescales ≥ 1 Zeqond.

---

## How Scientists Interpret R(t) vs S(t)

### Scenario 1: You Need Only the Final Answer

Example: Computing the ground state energy of a hydrogen atom.

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1"],
    "parameters": {"n_max": 10}
  }'
```

Response:
```json
{
  "result": {
    "modulated_value": -13.6057134,  // This is R(t)
    "modulation_factor": 0.9998720,
    "phase_radians": 1.234
  }
}
```

**What to do:** Use `modulated_value` directly. The error introduced by the modulation (0.00129%) is smaller than typical measurement uncertainty.

### Scenario 2: You Need Extreme Precision (Research Paper)

Example: Measuring fine structure corrections to the hydrogen energy levels for publication.

**Strategy:**
1. Execute the computation 3 times (same parameters)
2. Average the three `modulated_value`s
3. The modulation oscillations cancel (they're out-of-phase), and you recover S(t) to ~0.0001% accuracy

```python
# Pseudocode
results = [zeq.compute(parameters, zeqond=t1),
           zeq.compute(parameters, zeqond=t2),
           zeq.compute(parameters, zeqond=t3)]

average_result = sum(r.modulated_value for r in results) / 3
# average_result ≈ S(t) with ultra-high precision
```

### Scenario 3: You Need to Verify Authenticity (Regulatory Work)

Example: FDA audit of a computational result in a drug trial.

**What to do:**
1. Extract `modulated_value`, `modulation_factor`, `phase_radians` from the response
2. Reconstruct S(t):
   ```
   S(t) = modulated_value / modulation_factor
   ```
3. Verify that the phase is consistent with the timestamp (proof of authenticity)
4. Send the ZeqProof signature to the FDA to prove the result wasn't tampered with

---

## Advanced: Modulation Factor Variation

The modulation factor `[1 + α·sin(2πf·t + φ₀)]` varies between:

```
Minimum: 1 - α = 1 - 0.00129 = 0.99871
Maximum: 1 + α = 1 + 0.00129 = 1.00129
```

This **0.258%** variation is intentionally small but large enough to carry phase information.

### Why Not Make α Larger?

If α = 0.01 (1% modulation):
- **Advantage**: Stronger phase signal, easier to detect tampering
- **Disadvantage**: Results degrade by 1%, not acceptable for publication
- **Trade-off**: Not worth it

If α = 0.0001 (0.01% modulation):
- **Advantage**: Results are nearly unaffected
- **Disadvantage**: Weak phase signal, hard to verify authenticity without ZeqProof
- **Trade-off**: You'd need very precise instruments to detect the modulation

The Zeq standard α = 0.00129 is the **Goldilocks value**—just right for both accuracy and verifiability.

---

## See Also

- [Master Equation](./master-equation.md): The HULYAS equation that R(t) parameterizes
- [Seven-Step Protocol](./seven-step-protocol.md): Step 4 (Precision Imperative) tunes α for your domain
