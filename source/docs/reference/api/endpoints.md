---
title: "REST API Endpoints"
sidebar_position: 1
description: "Complete reference for every REST endpoint exposed by the Zeq API server."
---

# REST API Endpoints

Every Zeq capability is reachable as a single HTTPS request. All endpoints are mounted under the **`/api`** prefix on `https://www.zeq.dev`. Authentication is a Bearer API key (`Authorization: Bearer $ZEQ_API_KEY`) unless marked **public**.

> **Base URL:** `https://www.zeq.dev/api`
> **Auth:** `Authorization: Bearer $ZEQ_API_KEY` (except where noted)
> **Content-Type:** `application/json`
> **Phase-locking:** every response includes `zeqondTick`, `hulyaPhase`, and (where applicable) a `zeqProof` HMAC receipt.

---

## Core Zeq Computation

The heart of the platform — phase-locked compute, ZeqProof verification, and the temporal bridge.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/zeq/pulse` | Current HulyaPulse snapshot (phase, Zeqond, frequency) |
| `GET` | `/api/zeq/pulse/stream` | Server-Sent Events stream of pulses, one per Zeqond |
| `POST` | `/api/zeq/compute` | Execute a phase-locked computation through the operator stack |
| `POST` | `/api/zeq/verify` | Verify a result against an expected value with phase tolerance |
| `POST` | `/api/zeq/lattice` | ZeqLattice multi-scale field operations |
| `POST` | `/api/zeq/shift` | ZeqShift Unix ↔ Zeqond conversion |
| `GET` | `/api/zeq/usage` | Per-key usage and quota |

## Protocol Discovery

Browse the full registry of 234+ protocols. Returns the same data documented in [Reference → Protocols](/reference/protocols).

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/protocols` | List all protocols (id, name, category, endpoint, method, auth, description) |
| `GET` | `/api/protocols/:id` | Single protocol detail with full param + return schema |
| `GET` | `/api/protocols/category/:category` | All protocols in a given category |

## Operators & Framework

The 1,576-operator registry, constants, equations, and the wizard solver.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/operators` | Full operator list (KO42, QM, NM, GR, CS, Awareness, …) |
| `GET` | `/api/operators/categories` | Operator family categories |
| `GET` | `/api/operator/:id` | Single operator with formula, family, scale |
| `GET` | `/api/registry` | Canonical operator + constant registry |
| `GET` | `/api/registry/categories` | Registry categories |
| `GET` | `/api/constants` | All physical and Zeq constants |
| `GET` | `/api/constants/:key` | Single constant value |
| `GET` | `/api/params` | Tunable framework parameters |
| `GET` | `/api/equations` | Master equations (HULYAS, KO42, R(t), Functional, Spectral) |
| `GET` | `/api/protocol` | Active protocol manifest |
| `GET` | `/api/experiments` | Pre-built example computations |
| `POST` | `/api/solve` | Run a computation through the 7-Step Wizard |
| `POST` | `/api/solve/strict` | Strict-mode solve (≤0.1% error gate enforced) |

## Kernel & Genesis

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/kernel` | Kernel manifest (version, operators loaded, mode) |
| `GET` | `/api/kernel/prompt` | The Zeq OS LLM kernel prompt |
| `GET` | `/api/kernel/demo` | Quick kernel demo response |
| `GET` | `/api/kernel/live` | Live kernel state |
| `GET` | `/api/genesis/status` | Zeq Genesis bootstrapping status |

## ZeqAuth — Equation-Based Identity

Zero-knowledge identity bound to phase. Used for the dual-auth flow on zeq.dev.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/zeq-auth/register` | Create a ZeqAuth identity |
| `POST` | `/api/zeq-auth/login` | Phase-locked login |
| `POST` | `/api/zeq-auth/verify` | Verify a ZeqAuth challenge |
| `GET` | `/api/zeq-auth/profile` | Current ZeqAuth profile |
| `POST` | `/api/zeq-auth/api-keys` | Mint a new API key under ZeqAuth |
| `GET` | `/api/zeq-auth/api-keys` | List ZeqAuth-issued keys |
| `GET` | `/api/zeq-auth/health` | ZeqAuth subsystem health |
| `POST` | `/api/auth/login` | Legacy email/password login |

## API Keys & Customer Portal

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/keys/me` | Current key metadata |
| `POST` | `/api/keys/rotate` | Rotate active key |
| `GET` | `/api/portal/me` | Portal account |
| `GET` | `/api/portal/key` | Active key |
| `GET` | `/api/portal/keys` | All keys for the account |
| `POST` | `/api/portal/keys` | Issue a new key |
| `DELETE` | `/api/portal/keys/:id` | Revoke a key |
| `POST` | `/api/portal/keys/:id/reveal` | One-time key reveal |
| `GET` | `/api/portal/certificate` | Account certificate |
| `POST` | `/api/portal/regenerate-key` | Regenerate primary key |
| `GET` | `/api/portal/usage` | Per-account usage rollup |

