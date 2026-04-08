---
title: Emergency Systems
description: Emergency dispatch, triage, and disaster response using Zeq for pulse-synced critical infrastructure.
sidebar_position: 3
---

# Emergency Systems with Zeq

Emergency response requires split-second decision-making with legal compliance. Zeq provides Zeqond-stamped audit trails and real-time dispatch optimization for critical life-safety systems.

## Use Case: City 911 Dispatch System

### The Problem

Traditional 911 systems:
- Dispatch times: 30-90 seconds
- No audit trail for critical decisions
- Resource allocation is manual
- Post-incident review lacks proof

### The Solution with Zeq

Zeq provides:
- **Instant dispatch**: Sub-second optimization
- **Zeqond timestamps**: Cryptographic evidence of decisions
- **Multi-agency coordination**: Synchronized across agencies
- **Compliance-ready**: FDA/legal audit trails

## Architecture

```
911 Call → Zeq-911 → Optimal Resource Dispatch → EMS/Fire/Police
(intake)  (routing)  (real-time)               (synchronized)
  │         │            │                         │
  └─────────────────────────────────────────────────
           Zeqond-stamped audit trail
```

## Core APIs

### Emergency Intake & Dispatch (1)

Submit emergency call for immediate routing:

```bash
curl -X POST "https://zeq.dev/api/emergency/dispatch" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "call_id": "911_call_20240101_001",
    "caller_location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York, NY"
    },
    "incident_type": "medical",
    "severity": "critical",
    "description": "Unresponsive adult, possible cardiac arrest",
    "resources_needed": ["ambulance", "fire_truck"],
    "available_resources": {
      "ambulances": [
        {
          "id": "amb_001",
          "location": [40.7150, -74.0050],
          "eta_minutes": 2
        },
        {
          "id": "amb_002",
          "location": [40.7100, -74.0100],
          "eta_minutes": 4
        }
      ],
      "fire_trucks": [
        {
          "id": "fire_001",
          "location": [40.7140, -74.0070],
          "eta_minutes": 3
        }
      ]
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "call_id": "911_call_20240101_001",
    "dispatch_decision": {
      "primary_unit": "amb_001",
      "backup_unit": "fire_001",
      "dispatch_time_ms": 245,
      "estimated_arrival": "2024-01-01T12:02:15Z"
    },
    "dispatch_proof": "zeqproof_dispatch_abc123...",
    "timestamp": 1704067200,
    "zeqond": 1000
  }
}
```

### Mass Casualty Triage (2)

Allocate resources across multiple patients:

```bash
curl -X POST "https://zeq.dev/api/emergency/triage" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "incident_id": "incident_multicar_collision_001",
    "incident_location": [40.7128, -74.0060],
    "patients": [
      {
        "patient_id": "patient_1",
        "location": [40.7128, -74.0060],
        "vital_signs": {
          "respiratory_rate": 22,
          "heart_rate": 110,
          "blood_pressure": "90/60",
          "consciousness": "responsive"
        },
        "injuries": ["femur_fracture", "head_trauma"],
        "triage_level": "urgent"
      },
      {
        "patient_id": "patient_2",
        "location": [40.7129, -74.0061],
        "vital_signs": {
          "respiratory_rate": 8,
          "heart_rate": 45,
          "blood_pressure": "60/40",
          "consciousness": "unresponsive"
        },
        "injuries": ["internal_bleeding"],
        "triage_level": "immediate"
      }
    ],
    "available_ambulances": 3,
    "available_helicopters": 1
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "incident_id": "incident_multicar_collision_001",
    "allocations": [
      {
        "patient_id": "patient_2",
        "assigned_unit": "helicopter_1",
        "destination": "trauma_hospital_1",
        "priority": 1,
        "eta_minutes": 8
      },
      {
        "patient_id": "patient_1",
        "assigned_unit": "ambulance_1",
        "destination": "general_hospital_1",
        "priority": 2,
        "eta_minutes": 12
      }
    ],
    "optimization_proof": "zeqproof_triage_xyz789...",
    "timestamp": 1704067200,
    "compliance_verified": true
  }
}
```

### Ambulance Routing (3)

Optimize multi-stop routes:

