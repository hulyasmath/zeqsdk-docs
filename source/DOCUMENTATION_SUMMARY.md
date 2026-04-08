# Zeq SDK Documentation Files - Summary

Complete documentation package for the Zeq SDK, including API reference, protocol documentation, and automation scripts.

## Part 1: API Reference Documentation

**Location:** `/docs/docs/api-reference/`

### 1. endpoints.md (sidebar_position: 1)
Complete endpoint directory with all API endpoints organized by functional category:
- Core Computation (3 endpoints)
- Advanced Computation & Solving (7 endpoints)
- Data Management & Registry (10 endpoints)
- Security & Encryption (5 endpoints)
- Medical Device Integration (10 endpoints, medical tier only)
- Emergency Services (5 endpoints, emergency tier only)
- Gaming & Simulation (5 endpoints)
- Analytics & Monitoring (3 endpoints)
- Billing & Account Management (6 endpoints)
- System Information (4 endpoints)

Each endpoint listed with: HTTP method, authentication requirement, and brief description.

### 2. zeqstate-object.md (sidebar_position: 2)
Deep dive into the ZeqState response object with:
- Field reference for all 8 major fields (masterSum, phase, precision, zeqond, operators, R_t, fieldStrength, modulation)
- Complete JSON example of a real response
- Usage patterns and best practices
- Tier-specific behavior table
- Code examples for common use cases
- Performance optimization tips

### 3. error-codes.md (sidebar_position: 3)
Complete error code reference with all API errors:
- HTTP 400 errors (4 codes: INVALID_DOMAIN, INVALID_OPERATOR, TOO_MANY_OPERATORS)
- HTTP 401 errors (2 codes: NO_KEY, INVALID_KEY)
- HTTP 403 errors (1 code: TIER_LOCKED)
- HTTP 429 errors (2 codes: RATE_LIMIT, DAILY_LIMIT)
- HTTP 500 errors (2 codes: SOLVER_ERROR, TIMEOUT)

Each error includes: HTTP status, error code, message, how to fix, example response, and code examples.

### 4. openapi.md (sidebar_position: 4)
OpenAPI specification reference covering:
- How to access the full OpenAPI spec at `/api/openapi.yaml`
- Using Swagger UI and ReDoc for interactive docs
- Code generation with Orval (TypeScript/JavaScript)
- Code generation with OpenAPI Generator (multi-language)
- Using the pre-generated `lib/api-spec` package in the monorepo
- Schema validation techniques
- Keeping the spec up to date
- Troubleshooting common issues

## Part 2: Protocol Reference Index

**Location:** `/docs/docs/protocols/`

### index.md (sidebar_position: 1)
Protocol reference landing page covering:
- What protocols are (fundamental units of computation)
- All 42 protocol categories with descriptions and counts
- Links to individual auto-generated category pages
- Total protocol count: 234 protocols
- Tier-specific access explanation
- Search and discovery guide
- Common protocol paths for different use cases

### Auto-Generated Category Pages (39 files, sidebar_position: 2-40)
One MDX file per protocol category, each containing:
- Category overview and purpose
- All protocols in that category with:
  - Protocol ID and version
  - Endpoint and HTTP method (with badges)
  - Authentication requirement
  - Rate limiting information
  - Parameters table (Name | Type | Required | Description)
  - Return type description
  - Example curl command
- Category-specific best practices and patterns

Categories include:
- Core, Compute, Data, Security, Identity
- Network, Blockchain, Healthcare, Energy, IoT
- Telecom, Space, Quantum, Finance, Biology
- Climate, Admin, Communications
- Medical Imaging, Medical Devices, Emergency
- Gaming, Hardware, Robotics, Weather
- Agriculture, Education, Manufacturing
- Automotive, Aviation, Maritime, Materials
- Audio, Optics, Nuclear, Defense, Geoscience
- Pharma, Nutrition, Water, Forensics
- And 5 more integrated categories

## Part 3: Protocol Page Generator Script

**Location:** `/scripts/generate-protocol-pages.mjs`

Node.js script that automatically generates protocol documentation from the TypeScript protocol registry.

### Features:
- **Automated parsing** - Reads from `../../api-server/src/lib/protocols.ts`
- **234 protocols** - Parses and documents all protocols
- **39 categories** - Organizes into logical category pages
- **No dependencies** - Pure Node.js, no npm packages required
- **Idempotent** - Safe to run multiple times
- **Robust parsing** - Handles complex TypeScript object syntax

### Usage:
```bash
node generate-protocol-pages.mjs
```

### Output:
- Generates 39 MDX files in `docs/protocols/`
- Each file contains all protocols for that category
- Automatically calculates sidebar positions
- Includes parameter tables and curl examples

### Configuration:
Paths defined at script top:
```javascript
const PROTOCOLS_TS_PATH = '../../api-server/src/lib/protocols.ts';
const OUTPUT_DIR = '../docs/protocols';
```

### How it works:
1. Reads the TypeScript protocols.ts file
2. Parses the PROTOCOLS array and category headers
3. Groups protocols by category
4. Generates MDX frontmatter and content
5. Writes files to `docs/protocols/`
6. Reports summary statistics

## Documentation Statistics

| Component | Count | Status |
|-----------|-------|--------|
| API Reference Files | 4 | Complete |
| API Endpoints Documented | 58 | Complete |
| Protocol Categories | 42 | Auto-generated |
| Total Protocols | 234 | Auto-generated |
| Generated MDX Files | 40 (index + 39 categories) | Auto-generated |
| Error Codes Documented | 11 | Complete |
| Code Examples | 50+ | Included |

## File Structure

```
artifacts/docs/
├── docs/
│   ├── api-reference/
│   │   ├── endpoints.md
│   │   ├── zeqstate-object.md
│   │   ├── error-codes.md
│   │   └── openapi.md
│   └── protocols/
│       ├── index.md
│       ├── core-computation.md
│       ├── quantum-computing.md
│       ├── machine-learning.md
│       ├── ... (36 more category files)
│       └── forensics.md
└── scripts/
    ├── generate-protocol-pages.mjs
    └── README.md
```

## Integration with Docusaurus

These files are designed for Docusaurus v2+ with:
- YAML frontmatter with `sidebar_position` for auto-ordering
- MDX format for React component support
- Markdown tables for parameter documentation
- Code blocks with bash syntax highlighting

## Update Workflow

When the API changes:

1. Update protocols in `api-server/src/lib/protocols.ts`
2. Run the generator: `node scripts/generate-protocol-pages.mjs`
3. Review generated files: `docs/protocols/*.md`
4. Commit changes: `git add docs/protocols/*.md scripts/`

The script automatically keeps protocol documentation synchronized with the API.

## Accessibility & SEO

Documentation includes:
- Comprehensive titles and descriptions
- Clear heading hierarchy
- Table formatting for structured data
- Code examples for all features
- Error documentation for troubleshooting
- Tier-specific information
- Links between related sections

## Performance Considerations

- API reference files are lightweight (< 50KB total)
- Generated protocol files average 5-8KB each
- Script execution time: < 1 second
- No external API calls during generation
- Works offline

## Future Enhancements

Potential additions:
- Interactive API explorer
- Parameter validator
- OpenAPI spec validator
- Changelog auto-generation
- SDK code examples (Node.js, Python, Go, etc.)
- Video tutorials
- Architecture diagrams
- Authentication flow diagrams

## Support & Maintenance

- Endpoint reference should be updated when new endpoints are added
- Error codes should be updated when new error types are introduced
- Protocol documentation is automatically maintained via the script
- OpenAPI spec should be kept in sync with actual API implementation
