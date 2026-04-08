---
sidebar_position: 7
---

# The Seven-Step Wizard Protocol

The **Seven-Step Wizard Protocol** is the mandatory sequence that every computation in Zeq must follow. It is enforced by the API, audited by compliance systems, and is the only approved method for requesting computations.

:::warning
Every API call to execute a computation internally follows these seven steps. Deviation from this protocol is not permitted and will result in an error.
:::

## The Seven Steps

### Step 1: PRIME DIRECTIVE — KO42 IS MANDATORY

**Action**: Verify that KO42 is included in the computation request.

**Enforcement**:
- If the request does not mention KO42, it is automatically added.
- If the request explicitly tries to exclude KO42, the API rejects the request with a 403 Forbidden error.
- KO42 is not optional at any tier.

**Example Valid Request:**
```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1", "KO42"],
    "parameters": {...}
  }'
```

**Example Invalid Request (Rejected):**
```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1"],
    "exclude_ko42": true
  }'
```

**Response:**
```json
{
  "error": "STEP_1_FAILED",
  "message": "KO42 is mandatory and cannot be excluded.",
  "status": 403
}
```

### Step 2: OPERATOR LIMIT — 1-3 Additional + KO42 (≤4 Total)

**Action**: Validate that the number of operators does not exceed tier limits.

**Limits by Tier:**

| Tier | Total Operator Count | KO42 | Additional | Validation |
|---|---|---|---|---|
| **Free** | ≤ 4 | ✓ (always) | ≤ 3 | Hard limit; requests with >3 additional are rejected |
| **Starter** | ≤ 5 | ✓ (always) | ≤ 4 | Hard limit; requests with >4 additional are rejected |
| **Builder** | ≤ 7 | ✓ (always) | ≤ 6 | Hard limit; requests with >6 additional are rejected |
| **Advanced** | ≤ 10 | ✓ (always) | ≤ 9 | Hard limit; requests with >9 additional are rejected |
| **Architect** | Unlimited | ✓ (always) | Unlimited | No hard limit |

**Example (Free Tier):**

Valid (3 additional + KO42 = 4 total):
```json
{
  "operators": ["QM1", "NM19", "CS43", "KO42"]
}
```

Invalid (4 additional + KO42 = 5 total):
```json
{
  "operators": ["QM1", "NM19", "CS43", "EM7", "KO42"]
}
```

**Response (Free Tier, 5 operators requested):**
```json
{
  "error": "STEP_2_FAILED",
  "message": "Free tier allows max 4 total operators (including KO42). Requested 5.",
  "tier": "free",
  "max_allowed": 4,
  "requested": 5,
  "status": 429
}
```

### Step 3: SCALE PRINCIPLE — Match Operators to Domain

**Action**: Verify that selected operators are compatible and belong to appropriate domains.

**Validation Rules**:
- Operators from the same domain (e.g., EM7 and EM8, both electromagnetics) must be marked as compatible.
- Operators from unrelated domains (e.g., QM and GR, quantum mechanics and general relativity) are allowed only for semi-classical systems.
- The solver will reject incompatible combinations and suggest alternatives.

**Example Valid Combination:**
```json
{
  "operators": ["QM1", "EM7"]
}
```
Comment: QM1 (quantum mechanics) + EM7 (electromagnetics) is valid—this is the semi-classical picture of atoms in fields.

**Example Invalid Combination:**
```json
{
  "operators": ["EM7", "EM8"]
}
```
**Response:**
```json
{
  "error": "STEP_3_FAILED",
  "message": "Operators EM7 and EM8 are mutually exclusive. Cannot use both in same computation.",
  "recommendations": [
    "Use EM7 for low-frequency electromagnetic phenomena.",
    "Use EM8 for high-frequency/quantum electromagnetic phenomena."
  ],
  "status": 400
}
```

### Step 4: PRECISION IMPERATIVE — Tune to ≤0.1% Error

**Action**: Verify or set error tolerance and precision parameters.

