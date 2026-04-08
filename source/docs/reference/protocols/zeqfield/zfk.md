---
sidebar_position: 1
title: "ZFK — ZeqField Key Activation"
description: "AES-256-GCM key derivation from HULYAS framework constants. The cryptographic foundation of the ZeqField."
---

# ZFK — ZeqField Key Activation

> **Layer 1 of 5.** AES-256-GCM key derivation · PBKDF2-SHA256 · 200,000 iterations · admin-only.

ZFK is the foundation of the ZeqField cryptographic layer. It derives a 256-bit encryption key from the HULYAS framework constants — the HulyaPulse frequency (1.287 Hz), Zeqond interval (0.777 s), coupling constant α, and operator count — combined with the `ZEQ_FIELD_KEY` environment secret via PBKDF2-SHA256 at 200,000 iterations.

The derived key encrypts all PII in the Zeq.dev system using AES-256-GCM authenticated encryption. Without `ZEQ_FIELD_KEY`, ZFK falls back to a `DATABASE_URL`-derived key — functional but weaker.

| | |
|---|---|
| **Cipher** | AES-256-GCM |
| **Key Derivation** | PBKDF2-SHA256 |
| **Iterations** | 200,000 |
| **IV Size** | 96-bit (random) |
| **Auth Tag** | 128-bit GCM |
| **Key Source** | `ZEQ_FIELD_KEY` + HULYAS salt |
| **Auth** | Admin |

## Endpoint

```http
GET /api/admin/zeqfield/status
Cookie: zeq_admin_token=<token>
```

```bash
curl https://www.zeq.dev/api/admin/zeqfield/status \
  -H "Cookie: zeq_admin_token=<token>"
```

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `cipher` | string | Always `AES-256-GCM` |
| `ZEQ_FIELD_KEY` | string | `"configured"` or `"fallback (DATABASE_URL hash)"` |
| `protocols` | string[] | All five active ZeqField protocol names |
| `endpoints` | object | Public and auth-required protocol endpoints |
