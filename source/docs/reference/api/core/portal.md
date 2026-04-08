---
id: portal
title: Portal — User account & key management
sidebar_label: Portal
description: Authenticated endpoints powering the Zeq portal UI — keys, certificates, usage.
---

# Portal API

The portal endpoints back the `/portal` web UI: profile, API keys, certificate download, and usage metrics. All require a valid ZeqAuth bearer token unless noted.

## GET /api/portal/me

Current user profile (ZID, plan, daily limit, usage so far).

## GET /api/portal/key

Returns the user's primary key prefix (no secret).

## GET /api/portal/keys

List all API keys for the authenticated user.

```json
{
  "keys": [
    { "id":"...", "label":"prod", "keyPrefix":"zeq_ak_abc123", "active":true,
      "createdAt":"...", "lastUsedAt":"..." }
  ]
}
```

## POST /api/portal/keys

Create a new API key. Returns the **full** secret once — store it immediately.

```json
{ "label": "ci-pipeline" }
```

## DELETE /api/portal/keys/:id

Revoke a key. Idempotent.

## POST /api/portal/keys/:id/reveal

One-time reveal of a previously-issued key (decrypts the stored ciphertext using the user's field key). Heavily rate-limited.

## GET /api/portal/certificate

Returns the user's identity certificate (ZID + signed metadata) as a downloadable bundle.

## POST /api/portal/regenerate-key

Rotates the user's primary key. Old key becomes invalid immediately.

## GET /api/portal/usage

Per-endpoint call counts and remaining quota for the current zeqond window.

```json
{
  "plan": "pro",
  "dailyLimit": 10000,
  "used": 2417,
  "remaining": 7583,
  "byEndpoint": { "/api/zeq/compute": 1820, "/api/mesh/verify": 597 }
}
```

## Related

- [ZeqAuth](../../protocols/zeq-auth-equation-based-identity/zeq-identity-mesh.md) · [Compute](./compute)
