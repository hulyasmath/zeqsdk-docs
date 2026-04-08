---
title: Robotics
description: Multi-robot coordination using Zeq for synchronized swarms and collaborative systems.
sidebar_position: 5
---

# Robotics with Zeq

Coordinating multiple robots requires precise synchronization across distributed systems. Zeq provides Zeqond-synchronized multi-robot control, SLAM, kinematics, and PID loops for warehouse automation and swarm robotics.

## Use Case: Warehouse Robot Swarm

### The Problem

Traditional warehouse robotics:
- Robots operate independently (low efficiency)
- Collision avoidance is reactive
- No global optimization
- Manual synchronization

### The Solution with Zeq

Zeq provides:
- **Swarm coordination**: All robots see same world state
- **Zeqond synchronization**: Perfect timing across fleet
- **Deterministic SLAM**: Identical map on all robots
- **Proof-verified paths**: No collisions possible

## Architecture

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│Robot 1   │  │Robot 2   │  │Robot 3   │
│(Local)   │  │(Local)   │  │(Local)   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     │ State       │ State       │ State
     └─────────────┼─────────────┘
                   ▼
         ┌────────────────────┐
         │ Zeq             │
         │ zeq-swarm-control  │
         │ (Universal time)   │
         │ t=Zeqond_1000      │
         └──────────┬─────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
   Path_1       Path_2         Path_3
(Verified)   (Verified)      (Verified)
```

## Core APIs

### Swarm Control (1)

Coordinate multiple robots:

```bash
curl -X POST "https://zeq.dev/api/robotics/swarm" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "swarm_id": "warehouse_swarm_001",
    "time_quantum": 100,
    "robots": [
      {
        "robot_id": "robot_001",
        "current_position": [0.0, 0.0],
        "current_orientation": 0.0,
        "current_velocity": [0.5, 0.0],
        "mass": 50.0
      },
      {
        "robot_id": "robot_002",
        "current_position": [5.0, 0.0],
        "current_orientation": 0.0,
        "current_velocity": [0.5, 0.0],
        "mass": 50.0
      }
    ],
    "goals": [
      {
        "robot_id": "robot_001",
        "target": [10.0, 5.0]
      },
      {
        "robot_id": "robot_002",
        "target": [10.0, -5.0]
      }
    ],
    "collision_avoidance": true,
    "formation_constraint": "line"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "swarm_id": "warehouse_swarm_001",
    "time_quantum": 100,
    "commands": [
      {
        "robot_id": "robot_001",
        "velocity": [0.5, 0.1],
        "angular_velocity": 0.05,
        "estimated_arrival_ms": 18500
      },
      {
        "robot_id": "robot_002",
        "velocity": [0.5, -0.1],
        "angular_velocity": -0.05,
        "estimated_arrival_ms": 18600
      }
    ],
    "collision_forecast": [],
    "swarm_proof": "zeqproof_swarm_abc123...",
    "proof_verified": true
  }
}
```

### SLAM (Simultaneous Localization and Mapping) (2)

Deterministic map building:

```bash
curl -X POST "https://zeq.dev/api/robotics/slam" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "robot_id": "robot_001",
    "sensor_data": {
      "lidar": {
        "scan_points": 720,
        "range_max_m": 30.0,
        "data": "base64_lidar_scan..."
      },
      "odometry": {
        "delta_position": [0.1, 0.0],
        "delta_orientation": 0.02
      }
    },
    "map_id": "warehouse_map_001",
    "localization_only": false
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "robot_id": "robot_001",
    "position": [1.23, 4.56],
    "orientation": 0.785,
    "confidence": 0.98,
    "map_update": {
      "new_features": 12,
      "map_id": "warehouse_map_001",
      "map_hash": "sha256_abc123..."
    },
    "proof": "zeqproof_slam_xyz789...",
    "proof_verified": true
  }
}
```

### Kinematics & Path Planning (3)

Plan collision-free paths:

```bash
curl -X POST "https://zeq.dev/api/robotics/kinematics" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "robot_id": "robot_001",
    "robot_type": "differential_drive",
    "current_pose": {
      "position": [0.0, 0.0],
      "orientation": 0.0
    },
    "target_pose": {
      "position": [10.0, 5.0],
      "orientation": 1.57
    },
    "map_id": "warehouse_map_001",
    "max_velocity": 1.0,
    "max_angular_velocity": 0.5,
    "robot_radius": 0.5
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "robot_id": "robot_001",
    "path": {
      "waypoints": [
        [0.0, 0.0],
        [2.5, 1.2],
        [5.0, 2.8],
        [7.5, 4.0],
        [10.0, 5.0]
      ],
      "total_distance": 11.2,
      "estimated_time_ms": 11200
    },
    "velocity_profile": [
      {"distance": 0, "velocity": 0.0},
      {"distance": 5, "velocity": 0.8},
      {"distance": 10, "velocity": 0.5},
      {"distance": 11.2, "velocity": 0.0}
    ],
    "proof": "zeqproof_path_def456..."
  }
}
```

### PID Control Loop (4)

Closed-loop motor control:

```bash
curl -X POST "https://zeq.dev/api/robotics/pid" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "controller_id": "motor_controller_1",
    "setpoint": 1.0,
    "process_variable": 0.95,
    "control_gains": {
      "kp": 0.5,
      "ki": 0.1,
      "kd": 0.05
    },
    "limits": {
      "output_min": -255,
      "output_max": 255,
      "integral_min": -50,
      "integral_max": 50
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "controller_id": "motor_controller_1",
    "control_output": 15,
    "error": 0.05,
    "integral_error": 0.005,
    "derivative_error": -0.02,
    "status": "stable"
  }
}
```

## Implementation: Warehouse Control System

### Python Integration

```python
import requests
import os
import json
import time
from threading import Thread

