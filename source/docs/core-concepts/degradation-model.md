---
sidebar_position: 9
---

# Degradation Model: Tiers and Limits

The **Degradation Model** defines how Zeq capabilities scale across subscription tiers. Free-tier users receive a degraded experience (lower precision, fewer operators, rate limits), while paying users unlock monotonically more capabilities—until Architect tier, which has no limits.

:::info
"Degradation" means that free-tier capabilities are a strict subset of paid-tier capabilities. Each tier strictly improves upon the previous one.
:::

## The Four Paid Tiers (+ Free)

| Tier | Price | Rate Limit | Precision | Operators | Advanced Protocols | Use Case |
|---|---|---|---|---|---|---|
| **Free** | $0/mo | 10 req/min | ≤1% error | 42 core only | Locked | Learning, prototyping |
| **Starter** | $29/mo | 100 req/min | ≤0.5% error | 234 all | Partial (70%) | Small projects, research |
| **Builder** | $99/mo | 500 req/min | ≤0.1% error | 234 all | Full (100%) | Medium projects, production |
| **Advanced** | $499/mo | 5000 req/min | ≤0.01% error | 234 all | Full (100%) | Complex simulations, teams |
| **Architect** | $2499/mo | Unlimited | ≤0.001% error | 234 all | Full (100%) | Enterprise, research orgs |

## Free Tier: The Degraded Experience

Free users can:
- Execute **10 computations per minute** (hard limit; requests beyond this are rejected with 429 Too Many Requests)
- Use only **42 core operators** (out of 1,576 available)
- Access only **basic operators**: QM1, NM19, GR1, CS1, EM1, SM1, and others (one per major domain)
- Receive results with **≤1% precision error** (relaxed tolerance)
- **Cannot access** advanced protocols (see below)
- Results are **marked as "Free Tier"** in metadata (not suitable for publication)

### Free Tier Rate Limiting

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY"
```

If you exceed 10 computations per minute:

**Response (429 Too Many Requests):**
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "tier": "free",
  "limit": {
    "computations_per_minute": 10,
    "window_seconds": 60
  },
  "current_usage": {
    "computations_this_minute": 11,
    "quota_exceeded_by": 1
  },
  "retry_after_seconds": 45,
  "upgrade_message": "Upgrade to Starter tier for 100 req/min, or Builder for 500 req/min."
}
```

### Free Tier Operator List (42 core operators)

```
QM1   (Schrödinger)
NM19  (Newton)
GR1   (Einstein Field Equations - basic)
CS1   (Complexity – basic algorithm analysis)
EM1   (Maxwell Equations – basic)
SM1   (Boltzmann Distribution)
OD1   (Linear ODE – basic)
PD1   (Laplace Equation – basic)
PR1   (Probability – basic)
ST1   (Statistics – descriptive)
AC1   (Acoustics – basic)
OP1   (Optics – basic)
TH1   (Thermodynamics – basic)
FL1   (Fluid Dynamics – basic inviscid)
... and 28 more basic operators (one per domain)
```

Accessing any operator outside this list results in an error:

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM23"]
  }'
```

**Response (403 Forbidden):**
```json
{
  "error": "OPERATOR_NOT_ACCESSIBLE",
  "tier": "free",
  "requested_operator": "QM23",
  "reason": "QM23 (advanced quantum mechanics) is available only on Starter tier and above.",
  "accessible_in_tier": "free",
  "operators_in_free_tier": 42,
  "upgrade_suggestion": "Upgrade to Starter tier to access 234 operators."
}
```

### Free Tier Precision

Free-tier results have a relaxed precision guarantee of **≤1% error**. For scientific work, this is often insufficient.

**Example:** A free-tier QM1 computation might return:
```json
{
  "result": 4.852103847,
  "precision_error_percent": 0.87,
  "tier": "free",
  "note": "Free tier results are for educational purposes only. Publication-quality results require paid tiers."
}
```

## Starter Tier: Entry-Level Production

Starter users get:
- **100 computations per minute** (10× free)
- All **234 operators**
- **≤0.5% precision error** (good for most research)
- **70% of advanced protocols** (see below)
- Results are **suitable for academic publication** (with proper attribution)

**Price**: $29/month

### When to Use Starter

- Running research projects with moderate computational load
- Publishing in peer-reviewed journals (results verified for accuracy)
- Teaching and coursework (students working on real science)
- Exploring all operators without restriction

### Starter Tier Example

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM23", "EM12", "NM19"],
    "parameters": {...}
  }'
```

