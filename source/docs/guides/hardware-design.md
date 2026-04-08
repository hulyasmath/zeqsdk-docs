---
title: Hardware Design
description: Chip and FPGA design using Zeq for timing analysis and synthesis.
sidebar_position: 4
---

# Hardware Design with Zeq

Semiconductor design requires microsecond-accurate timing analysis. Zeq provides HulyaPulse clock tree analysis and deterministic synthesis for VLSI design automation.

## Use Case: ASIC Timing Closure

### The Problem

Traditional EDA tools:
- Timing analysis takes 4-24 hours per iteration
- Variability across tools and versions
- Non-deterministic convergence
- Manual review of critical paths

### The Solution with Zeq

Zeq provides:
- **Instant timing analysis**: Sub-minute results
- **Deterministic results**: Same netlist = same timing always
- **HulyaPulse**: Microsecond-precision clock tree analysis
- **Automated closure**: Iterative optimization with proof

## Architecture

```
RTL Code → Synthesis → Place & Route → Timing Analysis
  │          (Zeq)       (Zeq)         (HulyaPulse)
  └────────────────────────────────────┬──────────────
                                       │
                                    Timing Report
                                  + Proof Verified
```

## Core APIs

### Timing Analysis (1)

Analyze circuit timing:

```bash
curl -X POST "https://zeq.dev/api/chip/timing" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "design_id": "asic_project_2024",
    "netlist_id": "netlist_rev5",
    "process_node": 5,
    "clock_frequency_mhz": 3000,
    "corner": "tt",
    "temperature_c": 25,
    "voltage_v": 0.8,
    "analysis_type": "static",
    "critical_path_only": false,
    "generate_proof": true
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "design_id": "asic_project_2024",
    "timing_report": {
      "worst_slack_ns": -0.123,
      "critical_path_delay_ns": 0.400,
      "clock_period_ns": 0.333,
      "total_paths_analyzed": 1500000,
      "paths_failing": 847,
      "setup_slack_ns": -0.123,
      "hold_slack_ns": 0.089
    },
    "critical_paths": [
      {
        "path_id": "path_1",
        "start_cell": "FF_1",
        "end_cell": "FF_2",
        "delay_ns": 0.400,
        "slack_ns": -0.067,
        "number_of_gates": 23
      }
    ],
    "proof": "zeqproof_timing_abc123...",
    "analysis_time_ms": 847
  }
}
```

### Clock Tree Synthesis (2): HulyaPulse

Optimize clock distribution:

```bash
curl -X POST "https://zeq.dev/api/chip/clock-tree" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "design_id": "asic_project_2024",
    "root_clock_frequency_mhz": 3000,
    "num_leaf_loads": 50000,
    "max_skew_ps": 50,
    "max_latency_ns": 1.5,
    "routing_layer": "metal_8",
    "optimization_mode": "aggressive",
    "buffer_library": "stdcells_5nm"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "design_id": "asic_project_2024",
    "clock_tree": {
      "total_buffers": 12456,
      "total_length_um": 145230.5,
      "estimated_power_mw": 234.6,
      "max_skew_ps": 48.3,
      "max_latency_ns": 1.423
    },
    "buffer_breakdown": {
      "CTS_BUFFER_1": 5234,
      "CTS_BUFFER_2": 4122,
      "CTS_BUFFER_3": 3100
    },
    "proof": "zeqproof_cts_xyz789..."
  }
}
```

### FPGA Synthesis (3)

Logic synthesis for FPGA:

```bash
curl -X POST "https://zeq.dev/api/fpga/synthesis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "design_id": "fpga_project_2024",
    "rtl_file": "design.verilog",
    "target_device": "xcvu19p",
    "optimization_goal": "performance",
    "timing_constraints": {
      "clk": "3000 MHz"
    },
    "generate_timing_report": true
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "design_id": "fpga_project_2024",
    "synthesis_report": {
      "lut_count": 234567,
      "bram_count": 128,
      "dsp_count": 256,
      "estimated_wns_ns": 0.245,
      "estimated_tns_ns": 0.0
    },
    "area_utilization": {
      "lut_usage": "85.2%",
      "bram_usage": "62.4%",
      "dsp_usage": "78.1%"
    },
    "proof": "zeqproof_fpga_synthesis..."
  }
}
```

### Thermal Analysis (4)

Analyze power and temperature:

