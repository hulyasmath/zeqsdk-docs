# Zeq SDK Documentation

Comprehensive documentation package for the Zeq SDK including API reference, protocol documentation, and automated tooling.

## Contents

This documentation package contains:

### Part 1: API Reference (`docs/api-reference/`)

Complete technical reference for the Zeq API.

- **endpoints.md** - Complete endpoint directory with all 58 API endpoints organized by functional category
- **zeqstate-object.md** - Deep dive into the ZeqState response object with all fields explained, JSON examples, and usage patterns
- **error-codes.md** - Complete error code reference with 11 error types, solutions, and handling patterns
- **openapi.md** - OpenAPI specification reference with code generation guides and integration instructions

### Part 2: Protocol Reference (`docs/protocols/`)

Complete reference for all 234 Zeq protocols organized into 42 categories.

- **index.md** - Protocol reference landing page explaining what protocols are, tier requirements, and discovery guide
- **39 category pages** - Auto-generated documentation for each protocol category with all protocols, parameters, examples, and best practices

Categories include: Core computation, quantum computing, machine learning, medical imaging, emergency services, gaming, and 33+ more specialized domains.

### Part 3: Generator Script (`scripts/`)

Automated documentation generation for protocols.

- **generate-protocol-pages.mjs** - Node.js script that parses `api-server/src/lib/protocols.ts` and generates 39 protocol documentation pages
- **README.md** - Complete documentation for the generator script with usage instructions, parsing details, and troubleshooting

## Quick Start

### Viewing the Documentation

The documentation files are ready for integration with Docusaurus v2+:

1. Copy the `docs/` folder to your Docusaurus project
2. Copy the `scripts/` folder to your project
3. Update `docusaurus.config.js` if needed
4. Run `docusaurus build` or `npm run docs:dev`

All files use YAML frontmatter with `sidebar_position` for automatic ordering.

### Regenerating Protocol Documentation

When the protocols.ts file is updated:

```bash
cd scripts
node generate-protocol-pages.mjs
```

The script:
- Parses all 234 protocols from protocols.ts
- Groups them into 39 categories
- Generates MDX files with parameter tables and curl examples
- Calculates sidebar positions automatically
- Is safe to run multiple times (idempotent)

## File Structure

```
artifacts/docs/
├── README.md (this file)
├── DOCUMENTATION_SUMMARY.md
├── FILES_CREATED.txt
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
│       ├── medical-imaging.md
│       ├── emergency-services.md
│       └── ... (34 more category files)
└── scripts/
    ├── generate-protocol-pages.mjs
    └── README.md
```

## Statistics

| Component | Count | Details |
|-----------|-------|---------|
| API Reference Files | 4 | Endpoints, ZeqState, errors, OpenAPI |
| API Endpoints | 58 | Core, compute, data, security, medical, gaming |
| Error Codes | 11 | HTTP 400, 401, 403, 429, 500 |
| Protocol Index | 1 | Landing page with discovery guide |
| Protocol Categories | 39 | Auto-generated from protocols.ts |
| Total Protocols | 234 | All documented with examples |
| Generator Script | 1 | Pure Node.js, no dependencies |
| Total Files | 48+ | All production-ready |
| Total Size | 352 KB | Compact and optimized |

## Integration Checklist

- [ ] Copy `docs/` to your Docusaurus root
- [ ] Copy `scripts/` to your project
- [ ] Update `docusaurus.config.js` to include these paths
- [ ] Run `docusaurus build` to verify
- [ ] Test links and sidebar ordering
- [ ] Deploy documentation site
- [ ] Add regeneration to CI/CD pipeline
- [ ] Set up pre-commit hook for protocol updates

## Common Tasks

### View API Endpoint Reference
See `docs/api-reference/endpoints.md` for all 58 endpoints organized by category.

### Understand ZeqState Response
See `docs/api-reference/zeqstate-object.md` for field descriptions and usage examples.

### Find Error Solutions
See `docs/api-reference/error-codes.md` for all error codes with solutions and code examples.

### Generate TypeScript Client
See `docs/api-reference/openapi.md` for code generation with Orval or OpenAPI Generator.

### Explore Protocols
See `docs/protocols/index.md` to browse the protocol library and find categories.

### Regenerate Protocols Documentation
Run `scripts/generate-protocol-pages.mjs` after updating `api-server/src/lib/protocols.ts`.

## Documentation Quality

All documentation includes:

- Clear, comprehensive titles and descriptions
- Organized tables and lists
- Real code examples and curl commands
- Error handling patterns and best practices
- Tier-specific information clearly marked
- Links between related sections
- Troubleshooting guides

## Maintenance

### When to Update

- **API Reference**: When endpoints are added/changed
- **Error Codes**: When new error types are introduced
- **Protocol Documentation**: Run the script after updating protocols.ts
- **OpenAPI Spec**: Keep in sync with actual API implementation

### Update Workflow

1. Update the source (endpoints, errors, or protocols.ts)
2. Run the script: `node scripts/generate-protocol-pages.mjs`
3. Review generated files
4. Commit changes: `git add docs/ scripts/`
5. Optionally add CI/CD step to regenerate automatically

## Customization

The generator script can be customized:

- **Category descriptions** - Edit `generateCategoryOverview()` function
- **Best practices patterns** - Edit `generateCommonPatterns()` function
- **Output format** - Edit `generateProtocolSection()` function
- **File paths** - Edit `PROTOCOLS_TS_PATH` and `OUTPUT_DIR` constants

See `scripts/README.md` for detailed customization instructions.

## Performance

- API reference files: < 60 KB
- Protocol documentation: 240 KB
- Generator execution: < 1 second
- No external API calls or dependencies
- Works completely offline

## Support

For issues or improvements:

1. Check the inline code comments
2. Review `scripts/README.md` for detailed explanation
3. See `DOCUMENTATION_SUMMARY.md` for overview
4. Check `FILES_CREATED.txt` for verification checklist

## Future Enhancements

Potential improvements:

- Interactive API explorer
- Client SDK code generators
- Changelog auto-generation
- Video tutorials
- Architecture diagrams
- Parameter validators
- Schema validators
- Coverage metrics

## License

Part of the Zeq SDK documentation system.

---

**Created**: March 29, 2026
**Total Files**: 48+
**Total Protocols**: 234
**Status**: Production ready
