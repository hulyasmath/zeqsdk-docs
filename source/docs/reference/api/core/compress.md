---
id: compress
title: ZeqCompress — Operator-aware compression
sidebar_label: Compress
description: Compress and decompress payloads using HulyaPulse-aligned operator chains.
---

# ZeqCompress

ZeqCompress runs the input through an operator chain (KO42 mandatory) and stores only the residual + chain. The decompressor replays the chain to reconstruct the original — no raw payload ever needs to be transmitted across the wire.

## POST /api/compress

**Request:**
```json
{ "data": "base64-payload", "operators": ["KO42","QM1"], "intent": "log-batch" }
```

**Response:**
```json
{
  "compressed": "hex",
  "operatorChain": ["KO42","QM1"],
  "originalBytes": 8192,
  "compressedBytes": 1431,
  "ratio": 5.72,
  "zeqond": 65392856,
  "precisionBound": 0.000128
}
```

## POST /api/decompress

```json
{ "compressed": "hex", "operatorChain": ["KO42","QM1"] }
```
Response: `{ "data": "base64-payload", "verified": true, "zeqond": ... }`

## POST /api/analyze

Returns the recommended operator chain for a given payload without compressing.
```json
{ "data": "base64-payload" }
```
Response: `{ "recommended": ["KO42","XI1"], "estimatedRatio": 4.3 }`

## Related

- [Compute](./compute) · [Operators catalog](./operators)
