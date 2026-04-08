---
sidebar_position: 0
title: "Operate — Overview"
description: "Run Zeq OS in production: error handling, rate limits, webhooks, and observability via ZeqState."
---

# Operate

This section covers everything you need to run Zeq OS workloads in production.

| Page | What it covers |
|---|---|
| [Error Handling](./error-handling) | Canonical error envelope, retry strategy, idempotency, KO42 violation codes |
| [Rate Limits](./rate-limits) | Per-plan limits, headers (`X-RateLimit-*`), burst windows, 429 handling |
| [Webhooks](./webhooks) | Signed webhook delivery, replay protection, ZeqState fan-out |

## Observability via ZeqState

Every billable computation emits a [ZeqState](../learn/concepts/zeqstate) record carrying the full [CKO envelope](../learn/concepts/cko) — operator chain, [HulyaPulse](../learn/concepts/hulyapulse) phase, [Zeqond](../learn/concepts/zeqond) tick, [ZeqProof](../learn/concepts/zeqproof), and the precision bound. Free and starter plans publish to the public feed at [zeq.dev/state](https://zeq.dev/state); paid plans default to private and can opt-in per request.

Use ZeqState as your audit trail — every response your code receives is independently re-derivable from the published envelope.