**Response (Success):**
```json
{
  "result": 4.852103847,
  "precision_error_percent": 0.34,
  "tier": "starter",
  "operators_used": ["QM23", "EM12", "NM19", "KO42"],
  "zeqproof": {...},
  "advanced_protocols_available": "70%"
}
```

## Builder Tier: Production Standard

Builder users get:
- **500 computations per minute** (50× free)
- All **234 operators**
- **≤0.1% precision error** (tight, suitable for publication and regulatory work)
- **100% of advanced protocols** (unrestricted access)
- Results are **suitable for regulatory submissions** (FDA, EMA, etc.)

**Price**: $99/month

### When to Use Builder

- Production-grade applications (fintech, pharma, engineering)
- Regulatory submissions (FDA drug trials, safety-critical systems)
- Academic research with high precision requirements
- Teams working on shared projects

## Advanced Tier: Research + Teams

Advanced users get:
- **5000 computations per minute** (500× free)
- All **234 operators**
- **≤0.01% precision error** (extremely tight)
- **100% of advanced protocols**
- **Dedicated API endpoint** (lower latency)
- **Team collaboration** (multiple users on one account)
- **Priority support** (24/7 SLA)

**Price**: $499/month

### When to Use Advanced

- Large-scale simulations (climate modeling, structural analysis)
- Teams with multiple users (research labs, companies)
- Real-time applications (fintech, robotics)
- Complex scientific projects requiring tight coordination

## Architect Tier: Unlimited

Architect users get:
- **Unlimited computations** (no rate limit)
- All **234 operators**
- **≤0.001% precision error** (maximum accuracy)
- **100% of advanced protocols**
- **Custom infrastructure** (on-premises or dedicated cloud)
- **Dedicated account manager**
- **Custom SLAs**

**Price**: $2499/month (or custom enterprise agreement)

### When to Use Architect

- Enterprise organizations (Fortune 500, national labs)
- Mission-critical applications (space systems, nuclear, medical devices)
- Research organizations publishing dozens of papers per year
- Custom requirements (on-premises deployment, audit trails, etc.)

## Precision Tiers: What They Mean

| Tier | Precision | Error Bound | Suitable For |
|---|---|---|---|
| **Free (≤1%)** | Worst | ± 0.01 (for result ~1.0) | Learning only |
| **Starter (≤0.5%)** | Good | ± 0.005 (for result ~1.0) | Academic publication |
| **Builder (≤0.1%)** | Excellent | ± 0.001 (for result ~1.0) | Regulatory work |
| **Advanced (≤0.01%)** | Very High | ± 0.0001 (for result ~1.0) | Engineering, fintech |
| **Architect (≤0.001%)** | Maximum | ± 0.00001 (for result ~1.0) | Critical systems |

**Note**: These are relative errors. For an absolute result of 100.0:
- Free tier: ± 1.0
- Builder tier: ± 0.1
- Architect tier: ± 0.01

## Advanced Protocols

Advanced protocols are domain-specific, specialized computational methods that unlock additional capabilities:

- **Adaptive Mesh Refinement** (AMR): Automatically refines spatial grid in high-gradient regions
- **Parallel Time Integration**: Solves for multiple time steps in parallel (speeds up long simulations)
- **Quantum Error Correction**: Reduces errors in quantum computations
- **Multi-Scale Coupling**: Simultaneously solves problems at different length/timescales
- **Uncertainty Quantification**: Quantifies sensitivity to parameter variations
- **Machine Learning Emulation**: Learns fast surrogate models for expensive computations
- ... and 227 more advanced protocols

**Availability by Tier:**

| Tier | Access | Example Restriction |
|---|---|---|
| Free | 0/234 | All locked |
| Starter | 164/234 | AMR, Parallel Time, ML Emulation locked |
| Builder | 234/234 | All unlocked |
| Advanced | 234/234 | All unlocked |
| Architect | 234/234 | All unlocked |

### Using an Unavailable Protocol (Free Tier)

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["QM1"],
    "advanced_protocol": "adaptive_mesh_refinement"
  }'
```

**Response (403 Forbidden):**
```json
{
  "error": "ADVANCED_PROTOCOL_NOT_AVAILABLE",
  "tier": "free",
  "requested_protocol": "adaptive_mesh_refinement",
  "reason": "Advanced protocols are available only on Starter tier (70% access) and above.",
  "upgrade_paths": [
    {
      "tier": "starter",
      "price_monthly": 29,
      "protocols_unlocked": 164
    },
    {
      "tier": "builder",
      "price_monthly": 99,
      "protocols_unlocked": 234
    }
  ]
}
```

## Credits and Overage Pricing

For paid tiers, you can exceed your monthly rate limit by purchasing **overages**:

```bash
curl -X POST https://zeq.dev/api/zeq/purchase-credits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "starter",
    "credit_amount": 1000,
    "auto_refill": true,
    "refill_threshold": 100,
    "refill_amount": 500
  }'