```bash
curl -X POST "https://zeq.dev/api/chip/thermal" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "design_id": "asic_project_2024",
    "power_report_file": "power.rpt",
    "die_size_mm2": 144.0,
    "package_type": "BGA_1248",
    "ambient_temp_c": 25,
    "heat_sink_type": "aluminum",
    "analysis_resolution": "high"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "design_id": "asic_project_2024",
    "thermal_report": {
      "max_temp_c": 87.3,
      "avg_temp_c": 72.1,
      "min_temp_c": 45.2,
      "hotspot_location": {
        "x_um": 5234.2,
        "y_um": 8432.1
      },
      "power_density_mw_mm2": 8.45
    },
    "cooling_analysis": {
      "adequate": true,
      "margin_c": 12.7
    },
    "proof": "zeqproof_thermal..."
  }
}
```

## Implementation: EDA Workflow

### Python Integration

```python
import requests
import os
import json

class ZeqEDAClient:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/chip"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def run_timing_analysis(self,
                           design_id: str,
                           netlist_id: str,
                           frequency_mhz: float,
                           process_node: int) -> dict:
        """Run full timing analysis."""

        payload = {
            "design_id": design_id,
            "netlist_id": netlist_id,
            "process_node": process_node,
            "clock_frequency_mhz": frequency_mhz,
            "corner": "tt",
            "temperature_c": 25,
            "voltage_v": 0.8,
            "analysis_type": "static",
            "critical_path_only": False,
            "generate_proof": True
        }

        response = self.session.post(f'{self.api_url}/timing', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def optimize_clock_tree(self,
                           design_id: str,
                           frequency_mhz: float,
                           num_loads: int,
                           max_skew_ps: float) -> dict:
        """Synthesize optimized clock tree."""

        payload = {
            "design_id": design_id,
            "root_clock_frequency_mhz": frequency_mhz,
            "num_leaf_loads": num_loads,
            "max_skew_ps": max_skew_ps,
            "max_latency_ns": frequency_mhz / 1000,
            "routing_layer": "metal_8",
            "optimization_mode": "aggressive"
        }

        response = self.session.post(f'{self.api_url}/clock-tree', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def thermal_analysis(self,
                        design_id: str,
                        power_mw: float,
                        die_area_mm2: float) -> dict:
        """Analyze thermal characteristics."""

        payload = {
            "design_id": design_id,
            "estimated_power_mw": power_mw,
            "die_size_mm2": die_area_mm2,
            "package_type": "BGA_1248",
            "ambient_temp_c": 25
        }

        response = self.session.post(f'{self.api_url}/thermal', json=payload)
        response.raise_for_status()

        return response.json()['data']

    def verify_timing_closure(self, proof: str, design_id: str) -> bool:
        """Verify timing closure proof."""

        payload = {
            "proof": proof,
            "design_id": design_id
        }

        response = self.session.post(f'{self.api_url}/verify', json=payload)
        response.raise_for_status()

        result = response.json()['data']
        return result['valid']

# Usage in design flow
eda = ZeqEDAClient()

# 1. Initial timing analysis
print("Running timing analysis...")
timing = eda.run_timing_analysis(
    design_id='asic_2024',
    netlist_id='netlist_rev5',
    frequency_mhz=3000,
    process_node=5
)

if timing['timing_report']['worst_slack_ns'] < 0:
    print(f"⚠ Setup violation: {timing['timing_report']['worst_slack_ns']} ns")

    # 2. Optimize clock tree
    print("Optimizing clock tree with HulyaPulse...")
    cts = eda.optimize_clock_tree(
        design_id='asic_2024',
        frequency_mhz=3000,
        num_loads=50000,
        max_skew_ps=50
    )

    print(f"CTS power: {cts['clock_tree']['estimated_power_mw']} mW")
    print(f"CTS skew: {cts['clock_tree']['max_skew_ps']} ps")

# 3. Thermal analysis
thermal = eda.thermal_analysis(
    design_id='asic_2024',
    power_mw=450,
    die_area_mm2=144
)

if thermal['thermal_report']['max_temp_c'] > 85:
    print(f"⚠ Thermal margin: {thermal['cooling_analysis']['margin_c']} C")

# 4. Verify closure
verified = eda.verify_timing_closure(
    timing['proof'],
    'asic_2024'
)

if verified:
    print("✓ Design timing closure verified")
```

