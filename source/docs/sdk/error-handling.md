---
title: Error Handling
description: Comprehensive guide to Zeq error codes, responses, and handling strategies.
sidebar_position: 7
---

# Error Handling

Zeq uses standard HTTP status codes and structured error responses. This guide covers every error type and how to handle them gracefully.

## HTTP Status Codes

### 200 OK

Success. The request was processed successfully.

**Example response:**

```json
{
  "success": true,
  "data": {
    "result": { "x": 1.5 },
    "proof": "zeqproof_abc123",
    "timestamp": 1704067200
  },
  "timestamp": 1704067200
}
```

**How to handle:**
- Extract `data` from the response
- Use the result for your business logic

---

### 400 Bad Request

The request was malformed or missing required fields.

**Example response:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: state"
  },
  "timestamp": 1704067200
}
```

**Common codes:**
- `INVALID_REQUEST` — Missing or invalid field
- `INVALID_STATE` — State object has invalid structure
- `INVALID_PROOF` — Proof string format is incorrect
- `INVALID_QUANTUM` — time_quantum is negative or too large

**How to handle:**

```javascript
try {
  const result = await client.compute(state, timeQuantum);
} catch (error) {
  if (error.statusCode === 400) {
    console.error(`Validation error: ${error.message}`);
    // Fix the request and retry
  }
}
```

---

### 401 Unauthorized

The request is missing a valid Bearer token or the token is invalid.

**Example response:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  },
  "timestamp": 1704067200
}
```

**Common codes:**
- `UNAUTHORIZED` — Missing, invalid, or expired token
- `TOKEN_REVOKED` — Token was revoked by the user

**How to handle:**

```javascript
try {
  const result = await client.compute(state, timeQuantum);
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    // Request a fresh token from your backend
    const newToken = await refreshToken();
    client = new ZeqClient(apiUrl, newToken);
    // Retry the request
  }
}
```

:::warning
Never retry with the same token immediately. Request a fresh token first.
:::

---

### 403 Forbidden

You don't have permission to use this feature (tier-locked or access denied).

**Example response:**

```json
{
  "success": false,
  "error": {
    "code": "TIER_LOCKED",
    "message": "This feature requires a Professional tier account"
  },
  "timestamp": 1704067200
}
```

**Common codes:**
- `TIER_LOCKED` — Endpoint requires a higher tier
- `QUOTA_EXCEEDED` — Daily quota consumed
- `ACCESS_DENIED` — Access revoked for this account

**How to handle:**

```python
try:
    result = client.compute(state, 1)
except ZeqError as e:
    if e.code == 'TIER_LOCKED':
        print("Please upgrade your plan to access this feature.")
        # Redirect to upgrade page
    elif e.code == 'QUOTA_EXCEEDED':
        print("Daily quota exhausted. Try again tomorrow.")
```

:::tip
Check your account tier on the [Dashboard](https://zeq.dev/dashboard) to see available features.
:::

---

### 429 Too Many Requests

You've exceeded the rate limit. Respect the backoff period.

**Example response:**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your tier's rate limit",
    "details": {
      "reset_at": 1704067260,
      "retry_after_seconds": 60
    }
  },
  "timestamp": 1704067200
}
```

**How to handle:**

Always check the response headers first:

```javascript
// Response headers
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067260

// Then implement backoff
const resetAt = parseInt(response.headers['X-RateLimit-Reset']);
const delayMs = (resetAt * 1000) - Date.now();

if (delayMs > 0) {
  console.log(`Rate limited. Retrying in ${delayMs}ms...`);
  await new Promise(resolve => setTimeout(resolve, delayMs + 100));
}
```

:::warning
Respect the rate limit. Continuing to make requests will result in temporary account suspension.
:::

See [Rate Limits Guide](./rate-limits.md) for detailed strategies.

---

### 500 Server Error

The Zeq API experienced an internal error. These are transient and should be retried.

**Example response:**

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error. Please try again later."
  },
  "timestamp": 1704067200
}
```

**Common codes:**
- `INTERNAL_ERROR` — Transient server error
- `SERVICE_UNAVAILABLE` — Service temporarily down
- `TIMEOUT` — Request timed out on server

**How to handle:**

Implement exponential backoff and retry:

```go
func computeWithRetry(client *ZeqClient, state ZeqState, maxAttempts int) error {
    for attempt := 0; attempt < maxAttempts; attempt++ {
        result, err := client.Compute(context.Background(), state, 1)
        if err == nil {
            return nil  // Success
        }

        if zeqErr, ok := err.(*ZeqError); ok && zeqErr.StatusCode >= 500 {
            if attempt < maxAttempts-1 {
                backoff := time.Duration(1<<uint(attempt)) * time.Second
                fmt.Printf("Server error. Retrying in %v...\n", backoff)
                time.Sleep(backoff)
                continue
            }
        }

        return err
    }

    return fmt.Errorf("max retry attempts exceeded")
}
```

