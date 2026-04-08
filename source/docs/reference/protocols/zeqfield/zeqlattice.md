---
title: "ZeqLattice — Multi-Scale Field Mesh"
sidebar_position: 4
description: "Phase-locked spatial lattice for coupling operators across scales."
---

# ZeqLattice

**Purpose.** ZeqLattice provides a phase-coherent spatial mesh that lets operators at different scales — quantum, classical, relativistic — talk to each other without losing synchronization to the 1.287 Hz HulyaPulse. It's the substrate Zeq uses to solve multi-scale problems (e.g. molecular dynamics coupled to bulk fluid flow) without scale-mismatch drift.

## What it does

ZeqLattice builds a 3D (or N-D) grid where each cell carries:

- A local field state ϕ(x, t)
- A local phase offset relative to the global HulyaPulse
- A list of active operators bound to that cell

You publish updates to cells; the lattice resolves cross-scale couplings every Zeqond and emits a coherent snapshot. The KO42 metric tensioner is automatically applied so cells stay phase-locked even under heavy nonlinear load.

## When to use it

Reach for ZeqLattice when a single operator chain isn't enough — when you need a *spatial* simulation that mixes domains. Examples: medical imaging reconstruction (voxels + acquisition physics), game physics (rigid body + fluid + soft body), climate cells, or any HULYAS Master Equation deployment that needs ϕ(x, t) over a region instead of a point.

## How to call it

### Create a lattice

```bash
curl -X POST https://api.zeq.dev/v1/zeqlattice/create \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dims": [64, 64, 64],
    "operators": ["KO42", "QM1", "GR33"],
    "spacing": 0.01
  }'
```

### Step the lattice

```bash
curl -X POST https://api.zeq.dev/v1/zeqlattice/{id}/step \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -d '{ "zeqonds": 1 }'
```

### Read a snapshot

```bash
curl https://api.zeq.dev/v1/zeqlattice/{id}/snapshot \
  -H "Authorization: Bearer $ZEQ_API_KEY"
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Lattice handle |
| `phase` | number | Current global HulyaPulse phase |
| `cells` | array | Per-cell ϕ values and local phase offsets |
| `coherence` | number | Global phase coherence score (1.0 = perfect lock) |
