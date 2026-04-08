---
title: JavaScript/TypeScript SDK
description: Complete guide to integrating Zeq with JavaScript and TypeScript.
sidebar_position: 2
---

# JavaScript/TypeScript SDK

Zeq works seamlessly with JavaScript and TypeScript using the native `fetch` API or popular HTTP libraries. This guide covers both browser and Node.js environments.

## Setup

### Environment Variables

Create a `.env` file in your project:

```bash
ZEQ_API_URL=https://zeq.dev/api
ZEQ_TOKEN=your_bearer_token_here
```

For Node.js, load these using `dotenv`:

```bash
npm install dotenv
```

Then in your code:

```javascript
require('dotenv').config();
const API_URL = process.env.ZEQ_API_URL;
const TOKEN = process.env.ZEQ_TOKEN;
```

For browser environments, store the token securely (e.g., in a secure cookie or via OAuth).

## Basic HTTP Request (fetch)

```javascript
const response = await fetch('https://zeq.dev/api/zeq/compute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: JSON.stringify({
    state: { x: 1.0, y: 2.0 },
    time_quantum: 1
  })
});

const data = await response.json();
if (data.success) {
  console.log('Result:', data.data.result);
} else {
  console.error('Error:', data.error.message);
}
```

## ZeqClient Class

Here's a reusable TypeScript client wrapper:

```typescript
interface ZeqState {
  [key: string]: number | ZeqState;
}

interface ComputeResponse {
  result: ZeqState;
  proof: string;
  timestamp: number;
}

interface VerifyResponse {
  valid: boolean;
  details: {
    proof_type: string;
    verified_at: number;
  };
}

interface VerifyRequest {
  proof: string;
  expected_state: ZeqState;
}

interface PulseResponse {
  current_quantum: number;
  synchronized: boolean;
  drift_ns: number;
}

interface RateLimitInfo {
  remaining: number;
  reset_at: number;
}

class ZeqClient {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl: string = process.env.ZEQ_API_URL || '',
              token: string = process.env.ZEQ_TOKEN || '') {
    this.apiUrl = apiUrl || 'https://zeq.dev/api';
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any
  ): Promise<{ data: T; rateLimit: RateLimitInfo }> {
    const url = `${this.apiUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const rateLimit = {
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
      reset_at: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
    };

    if (!response.ok) {
      const error = await response.json();
      throw new ZeqError(error.error.message, response.status, error.error.code);
    }

    const result = await response.json();
    if (!result.success) {
      throw new ZeqError(result.error.message, 400, result.error.code);
    }

    return { data: result.data as T, rateLimit };
  }

  async compute(state: ZeqState, timeQuantum: number = 1): Promise<ComputeResponse> {
    const { data } = await this.request<ComputeResponse>(
      '/zeq/compute',
      'POST',
      { state, time_quantum: timeQuantum }
    );
    return data;
  }

  async verify(proof: string, expectedState: ZeqState): Promise<VerifyResponse> {
    const { data } = await this.request<VerifyResponse>(
      '/zeq/verify',
      'POST',
      { proof, expected_state: expectedState }
    );
    return data;
  }

  async pulse(): Promise<PulseResponse> {
    const { data } = await this.request<PulseResponse>('/zeq/pulse');
    return data;
  }

  async operators(category: string = ''): Promise<{ operators: any[] }> {
    const endpoint = category
      ? `/zeq/operators?category=${encodeURIComponent(category)}`
      : '/zeq/operators';
    const { data } = await this.request<{ operators: any[] }>(endpoint, 'GET');
    return data;
  }

  async timebridge(timestamp: number, timezone: string = 'UTC'): Promise<{ zeqond: number }> {
    const { data } = await this.request<{ zeqond: number }>(
      '/zeq/timebridge',
      'POST',
      { timestamp, timezone }
    );
    return data;
  }
}

class ZeqError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ZeqError';
  }
}

export { ZeqClient, ZeqError, ZeqState, ComputeResponse, VerifyResponse };
```

## Usage Examples

### Compute Example

```javascript
import { ZeqClient } from './zeq-client';

const client = new ZeqClient();

