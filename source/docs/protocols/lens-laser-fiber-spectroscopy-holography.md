---
sidebar_position: 16
title: Lens, Laser, Fiber, Spectroscopy, Holography
description: Lens, Laser, Fiber, Spectroscopy, Holography protocols and algorithms
---

# Lens, Laser, Fiber, Spectroscopy, Holography

Complete reference for all Lens, Laser, Fiber, Spectroscopy, Holography protocols in the Zeq SDK.

## Overview

The Lens, Laser, Fiber, Spectroscopy, Holography protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqLensDesign

**Protocol ID:** `zeq-lens-design`
**Version:** 1.287.0
**Endpoint:** `/api/optics/lens` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Optical lens system design with R(t) aberration analysis. Ray tracing, Seidel aberrations, MTF curves, tolerance analysis — HulyaPulse-weighted merit function optimization.


#### Returns

{ mtf, spotDiagram, aberrations, focalLength_mm, fNumber, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/optics/lens \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqLaser

**Protocol ID:** `zeq-laser`
**Version:** 1.287.0
**Endpoint:** `/api/optics/laser` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Laser system modeling. Gain medium, cavity mode analysis, beam propagation (ABCD matrices) with R(t) pulse shaping for ultrafast applications.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cavity | `object` | Yes | Mirror curvatures and separations. |
| mode | `string` | No |  |

#### Returns

{ outputPower_W, beamWaist_um, m2, pulseWidth_fs, linewidth_nm, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/optics/laser \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqFiberOptics

**Protocol ID:** `zeq-fiber-optics`
**Version:** 1.287.0
**Endpoint:** `/api/optics/fiber` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Fiber optic link design. Attenuation, dispersion, nonlinear effects (SPM/XPM/FWM) with HulyaPulse chromatic dispersion compensation.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fiberType | `string` | Yes |  |
| length_km | `number` | Yes | Fiber length. |
| wavelength_nm | `number` | No | Operating wavelength. |
| launchPower_dBm | `number` | No | Launch power. |

#### Returns

{ loss_dB, dispersion_ps, ber, osnr_dB, nonlinearPenalty_dB, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/optics/fiber \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSpectroscopy

**Protocol ID:** `zeq-spectroscopy`
**Version:** 1.287.0
**Endpoint:** `/api/optics/spectroscopy` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Spectral analysis with HulyaPulse modulation. UV-Vis, IR, Raman, fluorescence peak fitting, compound identification, concentration quantification via Beer-Lambert.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `string` | No |  |
| referenceLibrary | `string` | No | Spectral library to match against. |

#### Returns

{ peaks, compounds, concentrations, absorbance, beerLambertFit, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/optics/spectroscopy \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqHolography

**Protocol ID:** `zeq-holography`
**Version:** 1.287.0
**Endpoint:** `/api/optics/holography` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Digital holography reconstruction. Fresnel propagation, phase unwrapping, 3D surface profiling with R(t)-compensated phase drift correction.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hologramData | `object` | Yes | Raw hologram intensity pattern. |
| wavelength_nm | `number` | Yes | Recording laser wavelength. |
| distance_mm | `number` | Yes | Reconstruction distance. |

#### Returns

{ amplitude, phase, surface3d, resolution_um, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/optics/holography \
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
