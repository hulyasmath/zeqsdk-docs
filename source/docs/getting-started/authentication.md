---
title: Authentication
description: API key management, rate limits by tier, and graceful degradation.
sidebar_position: 3
---

# Authentication

All requests to Zeq must include a valid API key in the Authorization header. This document covers authentication mechanisms, security practices, and key management.

## Why API Key Authentication?

Zeq chose API key authentication (rather than OAuth or complex credential systems) for three reasons:

1. **Simplicity for Developers** — A single environment variable in your code is easier than managing tokens and refresh workflows. This reduces bugs and deployment friction.

2. **Service-to-Service Communication** — API keys work seamlessly in backend services, serverless functions, and CI/CD pipelines where interactive OAuth flows don't make sense.

3. **Granular Revocation** — You can generate, rotate, and revoke keys independently without affecting your application's operation (thanks to the 24-hour grace period). OAuth tokens are harder to revoke cleanly.

The tradeoff: API keys grant full access to everything under your tier. Protect them accordingly.

## API Key Format

Zeq API keys follow this format:

```
zeq_ak_<random_32_char_string>
```

Example:
```
zeq_ak_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

The `zeq_ak_` prefix makes it easy to identify API keys in logs or code. If you ever accidentally commit one to Git, you'll spot it immediately.

:::warning
**Never share your API key.** Treat it like a password. Anyone with your key can make computations and consume your tier's daily quota. If compromised, rotate immediately (see Key Rotation below).
:::

## Bearer Token Authentication

Include your API key in the `Authorization` header using the Bearer scheme. The Bearer scheme is an IETF standard (RFC 6750) that says "the credentials are a bearer token"—meaning anyone who possesses the token can use it (which is why protecting it is critical).

```bash
curl -H "Authorization: Bearer zeq_ak_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  https://zeq.dev/api/zeq/compute
```

**All three SDKs handle this automatically:**

```javascript
// JavaScript
const response = await fetch('https://zeq.dev/api/zeq/compute', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});
```

```python
# Python
import requests
headers = {'Authorization': f'Bearer {api_key}'}
response = requests.post(url, headers=headers)
```

```bash
# cURL
curl -H "Authorization: Bearer $ZEQ_API_KEY" https://zeq.dev/api/zeq/compute
```

If the API key is missing, malformed, or invalid, you'll receive a 401 Unauthorized response.

### Security Best Practice: Use HTTPS

Always use `https://` URLs, never `http://`. When your API key travels over HTTPS, it's encrypted end-to-end. If you used `http://`, the key would be sent in plaintext over the network—anyone sniffing packets could steal it.

## Rate Limits by Tier

Each tier has a **daily computation quota** reset at midnight UTC. Once you hit the limit, Zeq doesn't reject your requests outright—instead, it degrades gracefully (see below). The quotas are designed to be fair-use limits; they prevent any single customer from monopolizing the global HulyaPulse network.

| Tier | Computations/Day | Max Request Size | Timeout |
|------|------------------|------------------|---------|
| **Free Trial** | Unlimited | 5 MB | 120 sec |
| **Starter** | 500 | 5 MB | 120 sec |
| **Builder** | 2,500 | 10 MB | 180 sec |
| **Advanced** | 7,500 | 25 MB | 300 sec |
| **Architect** | 25,000 | 50 MB | 600 sec |

:::info
Tier limits reset every day at **00:00 UTC**, not at the time you signed up. If you signed up at 3 PM on Tuesday, your quota still resets at midnight UTC that night, not 24 hours later. Plan accordingly.
:::

## What Happens When You Exceed Rate Limits

Zeq **does not reject your request**. Instead, it **degrades gracefully**:

1. **First 95% of quota** — Full precision, all operators available
2. **95-100% of quota** — Precision reduced to ±0.5% (from ±0.1%), fewer operators available
3. **After quota exceeded** — Precision reduced to ±1%, only essential operators (polynomial_solver, basic_ode, linear_algebra)

