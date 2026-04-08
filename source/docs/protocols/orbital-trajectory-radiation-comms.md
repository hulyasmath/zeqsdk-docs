---
sidebar_position: 22
title: Orbital, trajectory, radiation, comms
description: Orbital, trajectory, radiation, comms protocols and algorithms
---

# Orbital, trajectory, radiation, comms

Complete reference for all Orbital, trajectory, radiation, comms protocols in the Zeq SDK.

## Overview

The Orbital, trajectory, radiation, comms protocol family enables advanced computational capabilities.

## Protocols (11)

### ZeqOrbit — Orbital Mechanics

**Protocol ID:** `zeq-orbit`
**Version:** 1.0
**Endpoint:** `/api/space/orbit/compute` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Orbital mechanics computation using gravitational physics operators. Hohmann transfers, orbital elements, period, velocity — all synced to Zeqond time.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| centralBody | `string` | No |  |
| altitudeKm | `number` | Yes | Orbital altitude in km. |
| inclination | `number` | No | Orbital inclination (degrees). Default: 0. |

#### Returns

{ period, velocityMs, semiMajorAxis, eccentricity, hohmannDeltaV, orbitalElements }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/orbit/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqTrajectory — Multi-Body Optimization

**Protocol ID:** `zeq-trajectory`
**Version:** 1.0
**Endpoint:** `/api/space/trajectory/optimize` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Multi-body trajectory optimization using RK4 solver with gravitational operator coupling. Compute optimal transfer orbits between planets.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| origin | `string` | Yes | Departure body. |
| destination | `string` | Yes | Target body. |
| departureWindow | `number` | No | Search window in days. Default: 365. |
| payloadKg | `number` | No | Payload mass. |

#### Returns

{ optimalLaunchDate, totalDeltaV, flightTimeDays, trajectory: [{ t, x, y, z }], fuelMassKg }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/trajectory/optimize \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqRadiation — Space Radiation

**Protocol ID:** `zeq-radiation`
**Version:** 1.0
**Endpoint:** `/api/space/radiation/calculate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Space radiation exposure calculation using particle physics operators. GCR, SPE, and trapped radiation belt dose estimation for crew and electronics.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| altitudeKm | `number` | Yes | Orbital altitude. |
| inclination | `number` | No | Orbital inclination (degrees). |
| shieldingGcm2 | `number` | No | Aluminum-equivalent shielding (g/cm²). |
| missionDays | `number` | Yes | Mission duration in days. |

#### Returns

{ totalDoseMsv, gcrDose, speDose, trappedDose, annualLimit, shieldingEffectiveness }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/radiation/calculate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqLifeSupport — ECLSS Modeling

**Protocol ID:** `zeq-lifesupport`
**Version:** 1.0
**Endpoint:** `/api/space/lifesupport/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Environmental Control and Life Support System modeling. Atmospheric composition, thermal regulation, water recycling — closed-loop systems via coupled ODEs.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| crewSize | `number` | Yes | Number of crew members. |
| habitatVolumeM3 | `number` | Yes | Habitat volume in m³. |
| missionDays | `number` | Yes | Mission duration. |

#### Returns

{ o2ConsumptionKgDay, co2ProductionKgDay, waterRecycleRate, thermalLoadW, closureRatio }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/lifesupport/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDeepComms — Deep Space Communication

**Protocol ID:** `zeq-deepcomms`
**Version:** 1.0
**Endpoint:** `/api/space/comms/link` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Deep space communication with phase-locked signal recovery. Compensates for light-delay using Zeqond prediction — receiver knows the exact phase the signal was sent at.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| distanceAu | `number` | Yes | Distance in astronomical units. |
| txPowerW | `number` | Yes | Transmitter power in watts. |
| antennaGainDb | `number` | Yes | Antenna gain in dB. |
| frequencyGhz | `number` | No | Carrier frequency. Default: 8.4 (X-band). |

#### Returns

