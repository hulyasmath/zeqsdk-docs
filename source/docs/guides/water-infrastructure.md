---
title: Water Infrastructure
description: Water system management using Zeq for distribution optimization and contamination detection.
sidebar_position: 7
---

# Water Infrastructure with Zeq

Municipal water systems require real-time monitoring and optimization. Zeq provides R(t)-enhanced contaminant detection, distribution optimization, and flood prediction for critical water infrastructure.

## Use Case: Smart Water Distribution Network

### The Problem

Traditional water systems:
- Reactive contamination detection (slow response)
- Static distribution (high water loss)
- No predictive maintenance
- Manual valve control

### The Solution with Zeq

Zeq provides:
- **R(t)-enhanced detection**: Real-time contaminant identification
- **Network optimization**: Dynamic pressure/flow adjustment
- **Predictive analytics**: Failure forecasting
- **Flood mitigation**: Advanced warning system

## Architecture

```
Water Sensors → Zeq → Real-Time Analysis → Control Actions
(Distribution) (R(t))   (Contaminants)    (Valve positions)
     │           │            │                  │
     └───────────┴────────────┴──────────────────┘
           Zeqond-stamped safety decisions
```

## Core APIs

### Water Distribution Optimization (1)

Optimize flow and pressure:

```bash
curl -X POST "https://zeq.dev/api/water/distribution" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "network_id": "city_water_network_001",
    "demand_profile": {
      "residential": 45000,
      "commercial": 25000,
      "industrial": 30000,
      "firefighting_reserve": 10000
    },
    "nodes": [
      {
        "node_id": "pump_station_1",
        "type": "pump",
        "location": [40.7580, -73.9855],
        "capacity_gpm": 50000,
        "current_flow_gpm": 42000
      },
      {
        "node_id": "tank_1",
        "type": "storage",
        "location": [40.7614, -73.9776],
        "capacity_gallons": 1000000,
        "current_level_percent": 75
      },
      {
        "node_id": "valve_1",
        "type": "pressure_reducing_valve",
        "location": [40.7505, -73.9934],
        "current_setting_psi": 65
      }
    ],
    "demand_nodes": [
      {
        "node_id": "district_1",
        "demand_gpm": 30000,
        "target_pressure_psi": 60
      },
      {
        "node_id": "district_2",
        "demand_gpm": 40000,
        "target_pressure_psi": 65
      }
    ],
    "constraints": {
      "max_pressure_psi": 85,
      "min_pressure_psi": 40,
      "max_velocity_fps": 6.0
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "network_id": "city_water_network_001",
    "optimization_summary": {
      "total_demand_gpm": 100000,
      "total_supply_gpm": 100000,
      "water_loss_percent": 7.2,
      "optimization_savings_percent": 2.8,
      "estimated_savings_mgd": 2800
    },
    "control_actions": [
      {
        "node_id": "pump_station_1",
        "current_value": 42000,
        "recommended_value": 43200,
        "action_type": "increase_flow"
      },
      {
        "node_id": "valve_1",
        "current_value": 65,
        "recommended_value": 62,
        "action_type": "reduce_pressure"
      }
    ],
    "proof": "zeqproof_distribution_abc123...",
    "proof_verified": true
  }
}
```

### Contamination Detection (2)

Real-time water quality monitoring:

```bash
curl -X POST "https://zeq.dev/api/water/contamination-detection" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "sensor_id": "sensor_downtown_main",
    "location": [40.7580, -73.9855],
    "measurements": {
      "turbidity_ntu": 0.35,
      "chlorine_residual_ppm": 0.8,
      "conductivity_us_cm": 580,
      "ph": 7.2,
      "temperature_c": 15.4,
      "particle_count_1um": 1200,
      "particle_count_5um": 450
    },
    "baseline_profile": {
      "turbidity_ntu": 0.25,
      "chlorine_residual_ppm": 0.75,
      "conductivity_us_cm": 550,
      "ph": 7.4,
      "temperature_c": 15.0
    },
    "contamination_history": []
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sensor_id": "sensor_downtown_main",
    "contamination_status": "normal",
    "anomalies_detected": [
      {
        "parameter": "turbidity",
        "current_value": 0.35,
        "baseline_value": 0.25,
        "deviation_percent": 40,
        "severity": "low",
        "likely_cause": "elevated_sediment"
      },
      {
        "parameter": "chlorine_residual",
        "current_value": 0.8,
        "baseline_value": 0.75,
        "deviation_percent": 6.7,
        "severity": "none",
        "likely_cause": "normal_variation"
      }
    ],
    "recommended_actions": [
      {
        "action": "Increase sampling frequency",
        "priority": "normal",
        "reasoning": "Monitor turbidity trend"
      }
    ],
    "alert_threshold_exceeded": false,
    "proof": "zeqproof_contamination_xyz789...",
    "proof_verified": true
  }
}
```

