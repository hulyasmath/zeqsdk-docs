---
sidebar_position: 4
title: OpenAPI Specification
---

# OpenAPI Specification

The Zeq SDK publishes a complete OpenAPI 3.0 specification that documents all available endpoints, request/response schemas, authentication methods, and error codes.

## Accessing the Specification

The full OpenAPI specification is available at:

```
GET https://api.zeq.io/api/openapi.yaml
```

You can also access it via the web:
- **Interactive Documentation:** https://docs.zeq.io/api/openapi
- **Raw YAML:** https://api.zeq.io/api/openapi.yaml
- **JSON Format:** https://api.zeq.io/api/openapi.json

## Using the Specification

### View in Swagger UI

Swagger UI is an interactive documentation tool that lets you explore and test endpoints directly in your browser:

```
https://api.zeq.io/swagger/
```

From there you can:
- Browse all endpoints organized by category
- Read detailed parameter and response documentation
- Try out endpoints with your API key
- See curl examples and other code samples

### View in ReDoc

ReDoc provides another interactive documentation interface with a responsive design:

```
https://api.zeq.io/redoc/
```

## Code Generation

Generate strongly-typed client libraries in your preferred language directly from the OpenAPI spec.

### Using Orval (Recommended for TypeScript/JavaScript)

**Installation:**
```bash
npm install --save-dev @orval/cli
```

**Configuration (orval.config.ts):**
```typescript
import { defineConfig } from '@orval/cli';

export default defineConfig({
  zeq: {
    input: {
      target: 'https://api.zeq.io/api/openapi.yaml',
    },
    output: {
      target: './src/lib/api/generated.ts',
      client: 'fetch',
      mode: 'single',
      override: {
        mutator: {
          path: './src/lib/api/custom-request.ts',
          name: 'customRequest',
        },
      },
    },
  },
});
```

**Custom Request Handler (src/lib/api/custom-request.ts):**
```typescript
import type { AxiosRequestConfig } from 'axios';

export const customRequest = async (
  config: AxiosRequestConfig
): Promise<any> => {
  const apiKey = process.env.REACT_APP_ZEQ_API_KEY;

  return fetch(config.url || '', {
    method: config.method,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${apiKey}`,
    },
    body: config.data ? JSON.stringify(config.data) : undefined,
  }).then(res => res.json());
};
```

**Generate:**
```bash
npx orval
```

### Using OpenAPI Generator

**Installation:**
```bash
npm install --save-dev @openapitools/openapi-generator-cli
```

**Generate TypeScript Client:**
```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://api.zeq.io/api/openapi.yaml \
  -g typescript-fetch \
  -o ./src/lib/api/generated
```

**Generate JavaScript Client:**
```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://api.zeq.io/api/openapi.yaml \
  -g javascript \
  -o ./src/lib/api/generated
```

**Generate Python Client:**
```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://api.zeq.io/api/openapi.yaml \
  -g python \
  -o ./generated/zeq_sdk
```

### Using Swagger Codegen (Legacy)

For other languages, use the official Swagger Codegen:

```bash
swagger-codegen generate \
  -i https://api.zeq.io/api/openapi.yaml \
  -l go \
  -o ./zeq-sdk
```

Available languages: `go`, `rust`, `java`, `csharp`, `php`, `ruby`, `python`, `swift`, and many more.

## Monorepo Package

The Zeq monorepo includes a pre-generated API specification package:

**Location:** `lib/api-spec`

**Contents:**
- `lib/api-spec/openapi.yaml` - Full OpenAPI specification
- `lib/api-spec/types/` - TypeScript types generated from spec
- `lib/api-spec/client/` - Pre-configured fetch client

**Usage:**

```typescript
import { ZeqAPIClient } from '@zeq/api-spec/client';

const client = new ZeqAPIClient({
  apiKey: process.env.ZEQ_API_KEY,
  baseUrl: 'https://api.zeq.io',
});

// Strongly typed
const result = await client.zeq.pulse({
  domain: 'quantum_simulation',
  operators: ['OP_VECTOR_TRANSFORM'],
});

