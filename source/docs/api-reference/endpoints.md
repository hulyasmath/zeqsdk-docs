---
sidebar_position: 1
title: Endpoints Reference
---

# Endpoints Reference

Complete directory of all Zeq SDK API endpoints organized by functional category.

## Core Computation

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/zeq/pulse` | POST | Required | Execute a computation pulse in the HulyaPulse field |
| `/api/zeq/pulse/stream` | POST | Required | Stream computation results in real-time as the phase evolves |
| `/api/zeq/timebridge` | POST | Required | Bridge temporal domains for cross-phase computations |

## Advanced Computation & Solving

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/zeq/compute` | POST | Required | Execute a generic computation with custom operators |
| `/api/zeq/verify` | POST | Required | Verify a computation result against a known solution |
| `/api/zeq/lattice` | POST | Required | Perform lattice-based quantum computations |
| `/api/zeq/shift` | POST | Required | Apply phase shift operations to the HulyaPulse |
| `/api/framework/solve` | POST | Required | Solve equations using the framework solver |
| `/api/framework/solve/strict` | POST | Required | Strict mode solver with guaranteed precision bounds |
| `/api/zeq/master-equation` | POST | Required | Compute using the master equation protocol |

## Data Management & Registry

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/operators` | GET | Optional | List all available operators |
| `/api/operators/categories` | GET | Optional | List operator categories and groupings |
| `/api/framework/registry` | GET | Optional | Access the protocol registry |
| `/api/framework/operator/:id` | GET | Optional | Get detailed information about a specific operator |
| `/api/framework/constants` | GET | Optional | List all mathematical constants in the framework |
| `/api/framework/constants/:key` | GET | Optional | Get value and metadata for a specific constant |
| `/api/framework/params` | GET | Optional | List available computation parameters |
| `/api/framework/protocol` | GET | Optional | Get protocol metadata and specifications |
| `/api/framework/equations` | GET | Optional | List available equation templates |
| `/api/framework/experiments` | GET | Optional | List experimental protocols (advanced tier) |

## Security & Encryption

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/hite/encrypt` | POST | Required | Encrypt data using HITE encryption protocol |
| `/api/hite/decrypt` | POST | Required | Decrypt data using HITE encryption protocol |
| `/api/tesc/send` | POST | Required | Send encrypted message via TESC protocol |
| `/api/security/zk/prove` | POST | Required | Generate zero-knowledge proof |
| `/api/security/cert/issue` | POST | Required | Issue a security certificate |

## Medical Device Integration

| Endpoint | Method | Auth | Required Tier | Description |
|----------|--------|------|---------------|-------------|
| `/api/medical/mri` | POST | Required | medical | Integrate with MRI scan devices |
| `/api/medical/ct` | POST | Required | medical | Integrate with CT scan devices |
| `/api/medical/ultrasound` | POST | Required | medical | Integrate with ultrasound devices |
| `/api/medical/xray` | POST | Required | medical | Integrate with X-ray devices |
| `/api/medical/pet` | POST | Required | medical | Integrate with PET scan devices |
| `/api/medical/dialysis` | POST | Required | medical | Integrate with dialysis machines |
| `/api/medical/ventilator` | POST | Required | medical | Integrate with mechanical ventilators |
| `/api/medical/pacemaker` | POST | Required | medical | Integrate with pacemaker devices |
| `/api/medical/insulin` | POST | Required | medical | Integrate with insulin pump devices |
| `/api/medical/eps` | POST | Required | medical | Integrate with electrophysiology systems |

## Emergency Services

| Endpoint | Method | Auth | Required Tier | Description |
|----------|--------|------|---------------|-------------|
| `/api/emergency/911` | POST | Required | emergency | File emergency alert (emergency tier) |
| `/api/emergency/triage` | POST | Required | emergency | Emergency medical triage protocol |
| `/api/emergency/ambulance` | POST | Required | emergency | Coordinate ambulance dispatch |
| `/api/emergency/disaster` | POST | Required | emergency | Disaster response coordination |
| `/api/emergency/sar` | POST | Required | emergency | Search and rescue operations |

## Gaming & Simulation

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/gaming/physics` | POST | Required | Physics simulation engine integration |
| `/api/gaming/procgen` | POST | Required | Procedural generation using Zeq algorithms |
| `/api/gaming/netcode` | POST | Required | Networking for multiplayer games |
| `/api/gaming/ai` | POST | Required | AI opponent generation and training |
| `/api/gaming/spatial-audio` | POST | Required | 3D spatial audio processing |

## Analytics & Monitoring

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/analytics/usage` | GET | Required | Get API usage statistics |
| `/api/analytics/performance` | GET | Required | Get performance metrics |
| `/api/analytics/health` | GET | Optional | Get system health status |

## Billing & Account Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/account/profile` | GET | Required | Get account profile information |
| `/api/account/keys` | GET | Required | List API keys |
| `/api/account/keys` | POST | Required | Create a new API key |
| `/api/account/keys/:id` | DELETE | Required | Revoke an API key |
| `/api/billing/usage` | GET | Required | Get detailed billing information |
| `/api/billing/invoice` | GET | Required | Access invoices |

## System Information

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/system/status` | GET | Optional | Get overall system status |
| `/api/system/version` | GET | Optional | Get API version information |
| `/api/system/capabilities` | GET | Required | Get capabilities for your tier |
| `/api/openapi.yaml` | GET | Optional | OpenAPI specification |
