---
id: mcp
title: MCP — Model Context Protocol bridge
sidebar_label: MCP
description: JSON-RPC 2.0 endpoint exposing Zeq tools to MCP-compatible clients.
---

# MCP Bridge

Zeq exposes its compute, lattice, shift, verify, mail, and text endpoints as **Model Context Protocol** tools so any MCP-aware client (Claude Desktop, Cursor, custom agents) can call them natively.

## POST /api/mcp

JSON-RPC 2.0. **Rate limit:** mcpRateLimiter.

### Discovery

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
```

Response includes a tool descriptor for each Zeq endpoint, e.g.:

```json
{
  "name": "zeq_compute",
  "description": "Run a Zeq operator chain through the 7-step wizard",
  "inputSchema": { "type": "object", "properties": { "operators": { "type": "array" } } }
}
```

### Tool call

```json
{
  "jsonrpc": "2.0", "id": 2,
  "method": "tools/call",
  "params": {
    "name": "zeq_compute",
    "arguments": { "operators": ["KO42","QM1"], "domain": "quantum" }
  }
}
```

Response wraps the standard CKO inside a JSON-RPC envelope.

## GET /api/mcp

Returns server metadata (name, version, protocol revision).

## Connecting from Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zeq": {
      "url": "https://zeq.dev/api/mcp",
      "headers": { "x-api-key": "YOUR_KEY" }
    }
  }
}
```

## Related

- [LLM Gateway](./llm) · [Compute](./compute)