async function simulateODE() {
  try {
    const result = await client.compute(
      { x: 1.0, y: 2.0, z: 0.5 },
      5  // Compute 5 time quantums forward
    );

    console.log('Computed state:', result.result);
    console.log('Proof:', result.proof);
  } catch (error) {
    if (error instanceof ZeqError) {
      console.error(`API Error (${error.code}): ${error.message}`);
    }
  }
}
```

### Verify Example

```javascript
async function verifyComputation() {
  const client = new ZeqClient();

  // Get a computation result
  const compute = await client.compute({ x: 1.0 }, 1);

  // Verify the proof
  const verification = await client.verify(
    compute.proof,
    compute.result
  );

  if (verification.valid) {
    console.log('✓ Computation verified at', verification.details.verified_at);
  } else {
    console.warn('✗ Proof verification failed');
  }
}
```

### Pulse Example

```javascript
async function checkSync() {
  const client = new ZeqClient();

  const pulse = await client.pulse();
  console.log(`Current quantum: ${pulse.current_quantum}`);
  console.log(`Synchronized: ${pulse.synchronized}`);
  console.log(`Drift: ${pulse.drift_ns}ns`);

  if (pulse.drift_ns > 1000) {
    console.warn('High temporal drift detected');
  }
}
```

### Operators Example

```javascript
async function listOperators() {
  const client = new ZeqClient();

  // Get all operators
  const all = await client.operators();
  console.log(`Total operators: ${all.operators.length}`);

  // Get operators by category
  const physics = await client.operators('physics');
  console.log(`Physics operators: ${physics.operators.length}`);

  physics.operators.forEach(op => {
    console.log(`  - ${op.name}: ${op.description}`);
  });
}
```

### Timebridge Example

```javascript
async function convertTime() {
  const client = new ZeqClient();

  // Convert a Unix timestamp to Zeqond
  const now = Math.floor(Date.now() / 1000);
  const mapping = await client.timebridge(now, 'America/New_York');

  console.log(`Unix ${now} = Zeqond ${mapping.zeqond}`);
}
```

## Error Handling

The `ZeqClient` throws `ZeqError` with useful properties:

```javascript
try {
  await client.compute({ x: 1.0 }, 1);
} catch (error) {
  if (error instanceof ZeqError) {
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        console.error('Rate limited. Retry after backoff.');
        break;
      case 'UNAUTHORIZED':
        console.error('Invalid token.');
        break;
      case 'TIER_LOCKED':
        console.error('This feature requires a higher tier.');
        break;
      default:
        console.error(`Unexpected error: ${error.message}`);
    }
  }
}
```

## Batch Requests

For efficiency, use the `/api/zeq/lattice` endpoint to batch multiple computations:

```javascript
async function batchCompute() {
  const client = new ZeqClient();

  const batch = [
    { state: { x: 1.0 }, time_quantum: 1 },
    { state: { x: 2.0 }, time_quantum: 1 },
    { state: { x: 3.0 }, time_quantum: 1 }
  ];

  const response = await fetch('https://zeq.dev/api/zeq/lattice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ZEQ_TOKEN}`
    },
    body: JSON.stringify({ requests: batch })
  });

  const result = await response.json();
  result.data.results.forEach((r, i) => {
    console.log(`Result ${i}:`, r.result);
  });
}
```

## Rate Limit Handling

The `ZeqClient.request()` method returns rate limit info. Implement backoff:

```javascript
async function computeWithRetry(maxRetries = 3) {
  const client = new ZeqClient();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await client.compute({ x: 1.0 }, 1);
      return result;
    } catch (error) {
      if (error instanceof ZeqError && error.statusCode === 429) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}
```

## TypeScript Best Practices

The included TypeScript interfaces help catch errors at compile time:

```typescript
import { ZeqClient, ZeqState, ComputeResponse } from './zeq-client';

// Type-safe state object
const state: ZeqState = {
  position: { x: 1.0, y: 2.0 },
  velocity: { x: 0.5, y: -0.3 }
};

const client = new ZeqClient();
const result: ComputeResponse = await client.compute(state, 10);

// TypeScript ensures result.result is a ZeqState
const newX = result.result.position?.x;  // Type-safe access
```

## Browser Usage

For browser applications, use a secure token management strategy:

```javascript
// Get token from secure backend endpoint
async function getToken() {
  const response = await fetch('/api/zeq-token', {
    credentials: 'include'  // Include cookies
  });
  const { token } = await response.json();
  return token;
}

// Create client with fresh token
const token = await getToken();
const client = new ZeqClient('https://zeq.dev/api', token);
```

Never hardcode tokens in browser code. Always fetch from a backend.

## Next Steps

- [Error Handling Guide](./error-handling.md)
- [Rate Limits Guide](./rate-limits.md)
- [Medical Imaging Domain](../guides/medical-imaging.md)
- [Game Physics Domain](../guides/game-physics.md)

:::tip
Use the `ZeqClient` class in production. It handles authentication, rate limit headers, and error mapping for you.
:::