```

**Pricing:**
- **1 credit** = 1 computation beyond your monthly allowance
- **Free tier**: Cannot purchase credits (upgrade required)
- **Starter**: $0.03 per 100 extra computations
- **Builder**: $0.02 per 100 extra computations
- **Advanced**: $0.01 per 100 extra computations
- **Architect**: Custom pricing

**Response:**
```json
{
  "purchase_confirmed": true,
  "credits_purchased": 1000,
  "cost": "$300",
  "current_balance": 1023,
  "auto_refill_enabled": true,
  "refill_threshold": 100,
  "refill_amount": 500,
  "next_billing_date": "2025-04-29"
}
```

## Comparison Table

```
┌─────────────────────────────────────────────────────────────────┐
│ TIER COMPARISON                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Feature                  │ Free   │ Starter │ Builder │ Advanced │
├──────────────────────────┼────────┼─────────┼─────────┼──────────┤
│ Price                    │ $0     │ $29     │ $99     │ $499     │
│ Req/min                  │ 10     │ 100     │ 500     │ 5000     │
│ Operators                │ 42     │ 234     │ 234     │ 234      │
│ Max error                │ ≤1%    │ ≤0.5%   │ ≤0.1%   │ ≤0.01%   │
│ Advanced protocols       │ 0%     │ 70%     │ 100%    │ 100%     │
│ ZeqProof verification    │ Yes    │ Yes     │ Yes     │ Yes      │
│ Publication-ready        │ No     │ Yes     │ Yes     │ Yes      │
│ Regulatory-compliant     │ No     │ No      │ Yes     │ Yes      │
│ Team collaboration       │ No     │ No      │ No      │ Yes      │
│ Dedicated support        │ No     │ No      │ No      │ Yes      │
│ Custom SLA               │ No     │ No      │ No      │ Yes      │
└─────────────────────────────────────────────────────────────────┘
```

## Upgrading and Downgrading

### Upgrading

```bash
curl -X POST https://zeq.dev/api/account/upgrade \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "new_tier": "builder"
  }'
```

**Response:**
```json
{
  "upgrade_successful": true,
  "previous_tier": "starter",
  "new_tier": "builder",
  "effective_date": "2025-03-29T13:30:00Z",
  "prorated_refund": "$15.33",
  "new_billing_date": "2025-04-29",
  "next_invoice": {
    "amount": "$83.67",
    "description": "Builder tier (18 days remaining in cycle)"
  }
}
```

Upgrades take **immediate effect**.

### Downgrading

```bash
curl -X POST https://zeq.dev/api/account/downgrade \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "new_tier": "starter"
  }'
```

Downgrades take effect **at the next billing cycle** to protect your workflows.

## Cross-References

- **[Operators](./operators.md)**: How tiers unlock different operator counts
- **[Seven-Step Protocol](./seven-step-protocol.md)**: Step 2 validates operator limits based on tier
- **[ZeqProof](./zeqproof.md)**: Available on all tiers for verification

## The Degradation Philosophy

The term "degradation" is intentional. Zeq's design reflects a principle:

**Free-tier capabilities are a strict subset of paid-tier capabilities. Every upgrade strictly increases what you can do.**

This is different from some platforms where free and paid tiers are "different" but not comparable. At Zeq:

```
Free ⊂ Starter ⊂ Builder ⊂ Advanced ⊂ Architect

(where ⊂ means "is a strict subset of")
```

Everything you can do on Free, you can do on Starter (plus more). Everything on Starter, you can do on Builder, etc.

### Why This Philosophy?

1. **Fairness**: You're not learning one thing on Free and discovering on Starter that your code doesn't transfer
2. **Scalability**: As your project grows, you upgrade—your code doesn't break
3. **No Vendor Lock-in**: You choose to upgrade because you need more capability, not because the platform forces you

---

## Graceful Degradation: What Happens at Limits

### Example 1: Free Tier, Hitting Rate Limit

You're prototyping with QM1 on Free tier. You write a loop that makes 15 computations per minute:

```python
for i in range(15):
    result = zeq.compute("QM1", {"energy_level": i})
    print(result)
```

**What happens:**
- Computation 1-10: ✓ Succeed
- Computation 11: ✗ 429 Too Many Requests
- Computation 12-15: ✗ All rejected with same error

**Not degraded:** The API doesn't slow down or reduce precision. It either works (✓) or doesn't (✗).

**How to handle:**
```python
import time
for i in range(15):
    try:
        result = zeq.compute("QM1", {"energy_level": i})
    except RateLimitError:
        time.sleep(10)  # Wait before retrying
        result = zeq.compute("QM1", {"energy_level": i})
