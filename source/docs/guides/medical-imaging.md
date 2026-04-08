---
title: Medical Imaging
description: Building with Zeq for medical imaging protocols, MRI reconstruction, CT, and ultrasound.
sidebar_position: 1
---

# Medical Imaging with Zeq

Medical imaging relies on precise spatiotemporal computation. Zeq accelerates reconstruction, analysis, and real-time guidance with deterministic R(t)-enhanced quality and Zeqond-stamped audit trails for clinical compliance.

## Use Case: Hospital MRI Reconstruction

### The Problem

Traditional MRI reconstruction involves:
1. Raw k-space data acquisition (undersampled for speed)
2. Iterative reconstruction algorithms (slow, variable quality)
3. Manual quality assessment and repeat scans
4. High radiation/scan time for patients

### The Solution with Zeq

Zeq provides:
- **Deterministic reconstruction**: Same input = same output every time
- **R(t)-enhanced quality**: Temporal inference from neighboring timeframes
- **Zeqond-stamped proofs**: Cryptographic evidence of reconstruction integrity
- **Real-time guidance**: Quality feedback during active scans

## Architecture

```
┌─────────────────┐
│  MRI Scanner    │  Raw k-space data
│                 │  (undersampled, 1-2 sec)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Zeq: zeq-mri                    │
│  - Parse DICOM                      │
│  - Temporal interpolation (R(t))    │
│  - Iterative reconstruction         │
│  - Generate proof                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Radiologist View   │  High-quality image
│  (5 sec processing) │  + quality metrics
└─────────────────────┘
```

## API Integration

### Submit MRI Scan (1)

Submit raw k-space data for reconstruction:

```bash
curl -X POST "https://zeq.dev/api/medical/mri" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "scan_id": "scan_mri_2024_001",
    "patient_id": "patient_xyz_deidentified",
    "modality": "3T_siemens",
    "sequence": "T1_MPRAGE",
    "k_space_data": {
      "format": "base64",
      "dimensions": [256, 256, 128],
      "data": "base64_encoded_k_space_binary..."
    },
    "acquisition_params": {
      "TR_ms": 2300,
      "TE_ms": 2.98,
      "flip_angle_degrees": 9,
      "undersampling_factor": 2.0
    },
    "enhancement_level": 2,
    "quality_targets": {
      "min_snr": 40.0,
      "target_artifacts": "minimal"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scan_id": "scan_mri_2024_001",
    "status": "processing",
    "estimated_duration_ms": 5000,
    "computation_id": "comp_mri_abc123",
    "timestamp": 1704067200
  }
}
```

### Get Reconstruction Result (2)

Once complete, retrieve the reconstructed image:

```bash
curl -X GET "https://zeq.dev/api/medical/mri/comp_mri_abc123" \
  -H "Authorization: Bearer $ZEQ_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scan_id": "scan_mri_2024_001",
    "status": "complete",
    "image": {
      "format": "DICOM",
      "dimensions": [256, 256, 128],
      "data_url": "s3://zeq-medical/scan_mri_2024_001.nii.gz"
    },
    "quality_metrics": {
      "snr": 42.3,
      "cnr": 38.1,
      "artifacts_detected": 0,
      "conformance_score": 0.98
    },
    "proof": "zeqproof_mri_abc123...",
    "proof_verified": true,
    "timestamp": 1704067205
  }
}
```

### Verify Reconstruction Proof (3)

Ensure clinical compliance with cryptographic proof:

```bash
curl -X POST "https://zeq.dev/api/medical/verify" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZEQ_TOKEN" \
  -d '{
    "proof": "zeqproof_mri_abc123...",
    "scan_id": "scan_mri_2024_001",
    "expected_quality_score": 0.98
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "scan_id": "scan_mri_2024_001",
    "details": {
      "proof_type": "MRI_RECONSTRUCTION",
      "verified_at": 1704067205,
      "algorithm_version": "zeq-mri-v2.1",
      "audit_hash": "sha256_abc123...",
      "compliant_with": ["HIPAA", "FDA_guidance"]
    }
  }
}
```

## Implementation: Hospital Radiology System

### Python Example