{ lightDelaySeconds, dataRateBps, snrDb, bitErrorRate, zeqondOffset, phaseRecovery }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/comms/link \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqReentry — Atmospheric Entry

**Protocol ID:** `zeq-reentry`
**Version:** 1.0
**Endpoint:** `/api/space/reentry/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Atmospheric reentry heating and trajectory calculation using thermodynamics + fluid dynamics operators. Heat shield requirements and landing zone prediction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| entryVelocityMs | `number` | Yes | Entry velocity (m/s). |
| entryAngleDeg | `number` | Yes | Entry angle (degrees from horizontal). |
| vehicleMassKg | `number` | Yes | Vehicle mass. |
| heatShieldType | `string` | No |  |

#### Returns

{ peakHeatingWm2, peakGforce, landingZone: { lat, lon }, totalHeatLoad, blackoutDuration }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/space/reentry/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqQuantum — Circuit Simulation

**Protocol ID:** `zeq-qc-circuit`
**Version:** 1.0
**Endpoint:** `/api/quantum/circuit/simulate` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Quantum circuit simulation using quantum mechanics operators. Simulate gates (H, CNOT, T, S, Rx, Ry, Rz) on up to 20 qubits with HulyaPulse-synced decoherence.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| qubits | `number` | Yes | Number of qubits (1–20). |
| shots | `number` | No | Measurement shots (1–10000). Default: 1024. |

#### Returns

{ statevector, measurements, probabilities, entanglementMap, circuitDepth, fidelity }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/quantum/circuit/simulate \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqQEC — Quantum Error Correction

**Protocol ID:** `zeq-qc-error`
**Version:** 1.0
**Endpoint:** `/api/quantum/error/correct` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Quantum error correction code simulation. Surface codes, Steane codes, and Shor codes with decoherence rates derived from HulyaPulse temporal stability.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| code | `string` | Yes |  |
| physicalErrorRate | `number` | Yes | Physical qubit error rate (0–1). |
| distance | `number` | No | Code distance. Default: 3. |

#### Returns

{ logicalErrorRate, physicalQubits, logicalQubits, threshold, overhead, correctable }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/quantum/error/correct \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEntangle — Entanglement Analysis

**Protocol ID:** `zeq-qc-entangle`
**Version:** 1.0
**Endpoint:** `/api/quantum/entangle/analyze` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Entanglement analysis and Bell state preparation. Compute concurrence, von Neumann entropy, and Bell inequality violations using quantum operators QM3, QM4.


#### Returns

{ concurrence, vonNeumannEntropy, bellInequality, isEntangled, schmidtCoefficients }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/quantum/entangle/analyze \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAnneal — Quantum Annealing

**Protocol ID:** `zeq-qc-anneal`
**Version:** 1.0
**Endpoint:** `/api/quantum/anneal` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Quantum annealing simulation for optimization problems. Encode QUBO/Ising models and find ground states using the HULYAS master equation as the annealing Hamiltonian.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| numReads | `number` | No | Number of annealing reads. Default: 100. |
| annealTime | `number` | No | Anneal time in Zeqonds. Default: 100. |

#### Returns

{ solution, energy, sampleSet, timing, gapEstimate }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/quantum/anneal \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqVQE — Variational Eigensolver

**Protocol ID:** `zeq-qc-vqe`
**Version:** 1.0
**Endpoint:** `/api/quantum/vqe` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Variational Quantum Eigensolver for molecular ground state energy. Parameterized circuits optimized classically, evaluated quantumly — hybrid quantum-classical on HulyaPulse.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hamiltonian | `object` | Yes | Molecular Hamiltonian in Pauli decomposition. |
| ansatz | `string` | No |  |
| maxIterations | `number` | No | Optimizer iterations. Default: 100. |

#### Returns

{ groundStateEnergy, optimalParams, convergenceHistory, chemicalAccuracy }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/quantum/vqe \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


## Common Patterns

### Usage Tips
- Review the endpoint documentation before first use
- Start with simple inputs for testing
- Monitor API quota usage
- Cache results when appropriate for your use case
