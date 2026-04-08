---
sidebar_position: 99
---

# Changelog

Notable changes to the Zeq SDK, kernel, and public surfaces. Dates are UTC.

## 2026-04-06 — Explorer, PLNB, and Concept Coverage

**Kernel**

- Added `PLNB1` operator to the awareness family. Equation: `PLNB1(t) = γ · sin(2π·1.287·t + φ_obs(t))` where γ is the normalised projection of an observer-supplied signal onto the HulyaPulse carrier.
- Added `POST /api/zeq/plnb/observe` and `GET /api/zeq/plnb/operator`. The observe endpoint validates the signal against length and Nyquist bounds, computes γ and φ_obs deterministically, samples PLNB1 at the Step 0 phase, and returns a recommended operator chain. v1 returns the recommendation only — execution remains the caller's responsibility until Explorer telemetry establishes empirical accuracy across the γ bands.

**Explorer**

- New table `public_computations` records one append-only row per CKO execution that the caller has elected to publish. Free-tier rows are public by default; paid-tier rows are private unless `publish: true` is set.
- New endpoints: `GET /api/explorer/computations` (paginated, cursor-based, filterable by operator), `GET /api/explorer/computations/:id`, `GET /api/explorer/stats`.
- New static page at `/computations/` rendering the public feed with operator filtering, live stats, and cursor pagination.

**Stats**

- Homepage `/api/stats` now returns `computationsTotal`, `computationsToday`, and `computationsLast24h` with proper UTC midnight and 24-hour rolling filters. TTL lowered from 60 s to 5 s.
- New `logComputeCall` middleware records every successful POST/PUT against compute routes into `api_calls` so the homepage counter reflects every kernel-bound call, not only the five routes that previously self-logged.

**Documentation**

- Tone audit on `learn/concepts/`: removed pre-flight checklist, lighthouse, watermark, and pendulum analogies in favour of operational definitions.
- New concept pages: `zeqstate.md`, `cko.md`, `precision-bound.md`, `plnb.md`.
- Concept index updated; total published concept pages: 13.

## 2026-04-05 — SDK Docs Site Live

- Docusaurus SDK documentation deployed to docs.zeq.dev.
- Initial concept set (9 pages), build/quickstart, build/clients (5 languages), build/recipes (8 verticals), operate (error-handling, rate-limits, webhooks), reference (api, operators, protocols).

## Earlier

The pre-2026-04 history lives in the git log of the `zeqsdk` repository.