## Deterministic Timing

Same netlist always produces identical timing:

```python
# Run 1
result1 = eda.run_timing_analysis('design_abc', 'netlist_v5', 3000, 5)
proof1 = result1['proof']
slack1 = result1['timing_report']['worst_slack_ns']

# Run 2 (identical)
result2 = eda.run_timing_analysis('design_abc', 'netlist_v5', 3000, 5)
proof2 = result2['proof']
slack2 = result2['timing_report']['worst_slack_ns']

# Guaranteed identical
assert proof1 == proof2
assert slack1 == slack2
```

## Multi-Corner Analysis

Analyze across PVT corners:

```python
corners = [
    {'corner': 'ss', 'voltage': 0.72, 'temp': 125},  # Slow-slow
    {'corner': 'tt', 'voltage': 0.80, 'temp': 25},   # Typical-typical
    {'corner': 'ff', 'voltage': 0.88, 'temp': -40}   # Fast-fast
]

results = {}
for corner in corners:
    payload = {
        "design_id": "asic_2024",
        "netlist_id": "netlist_v5",
        "process_node": 5,
        "clock_frequency_mhz": 3000,
        "corner": corner['corner'],
        "temperature_c": corner['temp'],
        "voltage_v": corner['voltage']
    }

    response = eda.session.post(f'{eda.api_url}/timing', json=payload)
    results[corner['corner']] = response.json()['data']

# Find worst corner
worst_corner = max(results.items(),
                   key=lambda x: x[1]['timing_report']['worst_slack_ns'])

print(f"Worst corner: {worst_corner[0]}")
print(f"Slack: {worst_corner[1]['timing_report']['worst_slack_ns']} ns")
```

## Iterative Closure Flow

```python
def achieve_timing_closure(eda, design_id, target_slack_ns=0.1, max_iterations=10):
    """Iteratively improve timing."""

    for iteration in range(max_iterations):
        print(f"\nIteration {iteration + 1}")

        # Run timing analysis
        timing = eda.run_timing_analysis(
            design_id=design_id,
            netlist_id=f'netlist_v{iteration}',
            frequency_mhz=3000,
            process_node=5
        )

        slack = timing['timing_report']['worst_slack_ns']
        print(f"Slack: {slack} ns")

        if slack >= target_slack_ns:
            print(f"✓ Timing closure achieved!")
            return True, timing['proof']

        # Critical paths info
        print(f"Critical paths: {len(timing['critical_paths'])}")
        print(f"Top path: {timing['critical_paths'][0]['delay_ns']} ns")

    return False, None

# Run closure flow
closed, proof = achieve_timing_closure(eda, 'asic_2024')
if not closed:
    print("✗ Could not achieve timing closure")
```

## Proof-Based Design Verification

Every design milestone is verified:

```python
design_milestones = {
    'rtl_complete': None,
    'synthesis_complete': None,
    'place_and_route_complete': None,
    'timing_verified': None,
    'thermal_verified': None
}

# Populate proofs from Zeq
design_milestones['timing_verified'] = eda.run_timing_analysis(...)['proof']
design_milestones['thermal_verified'] = eda.thermal_analysis(...)['proof']

# Create design tape-out record
tape_out_record = {
    'design_id': 'asic_2024',
    'timestamp': datetime.now().isoformat(),
    'proofs': design_milestones,
    'status': 'ready_for_fab'
}

# Save record
with open('tape_out_record.json', 'w') as f:
    json.dump(tape_out_record, f, indent=2)

print("Design tape-out record created with ZeqProof verification")
```

## Performance Comparison

| Task | Traditional | Zeq |
|------|-----------|--------|
| Timing analysis | 4-8 hours | <1 minute |
| Clock tree synthesis | 2-4 hours | 30 seconds |
| Thermal analysis | 1-2 hours | 20 seconds |
| Multi-corner analysis | 8-16 hours | 5 minutes |
| Verification | Manual | Automatic (proof) |
| Determinism | ±2-5% variance | 100% identical |

## Next Steps

- [Robotics](./robotics.md) — Multi-robot coordination
- [Weather & Agriculture](./weather-agriculture.md) — Precision farming
- [Rate Limits](../sdk/rate-limits.md) — API optimization

:::tip
Use HulyaPulse clock tree analysis to achieve timing closure in minutes instead of hours. Proofs make design verification automatic.
:::
