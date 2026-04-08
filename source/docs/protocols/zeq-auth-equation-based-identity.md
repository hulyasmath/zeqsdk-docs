---
sidebar_position: 39
title: Zeq Auth, equation-based identity
description: Zeq Auth, equation-based identity protocols and algorithms
---

# Zeq Auth, equation-based identity

Complete reference for all Zeq Auth, equation-based identity protocols in the Zeq SDK.

## Overview

The Zeq Auth, equation-based identity protocol family enables advanced computational capabilities.

## Protocols (6)

### Zeq Auth — Register

**Protocol ID:** `zeq-auth-register`
**Version:** 2.0
**Endpoint:** `/api/auth/register` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Your equation IS your identity. Enter a mathematical equation — it


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| equation | `string` | Yes | Mathematical equation (max 500 chars). Supports sin, cos, tan, sqrt, log, exp, pi, e, phi, x, y. |
| displayName | `string` | Yes | Public display name. |

#### Returns

{ token, zid, displayName, avatarColor, equationHash }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auth/register \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Zeq Auth — Login

**Protocol ID:** `zeq-auth-login`
**Version:** 2.0
**Endpoint:** `/api/auth/login` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Re-enter your equation to authenticate. Same equation → same evaluation → same hash → same ZID. No password database to breach. Infinite mathematical function space.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| equation | `string` | Yes | Your equation key. |

#### Returns

{ token, zid, displayName, avatarColor }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auth/login \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Zeq Auth — Verify Token

**Protocol ID:** `zeq-auth-verify`
**Version:** 2.0
**Endpoint:** `/api/auth/verify` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Verify a Zeq Auth token. Returns validity, ZID, and display name if valid.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| token | `string` | Yes | Zeq Auth token (base64url JSON). |

#### Returns

{ valid, zid, displayName, expiresAt }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auth/verify \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### Zeq Auth — PKCE Cross-Domain

**Protocol ID:** `zeq-auth-pkce`
**Version:** 2.0
**Endpoint:** `/api/auth/pkce/authorize` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Cross-domain PKCE OAuth flow for third-party apps. 


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientId | `string` | Yes | Registered app client ID. |
| codeChallenge | `string` | Yes | PKCE code challenge (SHA-256, base64url). |
| scope | `string` | No | Requested scopes (e.g.  |
| redirectUri | `string` | Yes | Callback URL. |

#### Returns

{ authorizationCode, expiresIn, redirectUri }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auth/pkce/authorize \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMesh Identity — Federated

**Protocol ID:** `zeq-identity-mesh`
**Version:** 1.0
**Endpoint:** `/api/auth/mesh/verify` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Federated identity across Zeq instances. No central authority — your equation produces the same ZID on ANY node. Mesh verification via ZeqLattice coherence.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| zid | `string` | Yes | ZID to verify across the mesh. |
| nodes | `array` | No | Mesh node URLs to query. If omitted, uses default federation peers. |

#### Returns

{ zid, verified, meshNodes, coherenceScore, consensusReached }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/auth/mesh/verify \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqReputation — Mathematical Reputation

**Protocol ID:** `zeq-reputation`
**Version:** 1.0
**Endpoint:** `/api/auth/reputation` 🟢 GET
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Reputation score derived from computation history. More verified computations with lower error = higher reputation. Score is a function of ZeqProof chain length and precision.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| zid | `string` | Yes | ZID to query reputation for. |

#### Returns

{ zid, reputationScore, totalComputations, avgPrecision, proofChainLength, tier }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/auth/reputation \
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
