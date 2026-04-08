---
sidebar_position: 12
title: "ZID — Zero-Knowledge Identity"
description: "ZID is the first 32 hex chars of SHA-256(equation). Identity = equation. No email, no password, no PII."
---

# ZID — Zero-Knowledge Identity

> Your identity in Zeq OS is an equation. Nothing more.

A **ZID** is a 32-character lowercase hex string derived as:

```
ZID = sha256(equation).slice(0, 32)
```

The `equation` is any string you choose — a mantra, a derivation, a private polynomial. It is never sent to the server. You compute the SHA-256 locally; only the truncated digest leaves your machine. The server stores the ZID and nothing that maps back to you.

This is what we mean by **zero-knowledge**: the system can prove you are the same caller across requests without ever knowing who you are.

## Properties

| Property | Value |
|---|---|
| Length | 32 hex chars (128 bits) |
| Derivation | `sha256(equation)[0:32]` |
| Reversibility | None — the equation never leaves the client |
| Collision space | 2¹²⁸ |
| Stored server-side | Yes (the digest only) |
| Email required | **No** |
| Password required | **No** |

## Lifecycle

1. **Register** — `POST /api/zeq-auth/register` with `{ zid, displayName }`. The server returns a JWT bearing your ZID as `sub`.
2. **Verify** — `POST /api/zeq-auth/verify` re-derives the JWT from a fresh ZID proof.
3. **Inspect** — `GET /api/zeq-auth/me` returns `{ zid, displayName, plan, active, createdAt, lastLoginAt }`. No email, ever.

The legacy `email_encrypted` / `email_iv` columns on the `zeq_identities` table are marked `@deprecated` as of Phase C (2026-04). No new writes touch them; they exist only so pre-cleanup rows continue to load.

## Mesh coherence

When a ZID appears across multiple ZeqMesh nodes, conflicts are resolved by the **earlier-zeqond-wins** rule: the node whose registration carries the lowest [Zeqond](./zeqond) tick is canonical. Use `POST /api/mesh/verify` to obtain a coherence score for any ZID, and `GET /api/mesh/status` for live mesh health.

## Why this matters

Traditional auth systems force you to hand over an email, a password, and a recoverable identity to a third party. ZID inverts that: you keep the equation, the server keeps the digest, and the bridge between them is one-way SHA-256. The user is unforgeable to the server, and the server is unauthoritative over the user.

## Related

- [ZeqProof](./zeqproof) — the HMAC envelope the server returns once you authenticate
- [ZeqState](./zeqstate) — what gets published every time your ZID makes a billable call
- [CKO](./cko) — the canonical kernel output that wraps every authenticated response
