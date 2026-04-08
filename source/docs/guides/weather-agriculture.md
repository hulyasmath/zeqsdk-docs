---
title: Weather & Precision Agriculture
description: Weather forecasting and precision agriculture using Zeq for crop management and irrigation optimization.
sidebar_position: 6
---

# Weather & Precision Agriculture with Zeq

Precision farming requires real-time weather analysis and irrigation scheduling. Zeq provides deterministic weather forecasting and HulyaPulse temporal interpolation for crop disease detection and water optimization.

## Use Case: Smart Irrigation System

### The Problem

Traditional farming:
- Generic weather forecasts (inaccurate at field level)
- Manual irrigation scheduling (water waste)
- Reactive disease management (crop loss)
- No real-time optimization

### The Solution with Zeq

Zeq provides:
- **Hyperlocal forecasting**: Predict weather at each field
- **R(t) interpolation**: Estimate between sensor measurements
- **Disease detection**: Real-time pathogen risk assessment
- **Water optimization**: Minimize irrigation while maximizing yield

## Architecture

```
Weather Stations → Zeq → Field Predictions → Irrigation Control
(Local sensors)   (R(t))   (Hyperlocal)      (Optimized watering)
     │              │           │                   │
     └──────────────┴───────────┴───────────────────┘
          Zeqond-stamped forecasts with proof
```

## Core APIs

### Weather Forecast (1)

Get hyperlocal weather prediction:

```bash
curl -X POST "https://zeq.dev/api/weather/forecast" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "field_id": "field_north_40acres",
    "location": {
      "latitude": 40.2164,
      "longitude": -93.6450,
      "elevation_m": 285
    },
    "forecast_hours": 48,
    "resolution_minutes": 15,
    "include_soil_conditions": true,
    "include_pest_risk": true
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "field_id": "field_north_40acres",
    "forecast_horizon_hours": 48,
    "predictions": [
      {
        "hour": 0,
        "timestamp": "2024-06-01T12:00:00Z",
        "temperature_c": 22.3,
        "humidity_percent": 65,
        "wind_speed_ms": 3.2,
        "wind_direction": 180,
        "rainfall_mm": 0.0,
        "solar_radiation_w_m2": 850,
        "soil_moisture_percent": 68,
        "leaf_wetness_hours": 0,
        "pest_risk": {
          "corn_borer": 0.12,
          "powdery_mildew": 0.05,
          "rust": 0.22
        }
      },
      {
        "hour": 1,
        "timestamp": "2024-06-01T13:00:00Z",
        "temperature_c": 23.1,
        "humidity_percent": 62,
        "wind_speed_ms": 3.5,
        "wind_direction": 185,
        "rainfall_mm": 0.0,
        "solar_radiation_w_m2": 920,
        "soil_moisture_percent": 67,
        "leaf_wetness_hours": 0,
        "pest_risk": {
          "corn_borer": 0.14,
          "powdery_mildew": 0.04,
          "rust": 0.24
        }
      }
    ],
    "proof": "zeqproof_weather_abc123...",
    "proof_verified": true
  }
}
```

### Irrigation Schedule (2)

Optimize irrigation timing:

```bash
curl -X POST "https://zeq.dev/api/agriculture/irrigation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "field_id": "field_north_40acres",
    "crop_type": "corn",
    "growth_stage": "V6",
    "soil_type": "loam",
    "current_soil_moisture_percent": 68,
    "irrigation_available_mm": 100,
    "forecast": {
      "next_48_hours": "mostly_sunny",
      "rainfall_probability": 0.1,
      "avg_temperature_c": 23
    },
    "optimization_goal": "maximize_yield_minimize_water",
    "constraints": {
      "available_water_mm": 100,
      "application_rate_mm_hr": 10
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "field_id": "field_north_40acres",
    "irrigation_schedule": [
      {
        "scheduled_start": "2024-06-02T08:00:00Z",
        "duration_hours": 2.5,
        "application_mm": 25,
        "confidence": 0.92,
        "justification": "Soil below field capacity, warm forecast"
      },
      {
        "scheduled_start": "2024-06-04T07:30:00Z",
        "duration_hours": 1.5,
        "application_mm": 15,
        "confidence": 0.87,
        "justification": "Preempt V8 growth stage water need"
      }
    ],
    "water_savings_mm": 25,
    "predicted_yield_increase_percent": 3.2,
    "proof": "zeqproof_irrigation_xyz789...",
    "optimization_details": {
      "total_water_used_mm": 40,
      "total_water_available_mm": 100,
      "efficiency_percent": 92
    }
  }
}
```

