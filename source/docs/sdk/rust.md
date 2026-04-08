---
title: Rust SDK
description: Complete guide to integrating Zeq with Rust using reqwest and tokio.
sidebar_position: 5
---

# Rust SDK

Zeq integrates seamlessly with Rust using `reqwest` for HTTP and `tokio` for async runtime. This guide covers async patterns with strong type safety.

## Setup

### Add Dependencies

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
dotenv = "0.15"
```

### Load Environment Variables

Create a `.env` file:

```bash
ZEQ_API_URL=https://zeq.dev/api
ZEQ_TOKEN=your_bearer_token_here
```

## ZeqClient Struct

Here's a production-ready Rust client:

```rust
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;
use std::fmt;

/// Represents Zeq state as a JSON object
pub type ZeqState = HashMap<String, serde_json::Value>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ComputeResponse {
    pub result: ZeqState,
    pub proof: String,
    pub timestamp: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyResponse {
    pub valid: bool,
    pub details: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PulseResponse {
    pub current_quantum: i64,
    pub synchronized: bool,
    pub drift_ns: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperatorsResponse {
    pub operators: Vec<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimebridgeResponse {
    pub zeqond: i64,
}

#[derive(Debug, Clone)]
pub struct RateLimitInfo {
    pub remaining: u32,
    pub reset_at: u64,
}

#[derive(Debug)]
pub struct ZeqError {
    pub message: String,
    pub status_code: Option<u16>,
    pub code: String,
}

impl fmt::Display for ZeqError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ZeqError ({}): {}", self.code, self.message)
    }
}

impl std::error::Error for ZeqError {}

pub struct ZeqClient {
    api_url: String,
    token: String,
    client: Client,
}

impl ZeqClient {
    /// Create a new ZeqClient from environment or parameters
    pub fn new(
        api_url: Option<String>,
        token: Option<String>,
    ) -> Result<Self, ZeqError> {
        dotenv::dotenv().ok();

        let api_url = api_url
            .or_else(|| env::var("ZEQ_API_URL").ok())
            .unwrap_or_else(|| "https://zeq.dev/api".to_string());

        let token = token
            .or_else(|| env::var("ZEQ_TOKEN").ok())
            .ok_or_else(|| ZeqError {
                message: "ZEQ_TOKEN is required".to_string(),
                status_code: None,
                code: "MISSING_TOKEN".to_string(),
            })?;

        Ok(Self {
            api_url,
            token,
            client: Client::new(),
        })
    }

    /// Make an authenticated request
    async fn request<T: for<'de> Deserialize<'de>>(
        &self,
        method: &str,
        endpoint: &str,
        body: Option<serde_json::Value>,
    ) -> Result<(T, RateLimitInfo), ZeqError> {
        let url = format!("{}{}", self.api_url, endpoint);

        let mut request = match method {
            "GET" => self.client.get(&url),
            "POST" => self.client.post(&url),
            _ => {
                return Err(ZeqError {
                    message: "Unsupported HTTP method".to_string(),
                    status_code: None,
                    code: "INVALID_METHOD".to_string(),
                })
            }
        };

        request = request.header("Content-Type", "application/json");
        request = request.header("Authorization", format!("Bearer {}", self.token));

        if let Some(body) = body {
            request = request.json(&body);
        }

        let response = request
            .send()
            .await
            .map_err(|e| ZeqError {
                message: format!("Network error: {}", e),
                status_code: None,
                code: "NETWORK_ERROR".to_string(),
            })?;

        let rate_limit = RateLimitInfo {
            remaining: response
                .headers()
                .get("X-RateLimit-Remaining")
                .and_then(|h| h.to_str().ok())
                .and_then(|s| s.parse::<u32>().ok())
                .unwrap_or(0),
            reset_at: response
                .headers()
                .get("X-RateLimit-Reset")
                .and_then(|h| h.to_str().ok())
                .and_then(|s| s.parse::<u64>().ok())
                .unwrap_or(0),
        };

        let status = response.status();

        if !status.is_success() {
            let error_body: serde_json::Value = response
                .json()
                .await
                .unwrap_or(serde_json::json!({}));

            let message = error_body
                .get("error")
                .and_then(|e| e.get("message"))
                .and_then(|m| m.as_str())
                .unwrap_or("Unknown error")
                .to_string();

            let code = error_body
                .get("error")
                .and_then(|e| e.get("code"))
                .and_then(|c| c.as_str())
                .unwrap_or("UNKNOWN")
                .to_string();

            return Err(ZeqError {
                message,
                status_code: Some(status.as_u16()),
                code,
            });
        }

        let body: serde_json::Value = response
            .json()
            .await
            .map_err(|e| ZeqError {
                message: format!("Failed to parse response: {}", e),
                status_code: None,
                code: "PARSE_ERROR".to_string(),
            })?;

        let success = body
            .get("success")
            .and_then(|s| s.as_bool())
            .unwrap_or(false);

        if !success {
            let message = body
                .get("error")
                .and_then(|e| e.get("message"))
                .and_then(|m| m.as_str())
                .unwrap_or("Request failed")
                .to_string();

            let code = body
                .get("error")
                .and_then(|e| e.get("code"))
                .and_then(|c| c.as_str())
                .unwrap_or("UNKNOWN")
                .to_string();

            return Err(ZeqError {
                message,
                status_code: Some(200),
                code,
            });
        }

        let data: T = serde_json::from_value(
            body.get("data").cloned().unwrap_or(serde_json::json!({}))
        )
        .map_err(|e| ZeqError {
            message: format!("Failed to deserialize response: {}", e),
            status_code: None,
            code: "DESERIALIZE_ERROR".to_string(),
        })?;

        Ok((data, rate_limit))
    }

    /// Execute a computation step
    pub async fn compute(
        &self,
        state: ZeqState,
        time_quantum: i64,
    ) -> Result<ComputeResponse, ZeqError> {
        let body = serde_json::json!({
            "state": state,
            "time_quantum": time_quantum
        });

        let (response, _) = self
            .request::<ComputeResponse>("POST", "/zeq/compute", Some(body))
            .await?;

        Ok(response)
    }

    /// Verify a proof
    pub async fn verify(
        &self,
        proof: String,
        expected_state: ZeqState,
    ) -> Result<VerifyResponse, ZeqError> {
        let body = serde_json::json!({
            "proof": proof,
            "expected_state": expected_state
        });

        let (response, _) = self
            .request::<VerifyResponse>("POST", "/zeq/verify", Some(body))
            .await?;

        Ok(response)
    }

    /// Get the current Zeq time pulse
    pub async fn pulse(&self) -> Result<PulseResponse, ZeqError> {
        let (response, _) = self
            .request::<PulseResponse>("GET", "/zeq/pulse", None)
            .await?;

        Ok(response)
    }

    /// List available operators
    pub async fn operators(
        &self,
        category: Option<&str>,
    ) -> Result<OperatorsResponse, ZeqError> {
        let endpoint = match category {
            Some(cat) => format!("/zeq/operators?category={}", cat),
            None => "/zeq/operators".to_string(),
        };

        let (response, _) = self
            .request::<OperatorsResponse>("GET", &endpoint, None)
            .await?;

        Ok(response)
    }

    /// Convert Unix timestamp to Zeqond
    pub async fn timebridge(
        &self,
        timestamp: i64,
        timezone: Option<&str>,
    ) -> Result<TimebridgeResponse, ZeqError> {
        let tz = timezone.unwrap_or("UTC");

        let body = serde_json::json!({
            "timestamp": timestamp,
            "timezone": tz
        });

        let (response, _) = self
            .request::<TimebridgeResponse>("POST", "/zeq/timebridge", Some(body))
            .await?;

        Ok(response)
    }
}
```

## Usage Examples

### Basic Compute

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ZeqClient::new(None, None)?;

    let mut state = ZeqState::new();
    state.insert("x".to_string(), serde_json::json!(1.0));
    state.insert("y".to_string(), serde_json::json!(2.0));
    state.insert("z".to_string(), serde_json::json!(0.5));

    let result = client.compute(state, 5).await?;

    println!("Result: {:?}", result.result);
    println!("Proof: {}", result.proof);
    println!("Timestamp: {}", result.timestamp);

    Ok(())
}
```

### Verify with Error Handling

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ZeqClient::new(None, None)?;

    let mut state = ZeqState::new();
    state.insert("x".to_string(), serde_json::json!(1.0));

    let result = client.compute(state.clone(), 1).await?;

    let verification = client
        .verify(result.proof.clone(), result.result.clone())
        .await?;

    if verification.valid {
        println!("✓ Proof verified");
    } else {
        println!("✗ Proof verification failed");
    }

    Ok(())
}
```

### Error Handling

```rust
use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn compute_with_retry(
    client: &ZeqClient,
    state: ZeqState,
    max_retries: u32,
) -> Result<ComputeResponse, ZeqError> {
    for attempt in 0..max_retries {
        match client.compute(state.clone(), 1).await {
            Ok(result) => return Ok(result),
            Err(e) => {
                if e.status_code == Some(429) && attempt < max_retries - 1 {
                    let backoff = Duration::from_secs(2_u64.pow(attempt));
                    println!("Rate limited. Retrying in {:?}...", backoff);
                    sleep(backoff).await;
                    continue;
                }
                return Err(e);
            }
        }
    }

    Err(ZeqError {
        message: "Max retries exceeded".to_string(),
        status_code: None,
        code: "MAX_RETRIES".to_string(),
    })
}
```

### Pulse Example

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ZeqClient::new(None, None)?;

    let pulse = client.pulse().await?;

    println!("Current quantum: {}", pulse.current_quantum);
    println!("Synchronized: {}", pulse.synchronized);
    println!("Drift: {} ns", pulse.drift_ns);

    if pulse.drift_ns > 1000 {
        println!("⚠ High temporal drift detected");
    }

    Ok(())
}
```

### Concurrent Computations

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = std::sync::Arc::new(ZeqClient::new(None, None)?);

    let states = vec![
        serde_json::json!({"x": 1.0, "y": 2.0}),
        serde_json::json!({"x": 2.0, "y": 3.0}),
        serde_json::json!({"x": 3.0, "y": 4.0}),
    ];

    let mut handles = vec![];

    for state in states {
        let client = client.clone();
        let handle = tokio::spawn(async move {
            let mut s = ZeqState::new();
            for (k, v) in state.as_object().unwrap() {
                s.insert(k.clone(), v.clone());
            }
            client.compute(s, 1).await
        });

        handles.push(handle);
    }

    for handle in handles {
        match handle.await {
            Ok(Ok(result)) => println!("Result: {:?}", result.result),
            Ok(Err(e)) => eprintln!("Error: {}", e),
            Err(e) => eprintln!("Task error: {}", e),
        }
    }

    Ok(())
}
```

### Batch Processing

```rust
#[tokio::main]
async fn batch_compute(
    client: &ZeqClient,
    states: Vec<ZeqState>,
) -> Result<Vec<ComputeResponse>, Box<dyn std::error::Error>> {
    let mut tasks = vec![];

    for state in states {
        tasks.push(client.compute(state, 1));
    }

    let results: Result<Vec<_>, _> = futures::future::try_join_all(tasks).await;

    Ok(results?)
}
```

## Best Practices

1. **Use async/await** for non-blocking operations
2. **Share the client** across tasks with `Arc<ZeqClient>`
3. **Implement retry logic** for transient failures
4. **Check error codes** for proper error handling
5. **Use tokio::spawn** for concurrent operations

## Type Safety

Rust's type system ensures correctness at compile time:

```rust
// This won't compile - type mismatch
let state: ZeqState = HashMap::from([
    ("x".to_string(), serde_json::json!(1.0)),
]);

// ComputeResponse is strongly typed
let result: ComputeResponse = client.compute(state, 1).await?;
let x_value: serde_json::Value = result.result["x"].clone();
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_client_creation() {
        let client = ZeqClient::new(None, None);
        assert!(client.is_ok());
    }

    #[tokio::test]
    async fn test_compute() {
        let client = ZeqClient::new(None, None).unwrap();
        let state = serde_json::json!({"x": 1.0});

        let result = client.compute(state, 1).await;
        assert!(result.is_ok());
    }
}
```

## Next Steps

- [Error Handling Guide](./error-handling.md)
- [Rate Limits Guide](./rate-limits.md)
- [Hardware Design Domain](../guides/hardware-design.md)

:::tip
Use Arc<ZeqClient> to share the client safely across async tasks without cloning.
:::
