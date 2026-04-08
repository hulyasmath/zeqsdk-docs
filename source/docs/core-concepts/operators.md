---
sidebar_position: 5
---

# Operators: The Building Blocks

Operators are the fundamental computational primitives in Zeq. They are reusable, standardized mathematical modules that encode domain-specific knowledge and solve specific classes of problems.

## Overview

Zeq provides **1,576 operators** across **64 domains**, each with:
- A unique identifier (e.g., `QM1`, `NM19`, `GR33`)
- A defining mathematical equation (in LaTeX)
- A founder attribution (the researcher who contributed it)
- A tier level (Free, Starter, Builder, Advanced, Architect)
- Documentation and examples

## Anatomy of an Operator

Every operator has this structure:

```json
{
  "id": "QM1",
  "name": "Schrödinger Equation Solver",
  "domain": "Quantum Mechanics",
  "domain_id": "QM",
  "tier": "free",
  "equation": "i ℏ ∂ψ/∂t = Ĥ ψ",
  "equation_latex": "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\hat{H}\\psi",
  "description": "Solves the time-dependent Schrödinger equation...",
  "founder": "Erwin Schrödinger",
  "inputs": [
    {"name": "psi_initial", "type": "complex_wavefunction"},
    {"name": "hamiltonian", "type": "operator"}
  ],
  "outputs": [
    {"name": "psi_t", "type": "complex_wavefunction"}
  ],
  "computational_complexity": "O(N^3)",
  "max_instances_per_computation": 3,
  "requires_ko42": true,
  "is_always_included": false,
  "tags": ["quantum-mechanics", "wavefunction", "time-evolution"]
}
```

## Examples Across Domains

| ID | Domain | Equation | Use Case |
|---|---|---|---|
| **QM1** | Quantum Mechanics | i ℏ ∂ψ/∂t = Ĥ ψ | Quantum wavefunction evolution |
| **NM19** | Newtonian Mechanics | F = ma | Classical force and acceleration |
| **GR33** | General Relativity | G_{μν} = 8πG/c⁴ T_{μν} | Einstein field equations |
| **CS43** | Complexity Science | T(n) = aT(n/b) + f(n) | Algorithm complexity analysis |
| **EM7** | Electromagnetics | ∇ × E = -∂B/∂t | Faraday's law |
| **SM22** | Statistical Mechanics | Z = Σ_i exp(-βE_i) | Partition function |
| **OD5** | Ordinary Differential Equations | dy/dx + P(x)y = Q(x) | Linear ODE solving |

:::note
KO42 is not listed as an operator because it is mandatory on every computation. It is always present, even if not explicitly requested.
:::

## Retrieving All Operators

List all available operators in your tier:

