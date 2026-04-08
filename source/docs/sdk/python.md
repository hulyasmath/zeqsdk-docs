---
title: Python SDK
description: Complete guide to integrating Zeq with Python using requests.
sidebar_position: 3
---

# Python SDK

Zeq integrates seamlessly with Python using the popular `requests` library. This guide covers synchronous and async patterns for building scalable applications.

## Setup

### Install Dependencies

```bash
pip install requests python-dotenv
```

### Environment Variables

Create a `.env` file:

```bash
ZEQ_API_URL=https://zeq.dev/api
ZEQ_TOKEN=your_bearer_token_here
```

Load it in your code:

```python
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.environ.get('ZEQ_API_URL', 'https://zeq.dev/api')
TOKEN = os.environ.get('ZEQ_TOKEN')
```

## ZeqClient Class

Here's a production-ready Python client with full type hints:

```python
import requests
import os
from typing import Dict, Any, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

class ZeqState(dict):
    """Type alias for state objects."""
    pass

class ComputeResponse:
    def __init__(self, data: Dict[str, Any]):
        self.result: ZeqState = data.get('result', {})
        self.proof: str = data.get('proof', '')
        self.timestamp: int = data.get('timestamp', 0)

class VerifyResponse:
    def __init__(self, data: Dict[str, Any]):
        self.valid: bool = data.get('valid', False)
        self.details: Dict[str, Any] = data.get('details', {})

class PulseResponse:
    def __init__(self, data: Dict[str, Any]):
        self.current_quantum: int = data.get('current_quantum', 0)
        self.synchronized: bool = data.get('synchronized', False)
        self.drift_ns: int = data.get('drift_ns', 0)

class ZeqError(Exception):
    """Custom exception for Zeq API errors."""
    def __init__(self, message: str, status_code: int, code: str):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code

class ZeqClient:
    """Zeq REST client for Python."""

    def __init__(self,
                 api_url: Optional[str] = None,
                 token: Optional[str] = None):
        self.api_url = api_url or os.environ.get('ZEQ_API_URL', 'https://zeq.dev/api')
        self.token = token or os.environ.get('ZEQ_TOKEN')

        if not self.token:
            raise ValueError('ZEQ_TOKEN is required')

        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        })

    def _request(self,
                 endpoint: str,
                 method: str = 'POST',
                 json_data: Optional[Dict[str, Any]] = None
                 ) -> Tuple[Dict[str, Any], Dict[str, int]]:
        """Make an authenticated request to Zeq API."""
        url = f'{self.api_url}{endpoint}'

        try:
            if method == 'GET':
                response = self.session.get(url)
            else:
                response = self.session.post(url, json=json_data)

            rate_limit = {
                'remaining': int(response.headers.get('X-RateLimit-Remaining', 0)),
                'reset_at': int(response.headers.get('X-RateLimit-Reset', 0))
            }

            if response.status_code != 200:
                error_data = response.json()
                error = error_data.get('error', {})
                raise ZeqError(
                    error.get('message', 'Unknown error'),
                    response.status_code,
                    error.get('code', 'UNKNOWN')
                )

            result = response.json()
            if not result.get('success'):
                error = result.get('error', {})
                raise ZeqError(
                    error.get('message', 'Request failed'),
                    400,
                    error.get('code', 'UNKNOWN')
                )

            return result.get('data', {}), rate_limit

        except requests.RequestException as e:
            raise ZeqError(f'Network error: {str(e)}', 0, 'NETWORK_ERROR')

    def compute(self, state: ZeqState, time_quantum: int = 1) -> ComputeResponse:
        """
        Execute a computation step on the given state.

        Args:
            state: The state dictionary to compute
            time_quantum: Number of Zeqonds to advance (default: 1)

        Returns:
            ComputeResponse with result, proof, and timestamp
        """
        data, _ = self._request(
            '/zeq/compute',
            json_data={
                'state': state,
                'time_quantum': time_quantum
            }
        )
        return ComputeResponse(data)

    def verify(self, proof: str, expected_state: ZeqState) -> VerifyResponse:
        """
        Verify a proof of computation.

        Args:
            proof: The proof string to verify
            expected_state: The expected state after computation

        Returns:
            VerifyResponse indicating validity
        """
        data, _ = self._request(
            '/zeq/verify',
            json_data={
                'proof': proof,
                'expected_state': expected_state
            }
        )
        return VerifyResponse(data)

    def pulse(self) -> PulseResponse:
        """
        Get the current Zeq time pulse.

        Returns:
            PulseResponse with quantum and synchronization info
        """
        data, _ = self._request('/zeq/pulse', method='GET')
        return PulseResponse(data)

    def operators(self, category: Optional[str] = None) -> Dict[str, Any]:
        """
        List available operators.

        Args:
            category: Optional category filter

        Returns:
            Dictionary with 'operators' list
        """
        endpoint = '/zeq/operators'
        if category:
            endpoint += f'?category={category}'

        data, _ = self._request(endpoint, method='GET')
        return data

    def timebridge(self, timestamp: int, timezone: str = 'UTC') -> Dict[str, int]:
        """
        Convert Unix timestamp to Zeqond.

        Args:
            timestamp: Unix timestamp (seconds since epoch)
            timezone: Timezone for conversion (default: UTC)

        Returns:
            Dictionary with 'zeqond' value
        """
        data, _ = self._request(
            '/zeq/timebridge',
            json_data={
                'timestamp': timestamp,
                'timezone': timezone
            }
        )
        return data
```

