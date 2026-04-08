---
title: "POST /api/zeq/verify"
sidebar_label: "verify"
sidebar_position: 4
description: "Verify a returned ZeqProof against an expected value with phase tolerance. Returns ok/fail plus the live HulyaPulse phase for replay debugging."
---

# `POST /api/zeq/verify`

Verify a previously returned **ZeqProof** HMAC and (optionally) check that the bound R(t) is within a tolerance of an expected value. Use this on the receiver side of a Zeq computation to confirm authenticity and numerical correctness without re-running the full operator stack.

> **ZeqProofs are HMAC-SHA256** keyed to the API key prefix that produced them. A verify call recomputes the HMAC over the same `(operators, masterSum, zeqond, keyPrefix)` tuple and compares.

---

## Authentication

`Authorization: Bearer $ZEQ_API_KEY`

The API key must be from the **same account** that originally produced the proof. Cross-account verification is rejected.

---

## Request

```json
{
  "operators": ["KO42", "QM1"],
  "masterSum": 3.14159,
  "zeqond": 2285084179,
  "zeqProof": "d56aac2c74c24b065099d911d28a030a4b02a78248d39d0b6656fab45fea490e",
  "expected": { "value": 1.502, "tolerance": 0.001 }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `operators` | string[] | yes | Operator chain from the original CKO. |
| `masterSum` | number | yes | `zeqState.masterSum` from the original CKO. |
| `zeqond` | number | yes | `zeqState.zeqond` from the original CKO. |
| `zeqProof` | string | yes | The 64-hex HMAC string returned by the original call. |
| `expected.value` | number | optional | Expected R(t) value to compare against. |
| `expected.tolerance` | number | optional | Absolute tolerance (defaults to `0.001`). |

---

## Response

```json
{
  "ok": true,
  "verified": true,
  "match": "exact",
  "drift": 0.0,
  "phaseAtVerify": 0.5612,
  "zeqondAtVerify": 2285084182,
  "ageZeqonds": 3
}
```

| Field | Type | Meaning |
|---|---|---|
| `verified` | boolean | `true` if the HMAC matches and value (if supplied) is within tolerance. |
| `match` | string | `"exact"`, `"within_tolerance"`, `"out_of_tolerance"`, or `"hmac_mismatch"`. |
| `drift` | number | `|expected.value − actual|`, present when `expected.value` was supplied. |
| `phaseAtVerify` | number | Live HulyaPulse phase at the moment of verification. |
| `ageZeqonds` | integer | Number of Zeqonds elapsed since the original computation. |

---

## ZeqState publish behavior

`/api/zeq/verify` does **not** publish to the public ZeqState feed. Verification is a read-only operation against existing proofs.

---

## Examples

### curl

```bash
curl -X POST https://www.zeq.dev/api/zeq/verify \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operators": ["KO42","QM1"],
    "masterSum": 3.14159,
    "zeqond": 2285084179,
    "zeqProof": "d56aac2c74c24b065099d911d28a030a4b02a78248d39d0b6656fab45fea490e"
  }'
```

### JavaScript

```javascript
const res = await fetch("https://www.zeq.dev/api/zeq/verify", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.ZEQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    operators: cko.zeqState.operators,
    masterSum: cko.zeqState.masterSum,
    zeqond: cko.zeqState.zeqond,
    zeqProof: cko.zeqProof,
  }),
});
const v = await res.json();
console.log("verified:", v.verified, "drift:", v.drift);
```

### Python

```python
import httpx, os

r = httpx.post(
    "https://www.zeq.dev/api/zeq/verify",
    headers={"Authorization": f"Bearer {os.environ['ZEQ_API_KEY']}"},
    json={
        "operators": cko["zeqState"]["operators"],
        "masterSum": cko["zeqState"]["masterSum"],
        "zeqond": cko["zeqState"]["zeqond"],
        "zeqProof": cko["zeqProof"],
    },
)
print(r.json())
```

---

## Errors

| Code | HTTP | Meaning |
|---|---|---|
| `HMAC_MISMATCH` | 200 | Returned with `verified: false`. The proof does not match the supplied tuple. |
| `INVALID_PROOF_FORMAT` | 400 | `zeqProof` is not 64 hex chars. |
| `MISSING_FIELDS` | 400 | One of `operators`, `masterSum`, `zeqond`, or `zeqProof` is absent. |

---

## Related

- [`/api/zeq/compute`](./compute) — produces the proofs you verify here
- [ZeqProof concept](../../../learn/concepts/zeqproof)