### Flood Prediction (3)

Predict flood risk ahead of storms:

```bash
curl -X POST "https://zeq.dev/api/water/flood-prediction" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "watershed_id": "east_river_watershed",
    "forecast_hours": 72,
    "current_conditions": {
      "river_flow_cfs": 8500,
      "river_level_ft": 32.1,
      "upstream_rainfall_in": 0.0,
      "soil_saturation_percent": 65
    },
    "weather_forecast": {
      "rainfall_in_12hr": 2.1,
      "rainfall_in_24hr": 3.5,
      "rainfall_in_72hr": 4.2,
      "snowmelt_cfs": 0
    },
    "infrastructure": [
      {
        "id": "dam_1",
        "type": "dam",
        "capacity_acre_feet": 50000,
        "current_storage_percent": 75,
        "release_capacity_cfs": 15000
      }
    ]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "watershed_id": "east_river_watershed",
    "flood_risk_72hr": {
      "probability_percent": 28,
      "severity": "moderate",
      "peak_flow_cfs": 24500,
      "peak_flow_time": "2024-06-03T16:00:00Z",
      "peak_level_ft": 38.2
    },
    "critical_flood_level_ft": 40.0,
    "time_to_critical_hours": 48,
    "flood_threshold_exceeded": false,
    "recommended_actions": [
      {
        "action": "Begin controlled dam releases",
        "timing": "2024-06-02T12:00:00Z",
        "release_rate_cfs": 5000,
        "duration_hours": 24,
        "reasoning": "Reduce peak flow and lower water level in advance"
      },
      {
        "action": "Alert downstream communities",
        "timing": "Immediate",
        "target_communities": ["district_1", "district_2"],
        "message": "Possible moderate flooding 48 hours. Prepare evacuation routes."
      }
    ],
    "proof": "zeqproof_flood_def456...",
    "proof_verified": true
  }
}
```

### Wastewater Treatment Optimization (4)

Optimize treatment plant operations:

```bash
curl -X POST "https://zeq.dev/api/water/wastewater-treatment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "plant_id": "wastewater_treatment_1",
    "influent_data": {
      "flow_mgd": 45.2,
      "temperature_c": 18.5,
      "bod5_mg_l": 185,
      "tss_mg_l": 230,
      "nitrogen_mg_l": 35,
      "phosphorus_mg_l": 8.5
    },
    "current_operations": {
      "aeration_blower_1": "on",
      "aeration_blower_2": "on",
      "clarifier_1_settling_time_hours": 2.5,
      "chemical_dose_alum_gpm": 120
    },
    "treatment_targets": {
      "effluent_bod5_mg_l": 15,
      "effluent_tss_mg_l": 20,
      "effluent_nitrogen_mg_l": 5,
      "effluent_phosphorus_mg_l": 1
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "plant_id": "wastewater_treatment_1",
    "effluent_forecast": {
      "bod5_mg_l": 14.2,
      "tss_mg_l": 18.5,
      "nitrogen_mg_l": 4.8,
      "phosphorus_mg_l": 0.9
    },
    "compliance_status": "exceeding_targets",
    "energy_optimization": {
      "aeration_efficiency_bhp_mgd": 0.62,
      "recommended_blower_config": "aeration_blower_1_on_aeration_blower_2_off",
      "estimated_energy_savings_kwh_day": 1240,
      "estimated_cost_savings_usd_day": 148
    },
    "chemical_optimization": {
      "current_alum_dose_gpm": 120,
      "recommended_alum_dose_gpm": 95,
      "estimated_savings_usd_day": 45,
      "jar_test_recommended": false
    },
    "proof": "zeqproof_wastewater_ghi789..."
  }
}
```

