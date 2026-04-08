---
sidebar_position: 2
title: "ZeqSLAM"
description: "Simultaneous Localization and Mapping on Zeqond frames. LiDAR/camera fusion, loop closure detection, graph-based optimization with R(t)-weighted scan matching."
---

# ZeqSLAM

> Simultaneous Localization and Mapping on Zeqond frames. LiDAR/camera fusion, loop closure detection, graph-based optimization with R(t)-weighted scan matching.

| | |
|---|---|
| **Protocol ID** | `zeq-slam` |
| **Category** | Kinematics, SLAM, Manipulation, Swarm, Control |
| **Version** | 1.287.0 |
| **Endpoint** | `/api/robotics/slam` 🔵 POST |
| **Authentication** | Required (Bearer API key) |
| **Rate Limit** | 15/min |

## Purpose

Simultaneous Localization and Mapping on Zeqond frames. LiDAR/camera fusion, loop closure detection, graph-based optimization with R(t)-weighted scan matching. It belongs to the **Kinematics, SLAM, Manipulation, Swarm, Control** family and is callable as a single REST endpoint, a one-line SDK call, or via streaming where applicable.

## What it does

When you call `/api/robotics/slam`, Zeq runs the **ZeqSLAM** computation through the KO42 metric tensioner under the active HulyaPulse phase. The result is sealed at the next Zeqond boundary (0.777 s) and returned with a verifiable ZeqProof receipt — meaning the same inputs at the same phase always produce the same output, and any third party can later verify the result was computed at the time you claim.

In practice, this protocol takes the parameters listed below, performs its kinematics, slam, manipulation, swarm, control operation, and returns a structured response containing the computation output plus phase-locking metadata (`zeqondTick`, `hulyaPhase`, `zeqProof`).

## When to use it

Reach for **ZeqSLAM** when you need a kinematics, slam, manipulation, swarm, control primitive that:

- **Must be reproducible** — every call is deterministic for a given phase
- **Must be auditable** — every response carries a tamper-evident ZeqProof receipt
- **Must compose with other Zeq protocols** — outputs are phase-aligned to 1.287 Hz so they slot directly into downstream calls without resync
- **Must scale across domains** — the same endpoint works whether you're driving one call per minute or part of a high-throughput pipeline (subject to rate limit 15/min)

If you only need a one-shot kinematics, slam, manipulation, swarm, control answer with no audit trail and no composition with other Zeq calls, a plain library may be cheaper. If you need *any* of the four properties above, this protocol is the right tool.

## How to call it

The fastest path is a single HTTPS `POST` request to `/api/robotics/slam` with a Bearer token. You can use cURL, JavaScript, Python, or any HTTP client — examples for all three are below. The response is JSON.

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sensorData` | `object` | Yes | LiDAR point cloud and/or camera frames. |
| `odometry` | `object` | No | Wheel/IMU odometry estimates. |
| `mapId` | `string` | No | Existing map to localize against. |

## Returns

```
{ pose, map, loopClosures, uncertainty, zeqond }
```

## How to call it — every language

Every Zeq endpoint is a plain HTTPS `POST`. That means you can call it from **any** language that speaks HTTP. Below: thirteen working snippets — pick whichever fits your stack.

### Command line (curl)

```bash
curl -X POST \
  https://www.zeq.dev/api/robotics/slam \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}'
```

### JavaScript (browser / Node)

```javascript
const res = await fetch("https://www.zeq.dev/api/robotics/slam", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
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

const res = await fetch("https://www.zeq.dev/api/robotics/slam", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}),
});
const data: ZeqResponse = await res.json();
console.log(data.result);
```

### Python

```python
import os, requests

res = requests.post(
    "https://www.zeq.dev/api/robotics/slam",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
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
    req, _ := http.NewRequest("POST", "https://www.zeq.dev/api/robotics/slam", bytes.NewBuffer(payload))
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
        .uri(URI.create("https://www.zeq.dev/api/robotics/slam"))
        .header("Authorization", "Bearer " + System.getenv("ZEQ_API_KEY"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{
  \"sensorData\": \"<sensorData>\",
  \"odometry\": \"<odometry>\",
  \"mapId\": \"<mapId>\"
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/robotics/slam");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{
  \"sensorData\": \"<sensorData>\",
  \"odometry\": \"<odometry>\",
  \"mapId\": \"<mapId>\"
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
    curl_easy_setopt(curl, CURLOPT_URL, "https://www.zeq.dev/api/robotics/slam");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"json({
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
})json");
    curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}
```

### PHP

```php
<?php
$ch = curl_init("https://www.zeq.dev/api/robotics/slam");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . getenv("ZEQ_API_KEY"),
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

### Swift

```swift
import Foundation

var req = URLRequest(url: URL(string: "https://www.zeq.dev/api/robotics/slam")!)
req.httpMethod = "POST"
req.setValue("Bearer \(ProcessInfo.processInfo.environment["ZEQ_API_KEY"] ?? "")", forHTTPHeaderField: "Authorization")
req.setValue("application/json", forHTTPHeaderField: "Content-Type")
req.httpBody = "{
  \"sensorData\": \"<sensorData>\",
  \"odometry\": \"<odometry>\",
  \"mapId\": \"<mapId>\"
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
    url = "https://www.zeq.dev/api/robotics/slam",
    method = "POST",
    headers = {
        ["Authorization"] = "Bearer " .. os.getenv("ZEQ_API_KEY"),
        ["Content-Type"] = "application/json",
        ["Content-Length"] = tostring(#'{
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}'),
    },
    source = ltn12.source.string('{
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}'),
    sink = ltn12.sink.table(response),
}
print(table.concat(response))
```

### HTML (drop into any page)

```html
<script>
fetch("https://www.zeq.dev/api/robotics/slam", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ZEQ_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}),
})
  .then(r => r.json())
  .then(data => console.log(data));
</script>
```

### Markdown / REST Client (.http)

```http
POST https://www.zeq.dev/api/robotics/slam
Authorization: Bearer {{ZEQ_API_KEY}}
Content-Type: application/json

{
  "sensorData": "<sensorData>",
  "odometry": "<odometry>",
  "mapId": "<mapId>"
}
```

## Phase-Locking & ZeqProof

Every response from `/api/robotics/slam` carries:

- `zeqondTick` — the Zeqond (0.777 s) at which the result was sealed
- `hulyaPhase` — the HulyaPulse phase ∈ [0, 1) at sealing
- `zeqProof` — HMAC receipt that lets any third party verify the result without an API key via `POST /api/zeq/prove/verify`

See [Concepts → ZeqProof](/learn/concepts/zeqproof) and [HulyaPulse](/learn/concepts/hulyapulse) for the underlying mathematics.

## Related

- All protocols in this family — see the [Kinematics, SLAM, Manipulation, Swarm, Control](/reference/protocols) category
- [API Reference → Endpoints](/reference/api/endpoints)
- [Concepts → ZeqProof](/learn/concepts/zeqproof)
