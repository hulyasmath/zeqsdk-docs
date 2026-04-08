---
title: Rate Limits
description: Understanding and managing rate limits in Zeq.
sidebar_position: 8
---

# Rate Limits

Zeq uses rate limiting to protect service stability and ensure fair access. This guide explains limits, headers, and strategies to work efficiently within them.

## Rate Limit Tiers

Your account tier determines rate limits:

| Tier | Burst Limit | Per-Second Limit | Daily Quota |
|------|------------|------------------|------------|
| Starter | 10 req/s | 2 req/s | 10,000 |
| Professional | 50 req/s | 10 req/s | 500,000 |
| Enterprise | 200 req/s | 50 req/s | 10,000,000 |
| Unlimited | 500 req/s | 100 req/s | Unlimited |

**Burst limit**: Maximum requests in a short window (e.g., 100ms)
**Per-second limit**: Sustained throughput over time
**Daily quota**: Total requests per calendar day (UTC)

See your tier on the [Dashboard](https://zeq.dev/dashboard).

---

## Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067260
X-RateLimit-Limit: 100
```

- **X-RateLimit-Remaining**: Requests left in current window
- **X-RateLimit-Reset**: Unix timestamp when limit resets
- **X-RateLimit-Limit**: Total limit for current window

:::tip
Check `X-RateLimit-Remaining` to know when you're approaching the limit.
:::

---

## Rate Limit Response (429)

When you exceed the limit, you get a 429 status code:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your tier's rate limit",
    "details": {
      "reset_at": 1704067260,
      "retry_after_seconds": 60,
      "limit_type": "per_second"
    }
  },
  "timestamp": 1704067200
}
```

- **reset_at**: When the limit window resets
- **retry_after_seconds**: Recommended wait time
- **limit_type**: Which limit was exceeded (burst, per_second, or daily)

---

## Understanding Limits

### Burst Limit

The maximum number of requests allowed in a short window (approximately 100ms):

```javascript
// Good: Within burst limit
for (let i = 0; i < 5; i++) {
  client.compute(state, 1);  // 5 requests in quick succession, within Starter burst limit
}

// Bad: Exceeds burst limit (assuming Starter tier)
for (let i = 0; i < 20; i++) {
  client.compute(state, 1);  // 20 requests exceeds 10 req/s burst
}
```

### Per-Second Limit

Average sustained rate over ~1 second:

```javascript
// Good: 2 requests per second (within Starter limit)
setInterval(() => {
  client.compute(state, 1);
}, 500);

// Bad: 10 requests per second (exceeds Starter limit)
setInterval(() => {
  client.compute(state, 1);
}, 100);
```

### Daily Quota

Total requests per calendar day (UTC):

```python
# Track daily usage
def check_quota():
    usage = get_usage_from_dashboard()
    quota = 10000  # Starter tier
    remaining = quota - usage
    print(f"Daily quota: {remaining} / {quota}")

    if remaining < 100:
        alert("Approaching daily quota limit")
```

---

## Handling Rate Limits

### Strategy 1: Exponential Backoff

Recommended for most applications:

```javascript
async function exponentialBackoff(fn, maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && attempt < maxAttempts - 1) {
        const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

// Usage
try {
  const result = await exponentialBackoff(() => client.compute(state, 1));
} catch (error) {
  console.error('Failed after retries:', error.message);
}
```

### Strategy 2: Request Batching

Use the lattice endpoint to reduce request count:

```python
def batch_compute(states: list[dict], batch_size: int = 50):
    """Batch multiple states into single requests."""
    results = []

    for i in range(0, len(states), batch_size):
        batch = states[i:i + batch_size]

        requests = [
            {"state": s, "time_quantum": 1}
            for s in batch
        ]

        # Single request, multiple computations
        response = requests.post(
            'https://zeq.dev/api/zeq/lattice',
            json={"requests": requests},
            headers={'Authorization': f'Bearer {TOKEN}'}
        )

        results.extend(response.json()['data']['results'])

    return results

# 100 computations = 1 request instead of 100
states = [{'x': float(i)} for i in range(100)]
results = batch_compute(states)
```

**Benefits:**
- 100 states in 1 request instead of 100 requests
- Reduces rate limit pressure by 100x
- Faster overall execution

### Strategy 3: Request Queuing

Queue requests and process at a sustainable rate:

```python
import queue
import threading
import time

class RateLimitedQueue:
    def __init__(self, client, max_per_second: int = 2):
        self.client = client
        self.max_per_second = max_per_second
        self.queue = queue.Queue()
        self.running = True
        self.worker = threading.Thread(target=self._process_queue, daemon=True)
        self.worker.start()

    def _process_queue(self):
        last_request = 0
        while self.running:
            try:
                state = self.queue.get(timeout=1)
                # Ensure we don't exceed per-second limit
                elapsed = time.time() - last_request
                min_interval = 1.0 / self.max_per_second
                if elapsed < min_interval:
                    time.sleep(min_interval - elapsed)

                result = self.client.compute(state, 1)
                last_request = time.time()

            except queue.Empty:
                continue

    def submit(self, state):
        self.queue.put(state)

    def shutdown(self):
        self.running = False
        self.worker.join()

# Usage
queue = RateLimitedQueue(client, max_per_second=2)
for state in states:
    queue.submit(state)
time.sleep(5)  # Wait for processing
queue.shutdown()
```

### Strategy 4: Caching

Avoid recomputing identical states:

```typescript
class CachedZeqClient {
  private cache = new Map<string, ComputeResponse>();

  async compute(state: ZeqState, timeQuantum: number = 1): Promise<ComputeResponse> {
    const key = JSON.stringify({ state, timeQuantum });

    if (this.cache.has(key)) {
      console.log('Cache hit');
      return this.cache.get(key)!;
    }

    const result = await this.client.compute(state, timeQuantum);
    this.cache.set(key, result);

    // Clear old entries (LRU cache with limit)
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return result;
  }
}
```

### Strategy 5: Request Spreading

Distribute requests across time:

```go
func spreadRequests(client *ZeqClient, states []ZeqState, requestsPerSecond int) {
    interval := time.Duration(1000 / requestsPerSecond) * time.Millisecond
    ticker := time.NewTicker(interval)
    defer ticker.Stop()

    for _, state := range states {
        <-ticker.C
        go func(s ZeqState) {
            result, err := client.Compute(context.Background(), s, 1)
            if err != nil {
                log.Printf("Error: %v", err)
            } else {
                log.Printf("Result: %v", result.Result)
            }
        }(state)
    }
}

// Process 1000 states at 2 requests/second
states := generateStates(1000)
spreadRequests(client, states, 2)  // Takes ~500 seconds
```

---

## Monitoring Rate Limit Usage

### Per-Request Monitoring

```javascript
let requestsThisSecond = 0;
let lastSecondReset = Date.now();

async function computeWithMonitoring(state) {
  const now = Date.now();
  if (now - lastSecondReset > 1000) {
    requestsThisSecond = 0;
    lastSecondReset = now;
  }

  const result = await client.compute(state, 1);

  requestsThisSecond++;
  const remaining = response.headers['X-RateLimit-Remaining'];

  console.log({
    requestsThisSecond,
    remaining,
    percentUsed: (100 * (100 - remaining)) / 100
  });

  if (remaining < 10) {
    console.warn('Approaching rate limit');
  }

  return result;
}
```

### Daily Quota Tracking

```python
import requests

def check_daily_usage():
    # Call dashboard API to get usage stats
    response = requests.get(
        'https://zeq.dev/dashboard/api/usage',
        headers={'Authorization': f'Bearer {TOKEN}'}
    )

    data = response.json()
    quota = data['quota']
    used = data['used_today']
    remaining = quota - used

    print(f"Daily usage: {used} / {quota} ({100 * used / quota:.1f}%)")
    print(f"Remaining: {remaining}")

    if remaining < quota * 0.1:  # Less than 10% remaining
        print("WARNING: Less than 10% of daily quota remaining")
    elif remaining < quota * 0.2:  # Less than 20% remaining
        print("CAUTION: Less than 20% of daily quota remaining")

    return remaining

# Monitor daily
while True:
    check_daily_usage()
    time.sleep(3600)  # Check every hour
```

---

## Upgrade Your Tier

If you're consistently hitting limits, upgrade to a higher tier:

1. Visit the [Dashboard](https://zeq.dev/dashboard)
2. Go to Settings → Billing
3. Select your desired tier
4. New limits take effect immediately

---

## Rate Limit Best Practices

1. **Always check X-RateLimit-Remaining** after each request
2. **Implement exponential backoff** for 429 responses
3. **Use batching** when possible (lattice endpoint)
4. **Cache results** to avoid redundant computations
5. **Monitor daily quota** proactively
6. **Spread requests** across time for better throughput
7. **Queue requests** for non-critical operations
8. **Alert on high error rates** to catch issues early

---

## Burst vs Sustained Example

Here's the difference in practice:

```javascript
// Burst: 10 requests in 100ms (within Starter burst limit)
async function burstRequests() {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(client.compute({ x: i }, 1));
  }
  await Promise.all(promises);  // All requests sent at once
}

// Sustained: 2 requests/second over time (within Starter per-second limit)
async function sustainedRequests() {
  for (let i = 0; i < 100; i++) {
    await client.compute({ x: i }, 1);
    await new Promise(resolve => setTimeout(resolve, 500));  // 500ms between requests
  }
}

// Exceeds both burst AND per-second
async function badRequests() {
  for (let i = 0; i < 50; i++) {
    client.compute({ x: i }, 1);  // Fire all 50 at once
  }
}
```

---

## Webhook Integration (Future)

When webhooks are available, you can be notified of long-running computations instead of polling:

```javascript
// Future: Register webhook for batch completion
client.registerWebhook({
  event: 'batch.complete',
  url: 'https://your-app.com/webhook/zeq',
  signature_key: 'your_webhook_secret'
});

// Server receives callback when batch completes
// No rate limit impact from polling!
```

---

## Next Steps

- [Error Handling Guide](./error-handling.md)
- [Overview](./overview.md)
- [curl Reference](./curl.md)

:::warning
Don't ignore 429 responses. Continuing to make requests after rate limiting can result in temporary account suspension.
:::
