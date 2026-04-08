---
title: First Computation (Deep Dive)
description: Understanding domains, operators, modes, KO42 protocol, and verification.
sidebar_position: 4
---

# First Computation (Deep Dive)

The POST `/api/zeq/compute` endpoint is the heart of Zeq. Let's dissect every parameter and understand what's happening under the hood.

## The Compute Endpoint

```
POST https://zeq.dev/api/zeq/compute
Content-Type: application/json
Authorization: Bearer zeq_ak_...
```

## Request Structure

```json
{
  "domain": "string",
  "operators": ["string"],
  "inputs": {
    /* domain-specific fields */
  },
  "mode": "algebraic" | "ode" | "strict",
  "prompt": "optional natural language instruction"
}
```

### domain

The computational domain—think of this as the "language" or "skill set" you're asking Zeq to use. Zeq ships with 42 specialized domains (each with multiple operators) across 234 protocols. It's like asking a person "are you doing chemistry or carpentry?" — the domain tells the system what tools to prepare.

**Think of it like...**
A Swiss Army knife doesn't have one blade. It has 42 different tools (domains). When you open the knife, you first decide which tool you need: saw, screwdriver, or bottle opener. That's your domain. Then within the saw, you might choose between a large tooth or fine tooth blade. That's your operator.

Common domains:

- `algebra` — Polynomial solving, equation systems, symbolic simplification
- `calculus` — Derivatives, integrals, limits, series
- `linear_algebra` — Matrix operations, eigenvalues, decompositions
- `ode` — Ordinary differential equations (initial value problems)
- `pde` — Partial differential equations
- `quantum` — Quantum mechanics (Schrödinger equation, eigenstate computation)
- `physics` — Classical mechanics, kinematics, dynamics
- `medical_imaging` — CT reconstruction, MRI sequences, ultrasound beamforming
- `signal_processing` — Fourier analysis, filters, convolution
- `optimization` — Linear programming, nonlinear optimization, machine learning kernels
- `game_physics` — Rigid body dynamics, inverse kinematics, cloth simulation
- `hardware_design` — Thermal analysis, power delivery, signal integrity

See the full list in Domain Reference (link to be added).

### operators

An array of mathematical operators to apply. Each operator is a specific function within the domain—a concrete calculation method that solves a particular type of problem.

**Think of it like...**
Imagine you walk into a doctor's office. The domain is "medical diagnosis." The operators are the specific tests: blood test, X-ray, EKG, ultrasound. Different tests reveal different information about your health. Similarly, different operators within a domain solve different types of problems.

**Example operators in `algebra` domain:**
- `polynomial_solver` — Find roots of polynomials (where does it cross zero?)
- `linear_system_solver` — Solve Ax = b (simultaneous equations)
- `symbolic_simplify` — Simplify expressions (x² + 2x + 1 → (x+1)²)
- `factor` — Factor polynomials (break apart into pieces)

**Example operators in `quantum` domain:**
- `schrodinger_solver` — Solve time-independent Schrödinger equation (what are the allowed energy states?)
- `eigenstate_calculator` — Compute eigenvalues and eigenvectors (what are the special states and their properties?)
- `density_matrix` — Generate density matrix from state vector (convert between representations)

### The KO42 Protocol: Zeq's Signature

:::warning
**KO42 Protocol (Automatic & Mandatory):** Every computation includes the KO42 protocol implicitly. You don't add it yourself—Zeq automatically inserts it at the end of your operator chain. KO42 performs the phase-locking synchronization to HulyaPulse (the 1.287 Hz global heartbeat) and generates the cryptographic zeqProof that makes your result unforgeable. If KO42 fails, the entire computation fails and returns a 503 error.

**Think of KO42 like...**
Imagine a document notarized by a public notary. The notary (KO42) stamps your document with the current time (HulyaPulse phase) and a unique signature. Later, anyone can verify the signature to prove:
1. This document is authentic
2. It was notarized on this date/time
3. It hasn't been tampered with since

The KO42 protocol does exactly this for your computation—it's non-negotiable and always active.
:::

### inputs

Domain and operator-specific input parameters. The structure varies completely based on which domain and operator you're using—there's no one-size-fits-all input. You'll specify exactly the data your chosen operator needs to work.