## Usage Examples

### Compute Example

```python
from zeq_client import ZeqClient, ZeqState

client = ZeqClient()

# Define state
state: ZeqState = {
    'x': 1.0,
    'y': 2.0,
    'z': 0.5
}

# Compute 5 Zeqonds forward
result = client.compute(state, time_quantum=5)

print(f"Result: {result.result}")
print(f"Proof: {result.proof}")
print(f"Timestamp: {result.timestamp}")
```

### Verify Example

```python
# Get a computation
result = client.compute({'x': 1.0}, time_quantum=1)

# Verify the proof
verification = client.verify(result.proof, result.result)

if verification.valid:
    print(f"✓ Verified at {verification.details['verified_at']}")
else:
    print("✗ Proof verification failed")
```

### Pulse Example

```python
pulse = client.pulse()

print(f"Current quantum: {pulse.current_quantum}")
print(f"Synchronized: {pulse.synchronized}")
print(f"Drift: {pulse.drift_ns} nanoseconds")

if pulse.drift_ns > 1000:
    print("⚠ High temporal drift detected")
```

### Operators Example

```python
# Get all operators
all_ops = client.operators()
print(f"Total operators: {len(all_ops['operators'])}")

# Get physics operators
physics_ops = client.operators(category='physics')
for op in physics_ops['operators']:
    print(f"  - {op['name']}: {op['description']}")
```

### Timebridge Example

```python
import time

# Convert current time to Zeqond
now = int(time.time())
mapping = client.timebridge(now, timezone='America/New_York')

print(f"Unix {now} = Zeqond {mapping['zeqond']}")
```

## Error Handling

The `ZeqClient` raises `ZeqError` with structured information:

```python
from zeq_client import ZeqClient, ZeqError

client = ZeqClient()

try:
    result = client.compute({'x': 1.0}, time_quantum=1)
except ZeqError as e:
    if e.code == 'RATE_LIMIT_EXCEEDED':
        print(f"Rate limited. Wait before retrying.")
    elif e.code == 'UNAUTHORIZED':
        print("Invalid token. Check ZEQ_TOKEN.")
    elif e.code == 'TIER_LOCKED':
        print("This feature requires a higher tier.")
    else:
        print(f"Error ({e.code}): {e.message}")
```

## Batch Requests

For efficiency, batch computations using the `/api/zeq/lattice` endpoint:

```python
def batch_compute(states: list[ZeqState]) -> list[Dict[str, Any]]:
    """Compute multiple states in a single request."""
    batch = [
        {'state': s, 'time_quantum': 1}
        for s in states
    ]

    response = requests.post(
        'https://zeq.dev/api/zeq/lattice',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {os.environ["ZEQ_TOKEN"]}'
        },
        json={'requests': batch}
    )

    result = response.json()
    return result['data']['results']

# Usage
states = [
    {'x': 1.0, 'y': 2.0},
    {'x': 2.0, 'y': 3.0},
    {'x': 3.0, 'y': 4.0}
]

results = batch_compute(states)
for i, r in enumerate(results):
    print(f"State {i}: {r['result']}")
```

## Rate Limit Handling

Implement exponential backoff for rate limits:

```python
import time

def compute_with_retry(state: ZeqState, max_retries: int = 3) -> ComputeResponse:
    """Compute with automatic retry on rate limit."""
    client = ZeqClient()

    for attempt in range(max_retries):
        try:
            return client.compute(state, time_quantum=1)
        except ZeqError as e:
            if e.status_code == 429 and attempt < max_retries - 1:
                backoff_seconds = 2 ** attempt
                print(f"Rate limited. Retrying in {backoff_seconds}s...")
                time.sleep(backoff_seconds)
            else:
                raise

    raise RuntimeError('Max retries exceeded')
```

## Async Support

For high-throughput applications, use `aiohttp`:

```bash
pip install aiohttp
```

```python
import aiohttp
import asyncio

class ZeqClientAsync:
    """Async version of ZeqClient."""

    def __init__(self, api_url: str, token: str):
        self.api_url = api_url
        self.token = token
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        await self.session.close()

    async def compute(self, state: ZeqState, time_quantum: int = 1):
        async with self.session.post(
            f'{self.api_url}/zeq/compute',
            json={'state': state, 'time_quantum': time_quantum},
            headers={'Authorization': f'Bearer {self.token}'}
        ) as resp:
            result = await resp.json()
            if result['success']:
                return ComputeResponse(result['data'])
            else:
                raise ZeqError(result['error']['message'],
                             resp.status,
                             result['error']['code'])

# Usage
async def main():
    async with ZeqClientAsync(
        'https://zeq.dev/api',
        os.environ['ZEQ_TOKEN']
    ) as client:
        result = await client.compute({'x': 1.0})
        print(result.result)

asyncio.run(main())
```

## Best Practices

1. **Always use environment variables** for tokens
2. **Implement retry logic** for 429 responses
3. **Use batch endpoints** when making many requests
4. **Monitor rate limit headers** for proactive rate management
5. **Cache results** when computations are expensive

## Next Steps

- [Error Handling Guide](./error-handling.md)
- [Rate Limits Guide](./rate-limits.md)
- [Medical Imaging Domain](../guides/medical-imaging.md)
- [Robotics Domain](../guides/robotics.md)

:::tip
The ZeqClient class handles all the complexity. Focus on your business logic, not HTTP details.
:::