console.log(result.masterSum);
```

### Updating the Package

When the API schema changes, regenerate the types:

```bash
cd lib/api-spec
npm run generate
```

## Specification Structure

The OpenAPI spec includes:

### Paths (Endpoints)
- 40+ endpoints across 10 categories
- Each with full request/response documentation
- Query parameters, path parameters, request bodies
- Status codes and error responses

### Schemas (Request/Response Objects)
- `ZeqState` - Standard computation response
- `Computation` - Computation request object
- `Protocol` - Protocol registry schema
- And 50+ more domain objects

### Security Schemes
- `Bearer Token` - API key authentication
- `ApiKeyQuery` - Optional query parameter authentication

### Server Definitions
- Production: `https://api.zeq.io`
- Sandbox: `https://sandbox.zeq.io` (for testing)
- Custom: Configure your own endpoint

## Common OpenAPI Tools

| Tool | Purpose | Link |
|------|---------|------|
| **Swagger UI** | Interactive API explorer | https://api.zeq.io/swagger/ |
| **ReDoc** | Clean API documentation | https://api.zeq.io/redoc/ |
| **Orval** | TypeScript client generation | https://orval.dev |
| **OpenAPI Generator** | Multi-language client generation | https://openapi-generator.tech |
| **Insomnia** | REST client with OpenAPI support | https://insomnia.rest |
| **Postman** | API testing with OpenAPI import | https://postman.com |

## Example: Generating and Using a TypeScript Client

**Step 1: Install dependencies**
```bash
npm install --save-dev @orval/cli
npm install axios
```

**Step 2: Create orval config**
```bash
cat > orval.config.ts << 'EOF'
import { defineConfig } from '@orval/cli';

export default defineConfig({
  zeq: {
    input: {
      target: 'https://api.zeq.io/api/openapi.yaml',
    },
    output: {
      target: './src/api/generated.ts',
      client: 'fetch',
    },
  },
});
EOF
```

**Step 3: Generate client**
```bash
npx orval
```

**Step 4: Use the generated client**
```typescript
import { zeqClient } from './api/generated';

const response = await zeqClient.post('/api/zeq/pulse', {
  domain: 'quantum_simulation',
  operators: ['OP_VECTOR_TRANSFORM'],
});

console.log(response.masterSum);
```

## Schema Validation

You can validate your requests and responses against the schema:

**JavaScript:**
```javascript
import Ajv from 'ajv';
import { readFileSync } from 'fs';

const ajv = new Ajv();
const spec = JSON.parse(readFileSync('./openapi.json', 'utf8'));

// Compile a schema
const zeqStateSchema = spec.components.schemas.ZeqState;
const validateZeqState = ajv.compile(zeqStateSchema);

const isValid = validateZeqState(responseData);
if (!isValid) {
  console.error('Validation errors:', validateZeqState.errors);
}
```

## API Versioning

The current OpenAPI version is **3.0.3**. Future versions will:
- Maintain backward compatibility with existing endpoints
- Add new endpoints in a `v2` namespace if breaking changes are needed
- Use `x-api-version` header for version negotiation

## Keeping Up To Date

Subscribe to schema changes:

```bash
# Get notified when the spec updates
curl -X POST https://api.zeq.io/webhooks/subscribe \
  -H "Authorization: Bearer $ZEQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "openapi.updated",
    "webhook_url": "https://your-app.com/webhooks/openapi"
  }'
```

## Troubleshooting

**"Schema validation failed"**
- Ensure you're using the latest version of the spec
- Check that your request matches the exact schema format
- Run: `curl https://api.zeq.io/api/openapi.yaml | jq .`

**"Generated client doesn't match actual API"**
- Make sure you fetched the latest spec: `npm run generate`
- Check your API key hasn't been revoked
- Verify you're hitting the correct endpoint URL

**"Code generation tool fails"**
- Update your generator to the latest version
- Try a different language/framework
- Report the issue to the tool's issue tracker

## Additional Resources

- **API Documentation:** https://docs.zeq.io
- **Code Examples:** https://github.com/zeq-os/examples
- **OpenAPI Guide:** https://spec.openapis.org/oas/v3.0.3
- **Community Forum:** https://community.zeq.io
