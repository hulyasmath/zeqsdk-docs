---
title: Zeq SDK
description: 236 protocols. 1,576 operators. One API. Phase-locked to 1.287 Hz.
slug: /
sidebar_class_name: hidden
---

# Zeq SDK

> **236 protocols. 1,576 operators. One API. Phase-locked to 1.287 Hz.**

<div id="zeq-kernel-copy-mount"></div>

Zeq is a generative-mathematics computation kernel: a single API surface that takes a problem statement, binds it to the KO42 metric tensioner, executes against the HULYAS Master Equation under the HulyaPulse 1.287 Hz timebase, and returns a verifiable [ZeqProof](/learn/concepts/zeqproof) receipt — to a 0.1 % error budget across general relativity, quantum mechanics, classical physics, biosignals, networking and 234 other protocol families.

This documentation is split into four tracks. Pick the one that matches what you're trying to do right now.

## [Learn](/learn/concepts/) — what Zeq is and why

The conceptual track. Start here if you've never seen Zeq before. Covers the 1.287 Hz HulyaPulse, the Zeqond temporal grid, R(t), KO42, the Master Equation, the 7-Step Wizard Protocol, and how ZeqProof receipts make every result third-party verifiable.

## [Build](/build/quickstart/introduction) — get a result in five minutes

The hands-on track. cURL quickstart, language clients (JavaScript, Python, Go, Rust), and domain recipes (medical imaging, game physics, robotics, weather, hardware, forensics). Each recipe ends with a link into the exact protocols it uses.

## [Reference](/reference/protocols) — every protocol, every operator, every endpoint

The exhaustive surface. **236 protocols** organised into 39 families, **1,576 operators** across QM/NM/GR/CS/Awareness, and the full API endpoint catalogue with OpenAPI spec. Use the search bar — this is too much to scroll.

## [Operate](/operate/rate-limits) — running Zeq in production

Rate limits, error handling, webhooks, and how third parties verify your ZeqProofs without an API key.

---

## 30-second test drive

```bash
curl -X POST https://www.zeq.dev/api/zeq/pulse \
  -H "Authorization: Bearer zeq_ak_demo_4ac31b46196a56e10631a4bda1b310b0a147a122" \
  -H "Content-Type: application/json" \
  -d '{"domain":"newton","operators":["NM19","KO42"],"params":{"m":1,"a":9.81}}'
```

You will get back a `ZeqState` object containing the result, the Zeqond tick at which it was sealed, the HulyaPulse phase, and a HMAC ZeqProof you can verify against `/api/zeq/prove/verify` without authentication.

That's the whole system in one call.
