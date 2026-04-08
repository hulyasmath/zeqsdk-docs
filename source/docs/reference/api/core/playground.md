---
id: playground
title: Playground — Try Zeq without an API key
sidebar_label: Playground
description: Anonymous, rate-limited compute endpoint that powers the public playground UI.
---

# Playground

The playground gives anyone a way to fire a Zeq computation without signing up. Calls are anonymous, heavily rate-limited per IP, capped to short operator chains, and **always publish** to the public ZeqState feed.

## POST /api/playground/compute

**Auth:** None.
**Rate limit:** `playgroundRateLimiter` — strict per-IP.
**Publishes to ZeqState:** Always (intent: `playground`).

### Request

```json
{
  "operators": ["KO42", "QM1"],
  "domain": "quantum",
  "intent": "demo"
}
```

### Response

A trimmed CKO:

```json
{
  "operators": ["KO42","QM1"],
  "masterSum": -1.4142,
  "R_t": 1.00128,
  "phase": 0.4127,
  "zeqond": 65392856,
  "precisionBound": 0.000181,
  "stateUrl": "https://zeq.dev/state/<row-id>"
}
```

The `stateUrl` lets the caller jump straight to the published Explorer row.

### Limits

- Max 3 operators per call (KO42 + 2)
- 10 calls / minute / IP
- No `lattice`, `shift`, or `genesis` exposure
- No ZeqProof returned (no key context)

### curl

```bash
curl -X POST https://zeq.dev/api/playground/compute \
  -H "content-type: application/json" \
  -d '{"operators":["KO42","QM1"],"domain":"quantum"}'
```

## Related

- [Compute](./compute) · [ZeqState Explorer](https://zeq.dev/state/)