**Parameters**:
- **Relative error threshold**: Maximum allowable relative error in the result (default: 1e-3 = 0.1%)
- **Absolute error threshold**: Maximum allowable absolute error (domain-specific)
- **Convergence criterion**: Solver stops when error is below these thresholds

**Tuning via Request:**
```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1"],
    "parameters": {...},
    "precision": {
      "relative_error_tolerance": 0.001,
      "absolute_error_tolerance": 1e-8,
      "max_iterations": 10000
    }
  }'
```

**Response:**
```json
{
  "precision_validated": true,
  "requested_tolerance": 0.001,
  "estimated_convergence_time_ms": 45.3,
  "estimated_iterations": 273,
  "note": "Tighter tolerance (< 0.001) may require longer computation time."
}
```

**Auto-Tuning:**
If you omit the `precision` block, Step 4 auto-tunes based on the domain:
- Quantum Mechanics: 0.01% (0.0001) — tight, as quantum results are sensitive
- Classical Mechanics: 0.1% (0.001) — looser, classical systems are robust
- Complexity Science: 1% (0.01) — looser, complexity measures are coarse-grained

### Step 5: COMPILE via Master Equation

**Action**: Translate operators and parameters into the HULYAS Master Equation.

**What Happens Internally:**
- The solver maps each operator to its domain-specific coupling constants C_k(ϕ).
- The master equation is assembled with the correct boundary conditions.
- The KO42-modified metric is applied.
- The solver checks that all parameters are consistent.

**Example (Transparent to User):**

Request:
```json
{
  "operators": ["QM1"],
  "parameters": {"energy_level": 3}
}
```

Internally compiled to:
```
Master Equation with:
- Wave operator: □ϕ in KO42 metric
- Operator coupling: C_1, C_2, C_3, C_4 from QM1 [energy_level=3]
- Boundary conditions: ψ(∞) → 0, normalization = 1
```

**Response (on error):**
```json
{
  "error": "STEP_5_FAILED",
  "message": "Compilation failed: Parameter 'energy_level' must be an integer between 1 and 50.",
  "status": 400
}
```

### Step 6: EXECUTE via Functional Equation

**Action**: Numerically solve the compiled master equation using Runge-Kutta integration.

**What Happens:**
- Time-stepping from t=0 to t=T_final (or to steady-state equilibrium)
- Spatial discretization (finite difference or spectral methods)
- Adaptive step size control to maintain precision
- Phase locking to HulyaPulse at each step

**Response (Partial, Headers):**
```bash
HTTP/1.1 200 OK
Content-Type: application/json
X-Computation-Zeqond: 2245831.445
X-Computation-Duration-Ms: 47.2
X-Solver-Method: Runge-Kutta 4th Order
X-Iterations: 273
```

**Response (Body):**
```json
{
  "result": {
    "value": 8.472194128,
    "modulated_value": 8.471076453,
    "unit": "joules"
  },
  "metadata": {
    "zeqond_timestamp": 2245831.445,
    "solver_time_ms": 47.2,
    "iterations": 273,
    "final_error": 0.00087,
    "convergence_status": "SUCCESS"
  }
}
```

### Step 7: VERIFY & TROUBLESHOOT

**Action**: Validate the result and generate a ZeqProof.

**Validation Checks:**
- Is the result physically reasonable? (e.g., energy is positive, probabilities sum to 1)
- Does the result satisfy conservation laws? (energy, momentum, charge)
- Does the modulation factor fall within expected range?
- Is the phase consistent with current HulyaPulse state?

**Response (Success):**
```json
{
  "verification": {
    "status": "VERIFIED",
    "checks": {
      "physical_plausibility": "PASS",
      "conservation_laws": "PASS",
      "modulation_factor_range": "PASS [0.9996 to 1.0004]",
      "phase_consistency": "PASS"
    }
  },
  "zeqproof": {
    "proof": "hmac_sha256_hex_..._64_characters...",
    "algorithm": "HMAC-SHA256",
    "payload": {
      "zeqond_timestamp": 2245831.445,
      "operators": ["QM1"],
      "result_value": 8.472194128,
      "modulation_factor": 0.9998676
    }
  }
}
```

