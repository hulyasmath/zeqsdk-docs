---
sidebar_position: 3
title: Error Codes Reference
---

# Error Codes Reference

Complete reference of all error codes that the Zeq API can return, with explanations, solutions, and examples.

## HTTP 400 - Bad Request

### ZEQ_INVALID_DOMAIN

**Code:** `ZEQ_INVALID_DOMAIN`
**Message:** Domain not recognized
**HTTP Status:** 400

The computation domain you specified is not valid or not recognized by the API.

**How to Fix:**
- Check that the domain parameter is spelled correctly
- Consult the protocol registry for valid domains
- Ensure your tier has access to the requested domain

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_INVALID_DOMAIN",
    "message": "Domain 'quantum_cryptography' not recognized",
    "suggestion": "Did you mean 'quantum_crypto'? Available domains: [list...]"
  }
}
```

---

### ZEQ_INVALID_OPERATOR

**Code:** `ZEQ_INVALID_OPERATOR`
**Message:** Operator ID not found
**HTTP Status:** 400

One of the operators you specified doesn't exist or is not available.

**How to Fix:**
- Verify operator IDs via `GET /api/operators`
- Check operator availability for your tier
- Remove invalid operator IDs from your request
- Use only operators returned by the registry

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_INVALID_OPERATOR",
    "message": "Operator 'OP_NONEXISTENT' not found",
    "available_similar": ["OP_NEURAL_NET", "OP_NESTED_FUNC"]
  }
}
```

---

### ZEQ_TOO_MANY_OPERATORS

**Code:** `ZEQ_TOO_MANY_OPERATORS`
**Message:** More than 10 operators requested
**HTTP Status:** 400

You've requested more operators than allowed in a single computation. The limit is 10 operators per request.

**How to Fix:**
- Reduce the number of operators to 10 or fewer
- Simplify your computation or split into multiple requests
- Check if some operators can be combined or eliminated
- Professional tier may have higher limits (contact support)

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_TOO_MANY_OPERATORS",
    "message": "Requested 15 operators, maximum is 10",
    "requested_operators": 15,
    "limit": 10
  }
}
```

---

## HTTP 401 - Authentication Errors

### ZEQ_NO_KEY

**Code:** `ZEQ_NO_KEY`
**Message:** Missing API key
**HTTP Status:** 401

You didn't provide an API key, but the endpoint requires authentication.

**How to Fix:**
- Add your API key to the `Authorization` header: `Authorization: Bearer YOUR_KEY`
- Alternatively, pass it as a query parameter: `?key=YOUR_KEY`
- Generate a new key at https://console.zeq.io/keys

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_NO_KEY",
    "message": "API key required but not provided",
    "auth_header_example": "Authorization: Bearer sk_live_...",
    "docs_url": "https://docs.zeq.io/auth"
  }
}
```

---

### ZEQ_INVALID_KEY

**Code:** `ZEQ_INVALID_KEY`
**Message:** Key format invalid or revoked
**HTTP Status:** 401

Your API key is malformed, expired, or has been revoked.

**How to Fix:**
- Verify the key format (should start with `sk_` for production or `sk_test_` for testing)
- Check that the key hasn't been revoked in the console
- Create a new key if the current one is compromised
- Ensure no whitespace in the key

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_INVALID_KEY",
    "message": "API key invalid or revoked",
    "key_id": "key_123abc...",
    "revoked_at": "2026-03-25T14:32:01Z",
    "reason": "User initiated revocation"
  }
}
```

---

## HTTP 403 - Permission Errors

### ZEQ_TIER_LOCKED

**Code:** `ZEQ_TIER_LOCKED`
**Message:** Protocol requires higher tier
**HTTP Status:** 403

The endpoint or protocol you're trying to use requires a higher subscription tier than your current plan.

**How to Fix:**
- Upgrade your subscription at https://console.zeq.io/billing
- Use a different endpoint available for your tier
- Contact sales for enterprise features: sales@zeq.io
- Check `GET /api/system/capabilities` to see what's available to you

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_TIER_LOCKED",
    "message": "This protocol requires Professional tier",
    "required_tier": "professional",
    "current_tier": "standard",
    "upgrade_url": "https://console.zeq.io/billing/plans"
  }
}
```

---

## HTTP 429 - Rate Limiting

### ZEQ_RATE_LIMIT

**Code:** `ZEQ_RATE_LIMIT`
**Message:** Rate limit exceeded
**HTTP Status:** 429

You've made too many requests in a short period of time.

