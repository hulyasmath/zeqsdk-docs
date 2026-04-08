---
sidebar_position: 7
title: Chip Design, FPGA, Thermal, Power, Testing
description: Chip Design, FPGA, Thermal, Power, Testing protocols and algorithms
---

# Chip Design, FPGA, Thermal, Power, Testing

Complete reference for all Chip Design, FPGA, Thermal, Power, Testing protocols in the Zeq SDK.

## Overview

The Chip Design, FPGA, Thermal, Power, Testing protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqChipDesign

**Protocol ID:** `zeq-chip-design`
**Version:** 1.287.0
**Endpoint:** `/api/hardware/chip` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

IC timing analysis with HulyaPulse clock tree. Setup/hold verification at 0.777s boundaries, gate-level simulation, power estimation with R(t) leakage modeling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| netlist | `object` | Yes | Gate-level netlist (Verilog JSON or SPICE reference). |
| clockFreq_MHz | `number` | No | Target clock frequency. |
| processNode_nm | `number` | No | Fabrication node in nm. |

#### Returns

{ setupSlack_ns, holdSlack_ns, powerEstimate_mW, criticalPath, drc_errors, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hardware/chip \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFPGA

**Protocol ID:** `zeq-fpga`
**Version:** 1.287.0
**Endpoint:** `/api/hardware/fpga` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

FPGA synthesis and place-route optimization. HulyaPulse clock domain crossing verification, LUT utilization, DSP block allocation with Zeqond timing constraints.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hdlSource | `string` | Yes | Verilog/VHDL source or reference. |
| targetDevice | `string` | No | FPGA family (e.g.  |
| constraints | `object` | No | Timing/pin constraints. |

#### Returns

{ lutUtilization_pct, dspBlocks, bramUsage, fMax_MHz, timingMet, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hardware/fpga \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqThermal

**Protocol ID:** `zeq-thermal`
**Version:** 1.287.0
**Endpoint:** `/api/hardware/thermal` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Chip thermal simulation with R(t)-modulated heat dissipation. Junction temperature prediction, hotspot identification, cooling solution sizing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| chipLayout | `object` | Yes | Die layout with power density map. |
| coolingType | `string` | No |  |
| ambientTemp_C | `number` | No | Ambient temperature. |

#### Returns

{ junctionTemp_C, hotspots, thermalResistance_C_W, coolingRequired_W, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hardware/thermal \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPowerIntegrity

**Protocol ID:** `zeq-power-integrity`
**Version:** 1.287.0
**Endpoint:** `/api/hardware/power-integrity` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

PDN analysis with HulyaPulse noise characterization. IR drop, AC impedance, decoupling capacitor placement optimization synced to Zeqond switching transients.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| pdnModel | `object` | Yes | Power delivery network model. |
| currentProfile | `object` | Yes | Transient current demand profile. |
| targetRipple_mV | `number` | No | Maximum voltage ripple. |

#### Returns

{ irDrop_mV, acImpedance, decapPlan, worstCaseRipple_mV, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hardware/power-integrity \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqChipTest

**Protocol ID:** `zeq-chip-test`
**Version:** 1.287.0
**Endpoint:** `/api/hardware/test` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Automated test pattern generation (ATPG) with Zeqond scan chains. Fault coverage analysis, BIST integration, yield prediction using R(t) defect density modeling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| netlist | `object` | Yes | Gate-level netlist. |
| faultModel | `string` | No |  |
| targetCoverage_pct | `number` | No | Target fault coverage. |

#### Returns

{ testPatterns, faultCoverage_pct, testTime_ms, yieldPrediction_pct, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/hardware/test \
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