**Response (With Warnings):**
```json
{
  "verification": {
    "status": "VERIFIED_WITH_WARNINGS",
    "checks": {
      "physical_plausibility": "PASS",
      "conservation_laws": "WARNING: Energy conservation off by 0.15%",
      "modulation_factor_range": "PASS",
      "phase_consistency": "PASS"
    },
    "warning_message": "Energy conservation error is slightly above nominal (0.1%). Consider increasing precision tolerance or checking input parameters."
  }
}
```

## Full Protocol Example (End-to-End)

```bash
# Step 1-2 (embedded in request): KO42 mandatory, 3 operators total
# Step 3 (embedded): QM1 + NM19 compatible
# Step 4 (auto-tuned): Quantum domain -> 0.01% tolerance
# Step 5-7 (automatic): Compile, execute, verify

curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1", "NM19"],
    "parameters": {
      "particle_mass": 9.109e-31,
      "potential": "harmonic_oscillator",
      "frequency": 1e15
    }
  }'
```

**Full Response:**
```json
{
  "step_1_prime_directive": {
    "ko42_present": true,
    "status": "PASS"
  },
  "step_2_operator_limit": {
    "tier": "free",
    "max_allowed": 4,
    "requested": 2,
    "status": "PASS"
  },
  "step_3_scale_principle": {
    "operators": ["QM1", "NM19"],
    "compatibility": "COMPATIBLE",
    "status": "PASS"
  },
  "step_4_precision_imperative": {
    "relative_tolerance": 0.0001,
    "absolute_tolerance": 1e-10,
    "domain_auto_tuned": true,
    "status": "PASS"
  },
  "step_5_compile": {
    "master_equation": "□ϕ − μ²(r)ϕ − λϕ³ − e^{−ϕ/ϕ_c} + ϕ₄₂ ∑ C_k(ϕ) = RHS",
    "operators_compiled": ["QM1 (quantum harmonic oscillator)", "NM19 (Newton + force)"],
    "status": "PASS"
  },
  "step_6_execute": {
    "solver_method": "Runge-Kutta 4th Order",
    "time_integration": "0 to 1e-12 seconds",
    "iterations": 412,
    "computation_time_ms": 67.3,
    "status": "COMPLETE"
  },
  "step_7_verify": {
    "physical_plausibility": "PASS",
    "conservation_laws": "PASS",
    "modulation_consistency": "PASS",
    "zeqproof": "a8f2c9e1d5b4a7c2f9e8d1b5a4c7f0e9",
    "status": "VERIFIED"
  },
  "result": {
    "ground_state_energy": -6.81e-2,
    "unit": "eV",
    "modulated_value": -6.81089e-2,
    "zeqond_timestamp": 2245831.445
  }
}
```

## Checking Protocol Status

To see the protocol status for an in-flight computation:

