# Protocol Documentation Generator

This directory contains scripts for automatically generating Zeq SDK documentation.

## generate-protocol-pages.mjs

Generates MDX documentation pages for all 234 Zeq protocols from the TypeScript protocol registry.

### Purpose

The script parses `../../api-server/src/lib/protocols.ts` and generates a separate MDX file for each protocol category. This ensures documentation stays synchronized with the actual API protocol definitions.

### Usage

```bash
# Generate all protocol pages
node generate-protocol-pages.mjs

# Output: Generates MDX files in ../docs/protocols/
#   - core.md, compute.md, security.md, etc.
#   - One file per protocol category
#   - Each page lists all protocols in that category
```

### Features

- **Automated parsing** - Reads raw TypeScript protocol definitions
- **No dependencies** - Pure Node.js, no additional packages needed
- **Idempotent** - Safe to run multiple times, overwrites previous output
- **Robust parsing** - Handles complex TypeScript object syntax and multiline fields
- **Organized output** - Categories sorted alphabetically, sidebar positions auto-numbered
- **Rich formatting** - Generates parameter tables, curl examples, tier badges

### Output Structure

Each generated file includes:

```markdown
---
sidebar_position: N
title: Category Name
description: Category protocols and algorithms
---

# Category Name

## Overview
[Category description]

## Protocols (count)

### Protocol Name
- Protocol ID, version, endpoint, method
- Description
- Parameters table
- Return type
- Example curl command

## Common Patterns
[Best practices for this category]
```

### Configuration

Paths can be customized in the script header:

```javascript
const PROTOCOLS_TS_PATH = path.resolve(
  __dirname,
  '../../api-server/src/lib/protocols.ts'
);

const OUTPUT_DIR = path.resolve(
  __dirname,
  '../docs/protocols'
);
```

### Example Output

Run the script and check the generated files:

```bash
ls -la ../docs/protocols/
# core.md
# compute.md
# security.md
# ... 36 more category files
```

View one of the generated files:

```bash
head -50 ../docs/protocols/quantum-computing.md
```

### Protocol Format

The script expects protocols to be defined as JavaScript objects in an array:

```typescript
export const PROTOCOLS: ProtocolDef[] = [
  {
    id: "zeq-compute",
    name: "ZeqCompute",
    version: "1.0",
    category: "compute",
    description: "Core computation...",
    endpoint: "/api/zeq/compute",
    method: "POST",
    auth: "api-key",
    rateLimit: "60/min",
    params: [
      { name: "domain", type: "string", required: false, description: "..." }
    ],
    returns: "{ zeqState, result, meta, zeqProof }"
  },
  // ... more protocols
]
```

### Parsing Details

The parser:

1. **Finds the PROTOCOLS array** - Locates `export const PROTOCOLS: ProtocolDef[]`
2. **Extracts category headers** - Reads comments like `// 1. CORE — HulyaPulse heartbeat`
3. **Parses protocol objects** - Uses regex to extract all fields
4. **Groups by category** - Organizes protocols into category maps
5. **Generates MDX** - Creates formatted markdown for each category
6. **Writes files** - Saves to `docs/protocols/{category-slug}.md`

### Category Name Slugification

Categories are converted to filenames using:
- Lowercase
- Replace spaces/special chars with hyphens
- Remove leading/trailing hyphens

Examples:
- "Core Computation" → `core-computation.md`
- "Medical Imaging" → `medical-imaging.md`
- "911 Services" → `911-services.md`

### Sidebar Positioning

The `sidebar_position` is auto-calculated:
- index.md: position 1
- First category (alphabetically): position 2
- Second category: position 3
- ... and so on

This ensures proper ordering in the sidebar navigation.

### Parameter Tables

The script generates tables with:
- Parameter name
- Type (string, number, object, array, boolean)
- Required (Yes/No)
- Description

### Examples

Each protocol includes a curl example:

```bash
curl -X POST \
  https://api.zeq.io/api/zeq/compute \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example_domain"
  }'
```

### Error Handling

The script prints progress and any errors:

```
Zeq Protocol Page Generator
===================================

Reading /path/to/protocols.ts
File read successfully

Parsing protocol definitions...
Found 39 categories with 234 total protocols

Generating MDX files...
Generated core.md
Generated compute.md
... 37 more ...

Complete!
Generated 39 protocol category pages
Total protocols documented: 234
Output directory: /path/to/docs/protocols
```

### Integration with Docusaurus

These generated files integrate directly with Docusaurus:

```javascript
// docusaurus.config.js
export default {
  docs: {
    path: 'docs',
    routeBasePath: '/',
    sidebarPath: require.resolve('./sidebars.js'),
  }
};
```

The `sidebar_position` frontmatter in each file controls order in the sidebar.

### Regenerating After Updates

When protocols.ts is updated:

```bash
# Regenerate all documentation
npm run build:protocols

# Or directly:
node scripts/generate-protocol-pages.mjs

# Commit the changes
git add docs/protocols/*.md
git commit -m "Regenerate protocol documentation"
```

### Troubleshooting

**"No protocols found"**
- Check the path to protocols.ts is correct
- Verify the file contains `export const PROTOCOLS: ProtocolDef[]`
- Run with the correct working directory

**"Truncated descriptions or parameters"**
- The parser may be cutting off long multiline values
- Check the raw file for escaped quotes or special characters
- Edit the protocol definition to use shorter descriptions

**"Files not being generated"**
- Ensure the output directory exists: `mkdir -p docs/protocols`
- Check file permissions and disk space
- Look for error messages in the console output

### Performance

- Parsing: ~100ms (depends on file size)
- Generation: ~500ms (39 files)
- Total time: < 1 second

The script is fast enough to run as a pre-commit hook or build step.

### Future Enhancements

Potential improvements:

- JSON/YAML schema validation for protocols
- Type checking against ProtocolDef interface
- Diff generation (show what changed)
- Changelog integration (auto-detect new/updated protocols)
- OpenAPI spec generation from protocols
- Client SDK code generation

### Support

For issues or improvements:
- Check the inline code comments in generate-protocol-pages.mjs
- Run with `DEBUG=*` environment variable for verbose output
- Review the PROTOCOLS_TS_PATH to ensure it's correct

### License

Part of the Zeq SDK documentation system.
