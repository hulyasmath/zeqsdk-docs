---
sidebar_position: 37
title: Usage, keys, status
description: Usage, keys, status protocols and algorithms
---

# Usage, keys, status

Complete reference for all Usage, keys, status protocols in the Zeq SDK.

## Overview

The Usage, keys, status protocol family enables advanced computational capabilities.

## Protocols (2)

### API Usage

**Protocol ID:** `zeq-usage`
**Version:** 1.0
**Endpoint:** `/api/zeq/usage` 🟢 GET
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Current API usage — calls used today, daily limit, remaining, plan tier.


#### Returns

{ used, limit, remaining, plan, resetAt }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/zeq/usage \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqField Status

**Protocol ID:** `zeq-field-status`
**Version:** 1.0
**Endpoint:** `/api/admin/zeqfield/status` 🟢 GET
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Cryptographic infrastructure status — cipher, key derivation, salt source, proof algorithm. No key material exposed.


#### Returns

{ protocol, cipher, keyDerivation, saltSource, proofAlgorithm, ZEQ_FIELD_KEY, protocols }

#### Example

```bash
curl -X GET \
  https://api.zeq.io/api/admin/zeqfield/status \
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
