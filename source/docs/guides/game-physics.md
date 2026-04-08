---
title: Game Physics
description: Building multiplayer games with deterministic physics simulation using Zeq.
sidebar_position: 2
---

# Game Physics with Zeq

Real-time multiplayer games require deterministic, synchronized physics. Zeq provides Zeqond-stepped simulation ensuring every player sees identical physics despite network latency and frame rate differences.

## Use Case: Multiplayer Racing Game

### The Problem

Traditional game physics networking:
- Each client simulates locally (desync)
- Server arbitrates (high latency)
- Physics non-deterministic across platforms
- Cheating via client-side manipulation

### The Solution with Zeq

Zeq provides:
- **Deterministic simulation**: Identical input = identical output always
- **Zeqond synchronization**: All clients use universal time
- **Peer verification**: ZeqProof prevents cheating
- **Replay capability**: Fully reproducible gameplay

## Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Player 1     │    │ Player 2     │    │ Player 3     │
│ (Client)     │    │ (Client)     │    │ (Client)     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │ Input              │ Input             │ Input
       │ t=1000            │ t=998             │ t=1002
       └────────────────────┼──────────────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Zeq              │
                  │ zeq-physics-engine  │
                  │ (Universal time)    │
                  │ t=Zeqond_1000       │
                  └──────────┬──────────┘
                            │
                    ┌───────┴────────┬───────────┐
                    │                │           │
                    ▼                ▼           ▼
              ┌──────────┐      ┌──────────┐   ┌──────────┐
              │ Player 1 │      │ Player 2 │   │ Player 3 │
              │ Same     │      │ Same     │   │ Same     │
              │ physics  │      │ physics  │   │ physics  │
              └──────────┘      └──────────┘   └──────────┘
