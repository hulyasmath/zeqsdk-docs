---
sidebar_position: 2
title: ZeqState Response Object
---

# ZeqState Response Object

The `ZeqState` object is the standard response format for all computation endpoints in the Zeq SDK. It encapsulates the complete state of a computation at a specific moment in time.

## Overview

Every successful computation returns a `ZeqState` object containing:
- The computation result (masterSum)
- Current quantum state information
- Precision metrics
- Operator trace information
- Field strength and modulation data

## Field Reference

### masterSum
**Type:** `number`

The primary result of the computation. This is the R(t) value modulated by the current phase in the HulyaPulse field. On paid tiers, this value is guaranteed to have precision ≤ 0.001.

**Usage:** This is typically what you care about—the actual answer to your computation.

```javascript
const result = zeqState.masterSum;  // e.g., 3.14159265358979
```

---

### phase
**Type:** `number` (range: [0, 1))

The current phase of the HulyaPulse oscillation at the moment of computation. Phases closer to 0.5 typically have better precision. The phase drifts continuously and affects all computation results.

**Usage:** Use to understand timing and potential precision. Recompute at a better phase for higher precision results.

```javascript
if (zeqState.phase > 0.45 && zeqState.phase < 0.55) {
  console.log("Peak phase - best precision");
}
```

---

### precision
**Type:** `number`

The achieved precision of the computation result. This is an estimated error bound. For paid tier users, always ≤ 0.001. Free tier may reach 0.1 or higher.

**Usage:** Determine confidence in the result. If precision is unacceptable, retry the computation.

```javascript
if (zeqState.precision > 0.01) {
  console.log(`Warning: result may have error of ±${zeqState.precision}`);
}
```

---

### zeqond
**Type:** `number` (integer)

The number of "zeqonds" (Zeq time units) that have elapsed since the API server started. This is a monotonically increasing counter used for tracking computation timing.

**Usage:** Correlate computations with specific moments in time, debug timing issues, or implement time-based caching.

```javascript
const timeElapsed = currentState.zeqond - previousState.zeqond;
```

---

### operators
**Type:** `string[]`

Array of operator IDs that were actually used in the computation. The special operator `KO42` (Kormeister-Okamoto universal operator) is always included as a fallback.

**Usage:** Understand which operators contributed to your result. Useful for reproducibility and debugging.

```javascript
console.log(`Computation used operators: ${zeqState.operators.join(", ")}`);
// Example output: ["OP_VECTOR_TRANSFORM", "OP_PHASE_LOCK", "KO42"]
```

---

### R_t
**Type:** `number`

The unmodulated result value before phase modulation is applied. This is the "raw" computation output before the HulyaPulse phase affects it.

```javascript
const rawResult = zeqState.R_t;
const modulatedResult = zeqState.masterSum;
// masterSum = R_t * phase_modulation_function(phase)
```

---

### fieldStrength
**Type:** `number` (range: [0, 1])

The current strength of the HulyaPulse field. This affects the magnitude of phase-based modulation. Higher field strength means stronger phase effects.

**Usage:** Understand how much the phase affects the result. With fieldStrength = 0, phase has no effect.

```javascript
if (zeqState.fieldStrength > 0.8) {
  console.log("High field strength - phase timing is critical");
}
```

---

### modulation
**Type:** `object`

Detailed information about the phase modulation applied to the result.

#### modulation.alpha
**Type:** `number`

The modulation amplitude. Controls how much the phase oscillates the result.

#### modulation.frequency
**Type:** `number`

The frequency of phase oscillation in Hz (cycles per zeqond).

#### modulation.waveform
**Type:** `string`

The shape of the modulation: `"sine"`, `"cosine"`, `"triangle"`, or `"square"`.

**Usage:** Advanced tuning of computation behavior. Frequency affects how quickly results change with phase.

```javascript
const mod = zeqState.modulation;
console.log(`Modulation: ${mod.waveform} at ${mod.frequency}Hz, amplitude=${mod.alpha}`);
```

---

## Complete Example Response

```json
{
  "masterSum": 2.718281828459045,
  "phase": 0.6234567890123456,
  "precision": 0.0008347234,
  "zeqond": 4892734632,
  "operators": [
    "OP_EXPONENTIAL_DECAY",
    "OP_PHASE_LOCK",
    "KO42"
  ],
  "R_t": 2.650234092834,
  "fieldStrength": 0.8932,
  "modulation": {
    "alpha": 1.05234,
    "frequency": 2.341,
    "waveform": "sine"
  }
}
```

## Usage Patterns

### Safe Result Extraction

Always check precision before using a result in critical applications:

```javascript
async function computeWithValidation(input) {
  const state = await zeqAPI.compute(input);

  if (state.precision > 0.001) {
    throw new Error(`Precision insufficient: ${state.precision}`);
  }

  return state.masterSum;
}
```

### Retrying for Better Precision

If precision is poor, retry at a different phase:

```javascript
async function computeOptimal(input, maxRetries = 5) {
  let best = null;

  for (let i = 0; i < maxRetries; i++) {
    const state = await zeqAPI.compute(input);

    if (!best || state.precision < best.precision) {
      best = state;
    }

    if (state.precision <= 0.0001) {
      break;  // Good enough
    }

    await sleep(100);  // Wait for phase to change
  }

  return best;
}
```

### Timing Correlation

Track which computations ran at the same time:

```javascript
const computation1 = await zeqAPI.compute(input1);
const computation2 = await zeqAPI.compute(input2);

if (computation1.zeqond === computation2.zeqond) {
  console.log("These computations ran simultaneously");
}
```

### Phase-Aware Scheduling

Optimize when you run computations based on phase:

```javascript
async function computeAtBestPhase(input) {
  let best = await zeqAPI.compute(input);

  // Retry until phase is near optimal (0.5)
  while (Math.abs(best.phase - 0.5) > 0.05) {
    await sleep(100);
    best = await zeqAPI.compute(input);
  }

  return best;
}
```

## Tier-Specific Behavior

| Field | Free Tier | Standard Tier | Professional Tier |
|-------|-----------|---------------|-------------------|
| `precision` | 0.01 - 0.1 | 0.001 - 0.01 | ≤ 0.0001 guaranteed |
| `masterSum` | Basic operators only | Most operators | All operators |
| `modulation` | Read-only | Read-only | Configurable |
| `fieldStrength` | 0.5 fixed | 0.6-0.9 | 0.1-1.0 range |
