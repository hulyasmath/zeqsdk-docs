---
id: llm
title: LLM Gateway
sidebar_label: LLM Gateway
description: Provider-agnostic LLM endpoint that signs every completion with a ZeqProof.
---

# LLM Gateway

A thin gateway in front of upstream LLM providers (OpenAI, Anthropic, local Ollama, etc.). Every completion request is wrapped in a CKO so the response carries an operator chain, zeqond tick, and ZeqProof — meaning *the model output itself* becomes a verifiable computation in the ZeqState log.

## GET /api/llm/providers

Public. Lists configured providers and which models they expose.

```json
{
  "providers": [
    { "id": "openai", "models": ["gpt-4o","gpt-4o-mini"] },
    { "id": "anthropic", "models": ["claude-opus-4-6","claude-sonnet-4-6"] }
  ]
}
```

## GET /api/llm/models

Flat list of all model IDs across providers, with context window and pricing where available.

## POST /api/llm/key

Stores a user-supplied upstream key, encrypted with the user's ZID-derived field key.

```json
{ "provider": "openai", "key": "sk-..." }
```

## POST /api/llm/chat

**Auth:** API key. **Rate limit:** llmLimiter.

```json
{
  "provider": "anthropic",
  "model": "claude-opus-4-6",
  "messages": [{ "role": "user", "content": "Hello" }]
}
```

**Response:**
```json
{
  "completion": "Hi!",
  "provider": "anthropic",
  "model": "claude-opus-4-6",
  "operatorChain": ["KO42","ON0"],
  "zeqond": 65392856,
  "phase": 0.4127,
  "zeqProof": { "alg": "HMAC-SHA256", "value": "..." },
  "usage": { "promptTokens": 5, "completionTokens": 3 }
}
```

Every chat completion publishes a free-tier row to ZeqState (`endpoint: /api/llm/chat`).

## Related

- [Compute](./compute) · [MCP](./mcp) · [ZeqState Explorer](https://zeq.dev/state/)