```

## Core APIs

### Submit Physics Simulation (1)

Perform a deterministic physics step:

```bash
curl -X POST "https://zeq.dev/api/physics/rigidbody" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "simulation_id": "match_2024_race_001",
    "time_quantum": 1,
    "delta_time": 0.016,
    "bodies": [
      {
        "id": "car_1",
        "position": [100.5, 0.0, 50.3],
        "rotation": [0, 0, 0, 1],
        "velocity": [25.0, 0.0, 0.0],
        "angular_velocity": [0, 0, 0],
        "mass": 1500.0,
        "drag": 0.1,
        "angular_drag": 0.05,
        "use_gravity": true
      },
      {
        "id": "car_2",
        "position": [102.0, 0.0, 50.0],
        "rotation": [0, 0, 0, 1],
        "velocity": [24.5, 0.0, 0.0],
        "angular_velocity": [0, 0, 0],
        "mass": 1500.0,
        "drag": 0.1,
        "angular_drag": 0.05,
        "use_gravity": true
      }
    ],
    "forces": [
      {
        "body_id": "car_1",
        "force": [5000.0, 0.0, 0.0],
        "force_mode": "Force"
      }
    ],
    "collisions": [
      {
        "body_a": "car_1",
        "body_b": "car_2",
        "contact_type": "surface"
      }
    ],
    "gravity": [0.0, -9.81, 0.0]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "simulation_id": "match_2024_race_001",
    "time_quantum": 1,
    "timestamp": 1704067200,
    "bodies": [
      {
        "id": "car_1",
        "position": [100.7, 0.0, 50.3],
        "velocity": [25.2, 0.0, 0.0],
        "angular_velocity": [0, 0.1, 0]
      },
      {
        "id": "car_2",
        "position": [102.05, 0.0, 50.0],
        "velocity": [24.3, 0.0, 0.0],
        "angular_velocity": [0, 0, 0]
      }
    ],
    "proof": "zeqproof_physics_abc123...",
    "proof_verified": true
  }
}
```

### Procedural Generation (2)

Generate deterministic game worlds:

```bash
curl -X POST "https://zeq.dev/api/physics/procgen" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "world_seed": 12345,
    "world_size": 1000,
    "chunk_size": 50,
    "terrain_type": "mountain",
    "features": {
      "trees": true,
      "rivers": true,
      "rocks": true,
      "vegetation_density": 0.7
    },
    "deterministic": true
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "world_id": "world_12345",
    "terrain_map": "base64_heightmap...",
    "objects": [
      {
        "id": "tree_1",
        "type": "oak",
        "position": [100.5, 15.2, 50.3],
        "rotation": [0, 0, 0, 1]
      }
    ],
    "collision_geometry": "base64_collision_mesh...",
    "proof": "zeqproof_procgen_xyz789..."
  }
}
```

### Netcode Synchronization (3)

Synchronize multiple clients:

```bash
curl -X POST "https://zeq.dev/api/physics/netcode" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "match_id": "match_2024_001",
    "players": [
      {
        "player_id": "player_1",
        "input": {
          "move_direction": [1, 0, 0],
          "jump": false,
          "attack": true
        },
        "timestamp": 1704067200000,
        "input_proof": "zeqproof_input_player1..."
      },
      {
        "player_id": "player_2",
        "input": {
          "move_direction": [0, 0, 1],
          "jump": true,
          "attack": false
        },
        "timestamp": 1704067200015,
        "input_proof": "zeqproof_input_player2..."
      }
    ]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "match_id": "match_2024_001",
    "frame": 100,
    "states": {
      "player_1": {
        "position": [100.5, 0.0, 50.3],
        "animation_state": "running"
      },
      "player_2": {
        "position": [95.2, 2.0, 55.1],
        "animation_state": "jumping"
      }
    },
    "proof": "zeqproof_frame_100..."
  }
}
```

## Implementation: Game Server

### Godot/C# Example

```csharp
using Godot;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ZeqPhysicsEngine : Node {
    private string apiUrl = "https://zeq.dev/api/physics";
    private string token = OS.GetEnviron("ZEQ_TOKEN");
    private long currentTimeQuantum = 0;

    public async Task<PhysicsResult> StepSimulation(
        string simulationId,
        List<RigidBody3D> bodies,
        float deltaTime) {

        // Prepare request
        var bodyData = new List<Dictionary>();
        foreach (var body in bodies) {
            bodyData.Add(new Dictionary {
                { "id", body.Name },
                { "position", body.GlobalPosition },
                { "velocity", body.LinearVelocity },
                { "mass", body.Mass },
                { "use_gravity", !body.GravityScale.IsZeroApprox() }
            });
        }

        var request = new Dictionary {
            { "simulation_id", simulationId },
            { "time_quantum", currentTimeQuantum },
            { "delta_time", deltaTime },
            { "bodies", bodyData },
            { "gravity", Vector3.Down * 9.81f }
        };

        // Call Zeq
        var response = await CallZeqApi("/rigidbody", request);

        // Apply results
        foreach (var bodyResult in response["bodies"]) {
            var bodyId = (string)bodyResult["id"];
            var body = GetNode<RigidBody3D>(bodyId);

            body.GlobalPosition = (Vector3)bodyResult["position"];
            body.LinearVelocity = (Vector3)bodyResult["velocity"];
        }

        currentTimeQuantum++;
        return new PhysicsResult(response);
    }

    private async Task<Dictionary> CallZeqApi(
        string endpoint,
        Dictionary payload) {

        var http = new HttpRequest();
        AddChild(http);

        var error = http.Request(
            apiUrl + endpoint,
            new[] { $"Authorization: Bearer {token}" },
            HttpClient.Method.Post,
            Json.Stringify(payload)
        );

        if (error != Error.Ok) {
            GD.PrintErr($"HTTP error: {error}");
            return null;
        }

        var result = await ToSignal(http, "request_completed");
        var response = (Array)result[0];
        return Json.ParseString((string)response[2]);
    }
}

public class PhysicsResult {
    public Dictionary Data { get; set; }
    public string Proof { get; set; }

    public PhysicsResult(Dictionary response) {
        Data = (Dictionary)response["data"];
        Proof = (string)Data["proof"];
    }
}
```

### JavaScript/Three.js Example

```javascript
import * as THREE from 'three';

class ZeqPhysicsClient {
  constructor(token = null) {
    this.token = token || process.env.ZEQ_TOKEN;
    this.apiUrl = 'https://zeq.dev/api/physics';
    this.timeQuantum = 0;
  }

  async stepSimulation(simulationId, bodies, deltaTime) {
    const bodyData = bodies.map(body => ({
      id: body.userData.id,
      position: [body.position.x, body.position.y, body.position.z],
      rotation: [body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w],
      velocity: [body.userData.velocity.x, body.userData.velocity.y, body.userData.velocity.z],
      mass: body.userData.mass,
      drag: 0.1
    }));

    const request = {
      simulation_id: simulationId,
      time_quantum: this.timeQuantum,
      delta_time: deltaTime,
      bodies: bodyData,
      gravity: [0, -9.81, 0]
    };

    const response = await fetch(`${this.apiUrl}/rigidbody`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(request)
    });

    const result = await response.json();
    const data = result.data;

    // Update bodies
    data.bodies.forEach(bodyResult => {
      const body = bodies.find(b => b.userData.id === bodyResult.id);
      if (body) {
        body.position.set(...bodyResult.position);
        body.userData.velocity.set(...bodyResult.velocity);
      }
    });

