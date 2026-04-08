---
title: Webhooks (Future)
description: Design specification for Zeq webhook system for long-running computations.
sidebar_position: 9
---

# Webhooks (Future)

Zeq is designing a webhook system for long-running computations. Instead of polling for results, your servers will receive callbacks when computations complete. This document outlines the planned system.

:::info
Webhooks are currently in active design. This specification may change. Sign up on the [Roadmap](https://zeq.dev/roadmap) to be notified when webhooks are available.
:::

## Use Cases

### Long-Running ODE Solver

Instead of polling:

```javascript
// Current: Polling (blocks thread, wastes requests)
let result;
while (!result) {
  const response = await client.compute(state, 1000);
  if (response.completed) {
    result = response;
  } else {
    await sleep(5000);  // Waste rate limit quota
  }
}
```

Webhooks enable:

```javascript
// Future: Register webhook, get notified
await client.registerWebhook({
  event: 'computation.complete',
  url: 'https://your-app.com/webhook/zeq',
  includeResult: true
});

// Your server receives callback when done
// POST /webhook/zeq
// {
//   "event": "computation.complete",
//   "computation_id": "comp_abc123",
//   "result": { "state": {...} },
//   "proof": "zeqproof_...",
//   "timestamp": 1704067200
// }
```

### Batch Completion Notifications

Monitor multiple computations:

```javascript
// Register batch webhook
const batchId = await client.submitBatch({
  requests: states.map(s => ({ state: s, time_quantum: 1 })),
  webhook: {
    url: 'https://your-app.com/webhook/batch',
    events: ['batch.progress', 'batch.complete']
  }
});

// Your server receives:
// Progress: { event: 'batch.progress', completed: 50, total: 100 }
// Complete: { event: 'batch.complete', results: [...] }
```

### Medical Imaging Pipeline

Monitor image reconstruction:

```javascript
// Register MRI reconstruction webhook
const scanId = await client.submitMRI({
  k_space_data: data,
  webhook: 'https://hospital-app.com/webhook/mri'
});

// Hospital system receives notification when reconstruction completes
// POST /webhook/mri
// {
//   "scan_id": "scan_12345",
//   "status": "complete",
//   "image_url": "s3://bucket/scan_12345.dicom",
//   "quality_metrics": { "snr": 42.3, "resolution": "128x128x128" }
// }
```

---

## Webhook Specification

### Event Types

| Event | Trigger | Payload |
|-------|---------|---------|
| `computation.complete` | Single computation finishes | result, proof, timestamp |
| `batch.progress` | Batch progress update | completed, total, percentage |
| `batch.complete` | Batch finishes | results array, proofs |
| `computation.error` | Computation fails | error code, message |
| `batch.error` | Batch partially/fully fails | errors array |

### Request Format

Zeq sends webhooks as HTTP POST requests:

```json
{
  "event": "computation.complete",
  "computation_id": "comp_abc123",
  "timestamp": 1704067200,
  "delivery_attempt": 1,
  "data": {
    "result": { "x": 1.5, "y": 2.8 },
    "proof": "zeqproof_...",
    "metadata": {
      "time_quantum": 1,
      "execution_time_ms": 145
    }
  }
}
```

- **event**: Event type identifier
- **computation_id**: Unique computation ID
- **timestamp**: When event occurred
- **delivery_attempt**: Retry attempt number (1, 2, 3...)
- **data**: Event-specific payload

### Signature Verification

All webhooks are signed using HMAC-SHA256:

```
X-Zeq-Signature: sha256=abcd1234...
X-Zeq-Timestamp: 1704067200
X-Zeq-Delivery-ID: webhook_delivery_abc123
```

Verify the signature:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature.replace('sha256=', '')),
    Buffer.from(expectedSignature)
  );
}

