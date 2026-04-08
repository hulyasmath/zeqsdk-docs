---
sidebar_position: 26
title: Processing, Music, Speech, Acoustic, Codec
description: Processing, Music, Speech, Acoustic, Codec protocols and algorithms
---

# Processing, Music, Speech, Acoustic, Codec

Complete reference for all Processing, Music, Speech, Acoustic, Codec protocols in the Zeq SDK.

## Overview

The Processing, Music, Speech, Acoustic, Codec protocol family enables advanced computational capabilities.

## Protocols (5)

### ZeqAudioDSP

**Protocol ID:** `zeq-audio-dsp`
**Version:** 1.287.0
**Endpoint:** `/api/audio/dsp` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Audio DSP with HulyaPulse-synced sample clock. FFT, filtering (low/high/band/notch), compression, EQ — all phase-aligned to Zeqond boundaries for zero-drift processing.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| audioData | `object` | Yes | PCM audio buffer or reference. |

#### Returns

{ processedAudio, spectrum, peakLevel_dBFS, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/audio/dsp \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqMusicTheory

**Protocol ID:** `zeq-music-theory`
**Version:** 1.287.0
**Endpoint:** `/api/audio/music-theory` 🔵 POST
**Authentication:** Required
**Rate Limit:** 20/min

#### Description

Music theory analysis and generation. Harmonic analysis, chord progression, counterpoint rules, scale/mode detection — all frequencies mapped to HulyaPulse ratios.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| input | `object` | Yes | MIDI data, chord symbols, or audio features. |
| analysis | `string` | No |  |

#### Returns

{ analysis, chordProgression, key, tempo_bpm, hulyaPulseRatio, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/audio/music-theory \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqSpeech

**Protocol ID:** `zeq-speech`
**Version:** 1.287.0
**Endpoint:** `/api/audio/speech` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Speech processing with HulyaPulse phoneme alignment. Voice activity detection, speaker diarization, formant analysis with R(t) pitch tracking at 1.287 Hz resolution.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| audioData | `object` | Yes | Speech audio buffer or reference. |
| task | `string` | No |  |

#### Returns

{ segments, speakers, formants_Hz, pitch_Hz, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/audio/speech \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqAcousticSim

**Protocol ID:** `zeq-acoustic-sim`
**Version:** 1.287.0
**Endpoint:** `/api/audio/acoustic` 🔵 POST
**Authentication:** Required
**Rate Limit:** 10/min

#### Description

Room acoustics simulation. Ray tracing, RT60 calculation, speech intelligibility (STI), concert hall optimization with R(t) impulse response modeling.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| roomGeometry | `object` | Yes | Room mesh with material absorption coefficients. |

#### Returns

{ rt60_s, clarity_C80_dB, sti, impulseResponse, earlyDecay_s, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/audio/acoustic \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```


### ZeqCodec

**Protocol ID:** `zeq-codec`
**Version:** 1.287.0
**Endpoint:** `/api/audio/codec` 🔵 POST
**Authentication:** Required
**Rate Limit:** 15/min

#### Description

Audio codec with HulyaPulse quantization. Zeqond-aligned frame encoding, perceptual masking model, variable bitrate targeting MUSHRA ≥85 at minimal bandwidth.


#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| audioData | `object` | Yes | PCM audio to encode. |
| targetBitrate_kbps | `number` | No | Target bitrate. |
| mode | `string` | No |  |

#### Returns

{ encodedData, actualBitrate_kbps, mushra_score, latency_ms, zeqond }

#### Example

```bash
curl -X POST \
  https://api.zeq.io/api/audio/codec \
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