```bash
curl -X GET "https://zeq.dev/api/operators?tier=free&limit=50" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "operators": [
    {
      "id": "QM1",
      "name": "Schrödinger Equation Solver",
      "domain": "Quantum Mechanics",
      "tier": "free",
      "equation_latex": "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\hat{H}\\psi",
      "description": "Solves the time-dependent Schrödinger equation for quantum systems.",
      "founder": "Erwin Schrödinger",
      "tags": ["quantum-mechanics", "wavefunction"]
    },
    {
      "id": "NM19",
      "name": "Newton's Second Law",
      "domain": "Newtonian Mechanics",
      "tier": "free",
      "equation_latex": "F = ma",
      "description": "Applies Newton's second law to classical mechanical systems.",
      "founder": "Isaac Newton",
      "tags": ["classical-mechanics", "forces"]
    }
  ],
  "total": 1576,
  "tier_accessible": 42,
  "pagination": {
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

## Getting Details on a Specific Operator

Retrieve full documentation for a single operator:

```bash
curl -X GET "https://zeq.dev/api/framework/operator/QM1" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "id": "QM1",
  "name": "Schrödinger Equation Solver",
  "domain": "Quantum Mechanics",
  "tier": "free",
  "equation": "i ℏ ∂ψ/∂t = Ĥ ψ",
  "equation_latex": "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\hat{H}\\psi",
  "description": "Solves the time-dependent Schrödinger equation...",
  "founder": "Erwin Schrödinger",
  "inputs": [
    {
      "name": "psi_initial",
      "type": "complex_wavefunction",
      "description": "Initial quantum state",
      "constraints": "norm(psi) = 1"
    },
    {
      "name": "hamiltonian",
      "type": "operator_matrix",
      "description": "Hamiltonian (energy operator)",
      "constraints": "must be Hermitian"
    },
    {
      "name": "time_evolution",
      "type": "float_array",
      "description": "Time points for evolution",
      "constraints": "t >= 0"
    }
  ],
  "outputs": [
    {
      "name": "psi_t",
      "type": "complex_wavefunction_array",
      "description": "Quantum state at each time point"
    },
    {
      "name": "expectation_values",
      "type": "float_array",
      "description": "Energy expectation value at each time"
    }
  ],
  "computational_complexity": "O(N^3 * M)",
  "solver_method": "Runge-Kutta 4th order",
  "accuracy": "< 1e-10 RMS error",
  "max_instances_per_computation": 3,
  "requires_ko42": true,
  "examples": [
    {
      "name": "Particle in a Box",
      "description": "Solves for a quantum particle confined to 1D box",
      "code": "QM1(psi_box, H_kinetic, t_eval)"
    }
  ],
  "references": [
    {
      "title": "The Principles of Quantum Mechanics",
      "author": "P.A.M. Dirac",
      "year": 1930
    }
  ]
}
```

## Operator Constraints

### Maximum Operators Per Computation

You may combine multiple operators in a single computation, but the limit depends on your tier:

| Tier | Max Operators | Includes KO42 | Additional Operators | Examples |
|---|---|---|---|---|
| **Free** | 4 total | ✓ Included | 3 (QM1 + NM19 + CS43) | Educational, prototyping |
| **Starter** | 5 total | ✓ Included | 4 | Small projects, research |
| **Builder** | 7 total | ✓ Included | 6 | Medium projects, production |
| **Advanced** | 10 total | ✓ Included | 9 | Complex simulations, research |
| **Architect** | Unlimited | ✓ Included | Unlimited | Large-scale computations |

:::info
KO42 is always mandatory and always included in the count. For example, on the Free tier, you can add up to 3 additional operators plus the mandatory KO42 = 4 total.
:::

### Operator Compatibility

Not all operators can be mixed. The API will validate compatibility:

```bash
curl -X POST https://zeq.dev/api/framework/validate-operators \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1", "GR33", "NM19"]
  }'
```

**Response (Compatible):**
```json
{
  "valid": true,
  "operators": ["QM1", "GR33", "NM19"],
  "notes": "All operators are compatible. GR33 (General Relativity) can be used alongside QM1 (Quantum Mechanics) for semi-classical systems."
}
```

**Response (Incompatible):**
```json
{
  "valid": false,
  "operators": ["EM7", "EM8"],
  "error": "Electromagnetic operators EM7 and EM8 are mutually exclusive. Choose one.",
  "recommendation": "Use EM7 for low-frequency fields or EM8 for high-frequency/quantum regimes."
}
```

## Operator Categories by Domain

Zeq organizes operators into 64 domains:

- **Quantum Mechanics** (12 operators: QM1–QM12)
- **Newtonian Mechanics** (18 operators: NM1–NM18)
- **General Relativity** (8 operators: GR1–GR8)
- **Complexity Science** (15 operators: CS1–CS15)
- **Electromagnetics** (14 operators: EM1–EM14)
- **Statistical Mechanics** (12 operators: SM1–SM12)
- ... and 58 more domains

See the full list via:

```bash
curl -X GET https://zeq.dev/api/framework/domains \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Cross-References

- **[KO42](./ko42.md)**: The mandatory metric tensioner (always present)
- **[Seven-Step Protocol](./seven-step-protocol.md)**: Step 2 enforces the operator limit
- **[Master Equation](./master-equation.md)**: The equation that all operators are solved within

## What Are Operators? A Beginner's Guide

### Operators Are Like Functions in Programming

In traditional programming:
```python
def add(a, b):
    return a + b

result = add(3, 5)  # Returns 8
```

In Zeq, operators work similarly but for mathematical domains:

```python
# Zeq (pseudocode)
result = QM1(psi_initial, hamiltonian, time_points)
# Solves the Schrödinger equation and returns the wavefunction evolution
```

The key difference: **Zeq operators encode domain knowledge**. Instead of writing the Schrödinger solver from scratch, you call `QM1` and it handles all the mathematics.

