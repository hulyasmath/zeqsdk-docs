#!/usr/bin/env node

/**
 * Protocol Page Generator
 *
 * Generates MDX documentation pages for all Zeq protocols by parsing
 * the protocols.ts TypeScript definition file.
 *
 * Usage: node generate-protocol-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
// Try the in-tree path first, then the zeqsdk subtree (live VPS source).
const _candidates = [
  path.resolve(__dirname, '../../api-server/src/lib/protocols.ts'),
  path.resolve(__dirname, '../../../zeqsdk/artifacts/api-server/src/lib/protocols.ts'),
];
const PROTOCOLS_TS_PATH = _candidates.find((p) => fs.existsSync(p)) || _candidates[0];

const OUTPUT_DIR = process.env.ZEQ_PROTO_OUT || path.resolve(__dirname, '../docs/reference/protocols');

// Denylist — protocols and entire categories that must NEVER appear in public docs.
// Zeq is a harmonic-frequency platform; weapons/warfare framings are out of scope.
// Match whole words / category fragments only — narrow scope to weapons/war framings.
// Defense category specifically — its full canonical name in protocols.ts.
const DENY_CATEGORY_REGEX = /Radar,\s*Ballistic,\s*EW/i;
const DENY_PROTOCOL_IDS = new Set([
  'zeq-ballistic',
  'zeq-ew',
  'zeq-mil-crypto',
  'zeq-mil-logistics',
  'zeq-ballistic-forensics',
]);

function isDeniedCategory(category) {
  return DENY_CATEGORY_REGEX.test(category || '');
}

// Optional rename map: scrubs disallowed words from category labels/slugs
// without losing the underlying protocols.
const CATEGORY_RENAME = {
  'Digital, DNA, Fingerprint, Ballistic, Document': 'Digital, DNA, Fingerprint, Document',
};
function displayCategory(category) {
  return CATEGORY_RENAME[category] || category;
}

/**
 * Parse TypeScript protocols.ts file and extract protocol definitions.
 * Handles the array-based format: export const PROTOCOLS: ProtocolDef[] = [...]
 */
function parseProtocols(fileContent) {
  const protocols = {};

  // Find the PROTOCOLS array
  const arrayStart = fileContent.indexOf('export const PROTOCOLS: ProtocolDef[] = [');
  if (arrayStart === -1) {
    console.warn('Could not find PROTOCOLS array definition');
    return protocols;
  }

  // Extract just the array content
  const arrayContent = fileContent.substring(arrayStart);
  const lines = arrayContent.split('\n');

  let currentCategory = null;
  let protocolBuffer = '';
  let braceDepth = 0;
  let inObject = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Detect category headers
    const categoryMatch = trimmedLine.match(/\/\/\s*\d+\.\s+([A-Z]+)\s*—/);
    if (categoryMatch) {
      // Extract category name from comment
      const fullComment = trimmedLine;
      const catNameMatch = fullComment.match(/—\s*(.+?)\s*\(/);
      if (catNameMatch) {
        currentCategory = catNameMatch[1].trim();
        if (!protocols[currentCategory]) {
          protocols[currentCategory] = [];
        }
      }
      continue;
    }

    // Start of protocol object
    if (trimmedLine === '{') {
      inObject = true;
      braceDepth = 1;
      protocolBuffer = '';
      continue;
    }

    if (inObject) {
      protocolBuffer += line + '\n';
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      // End of protocol object
      if (braceDepth === 0 && trimmedLine.startsWith('}')) {
        const protocol = parseProtocolObject(protocolBuffer, currentCategory);
        if (protocol && currentCategory && protocols[currentCategory]) {
          protocols[currentCategory].push(protocol);
        }
        inObject = false;
        protocolBuffer = '';
      }
    }
  }

  return protocols;
}

/**
 * Parse a single protocol object definition
 */