### Crop Disease Risk (3)

Assess disease risk in real-time:

```bash
curl -X POST "https://zeq.dev/api/agriculture/disease-risk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "field_id": "field_north_40acres",
    "crop_type": "corn",
    "growth_stage": "V8",
    "current_weather": {
      "temperature_c": 22.3,
      "humidity_percent": 78,
      "leaf_wetness_hours": 4,
      "rainfall_mm": 8.5
    },
    "disease_history": [
      {
        "disease": "gray_leaf_spot",
        "last_occurrence_year": 2023,
        "severity": "moderate"
      }
    ],
    "scouting_notes": "Minor leaf spotting observed"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "field_id": "field_north_40acres",
    "disease_risks": [
      {
        "disease": "gray_leaf_spot",
        "risk_level": "high",
        "probability_percent": 68,
        "confidence": 0.91,
        "recommended_action": "Apply fungicide within 48 hours",
        "fungicide_options": [
          {
            "name": "Headline AMP",
            "cost_per_acre": 12.50,
            "efficacy_percent": 85,
            "re_entry_hours": 12
          }
        ]
      },
      {
        "disease": "northern_corn_leaf_blight",
        "risk_level": "moderate",
        "probability_percent": 42,
        "confidence": 0.79,
        "recommended_action": "Monitor closely, treat if lesion percentage exceeds 5%"
      }
    ],
    "proof": "zeqproof_disease_risk_def456...",
    "action_priority": 1
  }
}
```

### Soil Conditions Interpolation (4)

Estimate soil conditions between measurements:

```bash
curl -X POST "https://zeq.dev/api/agriculture/soil-conditions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "field_id": "field_north_40acres",
    "soil_measurements": [
      {
        "time": "2024-06-01T06:00:00Z",
        "moisture_percent": 72,
        "temperature_c": 18.5,
        "sensor_location": [40.2164, -93.6450]
      },
      {
        "time": "2024-06-02T06:00:00Z",
        "moisture_percent": 68,
        "temperature_c": 20.2,
        "sensor_location": [40.2164, -93.6450]
      }
    ],
    "interpolation_method": "r_t_enhanced",
    "prediction_time": "2024-06-01T18:00:00Z"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "field_id": "field_north_40acres",
    "prediction_time": "2024-06-01T18:00:00Z",
    "soil_moisture_percent": 70.2,
    "soil_temperature_c": 19.4,
    "confidence": 0.94,
    "interpolation_details": {
      "method": "R(t)_temporal",
      "measurements_used": 2,
      "time_window_hours": 24
    },
    "proof": "zeqproof_soil_interp_ghi789..."
  }
}
```

## Implementation: Farm Management System

### Python Integration