This means your application continues to work even when you exceed limits. You get mathematically valid results, just with wider error bounds.

:::tip
**Pro Tip:** Monitor your usage in the dashboard. When you approach 90% of your quota, you'll see a warning icon. Upgrade your tier before hitting 100%.
:::

## Checking Your Current Usage

Your dashboard shows real-time quota usage:

```
Free Trial
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Computations today: 142 / Unlimited
Remaining: Unlimited
Reset: Tomorrow at 00:00 UTC
```

API calls also return usage information in response headers:

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1648656000
```

## Key Rotation & Revocation

API key rotation is a critical security practice. You can generate a new API key at any time without affecting existing keys. This is useful for several scenarios:

**Security-Driven Rotation**
If you suspect a key is compromised (it was accidentally committed to Git, exposed in a screenshot, or an employee left your company), revoke it immediately. A 24-hour grace period gives you time to update all applications before the old key expires.

**Multi-Application Segmentation**
Instead of sharing one key across all your applications, generate separate keys for each. If one application is compromised, you only revoke that key—other applications keep working. This also makes audit logs clearer: you can see which app made which requests.

**Scheduled Rotation**
Large organizations often rotate keys quarterly as a preventive measure, even without a security incident. This limits the window of exposure if a key was compromised without your knowledge.

**To rotate your key:**

1. Go to your Dashboard
2. Click **Settings → API Keys**
3. Click **Generate New Key** — Zeq creates a new key immediately
4. Your old key remains active for **24 hours** (grace period)
5. Update your application(s) to use the new key
6. Old key expires automatically after 24 hours

:::warning
The 24-hour grace period is intentional—it gives you time to update all applications using the old key. If you're rotating across 50 microservices, you need time to coordinate the update. After 24 hours, the old key stops working. If you miss the window, you can generate another new key and start over.
:::

### Key Rotation Workflow for Teams

Here's a recommended workflow if you manage multiple services:

1. **Generate new key** (immediately usable)
2. **Update critical services first** — Database connections, payment processing, medical device APIs
3. **Perform smoke tests** — Verify the new key works before removing the old one
4. **Update remaining services** — Batch non-critical service updates
5. **Monitor logs** — Watch for any 401 Unauthorized errors from forgotten services
6. **Let grace period expire** — The old key automatically stops working after 24 hours

If you accidentally delete a key during the grace period and need to re-authenticate, you can generate another new key—you're not locked out.

## Error Responses

### 401 Unauthorized

```json
{
  "error": "invalid_api_key",
  "message": "API key is missing or invalid",
  "code": 401
}
```

**Causes:**
- Missing Authorization header
- Malformed API key format
- Expired or revoked key

**Fix:** Verify your API key and ensure it's in the correct format (`zeq_ak_...`).

### 429 Too Many Requests (Quota Exceeded)

```json
{
  "error": "quota_exceeded",
  "message": "Daily computation quota exceeded",
  "code": 429,
  "degradation_mode": "precision_reduced",
  "precision_level": 0.005
}
```

**What's happening:** You've exceeded your tier's daily limit. The system automatically degraded to reduced precision (±0.5%).

**Options:**
- Wait until tomorrow (quota resets at 00:00 UTC)
- Upgrade your tier in Dashboard
- Batch non-urgent computations for tomorrow

## Tier Upgrades and Downgrades

You can change your tier at any time through your Dashboard:

**Upgrading:** Takes effect immediately. You pay the difference for the remainder of your billing cycle.

**Downgrading:** Takes effect on your next renewal date. Your current tier remains active until then.

:::info
Downgrades and upgrades do not affect your API key or existing computations. They only change your quota and rate limits.
:::

## Next Steps

- **[First Computation](./first-computation.md)** — Learn what domain/operators to choose
- **[Understanding Responses](./understanding-responses.md)** — How to interpret zeqState and verify zeqProof