## Trial & Billing

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/trial/start` | Start a free trial |
| `GET` | `/api/trial/me` | Trial status |
| `POST` | `/api/stripe/create-checkout` | Create a Stripe Checkout session |
| `GET` | `/api/stripe/success` | Checkout success callback |
| `POST` | `/api/stripe/portal` | Stripe billing portal session |
| `GET` | `/api/stripe/prices` | Active price catalog |

## Zeq Store (Apps)

The 40+ Zeq apps converted from server-side to API-driven, browsable through the Store.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/store/apps` | List all Store apps |
| `GET` | `/api/store/categories` | App categories |
| `GET` | `/api/store/app/:slug` | App detail by slug |
| `POST` | `/api/store/launch` | Launch an app (returns API entrypoint + recipe) |

## HITE / TESC — Encrypted Channels

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/hite/encrypt` | HITE phase-keyed encryption |
| `POST` | `/api/hite/decrypt` | HITE decryption |
| `POST` | `/api/tesc/send` | Send a TESC encrypted message |

## ZeqMail

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/register` | ZeqMail registration |
| `POST` | `/api/login` | ZeqMail login |
| `GET` | `/api/inbox` | Inbox |
| `GET` | `/api/sent` | Sent folder |
| `GET` | `/api/starred` | Starred messages |
| `GET` | `/api/trash` | Trash folder |
| `GET` | `/api/contacts` | ZeqMail contacts |
| `GET` | `/api/pubkey/:zid` | Public key for a Zeq Identity |
| `GET` | `/api/status` | ZeqMail status |
| `POST` | `/api/star` | Star a message |
| `POST` | `/api/pubkey` | Publish public key |

## ZeqMesh, ZeqNode, ZeqDaemon

The internet-replacement layer.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/mesh/status` | ZeqMesh peer-to-peer status |
| `GET` | `/api/dns/status` | Phase-locked DNS layer |
| `GET` | `/api/node/status` | Node health |
| `GET` | `/api/peers` | Peer list |
| `GET` | `/api/health` | Aggregate health |
| `GET` | `/api/daemon/health` | Daemon liveness |
| `GET` | `/api/daemon/status` | Daemon state machine |
| `GET` | `/api/daemon/pulse` | Daemon-level HulyaPulse |
| `GET` | `/api/daemon/tesc` | TESC daemon channel |
| `GET` | `/api/daemon/landauer` | Landauer (LZ1) erasure cost |

## LLM Gateway

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/providers` | Supported LLM providers |
| `GET` | `/api/models` | Available models |
| `POST` | `/api/key` | Mint a gateway-scoped key |
| `POST` | `/api/chat` | Phase-locked chat completion |

## MCP

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/mcp` | MCP discovery |
| `POST` | `/api/mcp` | MCP JSON-RPC endpoint |

## Marketing & Public

These endpoints are **public** (no API key required).

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/waitlist` | Join waitlist |
| `POST` | `/api/contact` | Contact form |
| `GET` | `/api/stats` | Public usage stats |
| `GET` | `/api/stats/tiers` | Tier distribution |
| `GET` | `/api/demo-key` | Issue a temporary demo key |
| `GET` | `/api/healthz` | Liveness probe |
| `GET` | `/api/health` | Readiness probe |
| `GET` | `/api/download/source` | SDK source archive |
| `GET` | `/api/download/source.zip` | SDK source as zip |

## Playground

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/playground/compute` | Sandbox compute (rate-limited) |

## Admin

Admin endpoints require an admin session cookie issued by `/api/admin/login`. Not for normal API consumers.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/admin/login` | Admin login |
| `POST` | `/api/admin/logout` | Admin logout |
| `GET` | `/api/admin/check` | Session check |
| `GET` | `/api/admin/notifications` | Admin notifications |
| `POST` | `/api/admin/notifications/read` | Mark notifications read |
| `GET` | `/api/admin/overview` | System overview |
| `GET` | `/api/admin/analytics` | Analytics rollup |
| `GET` | `/api/admin/users` | User list |
| `GET` | `/api/admin/users/:id/calls` | Per-user call log |
| `PATCH` | `/api/admin/users/:id` | Update user |
| `GET` | `/api/admin/waitlist` | Waitlist entries |
| `GET` | `/api/admin/contacts` | Contact submissions |
| `GET` | `/api/admin/keys/overview` | Key metrics |
| `GET` | `/api/admin/zeqfield/status` | ZeqField subsystem status |

---

## Calling an endpoint — every language

Every Zeq endpoint is plain HTTPS. The SDK is your HTTP client. Below: thirteen working snippets calling `POST /api/zeq/compute` — pick whichever fits your stack. The same pattern applies to every endpoint above.

