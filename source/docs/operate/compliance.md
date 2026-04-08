---
title: Compliance & Audit
description: Per-call audit envelope (FDA 21 CFR Part 11, ISO 27001, GDPR, SOX, DO-178C, NIST 800-53) returned on every Zeq computation.
sidebar_position: 5
---

# Compliance & Audit

Every call to `POST /api/zeq/compute` returns a deterministic, hash-chained
**compliance envelope** (`zeq.compliance.v1`) that any regulated industry can
drop straight into an audit trail. No extra endpoint, no opt-in flag — it
ships on every CKO response.

## What you get

Each response includes a `compliance` object at the top level **and**
mirrored inside `cko.compliance`. Two response headers also surface the
envelope ID and schema for log scrapers:

```
X-Zeq-Compliance-Envelope: <envelope_id>
X-Zeq-Compliance-Schema:   zeq.compliance.v1
```

## Envelope shape

```json
{
  "schema": "zeq.compliance.v1",
  "envelope_id": "d13205ff35265fe03639a3dc994e98d4",
  "generated_at_iso": "2026-04-07T18:04:23.117Z",
  "actor": {
    "user_id": "...",
    "api_key_prefix": "zeq_ak_demo_…",
    "plan": "free",
    "country": "GB"
  },
  "action": {
    "endpoint": "/api/zeq/compute",
    "operator_ids": ["KO42", "GR32"],
    "domain": "general_relativity",
    "input_digest": "…",
    "started_at_iso": "2026-04-07T18:04:23.103Z",
    "finished_at_iso": "2026-04-07T18:04:23.117Z",
    "duration_ms": 14
  },
  "temporal": {
    "pulse_hz": 1.287,
    "zeqond_seconds": 0.777,
    "zeqond_tick": 2293180834,
    "phase_radians": 1.821,
    "phase_fraction": 0.289872
  },
  "output": {
    "result_digest": "…",
    "zeq_proof": "…",
    "precision_bound": 0.001,
    "metric_shift_triggered": false,
    "constants_version": "NIST CODATA 2018",
    "kernel_version": "v1.287.5"
  },
  "regulatory": {
    "fda_21_cfr_part_11": {
      "attributable": true,
      "legible": true,
      "contemporaneous": true,
      "original": true,
      "accurate": true
    },
    "iso_27001_aligned": true,
    "gdpr_art_30": {
      "purpose": "scientific_computation",
      "lawful_basis": "consent_or_contract",
      "retention": "user_controlled"
    }
  },
  "chain": {
    "alg": "sha256",
    "bound_to_proof": "<zeq_proof>",
    "envelope_hash": "<sha256(envelope_minus_chain)>"
  }
}
```

## Regulatory mappings

The envelope is designed to satisfy provenance requirements of:

| Standard | What the envelope proves |
| --- | --- |
| **FDA 21 CFR Part 11** | ALCOA: Attributable · Legible · Contemporaneous · Original · Accurate |
| **EU GMP Annex 11** | Computerised system audit trail |
| **ISO/IEC 27001** | Information security audit record |
| **ISO 13485** | Medical device design control trace |
| **SOX / SOC 2** | Financial-control immutable log |
| **DO-178C / ARP4754A** | Aerospace software lifecycle data |
| **NIST SP 800-53** | Federal security control audit |
| **GDPR Art. 30** | Records of processing activities |

## Verifying an envelope

The `chain.envelope_hash` is `sha256(envelope_minus_chain)` and is bound to
the same `zeq_proof` returned in the computation result, so any third party
can verify a compliance record matches the computation it claims to certify
without ever holding your API key.

```bash
curl -sS https://www.zeq.dev/api/zeq/verify \
  -H "Content-Type: application/json" \
  -d '{"zeqProof":"<proof>","envelopeHash":"<hash>"}'
```

## Industry recipes

- **Pharma / clinical trials** — store the envelope alongside source data;
  the `chain.bound_to_proof` field gives FDA inspectors a single
  cryptographic anchor per computation.
- **Aerospace / safety-critical** — the `temporal` block proves the call was
  phase-locked to the 1.287 Hz HulyaPulse, satisfying DO-178C tool
  qualification trace requirements.
- **Finance / SOX** — the `actor` + `action` + `output` triple is a
  drop-in immutable log entry; export to your SIEM via the
  `X-Zeq-Compliance-Envelope` header.
- **Defense / FedRAMP** — `regulatory.iso_27001_aligned` plus the
  hash-chained `chain` field map directly to NIST SP 800-53 AU-2/AU-10
  controls.

> **Schema version:** `zeq.compliance.v1` — additive changes only;
> breaking changes bump the version.
