---
sidebar_position: 15
title: Kinematics, SLAM, Manipulation, Swarm, Control
description: Kinematics, SLAM, Manipulation, Swarm, Control protocols and algorithms
---

# Kinematics, SLAM, Manipulation, Swarm, Control

Complete reference for all Kinematics, SLAM, Manipulation, Swarm, Control protocols in the Zeq SDK.

## Overview

The Kinematics, SLAM, Manipulation, Swarm, Control protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqKinematics

**Protocol ID:** `zeq-kinematics`
**Version:** 1.287.0
**Endpoint:** `/api/robotics/kinematics` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

Forward/inverse kinematics with HulyaPulse timing. DH parameter chains up to 12-DOF, singularity avoidance, workspace analysis with R(t) joint trajectory smoothing.


#### Returns

{ pose, jointAngles, jacobian, singularityDistance, reachable, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/robotics/kinematics \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSLAM

**Protocol ID:** `zeq-slam`
**Version:** 1.287.0
**Endpoint:** `/api/robotics/slam` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Simultaneous Localization and Mapping on Zeqond frames. LiDAR/camera fusion, loop closure detection, graph-based optimization with R(t)-weighted scan matching.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sensorData | `object` | Yes | LiDAR point cloud and/or camera frames. |
| odometry | `object` | No | Wheel/IMU odometry estimates. |
| mapId | `string` | No | Existing map to localize against. |

#### Returns

{ pose, map, loopClosures, uncertainty, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/robotics/slam \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqManipulation

**Protocol ID:** `zeq-manipulation`
**Version:** 1.287.0
**Endpoint:** `/api/robotics/manipulation` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Robotic grasp planning and manipulation. Force/torque control with HulyaPulse compliance, grasp quality metric, collision-free motion planning via RRT*.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| objectModel | `object` | Yes | Object mesh/point cloud with mass properties. |
| gripperType | `string` | No |  |
| workspace | `object` | No | Obstacle geometry for collision avoidance. |

#### Returns

{ graspPoses, quality, motionPlan, forceProfile, collisionFree, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/robotics/manipulation \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSwarm

**Protocol ID:** `zeq-swarm`
**Version:** 1.287.0
**Endpoint:** `/api/robotics/swarm` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Multi-robot swarm coordination via HulyaPulse synchronization. Formation control, task allocation, consensus algorithms — all agents tick on the same Zeqond clock.


#### Returns

{ assignments, paths, formationError, consensusReached, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/robotics/swarm \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPID

**Protocol ID:** `zeq-pid`
**Version:** 1.287.0
**Endpoint:** `/api/robotics/pid` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

PID controller tuning with HulyaPulse sampling. Auto-tune via Ziegler-Nichols on Zeqond timestep, bode plot analysis, stability margin computation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| tuningMethod | `string` | No |  |
| setpoint | `number` | No | Desired setpoint value. |

#### Returns

{ Kp, Ki, Kd, stepResponse, overshoot_pct, settlingTime_s, phaseMargin_deg, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/robotics/pid \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


## Common Patterns

### Usage Tips
- Review the endpoint documentation before first use
- Start with simple inputs for testing
- Monitor API quota usage
- Cache results when appropriate for your use case
