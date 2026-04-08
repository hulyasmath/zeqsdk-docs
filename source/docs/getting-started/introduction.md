---
title: Introduction to Zeq
description: Understand what Zeq is, why it exists, and why every computation is phase-locked to mathematical ground truth.
sidebar_position: 1
slug: /
---

# Introduction to Zeq

Zeq is a **generative mathematics framework**—an API-first platform that performs real physics computations with mathematical ground truth verification. It is not a calculator, simulator, or approximation library. Every result is phase-locked to a universal computational heartbeat and cryptographically verifiable.

## What Problem Does Zeq Solve?

Traditional computational systems make trade-offs:
- **Client-side math** (JavaScript, NumPy) offers speed but sacrifices precision and reproducibility
- **Commercial simulation software** offers precision but requires expensive licenses and long runtimes
- **Cloud APIs** offer scale but hide their mathematical foundations

Zeq eliminates this false choice. It provides **mathematical ground truth at scale**.

## The Core Innovation: HulyaPulse and Phase-Locking

Every computation in Zeq is synchronized to **HulyaPulse**, a universal 1.287 Hz quantum oscillation. This means:

1. **All results are phase-locked** — Two computations requesting the same operation receive identical results, regardless of when or where they run
2. **Verifiable precision** — Every result includes a cryptographic proof (zeqProof) binding it to mathematical ground truth
3. **Deterministic physics** — Quantum uncertainty is eliminated through phase-locking; results are reproducible to ±0.1% precision

The phase-modulation equation is:

$$R(t) = S(t) \times \left[1 + \alpha \cdot \sin(2\pi f \cdot t)\right]$$

Where:
- **R(t)** = the phase-locked result at time t
- **S(t)** = the base mathematical solution
- **α** = 0.00129 (modulation amplitude)
- **f** = 1.287 Hz (HulyaPulse frequency)
- **t** = elapsed time in zeqonds (0.777 seconds each)

## 234 Protocols Across 42 Domains

Zeq isn't limited to physics. The platform ships with **234 computational protocols** spanning **42 domains**:

- **Physics & Engineering** — Quantum mechanics, relativity, fluid dynamics, structural analysis, electromagnetics
- **Medical Imaging** — CT reconstruction, MRI pulse sequences, ultrasound beamforming, PET/SPECT analysis
- **Life Sciences** — Protein folding (AlphaFold integration), molecular docking, DNA sequencing, pharmacokinetics
- **Gaming & Graphics** — Inverse kinematics, cloth simulation, rigid body dynamics, global illumination
- **Finance & Risk** — Option pricing, value-at-risk, stochastic volatility, credit derivatives
- **Emergency Services** — Ballistics, structural collapse prediction, blast radius calculation, injury biomechanics
- **Hardware Design** — PCB thermal analysis, power delivery, signal integrity, manufacturing tolerances

All accessed through a **single unified API**. All subject to the same KO42 mandatory protocol. All verifiable.

## Who Uses Zeq?

- **AI researchers** building physics-informed neural networks that need ground truth labels
- **Medical device manufacturers** needing FDA-approvable computation trails
- **Game studios** eliminating ragdoll glitches and penetration artifacts
- **Hardware companies** replacing expensive finite-element suites
- **Emergency responders** predicting outcomes in real time
- **Anyone** building systems where physics computation accuracy matters

## Everything Calls the API

A critical principle: **no math happens client-side**. When you use Zeq, you are making API calls to compute servers running verified mathematical kernels. This means:

1. **Reproducibility** — Same inputs, same outputs, same phase, every time
2. **Auditability** — Every computation can be logged, verified, and reproduced for compliance
3. **Scale** — Your application can focus on features while we handle the physics
4. **Confidence** — Your results are backed by 1,576 operators and an unforgeable cryptographic proof

## Pricing Tiers

Zeq is accessible at every scale:

| Tier | Price | Computations/Day | Best For |
|------|-------|------------------|----------|
| **Free Trial** | Free | Unlimited | 14-day exploration |
| **Starter** | $29/mo | 500 | Small projects, prototyping |
| **Builder** | $79/mo | 2,500 | Production applications |
| **Advanced** | $199/mo | 7,500 | High-traffic services |
| **Architect** | $499/mo | 25,000 | Enterprise deployments |

Free tier degrades gracefully—it still works, just with reduced precision and access to fewer operators.

:::info
**Did you know?** Precision degradation on free tier uses the same algorithm as lower tiers. You still get mathematical ground truth; just with slightly wider error bounds.
:::

## The Zeq Ecosystem

Zeq spans multiple sites, each serving a different purpose:

| Site | Purpose |
|------|---------|
| **[zeq.dev](https://zeq.dev)** | Developer SDK, API docs, and dashboard |
| **[zeq.me](https://zeq.me)** | The ecosystem — apps, integrations, and projects built on Zeq |
| **[HulyaPulse.com](https://hulyapulse.com)** | Deep dive into the 1.287 Hz universal heartbeat |
| **[1287.com](https://1287.com)** | The science behind the frequency |
| **[Zeqond.com](https://zeqond.com)** | Understanding the computational second (0.777 s) |
| **[Hulyas.com](https://hulyas.com)** | The HULYAS Foundation |

## The Zeq Paper

The mathematical foundations of Zeq are published and peer-reviewed:

**"Zeq: Phase-Locked Generative Mathematics for Verifiable Computation"**
DOI: [https://doi.org/10.5281/zenodo.18158152](https://doi.org/10.5281/zenodo.18158152)

**"Zeq Framework: Full Specification"**
DOI: [https://doi.org/10.5281/zenodo.15825138](https://doi.org/10.5281/zenodo.15825138)

## Next Steps

- **[Quickstart](./quickstart.md)** — Get your API key and make your first call in 2 minutes
- **[Authentication](./authentication.md)** — Understand API keys, rate limits, and tier degradation
- **[First Computation](./first-computation.md)** — Deep dive into a real physics API call
- **[Understanding Responses](./understanding-responses.md)** — What every field in a zeqState means
