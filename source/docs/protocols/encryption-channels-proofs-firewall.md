---
sidebar_position: 10
title: Encryption, channels, proofs, firewall
description: Encryption, channels, proofs, firewall protocols and algorithms
---

# Encryption, channels, proofs, firewall

Complete reference for all Encryption, channels, proofs, firewall protocols in the Zeq SDK.

## Overview

The Encryption, channels, proofs, firewall protocol family enables advanced computational capabilities.

## Protocols (8)

### HITE Encryption

**Protocol ID:** `hite-encrypt`
**Version:** 2.0
**Endpoint:** `/api/hite/encrypt` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

HULYAS Information-Theoretic Encryption — AES-256-GCM with PBKDF2-SHA256 key derived from HulyaPulse constants. Includes Landauer certificate.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| plaintext | `string` | Yes | Data to encrypt (max 64KB). |

#### Returns

{ ciphertext, iv, tag, algorithm, keyDerivation, landauerCertificate }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hite/encrypt \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### HITE Decryption

**Protocol ID:** `hite-decrypt`
**Version:** 2.0
**Endpoint:** `/api/hite/decrypt` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Decrypt HITE-encrypted data. GCM authentication tag verified — integrity guaranteed.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| ciphertext | `string` | Yes | Encrypted data (hex). |
| iv | `string` | Yes | Initialization vector (hex). |
| tag | `string` | Yes | GCM auth tag (hex, 32 chars). |

#### Returns

{ plaintext, verified, algorithm }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hite/decrypt \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### TESC Encrypted Channel

**Protocol ID:** `tesc-channel`
**Version:** 1.0
**Endpoint:** `/api/tesc/send` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Temporal Entangled State Channel — AES-256-GCM with Phase-Locked Authentication Tags (PLATs) valid for exactly one Zeqond (0.777s). Replay impossible.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| message | `string` | Yes | Message to send (max 16KB). |
| channelId | `string` | No | Channel ID. Auto-generated if omitted. |

#### Returns

{ encrypted, plat, zeqond, phase, entanglementChain, expiresAt, ttlMs }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/tesc/send \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqZK — Zero-Knowledge Proof

**Protocol ID:** `zeq-zk`
**Version:** 1.0
**Endpoint:** `/api/security/zk/prove` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Zero-knowledge proof using HULYAS field evaluation. Prove you know an equation that produces a specific R(t) value without revealing the equation. Based on the Zeq Auth principle: the equation is never transmitted.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| commitment | `string` | Yes | SHA-256 hash of the equation + evaluation result (the ZID derivation). |
| challenge | `number` | No | Verifier |

#### Returns

{ proof, commitment, challenge, verified, zeqond, protocol }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/security/zk/prove \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCert — Mathematical Certificate

**Protocol ID:** `zeq-cert`
**Version:** 1.0
**Endpoint:** `/api/security/cert/issue` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Mathematical certificate authority. Certificates derived from operator coupling strength — not PKI trees. A cert is a ZeqProof chain binding identity to a set of verified computations.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| subject | `string` | Yes | ZID or entity identifier. |
| scope | `array` | Yes | Array of protocol IDs this cert authorizes. |
| ttlHours | `number` | No | Certificate validity in hours (1–720). Default: 168 (7 days). |

#### Returns

{ certificate, subject, scope, issuedAt, expiresAt, zeqProofChain, fingerprint }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/security/cert/issue \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqKeyEx — Temporal Key Exchange

**Protocol ID:** `zeq-keyex`
**Version:** 1.0
**Endpoint:** `/api/security/keyex/init` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Diffie-Hellman key exchange over the Zeqond grid. Both parties derive a shared secret synchronized to the same HulyaPulse phase — temporal key agreement.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | `string` | Yes | Initiator |
| targetZid | `string` | No | Target ZID for directed exchange. |

#### Returns

{ sessionId, publicKey, zeqond, phase, expiresAt, protocol }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/security/keyex/init \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFirewall — Phase-Locked ACL

**Protocol ID:** `zeq-firewall`
**Version:** 1.0
**Endpoint:** `/api/security/firewall/check` 🔵 POST
**Authentication:** Required
**Rate Limit:** 120/min

#### Description

Phase-locked access control. Requests only valid within specific Zeqond windows. Define time-gated permissions that open and close on the HulyaPulse cycle.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| resource | `string` | Yes | Resource path to check access for. |
| zid | `string` | Yes | Requester |

#### Returns

{ allowed, resource, zid, currentZeqond, windowActive, reason }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/security/firewall/check \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAudit — Computation Audit Trail

**Protocol ID:** `zeq-audit`
**Version:** 1.0
**Endpoint:** `/api/security/audit/chain` 🟢 GET
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Immutable computation audit trail. Every ZeqProof is chained — each proof references the previous one, creating an unforgeable computation history.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| zid | `string` | No | Filter by ZID. |
| from | `number` | No | Start zeqond. |
| to | `number` | No | End zeqond. |

#### Returns

{ chain: [{ zeqProof, operatorIds, R_t, zeqond, previousProof }], length, integrity }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/security/audit/chain \
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
