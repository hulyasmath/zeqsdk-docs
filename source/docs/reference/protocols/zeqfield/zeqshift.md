---
title: "ZeqShift — Temporal Bridge"
sidebar_position: 5
description: "Lossless conversion between Unix time and Zeqond time."
---

# ZeqShift

**Purpose.** ZeqShift is the temporal bridge between the Unix epoch (1-second ticks) and Zeqond time (0.777-second ticks at 1.287 Hz). Every other Zeq protocol assumes Zeqond time internally; ZeqShift is how the outside world talks to it without losing phase.

## What it does

ZeqShift implements the Zeqond ↔ Unix synchronization equation verbatim:

```
t_Zeq    = t_Unix / 0.777 + φ_epoch
φ_current = ((t_Unix mod 0.777) / 0.777) × 2π
```

Convert in either direction. Convert single timestamps or batches. Convert with or without the phase overlay. Round-trips are lossless to within floating-point precision.

## When to use it

Any time you need to feed a wall-clock timestamp into Zeq (for example, scheduling a computation to fire at a specific HulyaPulse phase), or any time you need to translate a Zeq result back into a timestamp humans and existing systems can read. ZeqShift is also what stamps `zeqond` and `phase` fields onto receipts and snapshots.

## How to call it

### Unix → Zeqond

```bash
curl -X POST https://api.zeq.dev/v1/zeqshift/unix-to-zeq \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "unix": 1775692800 }'
```

### Zeqond → Unix

```bash
curl -X POST https://api.zeq.dev/v1/zeqshift/zeq-to-unix \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "zeqond": 2285318404.12 }'
```

### Current phase

```bash
curl https://api.zeq.dev/v1/zeqshift/now \
  -H "Authorization: Bearer $ZEQ_API_KEY"
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `unix` | number | Unix seconds |
| `zeqond` | number | Zeqonds since Unix epoch |
| `phase` | number | HulyaPulse phase φ ∈ [0, 1) |
| `phase_rad` | number | Phase in radians ∈ [0, 2π) |
