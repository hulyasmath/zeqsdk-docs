---
sidebar_position: 2
---

# The Zeqond: Computational Time

The **Zeqond** is the unit of computational time in Zeq. Just as Unix timestamps measure time in seconds since 1970-01-01, Zeqonds measure time relative to the Zeq epoch (January 1, 2025, 00:00:00 UTC) in units of the HulyaPulse period.

## Definition

One **Zeqond** equals exactly **0.777 seconds**—the period of the HulyaPulse oscillation:

```
T_Z = 1 / f = 1 / 1.287 ≈ 0.777 seconds
```

The Zeqond timestamp is calculated as:

```
t_Zeq = (t_Unix - t_epoch) / T_Z + φ_epoch
```

where:
- **t_Unix** is the Unix timestamp (seconds since 1970-01-01)
- **t_epoch** is the Unix timestamp of the Zeq epoch: `1735689600` (2025-01-01 00:00:00 UTC)
- **T_Z = 0.777** is the Zeqond period
- **φ_epoch** is the HulyaPulse phase at the Zeq epoch (≈ 0.0)

## Conversion Formula (Unix ↔ Zeqond)

### Unix to Zeqond
```
t_Zeq = (t_Unix - 1735689600) / 0.777
```

### Zeqond to Unix
```
t_Unix = (t_Zeq × 0.777) + 1735689600
```

## Why the Zeqond?

The Zeqond is not merely a convenience—it is fundamental to Zeq because:

1. **Phase Synchronization**: Results are phase-locked to HulyaPulse. Using Zeqond as the native time unit makes this explicit.
2. **Precision**: The 0.777-second granularity matches the natural timescale of the HULYAS Master Equation solver.
3. **Reproducibility**: A computation recorded at Zeqond `t_Zeq` can be re-executed at any future Zeqond and produce identical results (given the same inputs).

## API: Bidirectional Conversion

Convert between Unix and Zeqond timestamps using the TimeBridge endpoint:

```bash
curl -X POST https://zeq.dev/api/zeq/timebridge \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "unix_timestamp": 1743339600.125,
    "direction": "to_zeqond"
  }'
```

**Response (Unix → Zeqond):**
```json
{
  "input": {
    "unix_timestamp": 1743339600.125,
    "direction": "to_zeqond"
  },
  "output": {
    "zeqond_timestamp": 2245831.445,
    "zeqond_integer_part": 2245831,
    "zeqond_fractional_part": 0.445,
    "phase_radians": 2.841
  },
  "metadata": {
    "epoch_unix": 1735689600,
    "period_zeqond_s": 0.777,
    "conversion_formula": "t_Zeq = (t_Unix - 1735689600) / 0.777"
  }
}
```

### Reverse Conversion (Zeqond → Unix)

```bash
curl -X POST https://zeq.dev/api/zeq/timebridge \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "zeqond_timestamp": 2245831.445,
    "direction": "to_unix"
  }'
```

**Response (Zeqond → Unix):**
```json
{
  "input": {
    "zeqond_timestamp": 2245831.445,
    "direction": "to_unix"
  },
  "output": {
    "unix_timestamp": 1743339600.125,
    "iso8601": "2025-03-29T13:30:00.125Z",
    "utc_date": "2025-03-29",
    "utc_time": "13:30:00.125"
  },
  "metadata": {
    "epoch_unix": 1735689600,
    "period_zeqond_s": 0.777,
    "conversion_formula": "t_Unix = (t_Zeq × 0.777) + 1735689600"
  }
}
```

## Zeqond vs. Unix: A Comparison

| Aspect | Unix Timestamp | Zeqond Timestamp |
|--------|---|---|
| **Unit** | 1 second | 0.777 seconds |
| **Epoch** | 1970-01-01 00:00:00 UTC | 2025-01-01 00:00:00 UTC |
| **Precision** | Seconds | Sub-second (phase-aware) |
| **Derivation** | Arbitrary POSIX standard | Derived from HulyaPulse physics |
| **Use Case** | General-purpose timekeeping | Zeq computation timing |

## Practical Example

Suppose you execute a computation at Unix timestamp `1743339600.125` (2025-03-29 13:30:00.125 UTC):

