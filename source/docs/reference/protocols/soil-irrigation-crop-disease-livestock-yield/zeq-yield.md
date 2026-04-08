---
sidebar_position: 5
title: "ZeqYield"
description: "Crop yield prediction via R(t)-modulated growth models. Integrates soil, weather, satellite imagery, and historical data for field-level harvest estimates."
---

# ZeqYield

> Crop yield prediction via R(t)-modulated growth models. Integrates soil, weather, satellite imagery, and historical data for field-level harvest estimates.

| | |
|---|---|
| **Protocol ID** | `zeq-yield` |
| **Category** | Soil, Irrigation, Crop Disease, Livestock, Yield |
| **Version** | 1.287.0 |
| **Endpoint** | `/api/agri/yield` 🔵 POST |
| **Authentication** | Required (Bearer API key) |
| **Rate Limit** | 10/min |

## Purpose

Crop yield prediction via R(t)-modulated growth models. Integrates soil, weather, satellite imagery, and historical data for field-level harvest estimates. It belongs to the **Soil, Irrigation, Crop Disease, Livestock, Yield** family and is callable as a single REST endpoint, a one-line SDK call, or via streaming where applicable.

## What it does

When you call `/api/agri/yield`, Zeq runs the **ZeqYield** computation through the KO42 metric tensioner under the active HulyaPulse phase. The result is sealed at the next Zeqond boundary (0.777 s) and returned with a verifiable ZeqProof receipt — meaning the same inputs at the same phase always produce the same output, and any third party can later verify the result was computed at the time you claim.

In practice, this protocol takes the parameters listed below, performs its soil, irrigation, crop disease, livestock, yield operation, and returns a structured response containing the computation output plus phase-locking metadata (`zeqondTick`, `hulyaPhase`, `zeqProof`).

## When to use it

Reach for **ZeqYield** when you need a soil, irrigation, crop disease, livestock, yield primitive that:

- **Must be reproducible** — every call is deterministic for a given phase
- **Must be auditable** — every response carries a tamper-evident ZeqProof receipt
- **Must compose with other Zeq protocols** — outputs are phase-aligned to 1.287 Hz so they slot directly into downstream calls without resync
- **Must scale across domains** — the same endpoint works whether you're driving one call per minute or part of a high-throughput pipeline (subject to rate limit 10/min)

If you only need a one-shot soil, irrigation, crop disease, livestock, yield answer with no audit trail and no composition with other Zeq calls, a plain library may be cheaper. If you need *any* of the four properties above, this protocol is the right tool.

## How to call it

The fastest path is a single HTTPS `POST` request to `/api/agri/yield` with a Bearer token. You can use cURL, JavaScript, Python, or any HTTP client — examples for all three are below. The response is JSON.

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `cropType` | `string` | Yes | Crop to predict. |
| `fieldArea_ha` | `number` | Yes | Field area. |
| `plantingDate` | `string` | Yes | ISO date of planting. |
| `ndviTimeSeries` | `array` | No | Historical NDVI readings. |

## Returns

```
{ predictedYield_tonnes_ha, confidence_pct, optimalHarvestDate, riskFactors, zeqond }
```

## How to call it — every language

Every Zeq endpoint is a plain HTTPS `POST`. That means you can call it from **any** language that speaks HTTP. Below: thirteen working snippets — pick whichever fits your stack.

### Command line (curl)

```bash
curl -X POST \
  https://www.zeq.dev/api/agri/yield \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}'
```

### JavaScript (browser / Node)

```javascript
const res = await fetch("https://www.zeq.dev/api/agri/yield", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
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

const res = await fetch("https://www.zeq.dev/api/agri/yield", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}),
});
const data: ZeqResponse = await res.json();
console.log(data.result);
```

### Python

```python
import os, requests

res = requests.post(
    "https://www.zeq.dev/api/agri/yield",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
},
)
print(res.json())
```

### Go

```go
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
    payload, _ := json.Marshal(map[string]interface{}{})
    req, _ := http.NewRequest("POST", "https://www.zeq.dev/api/agri/yield", bytes.NewBuffer(payload))
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
        .uri(URI.create("https://www.zeq.dev/api/agri/yield"))
        .header("Authorization", "Bearer " + System.getenv("ZEQ_API_KEY"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{
  \"cropType\": \"<cropType>\",
  \"fieldArea_ha\": 1,
  \"plantingDate\": \"<plantingDate>\",
  \"ndviTimeSeries\": []
}"))
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/agri/yield");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{
  \"cropType\": \"<cropType>\",
  \"fieldArea_ha\": 1,
  \"plantingDate\": \"<plantingDate>\",
  \"ndviTimeSeries\": []
}");
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/agri/yield");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"json({
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
})json");
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}
```

### PHP

```php
<?php
$ch = curl_init("https://www.zeq.dev/api/agri/yield");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . getenv("ZEQ_API_KEY"),
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

### Swift

```swift
import Foundation

var req = URLRequest(url: URL(string: "https://www.zeq.dev/api/agri/yield")!)
req.httpMethod = "POST"
req.setValue("Bearer \(ProcessInfo.processInfo.environment["ZEQ_API_KEY"] ?? "")", forHTTPHeaderField: "Authorization")
req.setValue("application/json", forHTTPHeaderField: "Content-Type")
req.httpBody = "{
  \"cropType\": \"<cropType>\",
  \"fieldArea_ha\": 1,
  \"plantingDate\": \"<plantingDate>\",
  \"ndviTimeSeries\": []
}".data(using: .utf8)

URLSession.shared.dataTask(with: req) { data, _, _ in
    if let data = data { print(String(data: data, encoding: .utf8) ?? "") }
}.resume()
```

### Lua

```lua
local http = require("socket.http")
local ltn12 = require("ltn12")
local response = {}

http.request{
    url = "https://www.zeq.dev/api/agri/yield",
    method = "POST",
    headers = {
        ["Authorization"] = "Bearer " .. os.getenv("ZEQ_API_KEY"),
        ["Content-Type"] = "application/json",
        ["Content-Length"] = tostring(#'{
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}'),
    },
    source = ltn12.source.string('{
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}'),
    sink = ltn12.sink.table(response),
}
print(table.concat(response))
```

### HTML (drop into any page)

```html
<script>
fetch("https://www.zeq.dev/api/agri/yield", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ZEQ_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}),
})
  .then(r => r.json())
  .then(data => console.log(data));
</script>
```

### Markdown / REST Client (.http)

```http
POST https://www.zeq.dev/api/agri/yield
Authorization: Bearer {{ZEQ_API_KEY}}
Content-Type: application/json

{
  "cropType": "<cropType>",
  "fieldArea_ha": 1,
  "plantingDate": "<plantingDate>",
  "ndviTimeSeries": []
}
```

## Phase-Locking & ZeqProof

Every response from `/api/agri/yield` carries:

- `zeqondTick` — the Zeqond (0.777 s) at which the result was sealed
- `hulyaPhase` — the HulyaPulse phase ∈ [0, 1) at sealing
- `zeqProof` — HMAC receipt that lets any third party verify the result without an API key via `POST /api/zeq/prove/verify`

See [Concepts → ZeqProof](/learn/concepts/zeqproof) and [HulyaPulse](/learn/concepts/hulyapulse) for the underlying mathematics.

## Related

- All protocols in this family — see the [Soil, Irrigation, Crop Disease, Livestock, Yield](/reference/protocols) category
- [API Reference → Endpoints](/reference/api/endpoints)
- [Concepts → ZeqProof](/learn/concepts/zeqproof)