```bash
curl -X GET "https://zeq.dev/api/zeq/protocol-status/:computation_id" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Cross-References

- **[KO42](./ko42.md)**: Step 1 enforces KO42 as mandatory
- **[Operators](./operators.md)**: Step 2 validates operator limits
- **[Master Equation](./master-equation.md)**: Step 5 compiles the equation
- **[ZeqProof](./zeqproof.md)**: Step 7 generates the cryptographic proof

## Visual Walkthrough: What Happens Inside

Here's what happens when you submit a computation request:

```
┌─────────────────────────────────────────────────────────────────┐
│ YOUR API REQUEST                                                │
│ POST /api/zeq/compute                                           │
│ {                                                               │
│   "operators": ["QM1", "NM19"],                                 │
│   "parameters": {...}                                           │
│ }                                                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 1: PRIME DIRECTIVE              │
        │ ✓ KO42 is mandatory                  │
        │ ✓ KO42 auto-added if missing         │
        │ ✓ Request rejected if tries to remove│
        └──────────────────────────┬───────────┘
                                   │
                           [KO42 verified]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 2: OPERATOR LIMIT               │
        │ ✓ Count operators: 2 + KO42 = 3 total│
        │ ✓ Free tier limit: 4 total ✓         │
        │ ✓ Request would fail here if over    │
        └──────────────────────────┬───────────┘
                                   │
                           [Limit verified]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 3: SCALE PRINCIPLE              │
        │ ✓ QM1 (Quantum) + NM19 (Classical)  │
        │ ✓ Compatible? YES (semi-classical)  │
        │ ✓ Request would fail here if invalid │
        └──────────────────────────┬───────────┘
                                   │
                           [Compatibility OK]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 4: PRECISION IMPERATIVE         │
        │ ✓ No explicit tolerance → auto-tune │
        │ ✓ QM domain → 0.01% (≤0.0001)       │
        │ ✓ Estimated: 47.2 ms to converge    │
        └──────────────────────────┬───────────┘
                                   │
                           [Precision set]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 5: COMPILE                      │
        │ ✓ Map QM1 → C₁,C₂,C₃,C₄             │
        │ ✓ Map NM19 → C₁₉,C₂₀                │
        │ ✓ Assemble master equation           │
        │ ✓ Set boundary conditions            │
        │ ✓ Apply KO42 metric                  │
        │ ✓ Check parameters are valid         │
        └──────────────────────────┬───────────┘
                                   │
                           [Equation assembled]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 6: EXECUTE                      │
        │ ✓ Runge-Kutta 4th order integration │
        │ ✓ 273 iterations (adaptive)          │
        │ ✓ Phase-locked at each step          │
        │ ✓ 47.2 ms elapsed                    │
        │ ✓ Convergence error: 0.00087 ✓       │
        └──────────────────────────┬───────────┘
                                   │
                           [Computation done]
                                   │
                           ▼
        ┌──────────────────────────────────────┐
        │ STEP 7: VERIFY & CERTIFY             │
        │ ✓ Physical plausibility: PASS        │
        │ ✓ Conservation laws: PASS            │
        │ ✓ Modulation factor: PASS [0.9996]  │
        │ ✓ Phase consistency: PASS            │
        │ ✓ Generate ZeqProof signature        │
        └──────────────────────────┬───────────┘
                                   │
                           [Result certified]
                                   │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ RESPONSE TO CLIENT                                              │
│ {                                                               │
│   "result": {value: 8.472194128},                              │
│   "zeqproof": {signature: "a8f2c9e1d5b4a..."},                 │
│   "metadata": {zeqond_timestamp: 2245831.445}                  │
│ }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Common Mistakes at Each Step

### Step 1: KO42 Mistakes

**Mistake 1a: Trying to exclude KO42**
```json
{
  "operators": ["QM1"],
  "exclude_ko42": true   // ❌ FAILS
}
```
**Error**: `STEP_1_FAILED: KO42 is mandatory and cannot be excluded.`
**Fix**: Remove the `exclude_ko42` field. KO42 is added automatically.

**Mistake 1b: Asking for "no modulation"**
```bash
"parameters": {
  "modulation": "none"   // ❌ FAILS
}
```
**Error**: KO42 is built into the metric—you cannot turn it off at the parameter level.
**Fix**: If you need different modulation, use KO42.2 (manual mode) with custom β.

### Step 2: Operator Limit Mistakes

**Mistake 2a: Exceeding tier limit**

Free tier (max 4 total including KO42):
```json
{
  "operators": ["QM1", "NM19", "CS43", "EM7", "KO42"]  // ❌ 5 total
}
```
**Error**: `STEP_2_FAILED: Free tier allows max 4 total operators.`
**Fix**: Remove one operator, or upgrade your tier.

**Mistake 2b: Forgetting to count KO42**

Many users think: "I'm on Free tier, so I can use 3 operators" and add QM1, NM19, CS43. But:
```
QM1 + NM19 + CS43 + KO42 (automatic) = 4 total ✓ OK
```

If they add a 4th operator:
```
QM1 + NM19 + CS43 + EM7 + KO42 = 5 total ❌ FAILS
```

**Fix**: Remember KO42 is always included in the count.

### Step 3: Scale Principle Mistakes