```bash
curl -X POST "https://zeq.dev/api/emergency/ambulance-route" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "ambulance_id": "amb_001",
    "current_location": [40.7150, -74.0050],
    "stops": [
      {
        "stop_id": "patient_pickup",
        "location": [40.7128, -74.0060],
        "action": "pickup"
      },
      {
        "stop_id": "hospital_delivery",
        "location": [40.7200, -74.0100],
        "action": "delivery"
      }
    ],
    "constraints": {
      "avoid_highways": false,
      "optimize_for": "time",
      "traffic_model": "real_time"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ambulance_id": "amb_001",
    "route": {
      "waypoints": [
        [40.7150, -74.0050],
        [40.7135, -74.0055],
        [40.7128, -74.0060],
        [40.7200, -74.0100]
      ],
      "total_distance_m": 9800,
      "total_time_minutes": 12,
      "eta_delivery": "2024-01-01T12:12:45Z"
    },
    "route_proof": "zeqproof_route_def456..."
  }
}
```

### Disaster Response Coordination (4)

Coordinate multi-agency response:

```bash
curl -X POST "https://zeq.dev/api/emergency/disaster" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "incident_id": "hurricane_2024_001",
    "incident_type": "natural_disaster",
    "scope": "citywide",
    "agencies": [
      {
        "agency_id": "fdny",
        "agency_name": "Fire Department",
        "available_units": 50,
        "staged_at": [40.7160, -74.0100]
      },
      {
        "agency_id": "nypd",
        "agency_name": "Police Department",
        "available_units": 100,
        "staged_at": [40.7100, -74.0000]
      },
      {
        "agency_id": "ems",
        "agency_name": "Emergency Medical Services",
        "available_units": 30,
        "staged_at": [40.7200, -74.0050]
      }
    ],
    "affected_zones": [
      {
        "zone_id": "zone_a",
        "center": [40.7128, -74.0060],
        "severity": "critical",
        "population": 50000
      }
    ]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "incident_id": "hurricane_2024_001",
    "response_plan": {
      "zone_a": {
        "primary_agency": "fdny",
        "support_agencies": ["nypd", "ems"],
        "assigned_units": 25,
        "command_center": [40.7140, -74.0070],
        "objectives": [
          "Establish perimeter",
          "Search and rescue",
          "Medical triage"
        ]
      }
    },
    "coordination_proof": "zeqproof_disaster_ghi789...",
    "audit_trail": "zeqond_synced_all_agencies"
  }
}
```

## Implementation: 911 Dispatch Center

### Python Example

```python
import requests
import os
from datetime import datetime

class ZeqEmergencyDispatch:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/emergency"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def submit_911_call(self,
                       caller_location: dict,
                       incident_type: str,
                       severity: str,
                       description: str,
                       available_resources: dict) -> dict:
        """Submit 911 call and get optimal dispatch."""

        payload = {
            "call_id": f"911_call_{datetime.now().isoformat()}",
            "caller_location": caller_location,
            "incident_type": incident_type,
            "severity": severity,
            "description": description,
            "resources_needed": self._get_resources_for_incident(incident_type, severity),
            "available_resources": available_resources
        }

        response = self.session.post(f'{self.api_url}/dispatch', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def mass_casualty_triage(self,
                             incident_id: str,
                             incident_location: tuple,
                             patients: list,
                             available_resources: dict) -> dict:
        """Optimize resource allocation for mass casualty incident."""

        payload = {
            "incident_id": incident_id,
            "incident_location": incident_location,
            "patients": patients,
            "available_ambulances": available_resources.get('ambulances', 0),
            "available_helicopters": available_resources.get('helicopters', 0)
        }

        response = self.session.post(f'{self.api_url}/triage', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def verify_dispatch_decision(self, proof: str, call_id: str) -> bool:
        """Verify dispatch decision for legal compliance."""

        payload = {
            "proof": proof,
            "call_id": call_id
        }

        response = self.session.post(
            f'{self.api_url}/verify',
            json=payload
        )
        response.raise_for_status()

        result = response.json()['data']
        return result['valid'] and result.get('compliant_with_protocols', True)

    @staticmethod
    def _get_resources_for_incident(incident_type: str, severity: str) -> list:
        """Determine resources needed based on incident."""
        resources = {
            ('medical', 'critical'): ['ambulance', 'fire_truck'],
            ('medical', 'urgent'): ['ambulance'],
            ('fire', 'critical'): ['fire_truck', 'hazmat'],
            ('police', 'critical'): ['police_unit', 'swat'],
            ('trauma', 'critical'): ['ambulance', 'fire_truck', 'police_unit']
        }
        return resources.get((incident_type, severity), ['ambulance'])

# Usage in dispatch center
dispatcher = ZeqEmergencyDispatch()

# 911 call comes in
result = dispatcher.submit_911_call(
    caller_location={
        'latitude': 40.7128,
        'longitude': -74.0060,
        'address': '123 Main St, New York, NY'
    },
    incident_type='medical',
    severity='critical',
    description='Unresponsive adult, possible cardiac arrest',
    available_resources={
        'ambulances': [
            {'id': 'amb_001', 'location': [40.7150, -74.0050], 'eta_minutes': 2},
            {'id': 'amb_002', 'location': [40.7100, -74.0100], 'eta_minutes': 4}
        ],
        'fire_trucks': [
            {'id': 'fire_001', 'location': [40.7140, -74.0070], 'eta_minutes': 3}
        ]
    }
)

# Dispatch immediately
print(f"Dispatching {result['dispatch_decision']['primary_unit']}")
print(f"ETA: {result['dispatch_decision']['estimated_arrival']}")

# Verify for compliance
verified = dispatcher.verify_dispatch_decision(
    result['dispatch_proof'],
    result['call_id']
)
print(f"Decision verified: {verified}")
```

