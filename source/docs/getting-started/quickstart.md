---
title: Quickstart
description: Zero to first API call in 2 minutes.
sidebar_position: 2
---

# Quickstart

Get your API key and make your first computation in 2 minutes.

## Step 1: Get an API Key (30 seconds)

1. Visit the [Zeq Pricing Page](https://zeq.dev/pricing)
2. Click **"Start 14-Day Free Trial"**
3. Sign up with your email
4. Your dashboard generates an API key with format: `zeq_ak_...`
5. Copy it to your clipboard

:::info
Free trial includes unlimited computations for 14 days. No credit card required.
:::

## Step 2: Set Your Environment Variable (20 seconds)

Store your API key so it's not hardcoded in your application.

**macOS / Linux:**
```bash
export ZEQ_API_KEY="zeq_ak_your_key_here"
```

**Windows (PowerShell):**
```powershell
$env:ZEQ_API_KEY = "zeq_ak_your_key_here"
```

**Or in a `.env` file:**
```
ZEQ_API_KEY=zeq_ak_your_key_here
```

## Step 3: Make Your First API Call (1 minute)

We'll compute a simple algebraic operation: **solve x² + 2x - 3 = 0**.

### Using cURL

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "algebra",
    "operators": ["polynomial_solver"],
    "inputs": {
      "coefficients": [1, 2, -3]
    },
    "mode": "algebraic"
  }'
```

### Using JavaScript (Node.js)

```javascript
const fetch = require('node-fetch');

const apiKey = process.env.ZEQ_API_KEY;

async function firstComputation() {
  const response = await fetch('https://zeq.dev/api/zeq/compute', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      domain: 'algebra',
      operators: ['polynomial_solver'],
      inputs: {
        coefficients: [1, 2, -3]
      },
      mode: 'algebraic'
    })
  });

  const data = await response.json();
  console.log('Result:', data.result);
  console.log('Precision:', data.zeqState.precision);
  console.log('Proof:', data.zeqProof);
}

firstComputation();
```

### Using Python

```python
import os
import requests
import json

api_key = os.getenv('ZEQ_API_KEY')

response = requests.post(
    'https://zeq.dev/api/zeq/compute',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    },
    json={
        'domain': 'algebra',
        'operators': ['polynomial_solver'],
        'inputs': {
            'coefficients': [1, 2, -3]
        },
        'mode': 'algebraic'
    }
)

data = response.json()
print('Result:', data['result'])
print('Precision:', data['zeqState']['precision'])
print('Proof:', data['zeqProof'])
```

## Step 4: Read the Response

The API returns a JSON object with three key fields:

```json
{
  "result": [-3, 1],
  "zeqState": {
    "masterSum": 42.7891234,
    "phase": 0.337,
    "precision": 0.0009876,
    "zeqond": 12.334,
    "operators": ["polynomial_solver"],
    "R_t": 1.00129,
    "fieldStrength": 0.0129,
    "modulation": 1.287
  },
  "zeqProof": "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

### What Each Field Means

- **result** — The answer to your computation (the roots: x = -3 and x = 1)
- **zeqState.precision** — How close your result is to mathematical ground truth (≤0.1%)
- **zeqProof** — HMAC-SHA256 signature proving this result is verifiable

:::success
You just made your first Zeq computation! The API verified it returned roots that satisfy the original polynomial.
:::

## What Just Happened? The Computation Pipeline Explained

When you sent that request, Zeq performed a remarkable sequence of operations—all in milliseconds. Here's what happened under the hood:

**1. Authentication & Routing (KO42 Entry Point)**
Your API key was validated and your request was routed to a distributed Zeq server. Think of this like showing your ticket at a concert—it proves you belong there.

**2. Domain & Operator Resolution**
Zeq recognized your domain as `algebra` and loaded the `polynomial_solver` operator. Behind the scenes, Zeq selected the optimal numerical algorithm for your specific problem (quadratic formula for degree-2 polynomials). If you'd sent a more complex problem, Zeq might have chosen a different algorithm entirely.

**3. KO42 Phase-Locking Protocol (The Heart)**
Here's where Zeq becomes special. The KO42 protocol synchronized your computation to the global HulyaPulse—imagine it like GPS satellites. Think of HulyaPulse like a heartbeat ticking at 1.287 Hz across every Zeq server worldwide. This synchronization ensures that:
- Your computation happened at a specific moment in time (`phase: 0.337`)
- The result is reproducible—if you run the exact same request later, you'll get the same result
- The result is cryptographically bound to this specific moment in the HulyaPulse cycle

**4. Operator Execution**
The polynomial solver ran your computation: for coefficients `[1, 2, -3]` (meaning x² + 2x - 3), it found the exact roots where the polynomial equals zero. Mathematically: x² + 2x - 3 = (x + 3)(x - 1) = 0, so x = -3 or x = 1.

**5. Precision Calculation**
Your result was verified against mathematical ground truth. The `precision: 0.0009876` (≈0.1%) tells you the result is accurate to within one part per thousand—good enough for engineering, science, and most applications.

**6. Proof Generation**
KO42 generated a cryptographic fingerprint (`zeqProof`) that uniquely binds your result to:
- Your specific computation (the operators, inputs, domain)
- The exact moment it ran (the phase)
- The result itself

If anyone ever modifies your result or claims a different answer, the zeqProof will be invalid—it's tamper-evident by design.

This entire process is what makes Zeq different from a simple equation solver. The result isn't just mathematically correct; it's *verifiable* and *auditable*. In regulated domains (medical devices, aerospace, finance), this proof is often worth more than the answer itself.

## Try These Next

Ready to explore Zeq's power? Here are three variations to build your intuition:

**Example 1: Cubic Equation (Slightly Harder)**

Solve 2x³ - 5x² + 4x - 1 = 0 to find all three roots:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "algebra",
    "operators": ["polynomial_solver"],
    "inputs": {
      "coefficients": [2, -5, 4, -1]
    },
    "mode": "algebraic"
  }'
```

Notice how `zeqProof` is different even though you're using the same domain and operator. That's because KO42 picked up a different HulyaPulse phase—your computation happened at a different moment in the cycle.

**Example 2: Linear System (Real-World)**

Solve a system of linear equations like you'd encounter in structural engineering or circuit analysis:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "algebra",
    "operators": ["linear_system_solver"],
    "inputs": {
      "A": [[3, 2], [1, 4]],
      "b": [5, 3]
    },
    "mode": "algebraic"
  }'
```

This solves the matrix equation Ax = b, finding x values that satisfy both equations simultaneously.

**Example 3: Calculus (Getting Physics)**

Compute the derivative of a polynomial at a specific point:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "calculus",
    "operators": ["derivative"],
    "inputs": {
      "expression": "x^3 + 2*x^2 - 5*x + 1",
      "variable": "x",
      "point": 2
    },
    "mode": "algebraic"
  }'
```

The derivative tells you the instantaneous rate of change—for instance, how fast a satellite is accelerating. The KO42 proof ensures engineers can audit this calculation for regulatory compliance.

## Choosing Your API Base URL

By default, use `https://zeq.dev/api/`. If you're on Replit or in an isolated environment, use `https://zeqsdk.replit.app/api/`.

## What to Explore Next

- **[Authentication](./authentication.md)** — Understand rate limits and key rotation
- **[First Computation](./first-computation.md)** — Deep dive into domain selection, operators, and input formats
- **[Understanding Responses](./understanding-responses.md)** — What precision, phase, and zeqProof really mean