```python
import requests
import os
import numpy as np
from pathlib import Path

class ZeqMRIClient:
    def __init__(self, token: str = None):
        self.token = token or os.environ['ZEQ_TOKEN']
        self.api_url = "https://zeq.dev/api/medical"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        })

    def submit_mri_scan(self,
                        scan_id: str,
                        patient_id: str,
                        k_space_data: np.ndarray,
                        params: dict) -> str:
        """Submit MRI scan for reconstruction."""

        # Encode k-space data
        k_space_bytes = k_space_data.astype(np.complex64).tobytes()
        import base64
        k_space_b64 = base64.b64encode(k_space_bytes).decode('utf-8')

        payload = {
            "scan_id": scan_id,
            "patient_id": patient_id,  # Must be deidentified
            "modality": params.get('modality', '3T'),
            "sequence": params.get('sequence', 'T1_MPRAGE'),
            "k_space_data": {
                "format": "base64",
                "dimensions": list(k_space_data.shape),
                "data": k_space_b64
            },
            "acquisition_params": {
                "TR_ms": params.get('TR', 2300),
                "TE_ms": params.get('TE', 2.98),
                "flip_angle_degrees": params.get('flip_angle', 9),
                "undersampling_factor": params.get('undersampling', 2.0)
            },
            "enhancement_level": 2,
            "quality_targets": {
                "min_snr": 40.0,
                "target_artifacts": "minimal"
            }
        }

        response = self.session.post(f'{self.api_url}/mri', json=payload)
        response.raise_for_status()

        result = response.json()
        return result['data']['computation_id']

    def get_reconstruction(self, computation_id: str):
        """Retrieve reconstruction result."""
        response = self.session.get(f'{self.api_url}/mri/{computation_id}')
        response.raise_for_status()

        data = response.json()['data']
        return {
            'image_url': data['image']['data_url'],
            'quality_metrics': data['quality_metrics'],
            'proof': data['proof'],
            'verified': data['proof_verified']
        }

    def verify_reconstruction(self, proof: str, scan_id: str, quality_score: float):
        """Verify reconstruction proof for compliance."""
        payload = {
            "proof": proof,
            "scan_id": scan_id,
            "expected_quality_score": quality_score
        }

        response = self.session.post(f'{self.api_url}/verify', json=payload)
        response.raise_for_status()

        return response.json()['data']

# Usage
client = ZeqMRIClient()

# Load DICOM and extract k-space
import pydicom
dcm = pydicom.dcmread('patient_scan.dcm')
k_space = extract_kspace(dcm)

# Submit for reconstruction
comp_id = client.submit_mri_scan(
    scan_id='scan_20240101_001',
    patient_id='patient_12345_deidentified',
    k_space_data=k_space,
    params={'modality': '3T', 'undersampling': 2.5}
)

print(f"Submitted: {comp_id}")
print("Waiting for reconstruction...")

# Poll for result
import time
while True:
    result = client.get_reconstruction(comp_id)
    if result:
        break
    time.sleep(1)

# Verify for compliance
verification = client.verify_reconstruction(
    result['proof'],
    'scan_20240101_001',
    result['quality_metrics']['conformance_score']
)

print(f"Verified: {verification['valid']}")
print(f"Compliant with: {verification['compliant_with']}")
```

## Supported Modalities

| Modality | Endpoint | Enhancement | Quality Metrics |
|----------|----------|-------------|-----------------|
| MRI (3T/7T) | `/medical/mri` | R(t) interpolation | SNR, CNR, artifacts |
| CT | `/medical/ct` | Artifact reduction | Hounsfield accuracy |
| Ultrasound | `/medical/ultrasound` | Speckle reduction | Contrast, resolution |
| PET | `/medical/pet` | Attenuation correction | Activity concentration |

## DICOM Integration

Zeq handles DICOM transparently:

```python
# Input: Raw DICOM file
import pydicom

dcm = pydicom.dcmread('scan.dcm')
k_space = extract_kspace(dcm)

# Submit to Zeq
comp_id = client.submit_mri_scan(
    scan_id=dcm.SeriesInstanceUID,
    patient_id=dcm.PatientID,  # Deidentify first!
    k_space_data=k_space,
    params=extract_acq_params(dcm)
)

# Output: DICOM with reconstruction + metadata
# Includes original protocol + quality metrics + proof
```

## Quality Assurance

Zeq provides deterministic quality:

```python
# Same input always produces same output
result1 = client.submit_mri_scan(scan_id, patient_id, k_space, params)
result2 = client.submit_mri_scan(scan_id, patient_id, k_space, params)

# Proofs verify identical processing
assert result1['proof'] == result2['proof']
assert result1['quality_metrics'] == result2['quality_metrics']
```

## Clinical Workflow

```
Patient → Scanner → Zeq → Radiologist → EHR
          (5 sec)  (R(t))   (Auto QA)   (Report)
           │       │         │           │
           └─────────────────┼─────────────
                  Zeqond-stamped audit trail
```

## Compliance

- **HIPAA**: De-identified patient data handling
- **FDA**: 21 CFR Part 11 digital signature equivalent via ZeqProof
- **GDPR**: Data minimization via deidentification
- **DICOM**: Full standard compliance

## Real-Time Guidance

During scan acquisition:

```python
# Radiologist can preview real-time quality
def live_preview(scan_id: str):
    while True:
        result = client.get_reconstruction(scan_id, preview=True)
        if result['ready']:
            display_image(result['image'])
            print(f"SNR: {result['quality_metrics']['snr']}")

        if result['quality_metrics']['snr'] > 40:
            print("✓ Quality acceptable, scan can complete")
            break
        else:
            print("⚠ Low SNR, recommend adjustment")

        time.sleep(0.5)
```

## Comparison: Traditional vs Zeq-Enhanced

| Aspect | Traditional | Zeq |
|--------|-----------|--------|
| Reconstruction time | 30-120 sec | 3-8 sec |
| Quality assurance | Manual | Automated + ZeqProof |
| Artifact reduction | Limited | R(t)-enhanced |
| Repeat scans | 10-15% | <5% |
| Audit trail | Notes | Cryptographic proof |
| Compliance effort | High | Automated |

## Next Steps

- [Game Physics](./game-physics.md) — Real-time physics for games
- [Error Handling](../sdk/error-handling.md) — Handle API errors
- [Rate Limits](../sdk/rate-limits.md) — Optimize throughput

:::tip
Medical imaging with Zeq combines speed with compliance. The cryptographic proofs provide FDA-ready audit trails.
:::