1. Convert to Zeqond:
   ```
   t_Zeq = (1743339600.125 - 1735689600) / 0.777
         = 7650000.125 / 0.777
         = 2245831.445
   ```

2. Record the result with Zeqond timestamp `2245831.445`.

3. To reproduce this computation 10 days later:
   - Retrieve the Zeqond timestamp from the result metadata
   - Set the HulyaPulse phase to match the original (if needed for exact reproducibility)
   - Re-execute with the same inputs

## Cross-References

- **[HulyaPulse](./hulyapulse.md)**: The 1.287 Hz frequency that defines the Zeqond period
- **[R(t) Modulation](./r-of-t.md)**: How Zeqond relates to phase modulation
- **[Seven-Step Protocol](./seven-step-protocol.md)**: Step 6 (Execute) records Zeqond timestamps

## Why Not Just Use Seconds?

You might ask: "Why create a new time unit? Isn't Unix timestamp enough?"

The answer lies in **phase synchronization and reproducibility**:

### Problem 1: Unix Timestamps Are Arbitrary

Unix timestamps measure "seconds since 1970" — a completely arbitrary epoch chosen by POSIX. There's no physical meaning to the number 1743339600 (March 29, 2025). If we use Unix seconds for Zeq, we're decoupling time from the HulyaPulse frequency.

### Problem 2: Phase Information Is Lost

When you execute a computation at Unix time `1743339600.125`, you need to then:
1. Convert to HulyaPulse phase: phase = 2π × fractional_zeqonds
2. Check if the phase is good (near a peak) or bad (near a trough)
3. Adjust the timestamp if needed for reproducibility

This is two conversions and introduces error.

### Problem 3: Sub-Second Precision Becomes Awkward

Unix timestamps in seconds have microsecond precision (1e-6 s). But HulyaPulse cycles every 0.777 seconds. If you want to know "how far into the current HulyaPulse cycle are we?", you have to compute:

```
fractional_part = (unix_timestamp - epoch) / 0.777
phase_radians = 2π × frac(fractional_part)
```

This is not elegant.

### Solution: Zeqond as the Native Unit

The **Zeqond** makes everything natural:

```
zeqond_timestamp = (unix_timestamp - epoch) / 0.777
```

Now:
- The **integer part** tells you which cycle you're in (cycle 2245831 out of infinite cycles)
- The **fractional part** directly gives phase information (0.445 means 44.5% through the cycle)
- Phase in radians is simply: `phase = 2π × fractional_part`

**Example:**

Zeqond timestamp: 2245831.445

- Cycle number: 2245831
- Progress through cycle: 0.445 = 44.5%
- Phase in radians: 2π × 0.445 = 2.80 rad (about 160°, near the trough)
- This tells you: "We're 160° into the current oscillation—not ideal for computation"

### Real-World Analogy: Clock Minutes vs. Seconds

Imagine if the world's synchronization system used only seconds (like Unix does), and you had to manually convert to minutes when needed:

```
"Meeting at 3600 seconds past the hour"
```

vs.

```
"Meeting at 60 minutes past the hour"
```

The second is clearer. Zeqond is to HulyaPulse what minutes are to hours—the natural unit for the phenomenon at hand.

---

## Conversion Quick Reference

### Common Conversions (Examples)

| Scenario | Unix Timestamp | Zeqond Timestamp | Computation Quality |
|----------|---|---|---|
| Right now | 1743339600.125 | 2245831.445 | 44.5% through cycle (OK) |
| 10 seconds later | 1743339610.125 | 2245844.369 | 1% through cycle (poor) |
| 1 hour later | 1743343200.125 | 2246299.368 | Near peak (excellent) |
| 1 day ago | 1743253200.125 | 2245363.368 | Neutral phase |

### When to Use Each Unit

| Use Unix Timestamps For | Use Zeqond Timestamps For |
|---|---|
| Logging human-readable times | Recording Zeq computation times |
| Scheduling events in calendar apps | Reproducibility and phase-locking |
| Wall-clock time display | Scientific calculations |
| Integration with legacy systems | Regulatory compliance |

---

## See Also

- [Master Equation](./master-equation.md): Solved with Zeqond as the natural time variable
- [ZeqProof](./zeqproof.md): Cryptographic binding includes the Zeqond timestamp