### Operators vs. Ordinary Functions

| Aspect | Ordinary Function | Zeq Operator |
|--------|---|---|
| **Input** | Any data (numbers, strings, arrays) | Domain-specific (wavefunctions, field variables, etc.) |
| **Processing** | User-defined logic | Solves a mathematical equation from your domain |
| **Output** | Return value | Solution to the equation at specified times/points |
| **Example** | `max(array)` finds maximum | `QM1(...)` solves quantum mechanics |
| **Complexity** | Usually O(n) to O(n²) | Often O(n³) or higher—**computed server-side** |

### Why Use Operators Instead of Writing Your Own Solver?

1. **Correctness**: The equation is solved by expert physicists, not you (less bug-prone)
2. **Performance**: Optimized with spectral methods, adaptive timestepping, etc.
3. **Reproducibility**: Every Zeq user gets identical numerical results (not true with homebrew solvers)
4. **Verification**: Results are cryptographically signed (ZeqProof)
5. **Compliance**: Suitable for regulatory submissions (FDA, etc.)

---

## The 42-Domain Taxonomy

The 42-domain taxonomy is intentional—the number 42 appears in the HULYAS Master Equation:

```
ϕ₄₂ ∑_{k=1}^{42} C_k(ϕ) = ...
```

Each of the 42 domains has a dedicated set of operators, and each operator contributes specific coupling functions C_k to the master equation.

**The 42 domains:**
1. Quantum Mechanics (QM)
2. Newtonian Mechanics (NM)
3. General Relativity (GR)
4. Complexity Science (CS)
5. Electromagnetics (EM)
6. Statistical Mechanics (SM)
7. Ordinary Differential Equations (OD)
8. Partial Differential Equations (PD)
9. Probability Theory (PR)
10. Statistics (ST)
11. Acoustics (AC)
12. Optics (OP)
13. Thermodynamics (TH)
14. Fluid Dynamics (FL)
15. ... and 28 more

Each domain has dedicated equations, solutions, and numerical methods.

---

## Chaining Operators: An Example

You can combine multiple operators in a single computation. Example: simulating a **quantum particle in an electromagnetic field** (semi-classical quantum mechanics).

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1", "EM7"],
    "parameters": {
      "psi_initial": [complex array],
      "hamiltonian": [matrix for kinetic energy],
      "electric_field": {
        "strength_v_per_m": 1e6,
        "frequency_hz": 1e15
      },
      "time_evolution": [0, 1e-15, 2e-15, ...]
    }
  }'
```

Here:
- **QM1** handles quantum mechanics (wavefunction evolution)
- **EM7** handles electromagnetics (Faraday's law)
- Together, they solve the **coupled system** where the quantum particle moves in response to the electric field

The master equation automatically combines:
- Quantum coupling functions C_k from QM1
- Electromagnetic coupling functions C_k from EM7
- The term `β F_{μν} F^{μν}` that couples them

Result: A single computation that solves both quantum mechanics and electromagnetism simultaneously, with perfect synchronization.

### Operator Chaining Rules

Not all combinations are valid:

```
✓ VALID:   QM1 + EM7        (quantum particle in EM field)
✓ VALID:   NM19 + GR1       (classical mechanics under gravity)
✗ INVALID: EM7 + EM8        (mutually exclusive)
✗ INVALID: CS43 + QM1 + NM19 (complexity science doesn't mix with physics)
```

The API validates compatibility automatically.

---

## Founder Attribution

Each operator is credited to the physicist or mathematician who contributed it:

| Operator | Domain | Founder | Contribution |
|----------|--------|---------|---|
| QM1 | Quantum Mechanics | Erwin Schrödinger | Schrödinger equation solver |
| NM19 | Newtonian Mechanics | Isaac Newton | Force, acceleration, momentum |
| GR33 | General Relativity | Albert Einstein | Einstein field equations |
| EM7 | Electromagnetics | James Clerk Maxwell | Maxwell equations |
| CS43 | Complexity Science | Donald Knuth | Algorithm complexity analysis |

This creates a **lineage of scientific knowledge**—your computation traces back to the original discoverers of these equations.

---

## See Also

- [Degradation Model](./degradation-model.md): How tier determines available operators