// Express example
app.post('/webhook/zeq', (req, res) => {
  const signature = req.headers['x-zeq-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.ZEQ_WEBHOOK_SECRET;

  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  console.log('Verified webhook:', req.body.event);
  res.status(200).json({ success: true });
});
```

:::warning
Always verify webhook signatures to prevent spoofing attacks.
:::

### Retry Logic

Zeq retries failed webhooks with exponential backoff:

- **Attempt 1**: Immediate
- **Attempt 2**: 5 seconds later
- **Attempt 3**: 30 seconds later
- **Attempt 4**: 5 minutes later
- **Attempt 5**: 1 hour later

After 5 failures, the webhook is disabled.

Your webhook endpoint must:

1. Return HTTP 200 within 30 seconds
2. Return 2xx status for success, 4xx/5xx for failure
3. Be idempotent (handle duplicate deliveries)
4. Use `X-Zeq-Delivery-ID` to deduplicate

```python
from flask import Flask, request
import sqlite3

app = Flask(__name__)

@app.route('/webhook/zeq', methods=['POST'])
def webhook():
    # Check for duplicate delivery
    delivery_id = request.headers.get('X-Zeq-Delivery-ID')

    db = sqlite3.connect(':memory:')
    cursor = db.cursor()

    # Create table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS webhook_deliveries (
            delivery_id TEXT PRIMARY KEY,
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Check if already processed
    cursor.execute('SELECT * FROM webhook_deliveries WHERE delivery_id = ?', (delivery_id,))
    if cursor.fetchone():
        return {'success': True}, 200  # Already processed

    # Process webhook
    try:
        data = request.get_json()
        print(f"Processing {data['event']}")

        # Your business logic here

        # Mark as processed
        cursor.execute('INSERT INTO webhook_deliveries (delivery_id) VALUES (?)', (delivery_id,))
        db.commit()

        return {'success': True}, 200
    except Exception as e:
        print(f"Error: {e}")
        return {'error': str(e)}, 500
```

---

## Webhook Management

### Register a Webhook

```javascript
const webhook = await client.registerWebhook({
  url: 'https://your-app.com/webhook/zeq',
  events: ['computation.complete'],
  headers: {
    'Authorization': 'Bearer your_webhook_secret'
  },
  metadata: {
    description: 'Production webhook',
    team: 'platform'
  }
});

console.log(`Webhook ID: ${webhook.id}`);
```

### List Webhooks

```javascript
const webhooks = await client.listWebhooks();

webhooks.forEach(w => {
  console.log(`${w.id}: ${w.url} (${w.status})`);
  console.log(`  Events: ${w.events.join(', ')}`);
  console.log(`  Last delivery: ${w.last_delivery_at}`);
  console.log(`  Failures: ${w.failure_count}`);
});
```

### Test Webhook

Send a test event to verify endpoint:

```javascript
await client.testWebhook('webhook_abc123');

// Your endpoint receives:
// {
//   "event": "webhook.test",
//   "timestamp": 1704067200,
//   "data": {
//     "test_id": "test_xyz",
//     "message": "This is a test webhook"
//   }
// }
```

### Update Webhook

```javascript
await client.updateWebhook('webhook_abc123', {
  url: 'https://new-url.com/webhook/zeq',
  events: ['computation.complete', 'batch.complete']
});
```

### Delete Webhook

```javascript
await client.deleteWebhook('webhook_abc123');
```

### View Delivery History

```javascript
const deliveries = await client.getWebhookDeliveries('webhook_abc123', {
  limit: 10,
  status: 'failed'
});

deliveries.forEach(d => {
  console.log(`Delivery ${d.id}:`);
  console.log(`  Status: ${d.status}`);
  console.log(`  Attempt: ${d.attempt} of 5`);
  console.log(`  Response: ${d.response_status} - ${d.response_body}`);
  console.log(`  Next retry: ${d.next_retry_at}`);
});
```

---

## Real-World Examples

### Medical Imaging Processing

```python
from flask import Flask, request
import s3_client

app = Flask(__name__)

@app.route('/webhook/mri', methods=['POST'])
def process_mri_complete():
    # Verify signature
    signature = request.headers.get('X-Zeq-Signature')
    if not verify_signature(request.data, signature):
        return {'error': 'Invalid signature'}, 401

    data = request.get_json()
    event = data['event']

    if event == 'computation.complete':
        scan_id = data['computation_id']
        result = data['data']['result']

        # Reconstruct image
        image_data = reconstruct_mri_image(result)

        # Upload to S3
        s3_client.upload(f'mri-{scan_id}.nii', image_data)

        # Notify radiology system
        notify_pacs_system(scan_id, 'Ready for review')

        # Log metrics
        log_metrics({
            'scan_id': scan_id,
            'quality_score': result.get('quality_score'),
            'processing_time_ms': data['data']['metadata']['execution_time_ms']
        })

        return {'success': True}, 200

    return {'error': f'Unknown event: {event}'}, 400
```

### Game Server Batch Simulations

```javascript
const express = require('express');
const app = express();

app.post('/webhook/physics', express.json(), async (req, res) => {
  const { event, data } = req.body;

  if (event === 'batch.complete') {
    const { batch_id, results } = data;

    // Process simulation results
    results.forEach(result => {
      const gameState = parseGameState(result.result);

      // Update player clients
      broadcastToClients(batch_id, gameState);

      // Store in game database
      database.saveGameState(batch_id, gameState);
    });

    // Update server metrics
    metrics.recordPhysicsUpdate(batch_id, results.length);

    // Check if simulation is complete
    if (checkSimulationComplete(batch_id)) {
      emitGameEvent('simulation_complete', { batch_id });
    }
  }

  res.status(200).json({ success: true });
});
```

### Robotics Fleet Coordination

```python
from flask import Flask, request
import robot_controller

app = Flask(__name__)

@app.route('/webhook/swarm', methods=['POST'])
def robot_swarm_update():
    data = request.get_json()
    event = data['event']

    if event == 'computation.complete':
        swarm_id = data['computation_id']
        result = data['data']['result']

        # Extract robot positions
        robot_positions = parse_swarm_result(result)

        # Update each robot with new commands
        for robot_id, position in robot_positions.items():
            robot_controller.update_position(robot_id, position)

        # Log swarm state
        log_swarm_state(swarm_id, robot_positions)

    return {'success': True}, 200
```

---

## Design Principles

1. **Asynchronous**: Don't block on long computations
2. **Reliable**: Automatic retries ensure delivery
3. **Secure**: HMAC signatures prevent spoofing
4. **Deduplicatable**: `Delivery-ID` enables idempotency
5. **Observable**: Full delivery history and metrics

---

## Webhook Best Practices

1. **Return 200 quickly** — Process async if needed
2. **Verify signatures** always
3. **Be idempotent** — Handle duplicate deliveries
4. **Log everything** — Track for debugging
5. **Set a timeout** — Prevent hanging connections
6. **Monitor failures** — Alert on repeated failures
7. **Use metadata** — Tag webhooks for organization
8. **Test regularly** — Use test webhook feature

---

## Future Enhancements

Under consideration:

- **Conditional webhooks**: Only notify on specific result patterns
- **Webhook transformations**: Map Zeq result format to your schema
- **Webhook chaining**: Trigger other webhooks based on results
- **Rate-limited webhooks**: Control delivery rate
- **Webhook templates**: Predefined configurations for common use cases

---

## Migration Path

When webhooks are ready:

1. **Opt-in**: Register webhooks for your computations
2. **Dual-run**: Keep polling while testing webhooks
3. **Monitor**: Verify webhook delivery reliability
4. **Migrate**: Replace polling with webhooks
5. **Clean up**: Remove polling code

Existing polling clients will continue to work indefinitely.

---

## Next Steps

- [Overview](./overview.md)
- [Error Handling](./error-handling.md)
- [Rate Limits](./rate-limits.md)

:::tip
Join the [Zeq Community](https://discord.gg/zeq-os) to discuss webhook design and get early access when they launch.
:::
