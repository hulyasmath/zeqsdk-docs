---
title: SDK Overview
description: Zeq is REST-first. Learn how to integrate with HTTP clients and helper SDKs.
sidebar_position: 1
---

# Zeq SDK Overview

Zeq is built on a REST-first architecture. This means you can integrate with Zeq using any HTTP client in any language—no proprietary SDK required. Just HTTP, JSON, and a Bearer token.

## Philosophy

**No vendor lock-in.** We provide helper patterns and code examples for popular languages, but the underlying API is pure REST. If you can make HTTP requests, you can use Zeq.

## Base URL

All API endpoints are accessible at:

```
https://zeq.dev/api/
```

## Authentication

Every request requires a Bearer token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Obtain your token from the [Zeq Dashboard](https://zeq.dev/dashboard). Keep it secret—treat it like a password.

## Content Type

All request and response bodies use JSON. Always set:

```
Content-Type: application/json
```

## Request Format

All endpoints accept JSON payloads. Example structure:

```json
{
  "state": {
    "x": 1.5,
    "y": 2.0,
    "z": 3.5
  },
  "time_quantum": 1
}
```

## Response Format

Successful responses (HTTP 200) return JSON with this general structure:

```json
{
  "success": true,
  "data": {
    "result": "...",
    "proof": "...",
    "timestamp": 1234567890
  },
  "timestamp": 1234567890
}
```

- **success**: Boolean indicating if the request succeeded
- **data**: The actual response payload (varies by endpoint)
- **timestamp**: Unix timestamp when the response was generated

## Error Handling Pattern

Errors return appropriate HTTP status codes with structured error details:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your tier's rate limit.",
    "details": {
      "reset_at": 1234567900
    }
  },
  "timestamp": 1234567890
}
```

Always check the HTTP status code first:

- **200**: Success
- **400**: Bad request (invalid parameters)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (tier locked or insufficient permissions)
- **429**: Rate limited (too many requests)
- **500**: Server error (try again later)

See [Error Handling](./error-handling.md) for detailed patterns and retry strategies.

## Key Concepts

### Time Quantums (Zeqonds)

Zeq operates on discrete time steps called "Zeqonds." Every computation happens at a specific time quantum. This enables:

- Deterministic replay of computations
- Temporal causality verification
- Multi-system synchronization

### Proofs

Many endpoints return cryptographic proofs that verify:
- The computation was performed correctly
- The state transition is valid
- The timestamp is authentic

You can verify proofs using the `/api/zeq/verify` endpoint. See [Operators & Verification](../core-concepts/operators.md) for details.

### Rate Limits

Your API tier determines:
- **Per-endpoint burst limit**: How many calls in quick succession
- **Daily quota**: Total calls per calendar day
- **Per-second sustained rate**: Smooth throughput limit

Response headers indicate your current status:

```
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567900
```

See [Rate Limits](./rate-limits.md) for strategies like batching, caching, and backoff.

## Choosing a Helper SDK

We provide example implementations for popular languages:

- **JavaScript/TypeScript**: Use native `fetch()` or the axios library
- **Python**: Use the `requests` library
- **Go**: Use `net/http` with proper context handling
- **Rust**: Use `reqwest` with async/await
- **Shell**: Plain `curl` is perfectly fine

Each language guide includes:
- Complete code examples
- A reusable client class/function
- Error handling patterns
- TypeScript interfaces or type hints
- Environment variable configuration

Start with the guide for your language:

- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Go SDK](./go.md)
- [Rust SDK](./rust.md)
- [curl Reference](./curl.md)

## Quick Start Example

Here's a minimal example using curl:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "state": {"x": 1.0, "y": 2.0},
    "time_quantum": 1
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "result": {
      "x": 1.5,
      "y": 2.8
    },
    "proof": "zeqproof_...",
    "timestamp": 1234567890
  },
  "timestamp": 1234567890
}
```

## What's Next?

1. **Get your token** from the [Dashboard](https://zeq.dev/dashboard)
2. **Choose your language** and read its SDK guide
3. **Explore the core endpoints**: compute, verify, pulse, operators
4. **Learn domain patterns**: See the [Guides](../guides/medical-imaging.md) for real-world examples
5. **Implement error handling** following the patterns in [Error Handling](./error-handling.md)
6. **Monitor rate limits** using headers and the strategies in [Rate Limits](./rate-limits.md)

:::tip
Start with curl to understand the API, then move to a helper SDK for production use. You'll understand the REST layer better this way.
:::
