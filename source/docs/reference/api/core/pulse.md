---
title: "GET /api/zeq/pulse"
sidebar_label: "pulse"
sidebar_position: 5
description: "Read the current HulyaPulse phase, Zeqond, and frequency. Public, unauthenticated. Also exposes a Server-Sent Events stream of pulses, one per Zeqond."
---

# `GET /api/zeq/pulse`

Read the current **HulyaPulse** snapshot — the live phase, Zeqond tick, and 1.287 Hz carrier frequency the entire Zeq kernel is locked to. This endpoint is **public** (no API key required) and is the canonical way to align an external system to Zeq time.

> The companion endpoint **`GET /api/zeq/pulse/stream`** is a Server-Sent Events stream that emits one event per Zeqond (~0.777 s).

---

## Authentication

**None.** Public endpoint.

The streaming variant `/api/zeq/pulse/stream` does require `Authorization: Bearer $ZEQ_API_KEY`.

---

## Request

```http
GET /api/zeq/pulse HTTP/1.1
Host: www.zeq.dev
```

No body, no query params.

---

## Response

```json
{
  "ok": true,
  "phase": 0.5432,
  "zeqond": 2285084179,
  "zeqondSec": 0.7770800311,
  "pulseHz": 1.287,
  "alpha": 0.00129,
  "unixMs": 1775510398395,
  "computedAt": "2026-04-06T21:30:00.000Z",
  "equation": "R(t) = S(t) × [1 + α·sin(2π·1.287·t)]"
}
```

| Field | Type | Meaning |
|---|---|---|
| `phase` | number | Current Step 0 phase in `[0, 1)`. |
| `zeqond` | number | Integer Zeqond tick since Unix epoch. |
| `zeqondSec` | number | Length of one Zeqond in seconds (`0.7770800311`). |
| `pulseHz` | number | HulyaPulse carrier frequency (`1.287`). |
| `alpha` | number | R(t) modulation amplitude (`0.00129`). |
| `unixMs` | number | Server Unix time in milliseconds at the moment of read. |

---

## Streaming variant

`GET /api/zeq/pulse/stream` opens an SSE channel that emits one `pulse` event per Zeqond. Each event payload is the same shape as the snapshot above.

### curl

```bash
curl -N https://www.zeq.dev/api/zeq/pulse/stream \
  -H "Authorization: Bearer $ZEQ_API_KEY"
```

### JavaScript

```javascript
const es = new EventSource("https://www.zeq.dev/api/zeq/pulse/stream");
es.addEventListener("pulse", (e) => {
  const p = JSON.parse(e.data);
  console.log("zeqond", p.zeqond, "phase", p.phase.toFixed(4));
});
```

---

## ZeqState publish behavior

`/api/zeq/pulse` and `/api/zeq/pulse/stream` do **not** publish to the ZeqState feed. Reading the pulse is not a computation.

---

## Examples

### curl

```bash
curl https://www.zeq.dev/api/zeq/pulse
```

### Python

```python
import httpx
print(httpx.get("https://www.zeq.dev/api/zeq/pulse").json())
```

---

## Related

- [HulyaPulse concept](../../../learn/concepts/hulyapulse)
- [Zeqond concept](../../../learn/concepts/zeqond)
- [`/api/zeq/shift`](./shift) — project an operator chain across multiple Zeqonds