class ZeqSwarmController:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/robotics"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def coordinate_swarm(self,
                        swarm_id: str,
                        robots: list,
                        goals: list,
                        formation: str = 'line') -> dict:
        """Coordinate multiple robots toward goals."""

        payload = {
            "swarm_id": swarm_id,
            "time_quantum": 100,
            "robots": robots,
            "goals": goals,
            "collision_avoidance": True,
            "formation_constraint": formation
        }

        response = self.session.post(f'{self.api_url}/swarm', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def localize_robot(self,
                      robot_id: str,
                      lidar_data: dict,
                      odometry: dict,
                      map_id: str) -> dict:
        """Update robot position via SLAM."""

        payload = {
            "robot_id": robot_id,
            "sensor_data": {
                "lidar": lidar_data,
                "odometry": odometry
            },
            "map_id": map_id,
            "localization_only": False
        }

        response = self.session.post(f'{self.api_url}/slam', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def plan_path(self,
                 robot_id: str,
                 start_pose: dict,
                 goal_pose: dict,
                 map_id: str) -> dict:
        """Plan collision-free path."""

        payload = {
            "robot_id": robot_id,
            "robot_type": "differential_drive",
            "current_pose": start_pose,
            "target_pose": goal_pose,
            "map_id": map_id,
            "max_velocity": 1.0,
            "max_angular_velocity": 0.5,
            "robot_radius": 0.5
        }

        response = self.session.post(f'{self.api_url}/kinematics', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def compute_pid(self,
                   controller_id: str,
                   setpoint: float,
                   process_variable: float,
                   gains: dict) -> dict:
        """Compute PID control output."""

        payload = {
            "controller_id": controller_id,
            "setpoint": setpoint,
            "process_variable": process_variable,
            "control_gains": gains,
            "limits": {
                "output_min": -255,
                "output_max": 255
            }
        }

        response = self.session.post(f'{self.api_url}/pid', json=payload)
        response.raise_for_status()

        return response.json()['data']

# Warehouse automation example
controller = ZeqSwarmController()

# Define robots and their current state
robots = [
    {
        'robot_id': 'robot_001',
        'current_position': [0.0, 0.0],
        'current_orientation': 0.0,
        'current_velocity': [0.0, 0.0],
        'mass': 50.0
    },
    {
        'robot_id': 'robot_002',
        'current_position': [1.0, 0.0],
        'current_orientation': 0.0,
        'current_velocity': [0.0, 0.0],
        'mass': 50.0
    }
]

# Define goals (pickups/deliveries)
goals = [
    {'robot_id': 'robot_001', 'target': [10.0, 5.0]},
    {'robot_id': 'robot_002', 'target': [10.0, -5.0]}
]

# Coordinate swarm
result = controller.coordinate_swarm(
    swarm_id='warehouse_001',
    robots=robots,
    goals=goals,
    formation='line'
)

print(f"Swarm commands: {json.dumps(result['commands'], indent=2)}")
print(f"Collisions forecast: {result['collision_forecast']}")

# Each robot executes its command
for cmd in result['commands']:
    print(f"Robot {cmd['robot_id']}: velocity={cmd['velocity']}")
```

## Deterministic Swarm Behavior

Same state always produces same commands:

```python
# Control loop
while not all_goals_reached():
    # Get current state from all robots
    robot_states = get_all_robot_states()

    # Coordinate swarm (deterministic)
    commands = controller.coordinate_swarm(
        swarm_id='warehouse_001',
        robots=robot_states,
        goals=current_goals
    )

    # Verify swarm behavior is correct
    proof = commands['swarm_proof']
    if verify_proof(proof):
        # Execute commands to all robots
        for cmd in commands['commands']:
            execute_robot_command(cmd)
    else:
        alert("Swarm command verification failed!")
```

## PID Tuning & Stabilization

```python
class AdaptivePIDTuner:
    def __init__(self, controller: ZeqSwarmController):
        self.controller = controller
        self.gains = {'kp': 0.5, 'ki': 0.1, 'kd': 0.05}

    def tune(self, controller_id: str, setpoint: float, samples: int = 100):
        """Autotune PID gains."""

        errors = []
        for _ in range(samples):
            pv = read_process_variable(controller_id)

            # Compute with current gains
            output = self.controller.compute_pid(
                controller_id=controller_id,
                setpoint=setpoint,
                process_variable=pv,
                gains=self.gains
            )

            error = setpoint - pv
            errors.append(abs(error))

            time.sleep(0.01)  # 10ms control loop

        # Analyze stability
        avg_error = sum(errors) / len(errors)
        steady_state = sum(errors[-10:]) / 10

        if steady_state < avg_error * 0.1:
            print(f"✓ Stable. Steady-state error: {steady_state:.3f}")
            return True
        else:
            print(f"⚠ Unstable. Adjusting gains...")
            # Adjust gains (simplified)
            self.gains['kd'] *= 1.1
            return False

tuner = AdaptivePIDTuner(controller)
tuned = tuner.tune('motor_1', setpoint=1.0)
```

## Multi-Robot SLAM

All robots maintain identical map:

```python
# Each robot submits sensor data
for robot in robots:
    lidar_data = robot.get_lidar_scan()
    odometry = robot.get_odometry()

    # Update map (deterministic SLAM)
    result = controller.localize_robot(
        robot_id=robot.id,
        lidar_data=lidar_data,
        odometry=odometry,
        map_id='warehouse_001'
    )

    # All robots see identical updated map
    map_hash = result['map_update']['map_hash']
    print(f"Robot {robot.id} map hash: {map_hash}")

# Verify all hashes are identical
assert all(hash == map_hash for hash in map_hashes)
```

## Collision Avoidance Proof

Zeq guarantees no collisions:

```python
# Swarm computation includes collision forecasting
result = controller.coordinate_swarm(...)

# Check forecast
if result['collision_forecast']:
    print("⚠ Collision forecast:")
    for collision in result['collision_forecast']:
        print(f"  {collision['robot_a']} vs {collision['robot_b']}")
        print(f"  Time: {collision['estimated_time_ms']}ms")
else:
    print("✓ No collisions forecast")

# Proof ensures commands are safe
if verify_proof(result['swarm_proof']):
    execute_all_commands(result['commands'])
```

## Performance Metrics

| Metric | Traditional | Zeq |
|--------|-----------|--------|
| Swarm sync time | 500-2000ms | <100ms |
| Map update consistency | Eventual | Immediate |
| Collision avoidance | Reactive | Predictive |
| Path planning time | 100-500ms | 10-50ms |
| Determinism | Variable | 100% identical |
| Scalability | ~10 robots | 100+ robots |

## Next Steps

- [Weather & Agriculture](./weather-agriculture.md) — Precision farming
- [Water Infrastructure](./water-infrastructure.md) — Water systems
- [Rate Limits](../sdk/rate-limits.md) — API optimization

:::tip
Zeq-synchronized swarms achieve 10x efficiency vs traditional approaches. Deterministic behavior eliminates emergent bugs.
:::