function parseProtocolObject(objectContent, category) {
  try {
    const protocol = {
      id: '',
      name: '',
      version: '1.0',
      category: category || 'Uncategorized',
      description: '',
      endpoint: '',
      method: 'POST',
      auth: 'api-key',
      rateLimit: '1000/min',
      parameters: [],
      returns: '',
    };

    // Extract fields using regex
    const idMatch = objectContent.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) protocol.id = idMatch[1];

    const nameMatch = objectContent.match(/name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) protocol.name = nameMatch[1];

    const versionMatch = objectContent.match(/version:\s*['"]([^'"]+)['"]/);
    if (versionMatch) protocol.version = versionMatch[1];

    const descMatch = objectContent.match(/description:\s*['"]([^'"]+)['"]/);
    if (descMatch) protocol.description = descMatch[1];

    const endpointMatch = objectContent.match(/endpoint:\s*['"]([^'"]+)['"]/);
    if (endpointMatch) protocol.endpoint = endpointMatch[1];

    const methodMatch = objectContent.match(/method:\s*['"]([^'"]+)['"]/);
    if (methodMatch) protocol.method = methodMatch[1];

    const authMatch = objectContent.match(/auth:\s*['"]([^'"]+)['"]/);
    if (authMatch) protocol.auth = authMatch[1];

    const rateLimitMatch = objectContent.match(/rateLimit:\s*['"]([^'"]+)['"]/);
    if (rateLimitMatch) protocol.rateLimit = rateLimitMatch[1];

    const returnsMatch = objectContent.match(/returns:\s*['"]([^'"]+)['"]/);
    if (returnsMatch) protocol.returns = returnsMatch[1];

    // Parse params array
    const paramsMatch = objectContent.match(/params:\s*\[([\s\S]*?)\]/);
    if (paramsMatch) {
      const paramsStr = paramsMatch[1];
      // Split by object patterns
      const paramObjects = paramsStr.match(/\{[^{}]*\}/g) || [];
      paramObjects.forEach(paramObj => {
        const param = {
          name: '',
          type: 'string',
          required: false,
          description: '',
        };
        const pNameMatch = paramObj.match(/name:\s*['"]([^'"]+)['"]/);
        if (pNameMatch) param.name = pNameMatch[1];
        const pTypeMatch = paramObj.match(/type:\s*['"]([^'"]+)['"]/);
        if (pTypeMatch) param.type = pTypeMatch[1];
        const pReqMatch = paramObj.match(/required:\s*(true|false)/);
        if (pReqMatch) param.required = pReqMatch[1] === 'true';
        const pDescMatch = paramObj.match(/description:\s*['"]([^'"]+)['"]/);
        if (pDescMatch) param.description = pDescMatch[1];
        if (param.name) protocol.parameters.push(param);
      });
    }

    return protocol.id ? protocol : null;
  } catch (error) {
    console.error('Error parsing protocol object:', error.message);
    return null;
  }
}

/**
 * Convert PROTOCOL_NAME_LIKE_THIS to Protocol Name Like This
 */
