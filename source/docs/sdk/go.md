---
title: Go SDK
description: Complete guide to integrating Zeq with Go using net/http.
sidebar_position: 4
---

# Go SDK

Zeq integrates smoothly with Go using the standard `net/http` library. This guide covers synchronous patterns with proper timeout and error handling.

## Setup

### Create a Go Project

```bash
go mod init zeq-example
```

### Load Environment Variables

```bash
go get github.com/joho/godotenv
```

## ZeqClient Structure

Here's a production-ready Go client:

```go
package zeq

import (
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "time"
)

// ZeqState represents the state dictionary
type ZeqState map[string]interface{}

// ComputeResponse is the response from /zeq/compute
type ComputeResponse struct {
    Result    ZeqState  `json:"result"`
    Proof     string    `json:"proof"`
    Timestamp int64     `json:"timestamp"`
}

// VerifyRequest is the request body for /zeq/verify
type VerifyRequest struct {
    Proof         string   `json:"proof"`
    ExpectedState ZeqState `json:"expected_state"`
}

// VerifyResponse is the response from /zeq/verify
type VerifyResponse struct {
    Valid   bool                   `json:"valid"`
    Details map[string]interface{} `json:"details"`
}

// PulseResponse is the response from /zeq/pulse
type PulseResponse struct {
    CurrentQuantum int64 `json:"current_quantum"`
    Synchronized   bool  `json:"synchronized"`
    DriftNS        int64 `json:"drift_ns"`
}

// TimebridgeResponse is the response from /zeq/timebridge
type TimebridgeResponse struct {
    Zeqond int64 `json:"zeqond"`
}

// OperatorsResponse is the response from /zeq/operators
type OperatorsResponse struct {
    Operators []map[string]interface{} `json:"operators"`
}

// RateLimitInfo contains rate limit information from response headers
type RateLimitInfo struct {
    Remaining int
    ResetAt   int64
}

// ZeqError is a custom error type
type ZeqError struct {
    Message    string
    StatusCode int
    Code       string
}

func (e *ZeqError) Error() string {
    return fmt.Sprintf("ZeqError (%s): %s", e.Code, e.Message)
}

// ZeqClient is the main Zeq API client
type ZeqClient struct {
    apiURL string
    token  string
    client *http.Client
}

// NewZeqClient creates a new ZeqClient with default settings
func NewZeqClient(apiURL, token string) (*ZeqClient, error) {
    if token == "" {
        token = os.Getenv("ZEQ_TOKEN")
    }
    if apiURL == "" {
        apiURL = os.Getenv("ZEQ_API_URL")
        if apiURL == "" {
            apiURL = "https://zeq.dev/api"
        }
    }

    if token == "" {
        return nil, fmt.Errorf("ZEQ_TOKEN is required")
    }

    return &ZeqClient{
        apiURL: apiURL,
        token:  token,
        client: &http.Client{
            Timeout: 30 * time.Second,
        },
    }, nil
}

// request makes an authenticated HTTP request
func (c *ZeqClient) request(ctx context.Context,
    method string,
    endpoint string,
    body interface{}) ([]byte, *RateLimitInfo, error) {

    url := c.apiURL + endpoint
    var bodyReader io.Reader

    if body != nil {
        jsonBody, err := json.Marshal(body)
        if err != nil {
            return nil, nil, err
        }
        bodyReader = io.NopCloser(io.Reader(strings.NewReader(string(jsonBody))))
    }

    req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
    if err != nil {
        return nil, nil, err
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.token))

    resp, err := c.client.Do(req)
    if err != nil {
        return nil, nil, &ZeqError{
            Message:    fmt.Sprintf("Network error: %v", err),
            StatusCode: 0,
            Code:       "NETWORK_ERROR",
        }
    }
    defer resp.Body.Close()

    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, nil, err
    }

    rateLimit := &RateLimitInfo{}
    if remaining := resp.Header.Get("X-RateLimit-Remaining"); remaining != "" {
        fmt.Sscanf(remaining, "%d", &rateLimit.Remaining)
    }
    if resetAt := resp.Header.Get("X-RateLimit-Reset"); resetAt != "" {
        fmt.Sscanf(resetAt, "%d", &rateLimit.ResetAt)
    }

    if resp.StatusCode != http.StatusOK {
        var errResp struct {
            Success bool `json:"success"`
            Error   struct {
                Code    string `json:"code"`
                Message string `json:"message"`
            } `json:"error"`
        }
        json.Unmarshal(respBody, &errResp)

        return nil, rateLimit, &ZeqError{
            Message:    errResp.Error.Message,
            StatusCode: resp.StatusCode,
            Code:       errResp.Error.Code,
        }
    }

    return respBody, rateLimit, nil
}

// Compute executes a computation step
func (c *ZeqClient) Compute(ctx context.Context,
    state ZeqState,
    timeQuantum int64) (*ComputeResponse, error) {

    reqBody := map[string]interface{}{
        "state":         state,
        "time_quantum":  timeQuantum,
    }

    respBody, _, err := c.request(ctx, "POST", "/zeq/compute", reqBody)
    if err != nil {
        return nil, err
    }

    var result struct {
        Success bool              `json:"success"`
        Data    ComputeResponse   `json:"data"`
    }

    if err := json.Unmarshal(respBody, &result); err != nil {
        return nil, err
    }

    return &result.Data, nil
}

// Verify verifies a proof
func (c *ZeqClient) Verify(ctx context.Context,
    proof string,
    expectedState ZeqState) (*VerifyResponse, error) {

    reqBody := VerifyRequest{
        Proof:         proof,
        ExpectedState: expectedState,
    }

    respBody, _, err := c.request(ctx, "POST", "/zeq/verify", reqBody)
    if err != nil {
        return nil, err
    }

    var result struct {
        Success bool              `json:"success"`
        Data    VerifyResponse    `json:"data"`
    }

    if err := json.Unmarshal(respBody, &result); err != nil {
        return nil, err
    }

    return &result.Data, nil
}

// Pulse gets the current Zeq time pulse
func (c *ZeqClient) Pulse(ctx context.Context) (*PulseResponse, error) {
    respBody, _, err := c.request(ctx, "GET", "/zeq/pulse", nil)
    if err != nil {
        return nil, err
    }

    var result struct {
        Success bool              `json:"success"`
        Data    PulseResponse     `json:"data"`
    }

    if err := json.Unmarshal(respBody, &result); err != nil {
        return nil, err
    }

    return &result.Data, nil
}

// Operators lists available operators
func (c *ZeqClient) Operators(ctx context.Context,
    category string) (*OperatorsResponse, error) {

    endpoint := "/zeq/operators"
    if category != "" {
        endpoint += "?category=" + category
    }

    respBody, _, err := c.request(ctx, "GET", endpoint, nil)
    if err != nil {
        return nil, err
    }

    var result struct {
        Success bool                 `json:"success"`
        Data    OperatorsResponse    `json:"data"`
    }

    if err := json.Unmarshal(respBody, &result); err != nil {
        return nil, err
    }

    return &result.Data, nil
}

// Timebridge converts Unix timestamp to Zeqond
func (c *ZeqClient) Timebridge(ctx context.Context,
    timestamp int64,
    timezone string) (*TimebridgeResponse, error) {

    if timezone == "" {
        timezone = "UTC"
    }

    reqBody := map[string]interface{}{
        "timestamp": timestamp,
        "timezone":  timezone,
    }

    respBody, _, err := c.request(ctx, "POST", "/zeq/timebridge", reqBody)
    if err != nil {
        return nil, err
    }

    var result struct {
        Success bool                   `json:"success"`
        Data    TimebridgeResponse     `json:"data"`
    }

    if err := json.Unmarshal(respBody, &result); err != nil {
        return nil, err
    }

    return &result.Data, nil
}
```