**Mistake 3a: Incompatible operators**
```json
{
  "operators": ["EM7", "EM8"]  // ❌ Mutually exclusive
}
```
**Error**: `STEP_3_FAILED: EM7 and EM8 cannot be used together.`
**Fix**: Check the API documentation for compatibility. Use only one of EM7 or EM8.

**Mistake 3b: Mismatched domains**
```json
{
  "operators": ["CS43", "QM1"]  // ❌ Complexity + quantum mixing
}
```
**Error**: `STEP_3_FAILED: Complexity science operators cannot be mixed with physics operators.`
**Fix**: Choose operators from compatible domains (e.g., QM1 + EM7 for quantum electromagnetism, or CS43 + OD5 for complexity of algorithm analysis).

### Step 4: Precision Imperative Mistakes

**Mistake 4a: Impossible tolerance**
```json
{
  "precision": {
    "relative_error_tolerance": 1e-20  // ❌ Numerically impossible
  }
}
```
**Error**: `STEP_4_FAILED: Requested tolerance (1e-20) is below floating-point precision (1e-16).`
**Fix**: Use reasonable tolerances. For most domains, 1e-4 (0.01%) is excellent. For quantum, 1e-5 is tight but possible.

**Mistake 4b: Timeout due to excessive precision**
```json
{
  "precision": {
    "relative_error_tolerance": 1e-10  // ✓ Valid but very tight
  }
}
```
**Response** (not an error, but a warning):
```json
{
  "warning": "Step 4 validation suggests this may take 5+ seconds.",
  "recommendation": "Consider relaxing tolerance to 1e-6 (0.0001%) or upgrading to Advanced tier for faster hardware."
}
```

### Step 5: Compilation Mistakes

**Mistake 5a: Invalid parameter**
```json
{
  "operators": ["QM1"],
  "parameters": {
    "energy_level": 1000  // ❌ Out of bounds
  }
}
```
**Error**: `STEP_5_FAILED: Parameter 'energy_level' must be between 1 and 50.`
**Fix**: Consult the operator documentation for valid ranges.

**Mistake 5b: Missing required parameter**
```json
{
  "operators": ["QM1"]
  // Missing "hamiltonian" parameter
}
```
**Error**: `STEP_5_FAILED: Required parameter 'hamiltonian' is missing for operator QM1.`
**Fix**: Provide all required inputs. Check the operator spec for mandatory parameters.

### Step 6: Execution Mistakes

**Mistake 6a: Divergence (computation blows up)**
```json
{
  "convergence_status": "DIVERGED",
  "final_value": "inf",
  "error": "Solver diverged after 10000 iterations."
}
```
**Why**: Parameters might be physically unreasonable (e.g., coupling constant too large), or the equation is unstable in your regime.
**Fix**:
- Check input parameters for typos
- Reduce coupling strengths
- Use KO42.2 with smaller β
- Contact support if the operator should handle this regime

**Mistake 6b: Timeout (too slow)**
```
Computation exceeded 120 second timeout.
```
**Why**: Too many operators, too tight precision, or ill-conditioned problem.
**Fix**:
- Remove one operator if possible
- Relax precision tolerance
- Upgrade to Advanced/Architect tier (dedicated hardware)

### Step 7: Verification Mistakes

**Mistake 7a: Physical implausibility**
```json
{
  "verification": {
    "physical_plausibility": "FAIL",
    "reason": "Energy is negative for a harmonic oscillator ground state."
  }
}
```
**Why**: Operator returned a physically impossible result (sign of a bug or parameter error).
**Fix**:
- Double-check input parameters
- Verify you're using the right operator for your domain
- Contact support if the operator is faulty

**Mistake 7b: Conservation law violation**
```json
{
  "verification": {
    "conservation_laws": "WARNING",
    "violation": "Energy conservation error: 2.3%"
  }
}
```
**Why**: Numerical error accumulated more than expected.
**Fix**:
- Increase precision tolerance (reduce `relative_error_tolerance`)
- Use KO42.2 with tighter β
- Upgrade to higher tier for better numerics

---

## See Also

- [HULYAS Master Equation](./master-equation.md): The equation the protocol compiles
- [ZeqProof](./zeqproof.md): The cryptographic certificate generated in Step 7
