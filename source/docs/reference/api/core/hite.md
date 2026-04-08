---
id: hite
title: HITE — HulyaPulse Identity-Tied Encryption
sidebar_label: HITE
description: Equation-bound symmetric encryption and TESC sealed-envelope delivery.
---

# HITE & TESC

HITE binds a ciphertext to a ZID's identity equation: only a holder of the equation can derive the key. TESC wraps a HITE blob in a transit envelope routed by the mesh.

## POST /api/hite/encrypt

**Auth:** API key. **Rate limit:** see hiteLimiter.

```json
{ "zid": "a1b2c3...", "plaintext": "secret", "aad": "optional" }
```

Response:
```json
{ "ciphertext": "hex", "iv": "hex", "tag": "hex", "zeqond": 65392856 }
```

## POST /api/hite/decrypt

```json
{ "zid": "a1b2c3...", "ciphertext": "hex", "iv": "hex", "tag": "hex", "aad": "optional" }
```

Response: `{ "plaintext": "secret" }`

## POST /api/tesc/send

Wraps a HITE blob in a transit envelope and queues it for mesh delivery.

```json
{ "toZid": "...", "ciphertext": "hex", "iv": "hex", "tag": "hex" }
```

Response: `{ "envelopeId": "...", "queued": true, "zeqond": 65392856 }`

### curl

```bash
curl -X POST https://zeq.dev/api/hite/encrypt \
  -H "x-api-key: $ZEQ_API_KEY" -H "content-type: application/json" \
  -d '{"zid":"a1b2...","plaintext":"hello"}'
```

## Related

- [ZeqAuth ZID](../../protocols/zeq-auth-equation-based-identity/zeq-identity-mesh.md)
- [Mesh](./mesh) · [Mail](./mail)