**Think of it like...**
If you order a pizza, the "inputs" are your toppings, crust type, and size. If you order a haircut, the "inputs" are the style, length, and fade. Each service has completely different inputs because they solve different problems.

**For `algebra.polynomial_solver`:**
```json
{
  "coefficients": [1, 2, -3]
}
```
The array [a, b, c] means: solve ax² + bx + c = 0. In this case: x² + 2x - 3 = 0.

**For `quantum.schrodinger_solver` (More Complex):**
```json
{
  "potential": {
    "type": "harmonic_oscillator",
    "omega": 1.0
  },
  "energy_levels": 3,
  "x_range": [-5, 5],
  "grid_points": 1000
}
```
Here you're describing a quantum system: a particle in a harmonic potential (like a mass on a spring), and you want to know the 3 lowest energy levels. The `x_range` and `grid_points` tell Zeq how finely to discretize the space.

**For `medical_imaging.ct_reconstruction` (Real-World):**
```json
{
  "sinogram": [[...], [...], ...],
  "num_angles": 180,
  "filter_type": "ram_lak",
  "voxel_size_mm": 0.5
}
```
A CT scanner takes X-ray measurements from 180 different angles (the "sinogram"). Zeq reconstructs a 3D image by mathematically inverting these measurements. The `ram_lak` filter is a standard denoising algorithm used in medical imaging.

### mode

How to execute the computation—essentially, the "quality/speed tradeoff" you're choosing. Different modes balance speed, precision, and verification rigor.

**Think of it like...**
When you cook a steak, you can use three approaches: (1) high heat for 2 minutes (fast and risky), (2) medium heat for 10 minutes (balanced), (3) low heat for 30 minutes with a food thermometer at every step (slow but verified). Each approach produces edible steak, but with different certainty levels.

**The three modes:**

- **`algebraic`** — Seeks a closed-form symbolic solution (e.g., the quadratic formula). Fastest when available, but only works for certain problem classes (polynomials, linear systems, simple integrals). If a closed-form solution doesn't exist, this mode may fail.

- **`ode`** — Uses numerical integration (Runge-Kutta methods and similar) to solve differential equations. Required for simulating physical systems, quantum mechanics, and anything that evolves over time. Slower than algebraic but vastly more general.

- **`strict`** — Full verification mode with highest precision. Runs additional mathematical validation, increases precision to ±0.05% (from ±0.1%), and includes an extended zeqProof with audit trail showing every step. Slowest, but suitable for regulated environments.

Most computations use `algebraic` or `ode` depending on the problem type. Use `strict` sparingly—it's slower and more expensive.

:::info
**When to use `strict` mode:** When your computation result has legal, medical, or regulatory implications—FDA submissions, civil engineering calculations, financial derivatives pricing, or clinical trial analysis. `strict` mode runs additional validation, increases precision to ±0.05%, and includes an extended zeqProof with audit trail showing intermediate steps. Perfect for "prove this is correct" scenarios.
:::

### prompt (Optional)

Natural language instruction for complex or ambiguous computations. Useful when a computation could be interpreted multiple ways—when you want to provide context that would be hard to encode in structured inputs.

```json
{
  "domain": "optimization",
  "operators": ["linear_program"],
  "inputs": { ... },
  "mode": "algebraic",
  "prompt": "Minimize cost subject to production constraints, assume non-negative variables"
}
```

The Zeq inference engine parses this and adjusts parameters accordingly.

**Think of it like...**
Imagine telling a carpenter: "I need a wooden shelf." That's your structured input (what kind of furniture). But then you add: "Make it sturdy enough for books and heavy vases, and please use reclaimed oak to match my rustic kitchen." That's your prompt—additional context that changes how the carpenter approaches the problem.

## Real Example: Quantum Mechanics

Let's compute the ground state wavefunction of a 1D harmonic oscillator. This is a classic quantum mechanics problem—imagine a particle trapped in a potential well shaped like a bowl (U = ½x²).

### The Physics

A harmonic oscillator appears everywhere:
- Vibrating atoms in a crystal lattice
- Electron probability distributions in molecules
- Light trapped in resonators
- Quantum computing qubits (often implemented as harmonic oscillators)

When you solve the Schrödinger equation for this system, you get quantized energy levels—the particle can only have certain discrete energies, not arbitrary ones. This is fundamentally quantum behavior.