## Usage Examples

### Basic Compute

```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"
    "zeq"
)

func main() {
    client, err := zeq.NewZeqClient("", "")
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    state := zeq.ZeqState{
        "x": 1.0,
        "y": 2.0,
        "z": 0.5,
    }

    result, err := client.Compute(ctx, state, 5)
    if err != nil {
        log.Fatalf("Compute error: %v", err)
    }

    fmt.Printf("Result: %v\n", result.Result)
    fmt.Printf("Proof: %s\n", result.Proof)
}
```

### Verify with Error Handling

```go
func verifyComputation(client *zeq.ZeqClient, ctx context.Context) error {
    state := zeq.ZeqState{"x": 1.0}
    result, err := client.Compute(ctx, state, 1)
    if err != nil {
        return err
    }

    verification, err := client.Verify(ctx, result.Proof, result.Result)
    if err != nil {
        if zeqErr, ok := err.(*zeq.ZeqError); ok {
            switch zeqErr.Code {
            case "RATE_LIMIT_EXCEEDED":
                fmt.Println("Rate limited, implement backoff")
            case "UNAUTHORIZED":
                fmt.Println("Invalid token")
            default:
                fmt.Printf("Error: %s\n", zeqErr.Message)
            }
        }
        return err
    }

    if verification.Valid {
        fmt.Println("✓ Proof verified")
    } else {
        fmt.Println("✗ Proof failed verification")
    }

    return nil
}
```

