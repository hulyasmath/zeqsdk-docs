---
sidebar_position: 8
title: Digital, DNA, Fingerprint, Ballistic, Document
description: Digital, DNA, Fingerprint, Ballistic, Document protocols and algorithms
---

# Digital, DNA, Fingerprint, Ballistic, Document

Complete reference for all Digital, DNA, Fingerprint, Ballistic, Document protocols in the Zeq SDK.

## Overview

The Digital, DNA, Fingerprint, Ballistic, Document protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqDigitalForensics

**Protocol ID:** `zeq-digital-forensics`
**Version:** 1.287.0
**Endpoint:** `/api/forensics/digital` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Digital forensics evidence acquisition. Disk imaging with Zeqond hash chains, file carving, timeline reconstruction, chain-of-custody logging.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| analysis | `string` | No |  |

#### Returns

{ artifacts, timeline, hashChain, chainOfCustody, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/forensics/digital \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDNAForensics

**Protocol ID:** `zeq-dna-forensics`
**Version:** 1.287.0
**Endpoint:** `/api/forensics/dna` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Forensic DNA analysis. STR profiling, mixture deconvolution, likelihood ratios, kinship analysis with HulyaPulse electropherogram peak detection.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| electropherogram | `object` | Yes | Capillary electrophoresis data. |
| contributors | `number` | No | Expected number of contributors. |
| referenceProfile | `object` | No | Known reference for comparison. |

#### Returns

{ strProfile, likelihoodRatio, matchProbability, mixture, populationStats, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/forensics/dna \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFingerprint

**Protocol ID:** `zeq-fingerprint`
**Version:** 1.287.0
**Endpoint:** `/api/forensics/fingerprint` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Fingerprint analysis with R(t) ridge enhancement. Minutiae extraction, AFIS scoring, quality assessment, latent print processing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| printImage | `object` | Yes | Fingerprint image data. |
| mode | `string` | No |  |
| reference | `object` | No | Known print for comparison. |

#### Returns

{ minutiae, quality, matchScore, ridgeCount, classification, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/forensics/fingerprint \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqBallisticForensics

**Protocol ID:** `zeq-ballistic-forensics`
**Version:** 1.287.0
**Endpoint:** `/api/forensics/ballistic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Forensic ballistics analysis. Bullet/casing comparison, trajectory reconstruction, gunshot residue pattern analysis with Zeqond-stamped evidence chain.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| evidence | `object` | Yes | Bullet/casing images and measurements. |
| analysis | `string` | No |  |

#### Returns

{ matchScore, riflingCharacteristics, trajectory, gsrPattern, firingDistance_m, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/forensics/ballistic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDocumentForensics

**Protocol ID:** `zeq-document-forensics`
**Version:** 1.287.0
**Endpoint:** `/api/forensics/document` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Questioned document examination. Handwriting analysis, ink dating, paper fiber identification, alteration detection with R(t) spectral ink aging curves.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| documentImage | `object` | Yes | High-resolution document scan. |
| analysis | `string` | No |  |
| reference | `object` | No | Known writing samples for comparison. |

#### Returns

{ findings, confidence, inkAge_estimate, alterations, writerMatch, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/forensics/document \
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