## Audit Trail & Compliance

Every emergency decision is Zeqond-stamped:

```json
{
  "audit_entry": {
    "call_id": "911_call_001",
    "decision": "Dispatch AMB_001",
    "timestamp": "2024-01-01T12:01:00Z",
    "zeqond": 1000,
    "proof": "zeqproof_abc123...",
    "dispatcher_id": "dispatcher_john",
    "justification": "Closest available unit with 2-min ETA"
  }
}
```

### Legal Compliance

- **NFPA 1710/1720**: Response time compliance verified
- **HIPAA**: Patient data deidentified automatically
- **State laws**: Dispatch protocols enforced
- **Post-incident review**: Complete audit trail with proofs

## Real-Time Dashboard Integration

```javascript
class EmergencyDashboard {
  constructor(client) {
    this.client = client;
    this.activeIncidents = new Map();
  }

  async updateIncidentStatus(callId, status) {
    const incident = this.activeIncidents.get(callId);

    // Update in Zeq
    const result = await this.client.updateIncident(callId, status);

    // Display on dashboard
    this.renderIncident({
      callId,
      status: result.status,
      units: result.assigned_units,
      eta: result.estimated_arrival,
      proof: result.proof
    });

    // Verify compliance
    const verified = await this.client.verifyDecision(result.proof, callId);
    if (!verified) {
      alert(`⚠ Decision verification failed for ${callId}`);
    }
  }

  renderIncident(incident) {
    const marker = new google.maps.Marker({
      position: incident.location,
      map: this.map,
      title: incident.callId,
      color: this.getSeverityColor(incident.severity)
    });

    infoWindow.open(this.map, marker);
  }
}
```

## Multi-Agency Coordination

All agencies see synchronized data:

```javascript
// Fire department
const fireDispatch = await client.getDispatchForAgency('fdny');

// Police department
const policeDispatch = await client.getDispatchForAgency('nypd');

// EMS
const emsDispatch = await client.getDispatchForAgency('ems');

// All see identical incident data thanks to Zeqonds
assert(fireDispatch.incident_version === policeDispatch.incident_version);
```

## Performance Metrics

| Metric | Traditional | Zeq |
|--------|-----------|--------|
| Dispatch time | 30-90 sec | <1 sec |
| Audit trail | Manual logs | Automatic ZeqProof |
| Resource optimization | Heuristic | AI-optimized |
| Multi-agency sync | Eventual | Immediate |
| Compliance review | Weeks | Instant (proof-verified) |

## Next Steps

- [Hardware Design](./hardware-design.md) — Chip design timing
- [Robotics](./robotics.md) — Multi-robot coordination
- [Error Handling](../sdk/error-handling.md) — Handle API errors

:::warning
Emergency systems handle life-critical decisions. Always verify ZeqProofs for legal compliance. Never rely on unverified decisions.
:::
