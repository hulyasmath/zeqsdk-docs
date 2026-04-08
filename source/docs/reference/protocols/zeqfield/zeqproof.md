---
title: "ZeqProof — Cryptographic Receipts"
sidebar_position: 3
description: "HMAC-SHA256 receipts that prove a computation was phase-locked at a specific Zeqond."
---

# ZeqProof

**Purpose.** ZeqProof issues tamper-evident receipts for any Zeq computation. Every receipt binds the input, the output, the operator stack, and the exact HulyaPulse phase at execution time, signed with HMAC-SHA256. If anyone — including you — tries to replay or alter a result, the receipt fails verification.

## What it does

Given a computation result, ZeqProof captures:

- The canonical hash of inputs and outputs
- The Zeqond index and phase φ at execution
- The operator chain (e.g. `KO42 → QM5 → GR33`)
- An HMAC-SHA256 signature over all of the above

Receipts are deterministic: the same inputs at the same phase produce the same receipt. Different phases produce different receipts — that's the point.

## When to use it

Use ZeqProof whenever a downstream system needs to trust that a computation actually happened, when it happened, and that nothing has been altered since. Audit trails, regulated workflows (medical, financial, legal), reproducibility logs, and anti-replay defenses are the canonical use cases.

## How to call it

### REST

```bash
curl -X POST https://api.zeq.dev/v1/zeqproof/sign \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "computation_id": "compute_8f3a",
    "inputs": { "x": 1.287 },
    "outputs": { "y": 0.777 },
    "operators": ["KO42", "QM5"]
  }'
```

### Verify

```bash
curl -X POST https://api.zeq.dev/v1/zeqproof/verify \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "receipt": "<receipt-jwt>" }'
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `receipt` | string | Base64url JWT-style receipt |
| `zeqond` | number | Zeqond index at signing |
| `phase` | number | HulyaPulse phase φ ∈ [0,1) |
| `signature` | string | HMAC-SHA256 over canonical payload |
| `operators` | string[] | Operator chain at execution |
