---
sidebar_position: 7
title: Mesh API
description: ZeqMesh — decentralized node network management
---

# Mesh API

ZeqMesh enables decentralized computation across a distributed network of nodes. All nodes are synchronized via HulyaPulse timing, allowing seamless coordination of computation across the mesh without central orchestration. The Mesh API provides node registration, discovery, heartbeat tracking, and network topology management.

## Overview

ZeqMesh nodes form a self-organizing peer-to-peer network. Each node:
- Registers with a unique `nodeId` and mesh address
- Sends periodic heartbeats to report liveness
- Syncs computation state via HulyaPulse ticks
- Discovers peer nodes for direct peering
- Participates in mesh-wide synchronization events

All timing is synchronized to the HulyaPulse daemon running at 1.287 Hz.

## Network Status

### Mesh Network Health

Quick health check for the ZeqMesh network.

```
GET /api/mesh/health
```

**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "network": "ZeqMesh",
  "nodes_online": number,
  "nodes_syncing": number,
  "mesh_id": "string"
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/mesh/health
```

### Full Mesh Network Status

Comprehensive status of all mesh nodes and network state.

```
GET /api/mesh/status
```

**Response:**
```json
{
  "ok": true,
  "network_active": boolean,
  "node_count": number,
  "nodes_online": number,
  "nodes_syncing": number,
  "nodes_inactive": number,
  "mesh_id": "string",
  "consensus_round": number,
  "last_sync": "string (ISO 8601)",
  "topology_version": number
}
```

**Field Definitions:**
- `node_count` — Total registered nodes
- `nodes_online` — Nodes actively sending heartbeats
- `nodes_syncing` — Nodes participating in current sync round
- `nodes_inactive` — Nodes offline or unresponsive
- `consensus_round` — Current HulyaPulse sync round number
- `topology_version` — Current network topology version (increments on changes)

**Example:**
```bash
curl -X GET http://localhost:3000/api/mesh/status
```

## Node Management

### List All Registered Nodes

Retrieve information about all nodes in the mesh network.

```
GET /api/mesh/nodes
```

**Response:**
```json
{
  "ok": true,
  "nodes": [
    {
      "nodeId": "string (unique node identifier)",
      "meshId": "string (cluster membership ID)",
      "address": "string (IP address or hostname)",
      "port": number,
      "capabilities": ["string"],
      "status": "online|syncing|offline",
      "last_heartbeat": "string (ISO 8601)",
      "computation_load": number (0-100),
      "version": "string (zeq version)"
    }
  ]
}
```

**Field Definitions:**
- `nodeId` — Unique node identifier (UUID v4)
- `meshId` — Cluster membership token
- `status` — `online` (active), `syncing` (in sync round), or `offline` (unresponsive)
- `computation_load` — Percentage of node capacity in use (0-100)
- `capabilities` — List of computation types node supports (e.g., `["zeq", "lattice", "solve"]`)

**Example:**
```bash
curl -X GET http://localhost:3000/api/mesh/nodes
```

### Register a New Mesh Node

Register a new node to join the ZeqMesh network.

```
POST /api/mesh/register
```

**Request Body:**
```json
{
  "address": "string (IP or hostname)",
  "port": number,
  "capabilities": ["string"] (optional)
}
```

**Response:**
```json
{
  "ok": true,
  "nodeId": "string (new node ID)",
  "meshId": "string (cluster ID)",
  "endpoint": "string (mesh endpoint URL)"
}
```

**Field Definitions:**
- `nodeId` — Unique identifier for this node (use in future requests)
- `meshId` — Cluster membership token (same for all nodes in mesh)
- `endpoint` — Full mesh endpoint URL for peering

**Example:**
```bash
curl -X POST http://localhost:3000/api/mesh/register \
  -H "Content-Type: application/json" \
  -d '{
    "address": "192.168.1.100",
    "port": 5000,
    "capabilities": ["zeq", "lattice", "solve"]
  }'
```

## Node Heartbeat

### Send Node Heartbeat

Periodic heartbeat to report node liveness and status. Call every ~200ms or aligned with HulyaPulse ticks.

```
POST /api/mesh/heartbeat/:nodeId
```

**URL Parameters:**
- `nodeId` — Your node's ID (from registration)

**Request Body:**
```json
{
  "zeqond": number (current zeqond index),
  "computation_load": number (0-100),
  "status": "online|syncing",
  "uptime_ms": number (milliseconds since startup),
  "metrics": {
    "memory_mb": number,
    "cpu_percent": number,
    "pending_tasks": number
  }
}
```

**Response:**
```json
{
  "ok": true,
  "nodeId": "string",
  "zeqond_acked": number,
  "next_sync_zeqond": number,
  "consensus_round": number
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/mesh/heartbeat/node-uuid-123 \
  -H "Content-Type: application/json" \
  -d '{
    "zeqond": 6227,
    "computation_load": 45,
    "status": "online",
    "uptime_ms": 3600000,
    "metrics": {
      "memory_mb": 512,
      "cpu_percent": 23,
      "pending_tasks": 3
    }
  }'