### Pulse Example

```go
func checkSync(client *zeq.ZeqClient, ctx context.Context) error {
    pulse, err := client.Pulse(ctx)
    if err != nil {
        return err
    }

    fmt.Printf("Current quantum: %d\n", pulse.CurrentQuantum)
    fmt.Printf("Synchronized: %v\n", pulse.Synchronized)
    fmt.Printf("Drift: %d ns\n", pulse.DriftNS)

    if pulse.DriftNS > 1000 {
        fmt.Println("⚠ High temporal drift detected")
    }

    return nil
}
```

### Timebridge Example

```go
import "time"

func convertTime(client *zeq.ZeqClient, ctx context.Context) error {
    now := time.Now().Unix()
    response, err := client.Timebridge(ctx, now, "America/New_York")
    if err != nil {
        return err
    }

    fmt.Printf("Unix %d = Zeqond %d\n", now, response.Zeqond)
    return nil
}
```

## Timeout Handling

Always use context with timeouts:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// All requests will timeout after 5 seconds
result, err := client.Compute(ctx, state, 1)
```

## Concurrent Requests

The `ZeqClient` is thread-safe:

```go
func computeConcurrent(client *zeq.ZeqClient, states []zeq.ZeqState) error {
    ctx := context.Background()

    resultsChan := make(chan *zeq.ComputeResponse, len(states))
    errorsChan := make(chan error, len(states))

    for _, state := range states {
        go func(s zeq.ZeqState) {
            result, err := client.Compute(ctx, s, 1)
            if err != nil {
                errorsChan <- err
            } else {
                resultsChan <- result
            }
        }(state)
    }

    results := make([]*zeq.ComputeResponse, 0, len(states))
    for i := 0; i < len(states); i++ {
        select {
        case result := <-resultsChan:
            results = append(results, result)
        case err := <-errorsChan:
            return err
        }
    }

    for _, r := range results {
        fmt.Printf("Result: %v\n", r.Result)
    }
    return nil
}
```

## Batch Requests

Use the `/api/zeq/lattice` endpoint for batch operations:

```go
func batchCompute(client *zeq.ZeqClient, states []zeq.ZeqState) error {
    ctx := context.Background()

    requests := make([]map[string]interface{}, len(states))
    for i, state := range states {
        requests[i] = map[string]interface{}{
            "state":         state,
            "time_quantum":  1,
        }
    }

    // Make HTTP request directly
    body := map[string]interface{}{"requests": requests}
    respBody, _, err := /* make direct request */
    // Parse response with results

    return nil
}
```

## Rate Limit Handling

Implement exponential backoff:

```go
func computeWithRetry(client *zeq.ZeqClient,
    state zeq.ZeqState,
    maxRetries int) (*zeq.ComputeResponse, error) {

    for attempt := 0; attempt < maxRetries; attempt++ {
        ctx := context.Background()
        result, err := client.Compute(ctx, state, 1)

        if err == nil {
            return result, nil
        }

        if zeqErr, ok := err.(*zeq.ZeqError); ok && zeqErr.StatusCode == 429 {
            if attempt < maxRetries-1 {
                backoff := time.Duration(1<<uint(attempt)) * time.Second
                fmt.Printf("Rate limited. Retrying in %v...\n", backoff)
                time.Sleep(backoff)
                continue
            }
        }

        return nil, err
    }

    return nil, fmt.Errorf("max retries exceeded")
}
```

## Best Practices

1. **Always use context with timeouts** to prevent hanging requests
2. **Check error types** for proper handling (network vs API errors)
3. **Use concurrent requests** for better throughput
4. **Implement retry logic** for transient failures (429, 5xx)
5. **Monitor rate limit headers** proactively

## Next Steps

- [Error Handling Guide](./error-handling.md)
- [Rate Limits Guide](./rate-limits.md)
- [Robotics Domain](../guides/robotics.md)
- [Hardware Design Domain](../guides/hardware-design.md)

:::tip
Use context for all operations. It enables proper timeout, cancellation, and deadline handling across the call stack.
:::