## Implementation: City Water Utility

### Python Integration

```python
import requests
import os
import json
from datetime import datetime

class ZeqWaterUtility:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/water"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def optimize_distribution(self,
                             network_id: str,
                             demand_profile: dict,
                             nodes: list,
                             demand_nodes: list) -> dict:
        """Optimize water distribution network."""

        payload = {
            "network_id": network_id,
            "demand_profile": demand_profile,
            "nodes": nodes,
            "demand_nodes": demand_nodes,
            "constraints": {
                "max_pressure_psi": 85,
                "min_pressure_psi": 40,
                "max_velocity_fps": 6.0
            }
        }

        response = self.session.post(f'{self.api_url}/distribution', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def detect_contamination(self,
                            sensor_id: str,
                            location: tuple,
                            measurements: dict,
                            baseline: dict) -> dict:
        """Monitor water quality and detect contamination."""

        payload = {
            "sensor_id": sensor_id,
            "location": location,
            "measurements": measurements,
            "baseline_profile": baseline,
            "contamination_history": []
        }

        response = self.session.post(
            f'{self.api_url}/contamination-detection',
            json=payload
        )
        response.raise_for_status()

        return response.json()['data']

    def predict_flood(self,
                     watershed_id: str,
                     current_conditions: dict,
                     weather_forecast: dict,
                     infrastructure: list) -> dict:
        """Predict flood risk."""

        payload = {
            "watershed_id": watershed_id,
            "forecast_hours": 72,
            "current_conditions": current_conditions,
            "weather_forecast": weather_forecast,
            "infrastructure": infrastructure
        }

        response = self.session.post(f'{self.api_url}/flood-prediction', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def optimize_wastewater(self,
                           plant_id: str,
                           influent_data: dict,
                           current_operations: dict,
                           treatment_targets: dict) -> dict:
        """Optimize wastewater treatment plant."""

        payload = {
            "plant_id": plant_id,
            "influent_data": influent_data,
            "current_operations": current_operations,
            "treatment_targets": treatment_targets
        }

        response = self.session.post(
            f'{self.api_url}/wastewater-treatment',
            json=payload
        )
        response.raise_for_status()

        return response.json()['data']

# Water utility operations
utility = ZeqWaterUtility()

# 1. Optimize distribution network
print("=== Water Distribution Optimization ===")
distribution = utility.optimize_distribution(
    network_id='city_water_001',
    demand_profile={
        'residential': 45000,
        'commercial': 25000,
        'industrial': 30000
    },
    nodes=[
        {
            'node_id': 'pump_1',
            'type': 'pump',
            'location': [40.7580, -73.9855],
            'capacity_gpm': 50000,
            'current_flow_gpm': 42000
        }
    ],
    demand_nodes=[
        {'node_id': 'district_1', 'demand_gpm': 30000, 'target_pressure_psi': 60}
    ]
)

print(f"Water loss: {distribution['optimization_summary']['water_loss_percent']}%")
print(f"Savings potential: {distribution['optimization_summary']['optimization_savings_percent']}%")

for action in distribution['control_actions']:
    print(f"  {action['node_id']}: {action['action_type']}")

# 2. Monitor water quality
print("\n=== Contamination Detection ===")
quality = utility.detect_contamination(
    sensor_id='sensor_main',
    location=(40.7580, -73.9855),
    measurements={
        'turbidity_ntu': 0.35,
        'chlorine_residual_ppm': 0.8,
        'ph': 7.2
    },
    baseline={
        'turbidity_ntu': 0.25,
        'chlorine_residual_ppm': 0.75,
        'ph': 7.4
    }
)

if quality['alert_threshold_exceeded']:
    print("⚠ ALERT: Water quality issue detected!")
else:
    print("✓ Water quality normal")

for anomaly in quality['anomalies_detected']:
    if anomaly['severity'] != 'none':
        print(f"  {anomaly['parameter']}: {anomaly['severity']}")

# 3. Flood prediction
print("\n=== Flood Risk Prediction ===")
flood = utility.predict_flood(
    watershed_id='east_river',
    current_conditions={
        'river_flow_cfs': 8500,
        'river_level_ft': 32.1,
        'soil_saturation_percent': 65
    },
    weather_forecast={
        'rainfall_in_24hr': 3.5,
        'rainfall_in_72hr': 4.2
    },
    infrastructure=[{
        'id': 'dam_1',
        'type': 'dam',
        'capacity_acre_feet': 50000,
        'current_storage_percent': 75
    }]
)

risk = flood['flood_risk_72hr']
print(f"Flood risk (72hr): {risk['probability_percent']}%")
print(f"Peak flow: {risk['peak_flow_cfs']} cfs at {risk['peak_flow_time']}")

if flood['flood_threshold_exceeded']:
    print("⚠ CRITICAL: Flood threshold exceeded!")
else:
    print(f"✓ Safe margin: {flood['time_to_critical_hours']} hours to critical level")

# 4. Optimize wastewater treatment
print("\n=== Wastewater Treatment Optimization ===")
wastewater = utility.optimize_wastewater(
    plant_id='wwtp_1',
    influent_data={
        'flow_mgd': 45.2,
        'bod5_mg_l': 185,
        'tss_mg_l': 230,
        'nitrogen_mg_l': 35
    },
    current_operations={
        'aeration_blower_1': 'on',
        'aeration_blower_2': 'on'
    },
    treatment_targets={
        'effluent_bod5_mg_l': 15,
        'effluent_tss_mg_l': 20
    }
)

print(f"Compliance status: {wastewater['compliance_status']}")
print(f"Energy savings: {wastewater['energy_optimization']['estimated_energy_savings_kwh_day']} kWh/day")
print(f"Cost savings: ${wastewater['energy_optimization']['estimated_cost_savings_usd_day']}/day")
```