```

Or upgrade to Starter tier (100 req/min).

### Example 2: Free Tier, Requesting Unavailable Operator

You try to use QM23 (advanced quantum mechanics):

```bash
curl -X POST https://zeq.dev/api/zeq/compute \
  -H "Content-Type: application/json" \
  -d '{"operators": ["QM23"]}'
```

**Response:**
```json
{
  "error": "OPERATOR_NOT_ACCESSIBLE",
  "tier": "free",
  "requested_operator": "QM23",
  "reason": "Available only on Starter tier and above",
  "status": 403
}
```

**Not degraded:** You don't get a lesser version of QM23. You get rejected cleanly with a helpful error.

**How to handle:**
- Upgrade to Starter ($29/month), or
- Use QM1 (available on Free), which covers basic quantum mechanics

### Example 3: Starter Tier, Precision at Limit

You request a computation with very tight tolerance:

```json
{
  "operators": ["QM1"],
  "precision": {
    "relative_error_tolerance": 1e-8  // Very tight
  }
}
```

**Response (Starter tier):**
```json
{
  "precision_validated": true,
  "requested_tolerance": 1e-8,
  "achieved_tolerance": 5e-4,  // Only achieved this
  "warning": "Starter tier precision limit is ≤0.5% (5e-4). Your request was tightened to this value.",
  "recommendation": "Upgrade to Builder tier (≤0.1%) or Advanced (≤0.01%) for tighter tolerances."
}
```

**Graceful degradation:** The computation succeeds, but with the best precision your tier allows. You're not blindsided—the response tells you exactly what you got.

### Example 4: Builder Tier Computation Hitting Precision Limit

You're doing regulatory work (FDA submission) on Builder tier and need ≤0.05% error:

```json
{
  "operators": ["QM1", "NM19"],
  "precision": {
    "relative_error_tolerance": 5e-4  // 0.05%
  }
}
```

**Response:**
```json
{
  "result": {...},
  "metadata": {
    "achieved_error": 0.087,  // ✓ Within tier limit
    "tier_limit": 0.1,
    "margin": 0.013,  // Some headroom
    "regulatory_qualified": true  // Safe for FDA
  }
}
```

**Success:** You achieved your precision goal within your tier. You can confidently submit to FDA.

---

## Tier Upgrade Examples

### Scenario 1: Student to Researcher

**Starting point:** Free tier
- 10 computations/minute
- 42 basic operators
- ≤1% error
- Use case: Learning quantum mechanics

**After 6 months:** Starter tier ($29/month)
- 100 computations/minute (10× more)
- 234 operators (5.5× more)
- ≤0.5% error (2× tighter)
- Use case: Publishing research paper

**Code change:** NONE. Your QM1 computation that worked on Free still works on Starter, just faster and more precise.

### Scenario 2: Startup to Enterprise

**Year 1:** Builder tier ($99/month)
- 500 computations/minute
- All 234 operators
- ≤0.1% error
- Use case: Production drug simulation app

**Year 3:** Advanced tier ($499/month)
- 5000 computations/minute (10× more)
- Dedicated API endpoint (lower latency)
- Team collaboration (multiple users)
- Use case: Company-wide research platform

**Year 5:** Architect tier (custom)
- Unlimited computations
- ≤0.001% error
- Custom on-premises deployment
- Dedicated account manager
- Use case: National lab with 100+ researchers

**Code change:** NONE (at the API level). The request format is identical. Only the performance and limits scale up.

---

## When to Upgrade (Decision Matrix)

| Situation | Action |
|-----------|--------|
| You hit rate limit more than once a week | Upgrade immediately |
| You need an operator not in your tier | Upgrade (or wait for next billing cycle) |
| You're publishing results but precision warnings appear | Upgrade (precision affects reputation) |
| You have a team (>1 person) | Upgrade to Advanced (team features) |
| You're doing regulatory work (FDA, EMA) | Upgrade to Builder minimum (≤0.1% error required) |
| You're prototyping and learning | Stay on Free (no payment, no risk) |
| You're publishing but don't hit precision limits | Starter is sufficient (but check edge cases) |
| You're running a small production service | Builder tier is standard choice |
| You're running a large research lab | Advanced or Architect tier |

---

## See Also

- [Official Pricing Page](https://zeq.dev/pricing)
- [Tier Feature Comparison](https://zeq.dev/compare-tiers)
- [Billing FAQ](https://zeq.dev/billing-faq)