:::tip
Use exponential backoff with jitter for better results across multiple clients.
:::

---

## Error Handling Patterns

### Pattern 1: Simple Try-Catch

For simple scripts:

```python
try:
    result = client.compute(state, 1)
    print(f"Success: {result.result}")
except ZeqError as e:
    if e.status_code == 401:
        print("Invalid token")
    elif e.status_code == 429:
        print("Rate limited")
    else:
        print(f"Error: {e.message}")
```

### Pattern 2: Structured Error Handling

For production applications:

```typescript
async function computeWithHandling(state: ZeqState): Promise<Result | null> {
  try {
    return await client.compute(state, 1);
  } catch (error) {
    if (error instanceof ZeqError) {
      // Handle specific errors
      switch (error.code) {
        case 'RATE_LIMIT_EXCEEDED':
          logger.warn('Rate limited, queuing request');
          queue.push({ state, retry: true });
          return null;

        case 'UNAUTHORIZED':
          logger.error('Auth failed, requesting new token');
          await refreshAuth();
          throw new AuthError('Token refresh required');

        case 'TIER_LOCKED':
          logger.error('Feature unavailable on current tier');
          throw new UpgradeRequired('Please upgrade');

        default:
          logger.error(`Unexpected error: ${error.message}`);
          throw error;
      }
    }
  }
}
```

### Pattern 3: Retry Logic with Exponential Backoff

```javascript
async function exponentialBackoff(
  fn,
  maxAttempts = 3,
  initialDelayMs = 1000
) {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's a client error (4xx)
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // For server errors, retry with backoff
      if (attempt < maxAttempts - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * delayMs * 0.1;
        const totalDelay = delayMs + jitter;

        console.log(`Attempt ${attempt + 1} failed. Retrying in ${totalDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      }
    }
  }

  throw lastError;
}

// Usage
const result = await exponentialBackoff(() =>
  client.compute(state, 1)
);
```

### Pattern 4: Circuit Breaker

For high-traffic applications:

```python
import time

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.last_failure_time = None
        self.timeout_seconds = timeout_seconds
        self.state = 'closed'  # closed, open, half_open

    async def call(self, fn):
        if self.state == 'open':
            if time.time() - self.last_failure_time > self.timeout_seconds:
                self.state = 'half_open'
            else:
                raise CircuitBreakerOpen("Service is down")

        try:
            result = await fn()
            if self.state == 'half_open':
                self.state = 'closed'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'open'

            raise

# Usage
breaker = CircuitBreaker()
try:
    result = await breaker.call(lambda: client.compute(state, 1))
except CircuitBreakerOpen:
    print("Service is temporarily unavailable")
```

---

## Error Response Structure

Every error response follows this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field": "optional additional info"
    }
  },
  "timestamp": 1704067200
}
```

- **code**: Machine-readable error identifier (use for logic)
- **message**: Human-readable description (use for logging)
- **details**: Optional context (varies by error)
- **timestamp**: When the error occurred (Unix timestamp)

---

## Logging Errors

Always include context in error logs:

```typescript
function logError(error: ZeqError, context: any) {
  logger.error({
    timestamp: new Date(),
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    context: {
      requestId: context.requestId,
      userId: context.userId,
      endpoint: context.endpoint,
      state: context.state  // sanitize sensitive data!
    }
  });
}
```

---

## Recovery Strategies by Error Type

| Error | Retry? | Action |
|-------|--------|--------|
| 400 Bad Request | No | Fix the request, log the error |
| 401 Unauthorized | Yes* | Refresh token, retry |
| 403 Forbidden | No | Upgrade tier or contact support |
| 429 Rate Limited | Yes | Implement backoff, queue request |
| 5xx Server Error | Yes | Exponential backoff, alert ops |

*Only if you can refresh the token safely.

---

## Monitoring & Alerting

Set up alerts for error spikes:

```python
from collections import deque
import time

class ErrorMonitor:
    def __init__(self, window_seconds=300):
        self.errors = deque()
        self.window_seconds = window_seconds

    def record_error(self, code):
        now = time.time()
        self.errors.append((code, now))

        # Remove old entries
        while self.errors and self.errors[0][1] < now - self.window_seconds:
            self.errors.popleft()

        # Alert if error rate is high
        if len(self.errors) > 10:
            alert_ops(f"High error rate: {len(self.errors)} errors in {self.window_seconds}s")

monitor = ErrorMonitor()

try:
    result = client.compute(state, 1)
except ZeqError as e:
    monitor.record_error(e.code)
```

---

## Next Steps

- [Rate Limits Guide](./rate-limits.md) — Learn about rate limiting and burst vs sustained throughput
- [Overview](./overview.md) — Back to SDK basics

:::tip
Always implement retry logic for transient errors (429, 5xx). For permanent errors (4xx), fix the request before retrying.
:::
