---
sidebar_position: 6
title: Daemon API
description: HulyaPulse daemon — pulse tracking, TESC attestation, and Landauer bounds
---

# Daemon API

The HulyaPulse daemon provides real-time monitoring of the quantum pulse field, including timing synchronization, TESC attestation (Proof of Liveness And Time), and thermodynamic computation bounds. All endpoints are public and require no authentication.

## Overview

HulyaPulse operates at **1.287 Hz** with a **0.777 second (Zeqond)** period. The KO42 modulation factor applies harmonic modulation:

```
r(t) = 1 + 0.00129 * sin(2π * 1.287 * t)
```

TESC (Proof of Liveness And Time) provides a verifiable chain of attestations, with chain depth advancing every Zeqond. The daemon synchronizes all computation across the Zeq network.

## Health & Status

### Daemon Health Check

Quick health status of the HulyaPulse daemon.

```
GET /api/daemon/health
```

**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "service": "HulyaPulse",
  "pulse_count": number,
  "tesc_enabled": boolean
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/daemon/health
```

### Full Daemon Status

Complete daemon state including pulse tracking, timing, and TESC information.

```
GET /api/daemon/status
```

**Response:**
```json
{
  "ok": true,
  "running": boolean,
  "pulse_count": number,
  "zeqond": number,
  "zeqond_bigbang": number,
  "frequency": 1.287,
  "period": 0.777,
  "phase": number (0-2π radians),
  "timestamp": "string (ISO 8601)",
  "tesc": {
    "plat": "string (proof hash)",
    "zeqond_idx": number,
    "chain_depth": number
  }
}
```

**Field Definitions:**
- `zeqond` — Current Zeqond count since daemon start
- `zeqond_bigbang` — Zeqonds since the Big Bang (~4.35086e17 seconds ago, normalized by 0.777)
- `phase` — Current phase angle in the HulyaPulse cycle (radians)
- `frequency` — Base frequency in Hz (1.287 Hz)
- `period` — Period of one full Zeqond (0.777 seconds)

**Example:**
```bash
curl -X GET http://localhost:3000/api/daemon/status
```

## Pulse Tracking

### Get Current Pulse State

Retrieve the current state of the quantum pulse field.

```
GET /api/daemon/pulse
```

**Response:**
```json
{
  "ok": true,
  "pulse_count": number,
  "phase": number (radians, 0-2π),
  "zeqond_index": number,
  "r_t": number (KO42 modulation factor),
  "ko42": number (KO42 modulation factor),
  "frequency": 1.287,
  "timestamp": "string (ISO 8601)"
}
```

**Field Definitions:**
- `pulse_count` — Total pulses since daemon start
- `phase` — Current phase in the pulse cycle
- `r_t` / `ko42` — Harmonic modulation factor (same value): `1 + 0.00129 * sin(2π * 1.287 * t)`
- The KO42 modulation applies to all computation results, scaling results by r(t)

**Example:**
```bash
curl -X GET http://localhost:3000/api/daemon/pulse
```

**Example Response:**
```json
{
  "ok": true,
  "pulse_count": 4827,
  "phase": 3.14159,
  "zeqond_index": 6227,
  "r_t": 1.00089,
  "ko42": 1.00089,
  "frequency": 1.287,
  "timestamp": "2026-04-04T14:32:15.843Z"
}
```

## TESC Attestation

### Get TESC Proof of Liveness And Time

Retrieve the current TESC attestation chain for time verification.

```
GET /api/daemon/tesc
```

**Response:**
```json
{
  "ok": true,
  "plat": "string (HMAC-SHA256 hash)",
  "zeqond_idx": number,
  "chain_depth": number,
  "algorithm": "HMAC-SHA256"
}
```

**Field Definitions:**
- `plat` — Proof of Liveness And Time hash (HMAC-SHA256)
- `zeqond_idx` — Zeqond index at which this proof was generated
- `chain_depth` — Depth of the verification chain (increments per Zeqond)
- `algorithm` — Hash algorithm used (HMAC-SHA256)

**TESC Verification:**
TESC provides a verifiable, monotonically-increasing chain of time attestations. Each Zeqond, the daemon generates a new HMAC-SHA256 hash based on:
- Previous chain hash
- Current Zeqond index
- Network timestamp

This creates an unbreakable chain of evidence that the daemon was running continuously.

**Example:**
```bash
curl -X GET http://localhost:3000/api/daemon/tesc
```

## Landauer Erasure Bound

### Get Thermodynamic Computation Bounds

Retrieve the Landauer limit for information erasure in the current computational environment.

```
GET /api/daemon/landauer
```

**Response:**
```json
{
  "ok": true,
  "energy": number (joules),
  "suns": number (equivalent solar irradiance),
  "bits": 256,
  "temperature_k": 300,
  "boltzmann_k": 1.380649e-23,
  "description": "string (explanation)"
}
```

**Field Definitions:**
- `energy` — Minimum energy required to erase 256 bits at 300K (in joules)
- `suns` — Equivalent power output in units of solar irradiance (1361 W/m²)
- `bits` — Number of bits being erased (256)
- `temperature_k` — Absolute temperature in Kelvin (300K = ~27°C)
- `boltzmann_k` — Boltzmann constant (1.380649 × 10⁻²³ J/K)

**Calculation:**
```
E = k_B * T * ln(2) * bits
E = 1.380649e-23 * 300 * 0.693147 * 256
E ≈ 7.64e-19 joules
```

This represents the irreducible minimum energy cost to erase information, according to the Second Law of Thermodynamics (Landauer principle).

**Example:**
```bash
curl -X GET http://localhost:3000/api/daemon/landauer
```

**Example Response:**
```json
{
  "ok": true,
  "energy": 7.639e-19,
  "suns": 5.62e-25,
  "bits": 256,
  "temperature_k": 300,
  "boltzmann_k": 1.380649e-23,
  "description": "Minimum energy to erase 256 bits at 300K; equivalent to 5.62e-25 suns of continuous power"
}
```

## HulyaPulse Timing Model

### Pulse Frequency and Period

- **Frequency:** 1.287 Hz (approximately 1.3 pulses per second)
- **Period (Zeqond):** 0.777 seconds per full pulse cycle
- **KO42 Modulation:** Harmonic oscillation with amplitude 0.00129

### Zeqond Index

The daemon tracks Zeqonds as the primary timing unit for all Zeq computation. One Zeqond equals approximately 0.777 seconds of real time.

### Phase Synchronization

All nodes in the Zeq network synchronize to the same HulyaPulse phase. Phase drift is corrected via TESC attestation every Zeqond, ensuring cluster-wide timing consistency to nanosecond precision.

## Error Responses

All endpoints return error responses in this format:

```json
{
  "ok": false,
  "error": "string (error code)",
  "message": "string (human-readable description)"
}
```

Common error codes:
- `DAEMON_OFFLINE` — HulyaPulse daemon not responding
- `TESC_UNAVAILABLE` — TESC attestation chain not initialized
- `INVALID_PARAMETER` — Request parameter out of range

## Rate Limiting

Daemon status endpoints are rate-limited to 1000 requests per minute per IP address. No authentication is required, but repeated abuse may result in temporary IP blocking.