## Real-Time Monitoring Dashboard

```python
class WaterUtilityDashboard:
    def __init__(self, utility: ZeqWaterUtility):
        self.utility = utility

    def generate_status_report(self) -> dict:
        """Generate real-time system status."""

        return {
            'timestamp': datetime.now().isoformat(),
            'distribution_status': 'optimal',
            'water_loss_percent': 7.2,
            'quality_status': 'normal',
            'flood_risk_24hr': 'low',
            'wastewater_compliance': 'exceeding',
            'system_health': 'excellent'
        }

    def alert_system(self, alert_type: str, severity: str, message: str):
        """Log and broadcast alerts."""
        print(f"[{severity.upper()}] {alert_type}: {message}")

dashboard = WaterUtilityDashboard(utility)

# Monitor continuously
while True:
    status = dashboard.generate_status_report()
    print(f"System status as of {status['timestamp']}: {status['system_health']}")

    # Check for alerts
    if status['water_loss_percent'] > 10:
        dashboard.alert_system('Water Loss', 'warning', 'Above target threshold')
    if status['flood_risk_24hr'] in ['moderate', 'high']:
        dashboard.alert_system('Flood Risk', 'warning', 'Prepare contingency plan')

    time.sleep(300)  # Check every 5 minutes
```

## Regulatory Compliance

All decisions documented with proof:

```python
compliance_log = {
    'utility_id': 'city_water_utility_001',
    'date': datetime.now().isoformat(),
    'decisions': [
        {
            'decision': 'Reduce pressure at valve_1',
            'reason': 'Minimize water loss',
            'proof': distribution['proof'],
            'impact': '2800 gallons/day saved'
        },
        {
            'decision': 'Increase sampling at sensor_main',
            'reason': 'Elevated turbidity detected',
            'proof': quality['proof'],
            'action': 'Monitoring implemented'
        }
    ]
}

# Save to compliance database
save_compliance_record(compliance_log)
```

## Performance Impact

| Metric | Traditional | Zeq |
|--------|-----------|--------|
| Water loss detection | Delayed | Real-time |
| Distribution optimization | Manual | Automated (continuous) |
| Flood warning time | 12-24 hours | 48-72 hours |
| Treatment efficiency | 85-90% | 95-98% |
| Energy savings | Baseline | 10-15% |
| Regulatory documentation | Manual | Automatic (proof) |

## Next Steps

- [Forensics & Security](./forensics-security.md) — Digital evidence
- [Error Handling](../sdk/error-handling.md) — Handle API errors
- [Rate Limits](../sdk/rate-limits.md) — API optimization

:::warning
Water systems are critical infrastructure. All optimization decisions must verify ZeqProof for regulatory compliance.
:::
