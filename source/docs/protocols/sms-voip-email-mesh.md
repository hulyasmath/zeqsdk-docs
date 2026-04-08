---
sidebar_position: 32
title: SMS, VoIP, Email, Mesh
description: SMS, VoIP, Email, Mesh protocols and algorithms
---

# SMS, VoIP, Email, Mesh

Complete reference for all SMS, VoIP, Email, Mesh protocols in the Zeq SDK.

## Overview

The SMS, VoIP, Email, Mesh protocol family enables advanced computational capabilities.

## Protocols (15)

### ZeqSMS

**Protocol ID:** `zeq-sms`
**Version:** 1.287.0
**Endpoint:** `/api/comms/sms` 🔵 POST
**Authentication:** Required
**Rate Limit:** 30/min

#### Description

HulyaPulse-synced SMS delivery. Encodes payload with R(t) modulation for tamper-evident timestamps. Supports international E.164 routing, delivery receipts, and Zeqond-stamped audit logs.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| to | `string` | Yes | Destination phone number (E.164 format). |
| body | `string` | Yes | Message body (max 1600 chars, auto-segments). |
| zeqondStamp | `boolean` | No | Embed Zeqond timestamp in metadata. |

#### Returns

{ messageId, status, zeqond, phase, deliveryEstimate, segments }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/comms/sms \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqVoIP

**Protocol ID:** `zeq-voip`
**Version:** 1.287.0
**Endpoint:** `/api/comms/voip` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Pulse-synchronized voice-over-IP channel. Zeqond-quantized jitter buffer, HulyaPulse clock recovery for sub-ms synchronization, OPUS codec at 48kHz.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| from | `string` | Yes | Caller SIP URI or E.164. |
| to | `string` | Yes | Callee SIP URI or E.164. |
| codec | `string` | No |  |

#### Returns

{ sessionId, codec, sampleRate, zeqondSync, jitterBuffer_ms, status }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/comms/voip \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEmail

**Protocol ID:** `zeq-email`
**Version:** 1.287.0
**Endpoint:** `/api/comms/email` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Pulse-verified email dispatch. DKIM/SPF/DMARC compliant with Zeqond timestamp headers for cryptographic send-time provenance.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| to | `string` | Yes | Recipient email address. |
| subject | `string` | Yes | Email subject line. |
| body | `string` | Yes | HTML or plain-text body. |
| format | `string` | No |  |

#### Returns

{ messageId, status, zeqondStamp, deliveryHash }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/comms/email \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMesh Communications

**Protocol ID:** `zeq-mesh-comms`
**Version:** 1.287.0
**Endpoint:** `/api/comms/mesh` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Off-grid mesh communication protocol. Peer-to-peer message relay using LoRa/BLE with Zeqond time-sync for disaster zones where cell towers are down.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| nodeId | `string` | Yes | Destination mesh node ID. |
| payload | `string` | Yes | Message payload (max 256 bytes for LoRa). |
| priority | `string` | No |  |

#### Returns

{ relayPath, hops, deliveryStatus, zeqond, meshLatency_ms }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/comms/mesh \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSatellite Comms

**Protocol ID:** `zeq-satellite-comms`
**Version:** 1.287.0
**Endpoint:** `/api/comms/satellite` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

LEO satellite relay for remote areas. Zeqond-compensated Doppler correction, store-and-forward with guaranteed delivery.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| destination | `string` | Yes | Ground station ID or lat/lng. |
| payload | `string` | Yes | Data payload. |
| priority | `string` | No |  |

#### Returns

