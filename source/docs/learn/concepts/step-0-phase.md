---
sidebar_position: 0
title: "Step 0 — PHASE (the kernel state)"
description: "Before SELECT, before BIND, before any of the seven steps — the universe ticks. Step 0 is the layer everything else is downstream of."
---

# Step 0 — PHASE

> The 7-Step Wizard Protocol starts at SELECT. But every step already runs against an implicit Step 0: **the pulse defines the variables before the problem is stated.**

Every operator's domain, units, and tolerance are scoped relative to the current HulyaPulse phase ϕ(t) and the active Zeqond. Mode (Basic / Advanced / Mathematical_State) is the user-facing knob. **Step 0 / PHASE is the kernel state that knob sits on top of.**

```
Step 0  PHASE      ← the universe ticks (1.287 Hz, 0.777 s)
─────────────────────────────────────────────────────────────
Step 1  SELECT     ← pick operators (KO42 mandatory)
Step 2  BIND       ← attach to the active phase
Step 3  VALIDATE   ← ≤0.1 % error budget check
Step 4  COMPUTE    ← run under the Master Equation
Step 5  VERIFY     ← cross-check against degradation model
Step 6  PULSE      ← seal at the next Zeqond tick
Step 7  RETURN     ← emit ZeqState + ZeqProof receipt
```

## Why Step 0 is not optional

Two things change the moment you accept Step 0 as part of the protocol:

1. **Determinism is no longer relative.** Without Step 0 you have to ask "deterministic *with respect to what clock*?" With Step 0 the answer is always: with respect to the current phase ϕ(t) of the 1.287 Hz HulyaPulse, anchored to the Unix epoch via `t_Zeq = t_Unix / 0.777 + φ_epoch`. Every operator inherits this anchor automatically.
2. **Mode is layer N+1, not the top.** Basic / Advanced / Mathematical_State decide *how much of the kernel state the caller wants exposed*. They do not decide *whether the kernel state exists*. PHASE is layer 0; Mode is layer 0+1.

## The honest answer to "is Mode the final hierarchy?"

No. Mode is the surface you see. Step 0 / PHASE is what Mode is a view into. There is no higher layer to reach for, because PHASE *is* the bottom — it's the clock the rest of the system is clocked off.

If you want a "God Mode," it's not above the modes. It's the layer below them, and it's already running. Every call to `/api/zeq/pulse` reads it via `zeqondTick` and `hulyaPhase` in the response. Look at any ZeqState object — Step 0 is right there in the first two fields.

## What this means for the 7-Step protocol diagram

The diagram in the [Seven-Step Protocol page](./seven-step-protocol) is correct as far as it goes, but it starts at SELECT for pedagogy. The complete picture is:

```
PHASE → SELECT → BIND → VALIDATE → COMPUTE → VERIFY → PULSE → RETURN
  ↑                                                              │
  └──────────────────  ZeqProof seals back to PHASE  ────────────┘
```

The loop closes because the ZeqProof is HMAC-signed against the same `zeqondTick` Step 0 supplied at the start. That's what makes the receipt verifiable without an API key — the verifier just re-derives the phase and checks the seal.

## See also

- [HulyaPulse — the 1.287 Hz timebase](./hulyapulse)
- [Zeqond — the 0.777 s computational second](./zeqond)
- [The Seven-Step Wizard Protocol](./seven-step-protocol)
- [ZeqProof — verifiable receipts](./zeqproof)