    this.timeQuantum++;
    return data;
  }

  async verifyFrame(proof, expectedState) {
    const response = await fetch(`${this.apiUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ proof, expected_state: expectedState })
    });

    return await response.json();
  }
}

// Usage in game loop
const client = new ZeqPhysicsClient();
const scene = new THREE.Scene();

function gameLoop(timestamp) {
  const deltaTime = 0.016; // 60 FPS

  // Submit physics
  client.stepSimulation('match_001', scene.children, deltaTime)
    .then(result => {
      // Update renderer
      renderer.render(scene, camera);
    });

  requestAnimationFrame(gameLoop);
}
```

## Deterministic Physics for Multiplayer

Key principle: **Same input = Same output, Always**

```javascript
// Player 1's input
const input1 = {
  moveDirection: [1, 0, 0],
  jumpPressed: false,
  timestamp: 1704067200000
};

// Player 2 receives same computation
// Both see identical physics results
const result = await client.stepSimulation(
  'match_001',
  [body1, body2],
  0.016
);

// Proofs verify consistency
assert(result.proof === result.expectedProof);
```

## Anti-Cheat via ZeqProof

Players can't fake physics results:

```javascript
// Attacker tries to modify position
position.x += 100;  // Cheating!

// But Zeq verifies the proof
const isValid = await client.verifyFrame(
  storedProof,
  currentState
);

if (!isValid) {
  console.log("Cheating detected!");
  kickPlayer();
}
```

## Spatial Audio Synchronization

Sync sound to physics:

```bash
curl -X POST "https://zeq.dev/api/physics/spatial-audio" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "match_id": "match_2024_001",
    "sources": [
      {
        "id": "explosion_1",
        "position": [100.5, 0.0, 50.3],
        "sound_type": "explosion",
        "intensity": 0.8
      }
    ],
    "listener_positions": {
      "player_1": [95.0, 0.0, 50.0],
      "player_2": [105.0, 0.0, 50.0]
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "audio_events": {
      "player_1": {
        "sound_id": "explosion_1",
        "volume": 0.9,
        "pan": -0.3,
        "delay_ms": 0.05
      },
      "player_2": {
        "sound_id": "explosion_1",
        "volume": 0.85,
        "pan": 0.3,
        "delay_ms": 0.08
      }
    }
  }
}
```

## Replay Recording

Fully reproducible gameplay:

```javascript
class ReplayRecorder {
  constructor(client) {
    this.client = client;
    this.frames = [];
  }

  recordFrame(frameNumber, proof, states) {
    this.frames.push({ frameNumber, proof, states });
  }

  async saveReplay(filename) {
    const replay = {
      frames: this.frames,
      verified: await this.verifyAllFrames()
    };
    fs.writeFileSync(filename, JSON.stringify(replay));
  }

  async verifyAllFrames() {
    for (const frame of this.frames) {
      const valid = await this.client.verifyFrame(
        frame.proof,
        frame.states
      );
      if (!valid.valid) return false;
    }
    return true;
  }

  async playback() {
    for (const frame of this.frames) {
      console.log(`Frame ${frame.frameNumber}`);
      console.log(`State: ${JSON.stringify(frame.states)}`);
      await sleep(16);  // 60 FPS
    }
  }
}
```

## Scaling to Multiple Players

```javascript
// Batch 100 players in one request
const largeMatch = {
  match_id: 'tournament_finals',
  players: Array(100).fill(0).map((_, i) => ({
    player_id: `player_${i}`,
    input: generateInput(i),
    timestamp: Date.now()
  }))
};

const result = await client.submitNetcode(largeMatch);
// Single computation, 100 players synchronized
```

## Comparison: Traditional vs Zeq-Enhanced

| Aspect | Traditional | Zeq |
|--------|-----------|--------|
| Sync method | Client-side prediction | Deterministic Zeqonds |
| Desync | Common (0.5-2 sec) | Eliminated |
| Latency compensation | Extrapolation | Proof-based verification |
| Cheat resistance | Weak | Strong (ZeqProof) |
| Replay accuracy | Approximate | Perfect (deterministic) |
| Server load | High | Low (stateless) |

## Next Steps

- [Robotics](./robotics.md) — Multi-robot coordination
- [Emergency Systems](./emergency-systems.md) — Real-time dispatch
- [Rate Limits](../sdk/rate-limits.md) — Optimize throughput

:::tip
Deterministic physics with Zeq eliminates desync and enables provable replays. Perfect for competitive multiplayer.
:::