**How to Fix:**
- Implement exponential backoff: wait 1s, then 2s, then 4s, etc.
- Reduce the frequency of your requests
- Batch requests when possible
- Upgrade to a higher tier for higher rate limits
- Use the `Retry-After` header value to wait the recommended time

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_RATE_LIMIT",
    "message": "Rate limit exceeded: 100 requests per minute",
    "limit": 100,
    "window_seconds": 60,
    "retry_after_seconds": 12,
    "reset_at": "2026-03-29T15:42:00Z"
  }
}
```

**Recommended Retry Logic (JavaScript):**
```javascript
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code !== 'ZEQ_RATE_LIMIT') {
        throw error;
      }
      const waitTime = (error.retry_after_seconds || Math.pow(2, i)) * 1000;
      console.log(`Rate limited. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

---

### ZEQ_DAILY_LIMIT

**Code:** `ZEQ_DAILY_LIMIT`
**Message:** Daily call limit exceeded
**HTTP Status:** 429

You've exceeded your daily API call quota.

**How to Fix:**
- Wait until the quota resets at midnight UTC
- Upgrade to a higher tier for more daily allowance
- Optimize your code to make fewer API calls
- Implement caching to avoid redundant requests

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_DAILY_LIMIT",
    "message": "Daily limit of 10,000 calls exceeded",
    "daily_limit": 10000,
    "used_today": 10042,
    "reset_at": "2026-03-30T00:00:00Z",
    "hours_until_reset": 8
  }
}
```

---

## HTTP 500 - Server Errors

### ZEQ_SOLVER_ERROR

**Code:** `ZEQ_SOLVER_ERROR`
**Message:** Internal solver failure
**HTTP Status:** 500

The computation solver encountered an internal error and couldn't complete your request.

**How to Fix:**
- Retry the request (transient errors are common)
- Simplify your input (remove operators, reduce domain complexity)
- Check the status page: https://status.zeq.io
- Contact support if the error persists

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_SOLVER_ERROR",
    "message": "Solver failed to converge",
    "details": "Exceeded 100,000 iterations without convergence",
    "trace_id": "tr_abc123xyz789",
    "status_page": "https://status.zeq.io"
  }
}
```

---

### ZEQ_TIMEOUT

**Code:** `ZEQ_TIMEOUT`
**Message:** Computation exceeded time limit
**HTTP Status:** 500

Your computation took longer than the maximum allowed time (varies by tier: 30s free, 120s standard, 600s professional).

**How to Fix:**
- Simplify your computation
- Reduce the number of operators
- Use a less complex domain
- Upgrade to a higher tier for longer timeouts
- Use streaming endpoints (`/api/zeq/pulse/stream`) for long computations

**Example Response:**
```json
{
  "error": {
    "code": "ZEQ_TIMEOUT",
    "message": "Computation exceeded 30 second limit",
    "time_limit_seconds": 30,
    "elapsed_seconds": 31.4,
    "suggestion": "Upgrade to Standard tier for 120s limit"
  }
}
```

---

## Error Response Format

All error responses follow this standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "Additional context (optional)",
    "trace_id": "tr_xxxxx",
    "timestamp": "2026-03-29T15:35:42.123Z",
    "documentation_url": "https://docs.zeq.io/errors/ERROR_CODE"
  }
}
```

## Common Error Handling Patterns

### Check for Specific Errors

```javascript
async function compute(input) {
  try {
    return await zeqAPI.post('/api/zeq/compute', { input });
  } catch (error) {
    switch (error.code) {
      case 'ZEQ_TIER_LOCKED':
        console.error('Upgrade required');
        break;
      case 'ZEQ_RATE_LIMIT':
        // Retry with backoff
        await sleep(error.retry_after_seconds * 1000);
        return compute(input);
      case 'ZEQ_TIMEOUT':
        console.error('Computation too complex, simplify input');
        break;
      default:
        throw error;
    }
  }
}
```

### Generic Retry with Circuit Breaker

```javascript
async function callWithRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
  } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable = [
        'ZEQ_RATE_LIMIT',
        'ZEQ_TIMEOUT',
        'ZEQ_SOLVER_ERROR'
      ].includes(error.code);

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = Math.min(
        baseDelay * Math.pow(2, attempt),
        maxDelay
      );
      await sleep(delay);
    }
  }
}
```

---

## Status Page

For real-time status information about service incidents, visit:
**https://status.zeq.io**

## Getting Help

- **Documentation:** https://docs.zeq.io
- **Support:** support@zeq.io
- **Community:** https://community.zeq.io
- **Status Page:** https://status.zeq.io