```python
import requests
import os
from datetime import datetime, timedelta

class ZeqAgriculturalAI:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/agriculture"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def forecast_weather(self,
                        field_id: str,
                        latitude: float,
                        longitude: float,
                        hours: int = 48) -> dict:
        """Get hyperlocal weather forecast."""

        payload = {
            "field_id": field_id,
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "elevation_m": 300
            },
            "forecast_hours": hours,
            "resolution_minutes": 15,
            "include_soil_conditions": True,
            "include_pest_risk": True
        }

        response = self.session.post(
            'https://zeq.dev/api/weather/forecast',
            json=payload
        )
        response.raise_for_status()

        return response.json()['data']

    def optimize_irrigation(self,
                           field_id: str,
                           crop_type: str,
                           growth_stage: str,
                           soil_moisture_percent: float,
                           available_water_mm: float,
                           forecast: dict) -> dict:
        """Optimize irrigation schedule."""

        payload = {
            "field_id": field_id,
            "crop_type": crop_type,
            "growth_stage": growth_stage,
            "soil_type": "loam",
            "current_soil_moisture_percent": soil_moisture_percent,
            "irrigation_available_mm": available_water_mm,
            "forecast": forecast,
            "optimization_goal": "maximize_yield_minimize_water",
            "constraints": {
                "available_water_mm": available_water_mm,
                "application_rate_mm_hr": 10
            }
        }

        response = self.session.post(f'{self.api_url}/irrigation', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def assess_disease_risk(self,
                           field_id: str,
                           crop_type: str,
                           growth_stage: str,
                           current_weather: dict,
                           disease_history: list) -> dict:
        """Assess crop disease risk."""

        payload = {
            "field_id": field_id,
            "crop_type": crop_type,
            "growth_stage": growth_stage,
            "current_weather": current_weather,
            "disease_history": disease_history,
            "scouting_notes": ""
        }

        response = self.session.post(
            f'{self.api_url}/disease-risk',
            json=payload
        )
        response.raise_for_status()

        return response.json()['data']

    def interpolate_soil_conditions(self,
                                   field_id: str,
                                   measurements: list,
                                   prediction_time: str) -> dict:
        """Interpolate soil conditions using R(t)."""

        payload = {
            "field_id": field_id,
            "soil_measurements": measurements,
            "interpolation_method": "r_t_enhanced",
            "prediction_time": prediction_time
        }

        response = self.session.post(
            f'{self.api_url}/soil-conditions',
            json=payload
        )
        response.raise_for_status()

        return response.json()['data']

# Farm management workflow
ai = ZeqAgriculturalAI()

# 1. Get weather forecast
weather = ai.forecast_weather(
    field_id='field_north_40acres',
    latitude=40.2164,
    longitude=-93.6450,
    hours=48
)

print("Weather Forecast:")
for pred in weather['predictions'][:3]:
    print(f"  {pred['timestamp']}: {pred['temperature_c']}°C, "
          f"Humidity: {pred['humidity_percent']}%, "
          f"Rain: {pred['rainfall_mm']}mm")

# 2. Check disease risk
diseases = ai.assess_disease_risk(
    field_id='field_north_40acres',
    crop_type='corn',
    growth_stage='V8',
    current_weather={
        'temperature_c': 22.3,
        'humidity_percent': 78,
        'leaf_wetness_hours': 4,
        'rainfall_mm': 8.5
    },
    disease_history=[
        {'disease': 'gray_leaf_spot', 'last_occurrence_year': 2023}
    ]
)

print("\nDisease Risk Assessment:")
for disease in diseases['disease_risks']:
    print(f"  {disease['disease']}: {disease['risk_level']} "
          f"({disease['probability_percent']}%)")
    if disease['recommended_action']:
        print(f"    Action: {disease['recommended_action']}")

# 3. Optimize irrigation
irrigation = ai.optimize_irrigation(
    field_id='field_north_40acres',
    crop_type='corn',
    growth_stage='V8',
    soil_moisture_percent=68,
    available_water_mm=100,
    forecast={
        'next_48_hours': 'mostly_sunny',
        'rainfall_probability': 0.1,
        'avg_temperature_c': 23
    }
)

print("\nOptimal Irrigation Schedule:")
for schedule in irrigation['irrigation_schedule']:
    print(f"  {schedule['scheduled_start']}: "
          f"{schedule['application_mm']}mm "
          f"({schedule['duration_hours']}hr)")

print(f"\nWater Savings: {irrigation['water_savings_mm']}mm")
print(f"Expected Yield Increase: {irrigation['predicted_yield_increase_percent']}%")
```

## Real-Time Monitoring Dashboard