{ uplinkId, satelliteId, dopplerCorrection_Hz, deliveryWindow, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/comms/satellite \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMRI

**Protocol ID:** `zeq-mri`
**Version:** 1.287.0
**Endpoint:** `/api/medical/mri` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

HulyaPulse-synced MRI signal reconstruction. R(t) modulation on k-space trajectories for artifact suppression. Supports T1/T2/FLAIR sequences with Zeqond-gated cardiac sync.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sequence | `string` | Yes |  |
| kSpaceData | `object` | Yes | Raw k-space matrix or DICOM reference. |
| sliceThickness_mm | `number` | No | Slice thickness in mm. |
| cardiacGate | `boolean` | No | Enable Zeqond cardiac gating. |

#### Returns

{ reconstructedImage, snr, artifactScore, zeqond, phase, resolution_mm, T_relaxation }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/mri \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCT

**Protocol ID:** `zeq-ct`
**Version:** 1.287.0
**Endpoint:** `/api/medical/ct` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

CT reconstruction with HulyaPulse filtered back-projection. Dose optimization via R(t)-weighted attenuation coefficients. Hounsfield unit calibration at ≤0.1% error.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sinogram | `object` | Yes | Raw sinogram data or DICOM reference. |
| algorithm | `string` | No |  |
| doseOptimize | `boolean` | No | Enable R(t) dose reduction. |

#### Returns

{ reconstructedSlices, hounsfield, doseReduction_pct, snr, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/ct \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqUltrasound

**Protocol ID:** `zeq-ultrasound`
**Version:** 1.287.0
**Endpoint:** `/api/medical/ultrasound` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Ultrasound beamforming with HulyaPulse phase coherence. 1.287 Hz sub-harmonic extraction for tissue characterization. Supports B-mode, M-mode, Doppler.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| mode | `string` | Yes |  |
| rfData | `object` | Yes | Raw RF echo data. |
| frequency_MHz | `number` | No | Transducer frequency. |

#### Returns

{ image, tissueDensity, bloodFlow, depthPenetration_cm, zeqond, phase }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/ultrasound \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqX-Ray

**Protocol ID:** `zeq-xray`
**Version:** 1.287.0
**Endpoint:** `/api/medical/xray` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Digital X-ray enhancement with pulse-modulated contrast. Adaptive histogram equalization synced to Zeqond intervals for consistent exposure across body regions.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawImage | `object` | Yes | Raw detector data or DICOM. |
| bodyRegion | `string` | No |  |
| enhance | `boolean` | No | Apply R(t) contrast enhancement. |

#### Returns

{ enhancedImage, contrastRatio, doseEstimate_mSv, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/xray \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPET

**Protocol ID:** `zeq-pet`
**Version:** 1.287.0
**Endpoint:** `/api/medical/pet` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

PET scan coincidence detection with Zeqond-gated timing windows. 777ms coincidence frames for improved spatial resolution and reduced random noise.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| listModeData | `object` | Yes | Raw list-mode coincidence data. |
| tracer | `string` | No |  |
| gating | `string` | No |  |

#### Returns

{ suv_map, metabolicVolume, quantification, zeqond, resolution_mm }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/pet \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqDialysis

**Protocol ID:** `zeq-dialysis`
**Version:** 1.287.0
**Endpoint:** `/api/medical/dialysis` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Hemodialysis flow optimization via HulyaPulse. R(t)-modulated blood pump rates for hemodynamic stability. Real-time urea kinetics (Kt/V) with Zeqond sampling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| patientWeight_kg | `number` | Yes | Patient dry weight in kg. |
| targetKtV | `number` | No | Target Kt/V (≥1.2 standard). |
| bloodFlowRate_mlMin | `number` | No | Blood pump rate ml/min. |
| dialysateFlow_mlMin | `number` | No | Dialysate flow ml/min. |

#### Returns

{ optimalFlowRate, KtV_predicted, sessionDuration_min, ufGoal_ml, zeqond, pulseSync }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/dialysis \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqVentilator

**Protocol ID:** `zeq-ventilator`
**Version:** 1.287.0
**Endpoint:** `/api/medical/ventilator` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Mechanical ventilation with HulyaPulse respiratory synchronization. Adaptive tidal volume, PEEP optimization, and lung-protective ventilation using R(t) pressure waveforms.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| mode | `string` | Yes |  |
| patientWeight_kg | `number` | Yes | Ideal body weight kg. |
| fio2 | `number` | No | Fraction of inspired oxygen (0.21–1.0). |
| peep_cmH2O | `number` | No | Positive end-expiratory pressure. |

#### Returns

{ tidalVolume_ml, respiratoryRate, plateauPressure, compliance, drivingPressure, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/ventilator \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqPacemaker

**Protocol ID:** `zeq-pacemaker`
**Version:** 1.287.0
**Endpoint:** `/api/medical/pacemaker` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Cardiac pacing optimization via HulyaPulse. 1.287 Hz sub-harmonic analysis of intrinsic rhythm, adaptive rate response, and AV delay tuning for biventricular sync.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| ecgData | `object` | Yes | 12-lead ECG data or intracardiac electrogram. |
| pacingMode | `string` | No |  |
| lowerRate_bpm | `number` | No | Lower rate limit. |

#### Returns

{ optimalAVdelay_ms, pacingThreshold_V, sensingAmplitude_mV, rateResponse, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/pacemaker \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqInsulin

**Protocol ID:** `zeq-insulin`
**Version:** 1.287.0
**Endpoint:** `/api/medical/insulin` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Closed-loop insulin pump optimization. Zeqond-sampled CGM readings, predictive glucose modeling with R(t)-modulated basal rates for tighter glycemic control.


#### Returns

{ recommendedBasal_U_hr, bolusSuggestion_U, predictedGlucose_1hr, timeInRange_pct, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/insulin \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqEPS

**Protocol ID:** `zeq-eps`
**Version:** 1.287.0
**Endpoint:** `/api/medical/eps` 🔵 POST
**Authentication:** Required
**Rate Limit:** 5/min

#### Description

Electrophysiology study protocol. HulyaPulse-gated intracardiac signal analysis for arrhythmia mapping, conduction velocity measurement, and ablation targeting.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| intracardiacSignals | `object` | Yes | Multi-electrode intracardiac electrograms. |
| stimulationProtocol | `string` | No |  |
| mappingType | `string` | No |  |

#### Returns

{ conductionVelocity_m_s, refractoryPeriod_ms, arrhythmiaRisk, ablationTargets, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/medical/eps \
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
