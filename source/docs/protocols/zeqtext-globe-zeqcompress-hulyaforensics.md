---
sidebar_position: 40
title: ZeqText, Globe, ZeqCompress, HulyaForensics
description: ZeqText, Globe, ZeqCompress, HulyaForensics protocols and algorithms
---

# ZeqText, Globe, ZeqCompress, HulyaForensics

Complete reference for all ZeqText, Globe, ZeqCompress, HulyaForensics protocols in the Zeq SDK.

## Overview

The ZeqText, Globe, ZeqCompress, HulyaForensics protocol family enables advanced computational capabilities.

## Protocols (7)

### ZeqText

**Protocol ID:** `zeq-text`
**Version:** 1.287.0
**Endpoint:** `/api/tesc/send` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

TESC-encrypted messaging protocol. End-to-end AES-256-GCM with Phase-Locked Authentication Tags (PLATs) that expire every 0.777s. TESC UID serves as your phone number. WebSocket real-time delivery, typing indicators, read receipts, offline message queue, entanglement chain replay protection.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| message | `string` | Yes | Plaintext message to encrypt and send via TESC channel |
| channelId | `string` | No | TESC channel ID (auto-generated if omitted) |
| recipientUid | `string` | No | TESC UID of recipient |

#### Returns

{ protocol, channelId, encrypted, iv, plat, zeqond, phase, R_t, entanglementChain, expiresAt, ttlMs }

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


### Zeq Globe

**Protocol ID:** `zeq-globe`
**Version:** 1.287.002
**Endpoint:** `/api/zeq/globe` 🟢 GET
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Real-time 3D Earth visualization protocol. Serves USGS earthquake data (M2.5+, 60s refresh), Open-Meteo weather for 20+ cities, solar terminator, and UDPDS phi tension disaster precursor overlays. Operators: ON0, KO42.1, SEIS-PWAVE, CLIM-RCP.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| layer | `string` | No | Data layer: earthquakes | weather | terminator | udpds | all |
| minMagnitude | `number` | No | Minimum earthquake magnitude filter |

#### Returns

{ earthquakes[], weather[], terminator, udpdsRegions[], zeqond, phase }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/zeq/globe \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCompress

**Protocol ID:** `zeq-compress`
**Version:** 1.287.0
**Endpoint:** `/api/zeq/compress` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Zeqond-timestamped compression protocol. Creates .zeqc archives using Zstd level-19 compression with SHA-256 integrity verification. Custom binary format: ZEQC magic header, Zeqond timestamp, file metadata JSON, compressed payload. Includes forensic entropy analyzer (classifies data as RAW/COMPRESSED/ENCRYPTED).


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| data | `string` | Yes | Base64-encoded data to compress |
| filename | `string` | No | Original filename for archive metadata |
| level | `number` | No | Zstd compression level (1-22) |

#### Returns

{ archive (base64 .zeqc), sha256, zeqond, ratio, originalSize, compressedSize, forensic }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/compress \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDecompress

**Protocol ID:** `zeq-decompress`
**Version:** 1.287.0
**Endpoint:** `/api/zeq/decompress` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Decompress .zeqc archives. Validates ZEQC magic header, extracts Zeqond metadata, Zstd decompresses, verifies SHA-256 integrity. Returns original files with creation timestamp and compression ratio.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| archive | `string` | Yes | Base64-encoded .zeqc archive |

#### Returns

{ files[], originalZeqond, totalSize, sha256, verified }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/decompress \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqForensic

**Protocol ID:** `zeq-forensic`
**Version:** 1.287.0
**Endpoint:** `/api/zeq/forensic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Data forensic entropy analysis. Computes Shannon entropy, byte frequency distribution, SHA-256 hash, and HulyaPulse sync state. Classifies data as RAW (<6.0 bits/byte), COMPRESSED (6.0–7.5), or ENCRYPTED (>7.5). Includes pulse synchronization factor.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| data | `string` | Yes | Base64-encoded data to analyze |

#### Returns

{ sha256, size, entropy, maxEntropy, entropyRatio, verdict, pulseSync, zeqond, phase }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/forensic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### HulyaForensics Analyze

**Protocol ID:** `hf-analyze`
**Version:** 1.0
**Endpoint:** `/api/hf/analyze` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

HULYA Forensics — 20-equation pulse-synced forensic analysis. Evaluates: accuracy (HF1), manipulation detection (HF2), smear detection (HF3), source verification (HF4), legal criteria (HF5), temporal decay (HF6), consciousness reach (HF7), frequency clustering (HF8), contradiction detection (HF9), intent analysis (HF10), context matching (HF11), cluster analysis (HF12), domain diversity (HF13), resonance tracking (HF14), semantic deviation (HF15), severity scoring (HF16), sentiment analysis (HF17), fractal dimension (HF18), Bayesian inference (HF19), and composite weighted average (HF20). Final S_forensic weighted with α=0.05 pulse modulation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | `string` | Yes | Text content to analyze forensically |
| sources | `array` | No | Array of source URLs for verification scoring |

#### Returns

{ scores: { HF1..HF20 }, weights, S_forensic, verdict, zeqond, phase, pulseSync }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hf/analyze \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### HulyaForensics Score

**Protocol ID:** `hf-score`
**Version:** 1.0
**Endpoint:** `/api/hf/score` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Quick HF composite score — returns the final S_forensic value from all 20 HF equations with weighted average. Weights: HF5 (legal)=0.20, HF16 (severity)=0.20, HF20 (composite)=0.20, all others=0.05. `S_forensic = [Σ S_i·w_i]/[Σ w_i] · (1 + 0.05·sin(2π·1.287·t))`.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | `string` | Yes | Text content to score |

#### Returns

{ S_forensic, verdict, confidence, zeqond, phase }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hf/score \
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
