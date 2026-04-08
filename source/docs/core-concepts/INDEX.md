# Core Concepts Index

All 9 Core Concepts documentation files for Zeq SDK have been created.

## Files Created

1. **hulyapulse.md** (97 lines)
   - The 1.287 Hz heartbeat of Zeq
   - Derived from field physics
   - API: GET /api/zeq/pulse

2. **zeqond.md** (154 lines)
   - The computational second (0.777 seconds)
   - Bidirectional Unix ↔ Zeqond conversion
   - API: POST /api/zeq/timebridge

3. **r-of-t.md** (137 lines)
   - Phase-locked modulation: `R(t) = S(t)[1 + α·sin(2πf·t + φ₀)]`
   - Signal encoding and verification
   - Recovering raw results from modulated output

4. **ko42.md** (170 lines)
   - Mandatory metric tensioner on every computation
   - KO42.1 (Automatic) and KO42.2 (Manual) modes
   - Why it cannot be removed

5. **operators.md** (259 lines)
   - 1,576 operators across 64 domains
   - Operator specifications and metadata
   - API: GET /api/operators, GET /api/framework/operator/:id

6. **master-equation.md** (236 lines)
   - Full HULYAS Master Equation breakdown
   - Seven distinct terms explained
   - API: POST /api/zeq/master-equation

7. **seven-step-protocol.md** (393 lines)
   - Mandatory 7-step computation sequence
   - Step 1: KO42 mandatory
   - Step 2: Operator limits
   - Step 3: Scale principle
   - Step 4: Precision tuning
   - Step 5: Compilation
   - Step 6: Execution
   - Step 7: Verification

8. **zeqproof.md** (327 lines)
   - HMAC-SHA256 cryptographic binding
   - Proof of authenticity, integrity, and timestamp
   - API: POST /api/zeq/verify
   - Use cases: regulatory compliance, scientific reproducibility

9. **degradation-model.md** (404 lines)
   - Five tiers: Free, Starter, Builder, Advanced, Architect
   - Rate limits, operator access, precision, advanced protocols
   - Comparison table and upgrade/downgrade procedures
   - Credit and overage pricing

## Total Content

- **9 files**
- **2,177 lines** of documentation
- **60+ code examples** (API calls)
- **15+ tables** for reference
- **Complete mathematical equations** with LaTeX
- **Docusaurus MDX frontmatter** on all files
- **Comprehensive cross-references** between sections

## Key Features

✓ Production-ready Docusaurus MDX format
✓ Real API endpoints (https://zeq.dev/api/...)
✓ Mathematical equations in code blocks
✓ JSON response examples
✓ Admonitions (info, warning, note)
✓ Sidebar positioning (1-9)
✓ Internal cross-references
✓ Educational depth with practical examples
✓ Regulatory/compliance language
✓ Tier-appropriate content for all user levels

All files are ready for Docusaurus deployment.