### Command line (curl)

```bash
curl -X POST https://www.zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"domain":"three_body","operators":["KO42","NM21","GR33"]}'
```

### JavaScript (browser / Node)

```javascript
const res = await fetch("https://www.zeq.dev/api/zeq/compute", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    domain: "three_body",
    operators: ["KO42", "NM21", "GR33"],
  }),
});
const data = await res.json();
console.log(data);
```

### TypeScript

```typescript
interface ZeqResponse<T = unknown> {
  ok: boolean;
  result: T;
  zeqondTick: number;
  hulyaPhase: number;
  zeqProof: string;
}

const res = await fetch("https://www.zeq.dev/api/zeq/compute", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ domain: "three_body" }),
});
const data: ZeqResponse = await res.json();
```

### Python

```python
import os, requests

res = requests.post(
    "https://www.zeq.dev/api/zeq/compute",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={"domain": "three_body", "operators": ["KO42", "NM21", "GR33"]},
)
print(res.json())
```

### Go

```go
package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    payload := []byte(`{"domain":"three_body"}`)
    req, _ := http.NewRequest("POST", "https://www.zeq.dev/api/zeq/compute", bytes.NewBuffer(payload))
    req.Header.Set("Authorization", "Bearer "+os.Getenv("ZEQ_API_KEY"))
    req.Header.Set("Content-Type", "application/json")
    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}
```

### Java

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ZeqCall {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("https://www.zeq.dev/api/zeq/compute"))
        .header("Authorization", "Bearer " + System.getenv("ZEQ_API_KEY"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"domain\":\"three_body\"}"))
        .build();
    HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println(res.body());
  }
}
```

### C

```c
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/zeq/compute");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{\"domain\":\"three_body\"}");
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    return 0;
}
```

### C++

```cpp
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/zeq/compute");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"json({"domain":"three_body"})json");
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}
```

### PHP

```php
<?php
$ch = curl_init("https://www.zeq.dev/api/zeq/compute");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . getenv("ZEQ_API_KEY"),
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{"domain":"three_body"}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
curl_close($ch);
```

### Swift

```swift
import Foundation

var req = URLRequest(url: URL(string: "https://www.zeq.dev/api/zeq/compute")!)
req.httpMethod = "POST"
req.setValue("Bearer \(ProcessInfo.processInfo.environment["ZEQ_API_KEY"] ?? "")",
             forHTTPHeaderField: "Authorization")
req.setValue("application/json", forHTTPHeaderField: "Content-Type")
req.httpBody = "{\"domain\":\"three_body\"}".data(using: .utf8)

URLSession.shared.dataTask(with: req) { data, _, _ in
    if let data = data { print(String(data: data, encoding: .utf8) ?? "") }
}.resume()
```

### Lua

```lua
local http = require("socket.http")
local ltn12 = require("ltn12")
local body = '{"domain":"three_body"}'
local response = {}

http.request{
    url = "https://www.zeq.dev/api/zeq/compute",
    method = "POST",
    headers = {
        ["Authorization"] = "Bearer " .. os.getenv("ZEQ_API_KEY"),
        ["Content-Type"] = "application/json",
        ["Content-Length"] = tostring(#body),
    },
    source = ltn12.source.string(body),
    sink = ltn12.sink.table(response),
}
print(table.concat(response))
```

### HTML (drop into any page)

```html
<script>
fetch("https://www.zeq.dev/api/zeq/compute", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ZEQ_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ domain: "three_body" }),
})
  .then(r => r.json())
  .then(console.log);
</script>
```

### Markdown / REST Client (.http)

```http
POST https://www.zeq.dev/api/zeq/compute
Authorization: Bearer {{ZEQ_API_KEY}}
Content-Type: application/json

{"domain":"three_body"}
```

## Response envelope

Every successful response carries phase-locking metadata:

```json
{
  "ok": true,
  "result": { "...": "endpoint-specific payload" },
  "zeqondTick": 2285318404,
  "hulyaPhase": 0.412,
  "zeqProof": "eyJhbGciOiJIUzI1NiIs..."
}
```

The `zeqProof` field is an HMAC-SHA256 receipt that any third party can verify against `POST /api/zeq/verify` without an API key.

## Errors

Errors are JSON with HTTP status codes:

```json
{
  "ok": false,
  "error": "rate_limited",
  "message": "Quota exceeded for tier free",
  "retryAfter": 42
}
```

See [Operate → Error Handling](/operate/error-handling) for the full error code list.

## Related

- [Protocols Reference](/reference/protocols) — narrative docs for each callable protocol
- [Concepts → ZeqProof](/learn/concepts/zeqproof) — the receipt format
- [Concepts → HulyaPulse](/learn/concepts/hulyapulse) — phase-locking explained
- [Operate → Rate Limits](/operate/rate-limits)
