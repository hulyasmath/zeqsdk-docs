---
title: API Reference
description: REST endpoints, OpenAPI spec, error codes, and core API objects.
sidebar_position: 1
---

# API Reference

The Zeq API is a single REST surface. Every endpoint takes JSON and returns JSON. Every response is signed with a ZeqProof HMAC and a hash-chained compliance envelope.

## Quick links

- **[OpenAPI Spec](./openapi)** — machine-readable schema, copy-paste into Postman/Insomnia/Bruno.
- **[Endpoints](./endpoints)** — every endpoint, grouped by family.
- **[Error Codes](./error-codes)** — every error the API can return and how to recover.
- **[ZeqState Object](./zeqstate-object)** — the canonical computation result shape.
- **[Daemon API](./daemon-api)** · **[Mail API](./mail-api)** · **[Mesh API](./mesh-api)**

## Base URL

```
https://www.zeq.dev
```

All requests authenticate with `Authorization: Bearer YOUR_KEY`.
