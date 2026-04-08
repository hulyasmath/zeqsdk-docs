---
sidebar_position: 2
title: "ZeqPulse — Live HulyaPulse Synchronisation"
description: "Real-time 1.287 Hz deterministic execution clock. Snapshot endpoint plus authenticated SSE stream."
---

# ZeqPulse — Live HulyaPulse Synchronisation

> **Layer 2 of 5.** Real-time 1.287 Hz deterministic execution clock · Zeqond counter · phase φ · SSE stream.

ZeqPulse exposes the live state of the HulyaSync master clock. The public endpoint returns a single snapshot: the current Zeqond index τ, phase φ within the active Zeqond, and the instantaneous R(t) value.

The authenticated SSE stream delivers a new pulse tick every 777 ms — one per Zeqond — allowing agents to synchronise operations, replay computations deterministically, or detect temporal drift. The Zeqond is a monotonically-increasing integer counter; two calls at the same Zeqond will return identical phase and R(t) values.

| | |
|---|---|
| **Public Endpoint** | `GET /api/zeq/pulse` |
| **Stream Endpoint** | `GET /api/zeq/pulse/stream` |
| **Stream Auth** | `zeq_ak_` required |
| **Stream Protocol** | SSE (`text/event-stream`) |
| **Tick Interval** | 777 ms (1 Zeqond) |
| **MCP Tool** | `zeq_pulse` |

## Snapshot — no auth

```bash
curl https://www.zeq.dev/api/zeq/pulse
```

```json
{
  "protocol": "ZeqPulse",
  "zeqond": 2941083127,
  "phase": 0.3214,
  "R_t": 1.000412,
  "pulseHz": 1.287,
  "zeqondSec": 0.777,
  "alpha": 0.00129,
  "precision": 0.000412,
  "timestamp": "2026-03-27T14:22:08.123Z",
  "modulation": "R(t) = [1 + α·sin(2π·f·t)] where f=1.287 Hz, α=0.00129"
}
```

## SSE stream — `zeq_ak_` required

```bash
curl -N https://www.zeq.dev/api/zeq/pulse/stream \
  -H "Authorization: Bearer $ZEQ_API_KEY"
```

```
data: {"zeqond":2941083127,"phase":0.0012,"R_t":1.000013,"pulseHz":1.287,...}
data: {"zeqond":2941083128,"phase":0.0015,"R_t":1.000891,"pulseHz":1.287,...}
```

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `zeqond` | integer | Zeqond index τ = floor(unix_ms / 777). Monotonically increasing. |
| `phase` | number | φ ∈ [0,1] — fractional position within the current Zeqond. |
| `R_t` | number | R(t) = 1 + α·sin(2π·f·t) — instantaneous HulyaPulse modulation. |
| `pulseHz` | number | Always 1.287. The HulyaPulse carrier frequency. |
| `precision` | number | \|α·sin(2π·f·t)\|, capped at 0.001. Precision guarantee. |