```

## Discovery & Peering

### Discover Available Nodes for Peering

Find nodes available for direct peer-to-peer connection.

```
GET /api/mesh/discover
```

**Query Parameters:**
- `capability` (string, optional) — Filter nodes by capability (e.g., `zeq`, `lattice`)
- `exclude_self` (boolean, optional) — Exclude your own node (default: true)
- `min_load` (number, optional) — Maximum load percentage (find underutilized nodes)

**Response:**
```json
{
  "ok": true,
  "candidates": [
    {
      "nodeId": "string",
      "address": "string",
      "port": number,
      "capabilities": ["string"],
      "computation_load": number,
      "latency_ms": number (estimated RTT)
    }
  ]
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/mesh/discover?capability=solve&min_load=70"
```

## Synchronization

### Trigger Mesh Synchronization

Initiate a cluster-wide synchronization round aligned to HulyaPulse ticks.

```
POST /api/mesh/sync
```

**Request Body:**
```json
{
  "sync_zeqond": number (zeqond at which to sync),
  "include_nodes": ["nodeId"] (optional, all nodes if omitted),
  "timeout_ms": number (optional, default: 1000)
}
```

**Response:**
```json
{
  "ok": true,
  "sync_round": number,
  "zeqond": number,
  "nodes_syncing": number,
  "expected_completion_ms": number
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/mesh/sync \
  -H "Content-Type: application/json" \
  -d '{
    "sync_zeqond": 6230,
    "timeout_ms": 2000
  }'
```

## Network Topology

### Get Network Topology Graph

Retrieve the current mesh topology showing node interconnections.

```
GET /api/mesh/topology
```

**Response:**
```json
{
  "ok": true,
  "mesh_id": "string",
  "timestamp": "string (ISO 8601)",
  "nodes": [
    {
      "nodeId": "string",
      "address": "string",
      "status": "online|offline"
    }
  ],
  "edges": [
    {
      "from": "string (nodeId)",
      "to": "string (nodeId)",
      "latency_ms": number,
      "bandwidth_mbps": number,
      "synchronized": boolean
    }
  ]
}
```

**Field Definitions:**
- `nodes` — All mesh nodes and their addresses
- `edges` — Direct peer connections between nodes
- `synchronized` — Whether link is synchronized to HulyaPulse
- `latency_ms` — Round-trip latency in milliseconds
- `bandwidth_mbps` — Measured bandwidth capacity

**Example:**
```bash
curl -X GET http://localhost:3000/api/mesh/topology
```

## HulyaPulse Synchronization

All ZeqMesh nodes synchronize to HulyaPulse ticks. The mesh operates in **Zeqond-aligned rounds**:

1. **Every Zeqond (0.777s):** Nodes exchange state snapshots
2. **Consensus:** All nodes agree on state at each Zeqond boundary
3. **Deterministic Execution:** Computation results are identical across all nodes at same Zeqond

This enables true decentralized consensus without leader election or Byzantine fault tolerance overhead.

### Zeqond-Based Scheduling

When scheduling mesh operations, align to Zeqond boundaries:

```
next_zeqond = ceil(current_zeqond + delay_zeqonds)
sync_time_ms = next_zeqond * 777
```

Example: To sync at next Zeqond:
```bash
curl -X GET http://localhost:3000/api/daemon/pulse \
  -s | jq '.zeqond_index' # Current zeqond

# Schedule sync 1 zeqond in future
curl -X POST http://localhost:3000/api/mesh/sync \
  -d '{"sync_zeqond": NEXT_ZEQOND}'
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "ok": false,
  "error": "string (error code)",
  "message": "string (human-readable description)"
}
```

Common error codes:
- `NODE_NOT_FOUND` — Node ID not registered
- `INVALID_CAPABILITY` — Requested capability unsupported
- `MESH_TIMEOUT` — Synchronization did not complete in time
- `NETWORK_PARTITION` — Mesh is partitioned (some nodes unreachable)
- `INVALID_ZEQOND` — Requested zeqond in past or too far future
- `HEARTBEAT_STALE` — Last heartbeat too old (node presumed offline)

## Best Practices

1. **Heartbeat Interval:** Send heartbeats every 200-400ms or every HulyaPulse tick
2. **Sync Timing:** Align synchronization to Zeqond boundaries for determinism
3. **Node Cleanup:** Nodes offline for >30 seconds are removed from topology
4. **Load Balancing:** Use `discovery` endpoint to find underutilized nodes
5. **Capability Declaration:** Register with accurate capabilities to enable routing
