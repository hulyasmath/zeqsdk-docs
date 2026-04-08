---
sidebar_position: 31
title: Risk, pricing, audit
description: Risk, pricing, audit protocols and algorithms
---

# Risk, pricing, audit

Complete reference for all Risk, pricing, audit protocols in the Zeq SDK.

## Overview

The Risk, pricing, audit protocol family enables advanced computational capabilities.

## Protocols (4)

### ZeqRisk — Risk Modeling

**Protocol ID:** `zeq-risk`
**Version:** 1.0
**Endpoint:** `/api/finance/risk/model` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Risk modeling using chaotic systems and statistical mechanics operators. Monte Carlo simulations on the Zeqond grid — every simulation step is timestamped and verifiable.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| horizonDays | `number` | No | Risk horizon in days. Default: 252 (1 year). |
| simulations | `number` | No | Monte Carlo runs (100–10000). Default: 1000. |
| confidenceLevel | `number` | No | VaR confidence (0.90–0.999). Default: 0.95. |

#### Returns

{ valueAtRisk, conditionalVaR, sharpeRatio, maxDrawdown, correlationMatrix, simulated }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/finance/risk/model \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPrice — Fair Value Discovery

**Protocol ID:** `zeq-price`
**Version:** 1.0
**Endpoint:** `/api/finance/price/discover` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Fair value computation at each Zeqond. R(t)-modulated pricing shows how value oscillates around equilibrium — temporal price transparency.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| baseValue | `number` | Yes | Base asset value. |
| volatility | `number` | Yes | Annual volatility (0–1). |
| riskFreeRate | `number` | No | Risk-free rate. Default: 0.05. |

#### Returns

{ fairValue, R_t_modulated, confidence, zeqond, temporalSpread }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/finance/price/discover \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAuditFin — Financial Audit Trail

**Protocol ID:** `zeq-audit-fin`
**Version:** 1.0
**Endpoint:** `/api/finance/audit/record` 🔵 POST
**Authentication:** Required
**Rate Limit:** 60/min

#### Description

Financial transaction audit with ZeqProof chains. Every transaction cryptographically linked to the exact Zeqond — immutable, verifiable, tamper-evident.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| transactionId | `string` | Yes | Transaction identifier. |
| amount | `number` | Yes | Transaction amount. |
| parties | `array` | Yes | Array of party ZIDs involved. |

#### Returns

{ auditRecord, zeqProof, zeqond, chainPosition, previousProof, verified }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/finance/audit/record \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDerivatives — Options Pricing

**Protocol ID:** `zeq-derivatives`
**Version:** 1.0
**Endpoint:** `/api/finance/derivatives/price` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Options pricing using Black-Scholes and binomial models computed via the HULYAS solver. Greeks (delta, gamma, theta, vega, rho) at each Zeqond.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `string` | Yes |  |
| spotPrice | `number` | Yes | Current asset price. |
| strikePrice | `number` | Yes | Strike price. |
| timeToExpiry | `number` | Yes | Time to expiry in years. |
| volatility | `number` | Yes | Implied volatility. |
| riskFreeRate | `number` | No | Risk-free rate. Default: 0.05. |

#### Returns

{ price, delta, gamma, theta, vega, rho, impliedVol, model }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/finance/derivatives/price \
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