### Request

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQOSKEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "quantum",
    "operators": ["schrodinger_solver", "eigenstate_calculator"],
    "inputs": {
      "potential": {
        "type": "harmonic_oscillator",
        "omega": 1.0,
        "mass": 1.0
      },
      "energy_levels": 3,
      "x_range": [-4, 4],
      "grid_points": 500
    },
    "mode": "ode"
  }'
```

### What Happens Inside

1. Zeq recognizes `domain: quantum` and `operators: [schrodinger_solver, eigenstate_calculator]`
2. It automatically inserts **KO42** into the computation pipeline
3. KO42 retrieves the current HulyaPulse phase (synchronized across all servers)
4. The Schrödinger solver numerically integrates the differential equation using `ode` mode
5. The eigenstate calculator extracts the lowest 3 energy levels and wavefunctions
6. KO42 phase-locks the result to the current HulyaPulse cycle
7. KO42 generates an HMAC-SHA256 proof and returns it

### Response

```json
{
  "result": {
    "energy_levels": [0.5, 1.5, 2.5],
    "wavefunctions": [
      {
        "x_points": [-4.0, -3.99, -3.98, ...],
        "psi_values": [0.0001, 0.0005, 0.0015, ...],
        "norm": 1.0000
      },
      { ... },
      { ... }
    ]
  },
  "zeqState": {
    "masterSum": 123.456789,
    "phase": 0.287,
    "precision": 0.000987,
    "zeqond": 45.678,
    "operators": ["schrodinger_solver", "eigenstate_calculator"],
    "R_t": 1.001287,
    "fieldStrength": 0.01287,
    "modulation": 1.287
  },
  "zeqProof": "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

## Verifying Your Result (zeqProof)

Every result includes a `zeqProof`—an HMAC-SHA256 signature binding the computation to mathematical ground truth. You can verify it:

### Using POST /api/zeq/verify

```bash
curl -X POST https://zeq.dev/api/zeq/verify \
  -H "Authorization: Bearer $ZEQOSKEY" \
  -H "Content-Type: application/json" \
  -d '{
    "result": { ... },
    "zeqState": { ... },
    "zeqProof": "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
  }'
```

### Response

```json
{
  "valid": true,
  "verified_at": "2025-03-29T14:23:45Z",
  "confidence": 0.99999,
  "message": "Result is mathematically sound and phase-locked to HulyaPulse"
}
```

:::success
If `valid: true`, your result is mathematically verified and unforgeable.
:::

## Error Handling

### Missing Required Field

```json
{
  "error": "invalid_request",
  "message": "Missing required field: 'domain'",
  "code": 400
}
```

### Unknown Domain

```json
{
  "error": "unknown_domain",
  "message": "Domain 'quantum_computing' does not exist. Available domains: quantum, algebra, calculus, ...",
  "code": 400
}
```

### Invalid Operator for Domain

```json
{
  "error": "invalid_operator",
  "message": "Operator 'eigenstate_calculator' not available in domain 'algebra'",
  "code": 400
}
```

### KO42 Failure

```json
{
  "error": "ko42_failure",
  "message": "KO42 protocol failed to synchronize to HulyaPulse. Retry in 5 seconds.",
  "code": 503,
  "retry_after": 5
}
```

KO42 failures are rare but can happen during network saturation. Always implement exponential backoff.

### Computation Timeout

```json
{
  "error": "timeout",
  "message": "Computation exceeded 180-second timeout. Try a simpler problem or upgrade to Advanced tier.",
  "code": 504
}
```

Timeout limits depend on your tier (see [Authentication](./authentication.md)).

## Best Practices

1. **Always specify mode explicitly** — Don't rely on auto-detection for critical work
2. **Use strict mode for regulated domains** — Medical devices, aerospace, finance
3. **Implement exponential backoff** — KO42 may need retries
4. **Verify results in production** — Call `/api/zeq/verify` before committing to important decisions
5. **Cache results** — Identical inputs always produce identical outputs; reuse them
6. **Monitor precision** — If zeqState.precision > 0.01, upgrade your tier or simplify your computation

## Next Steps

- **[Understanding Responses](./understanding-responses.md)** — Deep dive into zeqState fields