```python
class FarmDashboard:
    def __init__(self, ai: ZeqAgriculturalAI):
        self.ai = ai

    def generate_daily_report(self, field_id: str, location: tuple) -> dict:
        """Generate comprehensive daily farm report."""

        # Get all data
        weather = self.ai.forecast_weather(
            field_id=field_id,
            latitude=location[0],
            longitude=location[1],
            hours=24
        )

        diseases = self.ai.assess_disease_risk(
            field_id=field_id,
            crop_type='corn',
            growth_stage='V10',
            current_weather=weather['predictions'][0],
            disease_history=[]
        )

        irrigation = self.ai.optimize_irrigation(
            field_id=field_id,
            crop_type='corn',
            growth_stage='V10',
            soil_moisture_percent=70,
            available_water_mm=100,
            forecast={'next_48_hours': 'sunny'}
        )

        return {
            'field_id': field_id,
            'date': datetime.now().isoformat(),
            'weather_summary': {
                'avg_temp': sum(p['temperature_c'] for p in weather['predictions']) / len(weather['predictions']),
                'total_rain': sum(p['rainfall_mm'] for p in weather['predictions']),
                'max_humidity': max(p['humidity_percent'] for p in weather['predictions'])
            },
            'disease_alerts': [d for d in diseases['disease_risks'] if d['risk_level'] in ['high', 'critical']],
            'irrigation_recommended': irrigation['irrigation_schedule'],
            'water_efficiency': irrigation['optimization_details']['efficiency_percent']
        }

# Generate report
dashboard = FarmDashboard(ai)
report = dashboard.generate_daily_report('field_north_40acres', (40.2164, -93.6450))
print(f"Daily Report for {report['date']}:")
print(f"  Avg temp: {report['weather_summary']['avg_temp']:.1f}°C")
print(f"  Total rain: {report['weather_summary']['total_rain']}mm")
print(f"  Disease alerts: {len(report['disease_alerts'])}")
print(f"  Water efficiency: {report['water_efficiency']}%")
```

## R(t) Temporal Interpolation

Estimate between sparse measurements:

```python
# Sparse soil moisture measurements
measurements = [
    {'time': '2024-06-01T06:00:00Z', 'moisture': 72},
    {'time': '2024-06-02T06:00:00Z', 'moisture': 68}
]

# Estimate moisture at hourly intervals using R(t)
predictions = ai.interpolate_soil_conditions(
    field_id='field_north_40acres',
    measurements=measurements,
    prediction_time='2024-06-01T18:00:00Z'  # Estimate at 6 PM
)

print(f"Soil moisture at 6 PM: {predictions['soil_moisture_percent']}%")
print(f"Confidence: {predictions['confidence'] * 100}%")
```

## Compliance & Record Keeping

Every decision is documented with proof:

```python
# Each recommendation is logged with ZeqProof
decision_log = {
    'field_id': 'field_north_40acres',
    'date': datetime.now().isoformat(),
    'decisions': [
        {
            'type': 'irrigation',
            'recommendation': 'Apply 25mm',
            'timestamp': weather['proof'],
            'justification': 'Soil below field capacity'
        },
        {
            'type': 'fungicide_application',
            'recommendation': 'Apply Headline AMP',
            'timestamp': diseases['proof'],
            'justification': 'Gray leaf spot risk 68%'
        }
    ]
}

# Save to compliance database
save_to_compliance_database(decision_log)
```

## Performance Impact

| Metric | Traditional | Zeq |
|--------|-----------|--------|
| Forecast accuracy | ±3-4°C | ±0.5°C |
| Irrigation waste | 20-30% | <5% |
| Disease detection | Reactive | Predictive (48-72hr) |
| Yield increase | Baseline | +5-8% |
| Water savings | Baseline | 20-30% |
| Decision audit trail | Manual notes | Automatic (proof) |

## Next Steps

- [Water Infrastructure](./water-infrastructure.md) — Urban water systems
- [Forensics & Security](./forensics-security.md) — Digital evidence
- [Rate Limits](../sdk/rate-limits.md) — API optimization

:::tip
Precision agriculture with Zeq combines hyperlocal weather forecasting with deterministic optimization. Farmers save water while increasing yields.
:::
