---
title: Protocols
description: 236 protocols across 39 families. Every computation the Zeq API can perform, phase-locked to 1.287 Hz.
sidebar_position: 1
---

# Protocols

**236 protocols. 39 families. One field.** Every protocol is phase-locked to the 1.287 Hz HulyaPulse and returns a signed [ZeqState](../api/zeqstate-object) with a hash-chained [Compliance Envelope](../../operate/compliance).

Use the sidebar to browse by family, or jump to the highlights below.

## Core ZeqField primitives

| # | Protocol | Layer | Endpoint | Auth |
|---|----------|-------|----------|------|
| 1 | [ZFK](./zeqfield/zfk) | ZeqField Key Activation | `POST /api/zeq/keys` | Public |
| 2 | [ZeqPulse](./zeqfield/zeqpulse) | Live HulyaPulse Synchronisation | `GET /api/zeq/pulse` · `GET /api/zeq/pulse/stream` | Public + Key |
| 3 | [ZeqProof](./zeqfield/zeqproof) | HMAC-SHA256 Result Attestation | `POST /api/zeq/verify` | Key |
| 4 | [ZeqLattice](./zeqfield/zeqlattice) | Multi-Node Coherence Grid | `POST /api/zeq/lattice` | Key |
| 5 | [ZeqShift](./zeqfield/zeqshift) | Forward Time-Series Projection | `POST /api/zeq/shift` | Key |

Plus the core compute primitive [ZeqCompute](./ode-solver-master-equation/zeq-compute) (`POST /api/zeq/compute`) and the WebSocket channel `WSS /api/zeq/ws`.

## Compliance

Every `/api/zeq/compute` response is wrapped in a hash-chained audit envelope:

- **[ZeqCompliance Envelope](./ode-solver-master-equation/zeq-compliance)** — `zeq.compliance.v1`. Satisfies FDA 21 CFR Part 11 (ALCOA), EU GMP Annex 11, ISO/IEC 27001, ISO 13485, SOX/SOC 2, DO-178C/ARP4754A, NIST SP 800-53, and GDPR Art. 30. See the full [Compliance guide](../../operate/compliance).

## All 236 protocols

Every protocol family is in the left sidebar — 39 families covering compute, ZeqField, encryption, navigation, biosignals, drug interaction, aerospace, power grids, finance, networking, and more. See the [REST API endpoint reference](../api/endpoints) for endpoints, methods, and auth requirements.