function humanizeName(protocolId) {
  return protocolId
    .replace(/^PROTOCOL_/, '')
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate MDX content for a single protocol category
 */
function generateCategoryPage(category, protocols) {
  // Determine sidebar position (index.md is 1, so categories start at 2)
  const sidebarPosition = 2 + Array.from(Object.keys(protocols)).sort().indexOf(category);

  const protocolCount = protocols[category].length;
  const overview = generateCategoryOverview(category);
  const protocolSections = protocols[category]
    .map(protocol => generateProtocolSection(protocol))
    .join('\n\n');
  const commonPatterns = generateCommonPatterns(category);

  const mdx = `---
sidebar_position: ${sidebarPosition}
title: ${category}
description: ${category} protocols and algorithms
---

# ${category}

Complete reference for all ${category} protocols in the Zeq SDK.

## Overview

${overview}

## Protocols (${protocolCount})

${protocolSections}

## Common Patterns

${commonPatterns}
`;

  return mdx;
}

/**
 * Generate a brief category overview based on the category name
 */
function generateCategoryOverview(category) {
  const overviews = {
    'Core Computation': 'Fundamental computation and phase management operations that form the foundation of all Zeq computations.',
    'Quantum Computing': 'Advanced quantum simulation protocols for quantum computing applications, state manipulation, and measurement.',
    'Linear Algebra': 'Matrix operations, decompositions, and linear system solving for mathematical computations.',
    'Numerical Methods': 'Integration, differentiation, and approximation methods for numerical analysis.',
    'Optimization': 'Optimization algorithms for minimization and constraint-based problem solving.',
    'Machine Learning': 'Neural networks, classification, clustering, and machine learning inference protocols.',
    'Signal Processing': 'Digital signal processing, filtering, and spectral analysis protocols.',
    'Statistical Analysis': 'Statistical methods, hypothesis testing, and probability analysis protocols.',
    'Cryptography & Security': 'Encryption, hashing, zero-knowledge proofs, and security protocols.',
    'Graph Algorithms': 'Graph theory algorithms for pathfinding, connectivity, and graph analysis.',
    'Geometry & Spatial': 'Computational geometry and spatial indexing algorithms.',
    'String Matching': 'Pattern matching and text analysis algorithms.',
    'Physics Simulation': 'Real-time physics simulation for games and scientific computing.',
    'Medical Imaging': 'Medical image processing and reconstruction from imaging devices.',
    'Medical Devices': 'Integration and communication with medical equipment.',
    'Emergency Response': 'Emergency services coordination and disaster response protocols.',
    'Gaming Physics': 'Real-time physics for game engines and interactive systems.',
    'Procedural Generation': 'Algorithmic generation of content and terrain.',
    'Networking & Netcode': 'Multiplayer networking and synchronization protocols.',
    'Game AI': 'Artificial intelligence for game opponents and autonomous agents.',
    'Spatial Audio': '3D audio processing and binaural rendering.',
    'Blockchain & Ledger': 'Distributed ledger operations and blockchain protocols.',
    'Data Compression': 'Lossless and lossy compression algorithms.',
  };

  return (
    overviews[category] ||
    `The ${category} protocol family enables advanced computational capabilities.`
  );
}

/**
 * Generate documentation section for a single protocol
 */
function generateProtocolSection(protocol) {
  const methodBadge = protocol.method === 'POST' ? '🔵 POST' : '🟢 GET';
  const tierLabel = protocol.tier === 'professional' ? ' (Professional)' : protocol.tier === 'medical' ? ' (Medical)' : '';

  let section = `### ${protocol.name}${tierLabel}

**Protocol ID:** \`${protocol.id}\`
**Version:** ${protocol.version}
**Endpoint:** \`${protocol.endpoint}\` ${methodBadge}
**Authentication:** ${protocol.auth ? 'Required' : 'Optional'}
**Rate Limit:** ${protocol.rateLimit}

#### Description

${protocol.description}

`;

  // Parameters table
  if (protocol.parameters.length > 0) {
    section += `
#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
`;
    protocol.parameters.forEach(param => {
      section += `| ${param.name} | \`${param.type}\` | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
    });
  }

  // Returns
  if (protocol.returns) {
    section += `
#### Returns

${protocol.returns}
`;
  }

  // Example curl
  section += `
#### Example

\`\`\`bash
curl -X ${protocol.method} \\
  https://api.zeq.io${protocol.endpoint} \\
  -H "Authorization: Bearer $ZEQ_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "domain": "example_domain"
  }'
\`\`\`
`;

  return section;
}

/**
 * Generate common patterns and best practices for a category
 */
function generateCommonPatterns(category) {
  const patterns = {
    'Machine Learning': `### Error Handling
Always check the response for convergence and training status. Incomplete models may need additional iterations.

### Performance
Larger models and datasets require more computation time. Use streaming endpoints for long-running operations.

### Validation
Evaluate models on hold-out test sets before deployment. Monitor accuracy metrics continuously.`,

    'Physics Simulation': `### Stability
Use smaller time steps for complex interactions. Monitor energy conservation for long-running simulations.

### Performance
Optimize collision detection with spatial partitioning. Reduce entity counts for real-time performance.

### Accuracy
Increase solver iterations for higher precision. Adjust damping and friction parameters for realistic behavior.`,

    'Game AI': `### Pathfinding
Cache computed paths when entities don't change. Update paths only when destination changes.

### Behavior Trees
Structure complex behaviors as composable trees. Use blackboards for state sharing between nodes.

### Performance
Profile behavior execution. Cull distant entities from update loops.`,

    'Medical Imaging': `### Privacy
Always ensure HIPAA compliance when processing medical data. Encrypt data in transit and at rest.

### Quality Assurance
Validate reconstructed images against reference standards. Monitor reconstruction artifacts.

### Integration
Coordinate with hospital IT for device integration. Use dedicated VLANs for medical device traffic.`,

    'Cryptography & Security': `### Key Management
Store API keys in environment variables or secure vaults. Never commit keys to version control.

### Zero-Knowledge Proofs
Verify proofs on both client and server. Use appropriate challenge sizes for security levels.

### Certificate Handling
Regularly rotate certificates. Monitor certificate expiration dates.`,
  };

  return (
    patterns[category] || `### Usage Tips
- Review the endpoint documentation before first use
- Start with simple inputs for testing
- Monitor API quota usage
- Cache results when appropriate for your use case`
  );
}

/**
 * Render the full call-it-from-anywhere example block.
 * Emits 13 language examples — every Zeq endpoint is just an HTTP call,
 * so the SDK is callable from any language with an HTTP client.
 */
function renderAllLanguages(endpoint, method, exampleJson) {
  const url = `https://www.zeq.dev${endpoint}`;
  const pyJson = exampleJson
    .replace(/true/g, 'True')
    .replace(/false/g, 'False')
    .replace(/null/g, 'None');
  const isGet = method === 'GET';
  const bodyEscC = exampleJson.replace(/"/g, '\\"');

  return `## How to call it — every language

Every Zeq endpoint is a plain HTTPS \`${method}\`. That means you can call it from **any** language that speaks HTTP. Below: thirteen working snippets — pick whichever fits your stack.

### Command line (curl)

\`\`\`bash
curl -X ${method} \\
  ${url} \\
  -H "Authorization: Bearer $ZEQ_API_KEY" \\
  -H "Content-Type: application/json"${isGet ? '' : ` \\\n  -d '${exampleJson}'`}
\`\`\`

### JavaScript (browser / Node)

\`\`\`javascript
const res = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": \`Bearer \${process.env.ZEQ_API_KEY}\`,
    "Content-Type": "application/json",
  },${isGet ? '' : `\n  body: JSON.stringify(${exampleJson}),`}
});
const data = await res.json();
console.log(data);
\`\`\`

### TypeScript

\`\`\`typescript
interface ZeqResponse<T = unknown> {
  ok: boolean;
  result: T;
  zeqondTick: number;
  hulyaPhase: number;
  zeqProof: string;
}

const res = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": \`Bearer \${process.env.ZEQ_API_KEY}\`,
    "Content-Type": "application/json",
  },${isGet ? '' : `\n  body: JSON.stringify(${exampleJson}),`}
});
const data: ZeqResponse = await res.json();
console.log(data.result);
\`\`\`

### Python

\`\`\`python
import os, requests

res = requests.${method.toLowerCase()}(
    "${url}",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},${isGet ? '' : `\n    json=${pyJson},`}
)
print(res.json())
\`\`\`

### Go

\`\`\`go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    ${isGet ? 'req, _ := http.NewRequest("' + method + '", "' + url + '", nil)' : `payload, _ := json.Marshal(map[string]interface{}{})
    req, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer(payload))`}
    req.Header.Set("Authorization", "Bearer "+os.Getenv("ZEQ_API_KEY"))
    req.Header.Set("Content-Type", "application/json")
    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}
\`\`\`

### Java

\`\`\`java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ZeqCall {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("${url}"))
        .header("Authorization", "Bearer " + System.getenv("ZEQ_API_KEY"))
        .header("Content-Type", "application/json")
        .${isGet ? 'GET()' : `${method}(HttpRequest.BodyPublishers.ofString("${bodyEscC}"))`}
        .build();
    HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println(res.body());
  }
}
\`\`\`

### C

\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <curl/curl.h>

int main(void) {
    CURL *curl = curl_easy_init();
    if (!curl) return 1;
    struct curl_slist *headers = NULL;
    char auth[256];
    snprintf(auth, sizeof(auth), "Authorization: Bearer %s", getenv("ZEQ_API_KEY"));
    headers = curl_slist_append(headers, auth);
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_URL, "${url}");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${method}");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);${isGet ? '' : `\n    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "${bodyEscC}");`}
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    return 0;
}
\`\`\`

### C++

\`\`\`cpp
#include <iostream>
#include <cstdlib>
#include <curl/curl.h>

int main() {
    CURL* curl = curl_easy_init();
    if (!curl) return 1;
    struct curl_slist* headers = nullptr;
    std::string auth = "Authorization: Bearer ";
    auth += std::getenv("ZEQ_API_KEY");
    headers = curl_slist_append(headers, auth.c_str());
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_URL, "${url}");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${method}");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);${isGet ? '' : `\n    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"json(${exampleJson})json");`}
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}
\`\`\`

### PHP

\`\`\`php
<?php
$ch = curl_init("${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . getenv("ZEQ_API_KEY"),
    "Content-Type: application/json",
]);${isGet ? '' : `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${exampleJson}');`}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
\`\`\`

### Swift

\`\`\`swift
import Foundation

var req = URLRequest(url: URL(string: "${url}")!)
req.httpMethod = "${method}"
req.setValue("Bearer \\(ProcessInfo.processInfo.environment["ZEQ_API_KEY"] ?? "")", forHTTPHeaderField: "Authorization")
req.setValue("application/json", forHTTPHeaderField: "Content-Type")${isGet ? '' : `\nreq.httpBody = "${bodyEscC}".data(using: .utf8)`}

URLSession.shared.dataTask(with: req) { data, _, _ in
    if let data = data { print(String(data: data, encoding: .utf8) ?? "") }
}.resume()
\`\`\`

### Lua

\`\`\`lua
local http = require("socket.http")
local ltn12 = require("ltn12")
local response = {}

http.request{
    url = "${url}",
    method = "${method}",
    headers = {
        ["Authorization"] = "Bearer " .. os.getenv("ZEQ_API_KEY"),
        ["Content-Type"] = "application/json",${isGet ? '' : `\n        ["Content-Length"] = tostring(#'${exampleJson}'),`}
    },${isGet ? '' : `\n    source = ltn12.source.string('${exampleJson}'),`}
    sink = ltn12.sink.table(response),
}
print(table.concat(response))
\`\`\`

### HTML (drop into any page)

\`\`\`html
<script>
fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer YOUR_ZEQ_API_KEY",
    "Content-Type": "application/json",
  },${isGet ? '' : `\n  body: JSON.stringify(${exampleJson}),`}
})
  .then(r => r.json())
  .then(data => console.log(data));
</script>
\`\`\`

### Markdown / REST Client (.http)

\`\`\`http
${method} ${url}
Authorization: Bearer {{ZEQ_API_KEY}}
Content-Type: application/json
${isGet ? '' : `\n${exampleJson}`}
\`\`\`

`;
}

/**
 * Generate a single-protocol detail page
 */
function generateProtocolDetailPage(protocol, category, sidebarPosition) {
  const methodBadge = protocol.method === 'POST' ? '🔵 POST' : '🟢 GET';
  const tierLabel = protocol.tier === 'professional' ? ' (Professional)' : protocol.tier === 'medical' ? ' (Medical)' : '';
  const yq = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  const safeDesc = (protocol.description || 'Zeq protocol page').slice(0, 180);

  let body = `---
sidebar_position: ${sidebarPosition}
title: ${yq(protocol.name + tierLabel)}
description: ${yq(safeDesc)}
---

# ${protocol.name}${tierLabel}

> ${protocol.description || 'Zeq protocol — phase-locked computation under HulyaPulse 1.287 Hz.'}

| | |
|---|---|
| **Protocol ID** | \`${protocol.id}\` |
| **Category** | ${category} |
| **Version** | ${protocol.version} |
| **Endpoint** | \`${protocol.endpoint}\` ${methodBadge} |
| **Authentication** | ${protocol.auth ? 'Required (Bearer API key)' : 'Optional'} |
| **Rate Limit** | ${protocol.rateLimit} |

## Purpose

${protocol.description || 'A phase-locked Zeq protocol.'} It belongs to the **${category}** family and is callable as a single REST endpoint, a one-line SDK call, or via streaming where applicable.

## What it does

When you call \`${protocol.endpoint}\`, Zeq runs the **${protocol.name}** computation through the KO42 metric tensioner under the active HulyaPulse phase. The result is sealed at the next Zeqond boundary (0.777 s) and returned with a verifiable ZeqProof receipt — meaning the same inputs at the same phase always produce the same output, and any third party can later verify the result was computed at the time you claim.

In practice, this protocol takes the parameters listed below, performs its ${category.toLowerCase()} operation, and returns a structured response containing the computation output plus phase-locking metadata (\`zeqondTick\`, \`hulyaPhase\`, \`zeqProof\`).

## When to use it

Reach for **${protocol.name}** when you need a ${category.toLowerCase()} primitive that:

- **Must be reproducible** — every call is deterministic for a given phase
- **Must be auditable** — every response carries a tamper-evident ZeqProof receipt
- **Must compose with other Zeq protocols** — outputs are phase-aligned to 1.287 Hz so they slot directly into downstream calls without resync
- **Must scale across domains** — the same endpoint works whether you're driving one call per minute or part of a high-throughput pipeline (subject to rate limit ${protocol.rateLimit})

If you only need a one-shot ${category.toLowerCase()} answer with no audit trail and no composition with other Zeq calls, a plain library may be cheaper. If you need *any* of the four properties above, this protocol is the right tool.

## How to call it

The fastest path is a single HTTPS \`${protocol.method}\` request to \`${protocol.endpoint}\` with a Bearer token. You can use cURL, JavaScript, Python, or any HTTP client — examples for all three are below. The response is JSON.

`;

  if (protocol.parameters.length > 0) {
    body += `## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
`;
    protocol.parameters.forEach(p => {
      body += `| \`${p.name}\` | \`${p.type}\` | ${p.required ? 'Yes' : 'No'} | ${p.description || ''} |\n`;
    });
    body += `\n`;
  } else {
    body += `## Parameters

No required parameters. Send an empty JSON body \`{}\` or include domain-specific fields.

`;
  }

  if (protocol.returns) {
    body += `## Returns

\`\`\`
${protocol.returns}
\`\`\`

`;
  }

  // Build a realistic example body
  const exampleBody = {};
  protocol.parameters.slice(0, 5).forEach(p => {
    if (p.type.includes('number')) exampleBody[p.name] = 1;
    else if (p.type.includes('array')) exampleBody[p.name] = [];
    else if (p.type.includes('bool')) exampleBody[p.name] = true;
    else exampleBody[p.name] = `<${p.name}>`;
  });
  const exampleJson = JSON.stringify(exampleBody, null, 2) || '{}';

  body += renderAllLanguages(protocol.endpoint, protocol.method, exampleJson);

  body += `## Phase-Locking & ZeqProof

Every response from \`${protocol.endpoint}\` carries:

- \`zeqondTick\` — the Zeqond (0.777 s) at which the result was sealed
- \`hulyaPhase\` — the HulyaPulse phase ∈ [0, 1) at sealing
- \`zeqProof\` — HMAC receipt that lets any third party verify the result without an API key via \`POST /api/zeq/prove/verify\`

See [Concepts → ZeqProof](/learn/concepts/zeqproof) and [HulyaPulse](/learn/concepts/hulyapulse) for the underlying mathematics.

## Related

- All protocols in this family — see the [${category}](/reference/protocols) category
- [API Reference → Endpoints](/reference/api/endpoints)
- [Concepts → ZeqProof](/learn/concepts/zeqproof)
`;

  return body;
}

/**
 * Write generated MDX files to disk — nested per-protocol layout.
 *
 * Each category becomes a directory:
 *   protocols/<category-slug>/_category_.json   — sidebar entry + generated index
 *   protocols/<category-slug>/index.md          — overview + protocol list
 *   protocols/<category-slug>/<protocol-id>.md  — one page per protocol
 */
function writeProtocolPages(protocols) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Wipe previous flat .md files (except top-level index.md)
  for (const entry of fs.readdirSync(OUTPUT_DIR)) {
    const full = path.join(OUTPUT_DIR, entry);
    const stat = fs.statSync(full);
    if (stat.isFile() && entry !== 'index.md' && entry.endsWith('.md')) {
      fs.unlinkSync(full);
    }
    // Wipe previous nested category directories so we regenerate cleanly,
    // but PRESERVE hand-authored directories like `zeqfield/`.
    const PRESERVE = new Set(['zeqfield']);
    if (stat.isDirectory() && !PRESERVE.has(entry)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }

  const categories = Object.keys(protocols).sort();
  let filesWritten = 0;
  let protoFilesWritten = 0;

  categories.forEach((category, catIdx) => {
    if (isDeniedCategory(category)) {
      console.log(`SKIP category (denylist): ${category}`);
      return;
    }
    const displayName = displayCategory(category);
    const catSlug = slugify(displayName);
    const catDir = path.join(OUTPUT_DIR, catSlug);
    fs.mkdirSync(catDir, { recursive: true });

    // _category_.json — sidebar label + collapsed + position
    const categoryJson = {
      label: displayName,
      position: catIdx + 2,
      collapsible: true,
      collapsed: true,
      link: { type: 'generated-index', title: displayName, description: `${protocols[category].length} Zeq protocols in the ${displayName} family.`, slug: `/protocols/${catSlug}` },
    };
    fs.writeFileSync(
      path.join(catDir, '_category_.json'),
      JSON.stringify(categoryJson, null, 2),
      'utf8',
    );

    // No index.md — _category_.json link.type=generated-index handles the landing page

    // Per-protocol detail pages
    protocols[category].forEach((protocol, pIdx) => {
      if (DENY_PROTOCOL_IDS.has(protocol.id)) {
        console.log(`  SKIP protocol (denylist): ${protocol.id}`);
        return;
      }
      const protoSlug = slugify(protocol.id || protocol.name);
      const detail = generateProtocolDetailPage(protocol, displayName, pIdx + 1);
      fs.writeFileSync(path.join(catDir, `${protoSlug}.md`), detail, 'utf8');
      protoFilesWritten++;
    });

    console.log(`Generated ${catSlug}/ (${protocols[category].length} protocols)`);
  });

  console.log(`\n${filesWritten} category indexes + ${protoFilesWritten} protocol detail pages`);
  return filesWritten + protoFilesWritten;
}

/**
 * Generate the per-category index.md (overview + linked list of protocols)
 */
function generateCategoryIndexPage(category, list) {
  const overview = generateCategoryOverview(category);
  const rows = list
    .map(p => {
      const slug = slugify(p.id || p.name);
      const desc = (p.description || '').replace(/\|/g, '\\|').slice(0, 140);
      return `| [${p.name}](./${slug}) | \`${p.endpoint}\` | ${desc} |`;
    })
    .join('\n');

  const yq = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  return `---
title: ${yq(category)}
description: ${yq(category + ' — ' + list.length + ' Zeq protocols')}
---

# ${category}

${overview}

**${list.length} protocols** in this family. Every protocol below is phase-locked to HulyaPulse 1.287 Hz and returns a verifiable ZeqProof receipt.

| Protocol | Endpoint | Description |
|----------|----------|-------------|
${rows}

---

${generateCommonPatterns(category)}
`;
}

/**
 * Convert "Category Name" to "category-name"
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Zeq Protocol Page Generator');
    console.log('===================================\n');

    // Check if protocols.ts exists
    if (!fs.existsSync(PROTOCOLS_TS_PATH)) {
      console.warn(`Warning: protocols.ts not found at ${PROTOCOLS_TS_PATH}`);
      console.log('Creating sample protocols for demonstration...\n');

      // Generate sample data for demonstration
      var protocols = generateSampleProtocols();
    } else {
      console.log(`Reading ${PROTOCOLS_TS_PATH}`);
      const fileContent = fs.readFileSync(PROTOCOLS_TS_PATH, 'utf8');
      console.log('File read successfully\n');

      console.log('Parsing protocol definitions...');
      var protocols = parseProtocols(fileContent);
    }

    const categoryCount = Object.keys(protocols).length;
    const protocolCount = Object.values(protocols).reduce((sum, cats) => sum + cats.length, 0);

    console.log(`Found ${categoryCount} categories with ${protocolCount} total protocols\n`);

    console.log('Generating MDX files...');
    const filesWritten = writeProtocolPages(protocols);

    console.log(`\nComplete!`);
    console.log(`Generated ${filesWritten} protocol category pages`);
    console.log(`Total protocols documented: ${protocolCount}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * Generate sample protocol data for testing
 */
function generateSampleProtocols() {
  return {
    'Core Computation': [
      {
        id: 'PROTOCOL_PULSE',
        name: 'Pulse Computation',
        category: 'Core Computation',
        description: 'Execute a computation pulse in the HulyaPulse field',
        endpoint: '/api/zeq/pulse',
        method: 'POST',
        auth: true,
        rateLimit: '1000/min',
        tier: 'free',
        version: '1.0',
        parameters: [
          { name: 'domain', type: 'string', required: true, description: 'Computation domain' },
          { name: 'operators', type: 'string[]', required: false, description: 'Operator IDs to use' },
        ],
        returns: 'ZeqState object with computation results',
      },
      {
        id: 'PROTOCOL_VERIFY',
        name: 'Verify Computation',
        category: 'Core Computation',
        description: 'Verify a computation result against a known solution',
        endpoint: '/api/zeq/verify',
        method: 'POST',
        auth: true,
        rateLimit: '500/min',
        tier: 'standard',
        version: '1.0',
        parameters: [
          { name: 'result', type: 'number', required: true, description: 'Result to verify' },
          { name: 'expected', type: 'number', required: true, description: 'Expected value' },
          { name: 'tolerance', type: 'number', required: false, description: 'Acceptable error margin' },
        ],
        returns: 'Verification status and confidence metrics',
      },
    ],
    'Quantum Computing': [
      {
        id: 'PROTOCOL_QUANTUM_STATE',
        name: 'Quantum State Simulation',
        category: 'Quantum Computing',
        description: 'Simulate quantum state evolution',
        endpoint: '/api/quantum/state',
        method: 'POST',
        auth: true,
        rateLimit: '100/min',
        tier: 'professional',
        version: '1.0',
        parameters: [
          { name: 'qubits', type: 'number', required: true, description: 'Number of qubits' },
          { name: 'gates', type: 'object[]', required: true, description: 'Quantum gates to apply' },
        ],
        returns: 'Final quantum state vector or measurement results',
      },
    ],
    'Machine Learning': [
      {
        id: 'PROTOCOL_NEURAL_NETWORK',
        name: 'Neural Network Inference',
        category: 'Machine Learning',
        description: 'Run inference with neural networks',
        endpoint: '/api/ml/infer',
        method: 'POST',
        auth: true,
        rateLimit: '1000/min',
        tier: 'professional',
        version: '1.0',
        parameters: [
          { name: 'model_id', type: 'string', required: true, description: 'Model identifier' },
          { name: 'input', type: 'array', required: true, description: 'Input tensor' },
          { name: 'batch_size', type: 'number', required: false, description: 'Batch size' },
        ],
        returns: 'Prediction results and confidence scores',
      },
    ],
  };
}

main();
