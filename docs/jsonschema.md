# JSON Schema Generator

Generates a [JSON Schema](https://json-schema.org/) (Draft 2020-12) document from your PostgreSQL database schema. The output is a language-agnostic JSON document that can be used for validation, documentation, or code generation in any language.

**Status:** Planned (not yet implemented)

## Usage

Save the generated output to a file (e.g., `database/schema.json`) in your project. JSON Schema is language-agnostic, so it can be used with any JSON Schema validator in any language.

### Validating data in JavaScript/TypeScript

```ts
import Ajv from "ajv";
import schema from "./database/schema.json";

const ajv = new Ajv();
const validate = ajv.compile(
  schema.properties.public.properties.Tables.properties.users.properties.Row
);

const valid = validate(row);
if (!valid) {
  console.error(validate.errors);
}
```

### Validating data in Python

```python
import json
from jsonschema import validate

with open("database/schema.json") as f:
    schema = json.load(f)

row_schema = schema["properties"]["public"]["properties"]["Tables"] \
    ["properties"]["users"]["properties"]["Row"]

validate(instance=row_data, schema=row_schema)
```

### Generating types from JSON Schema

JSON Schema can be used as an input to code generators for languages that don't have a dedicated generator:

```bash
# Generate TypeScript types from JSON Schema
npx json-schema-to-typescript database/schema.json > types.ts

# Generate Rust types
typify database/schema.json > types.rs
```

### API documentation

The schema can be embedded in OpenAPI specs or used to document your database structure:

```yaml
# openapi.yaml
components:
  schemas:
    User:
      $ref: "database/schema.json#/properties/public/properties/Tables/properties/users/properties/Row"
```

## Endpoint

```
GET /generators/jsonschema
```

## Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `included_schemas` | string | — | Comma-separated list of schemas to include |
| `excluded_schemas` | string | — | Comma-separated list of schemas to exclude |
| `db_driver_type` | string | `direct` | `direct` or `postgrest` — controls type mappings for driver-sensitive types (see [Driver modes](#driver-modes)) |

## CLI usage

```bash
# Using the dev server (npm run dev must be running)
npm run gen:types:jsonschema

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:jsonschema
```

## Output structure

The output is a JSON object with a top-level property per database schema. Each schema contains `Tables`, `Views`, `Enums`, `CompositeTypes`, and `Functions`. Enums and composite types are defined in `$defs` and referenced via `$ref`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "public": {
      "type": "object",
      "properties": {
        "Tables": {
          "type": "object",
          "properties": {
            "users": {
              "type": "object",
              "properties": {
                "Row": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "integer" },
                    "name": { "type": "string" },
                    "status": { "$ref": "#/$defs/public.user_status" }
                  },
                  "required": ["id", "name", "status"]
                },
                "Insert": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "integer" },
                    "name": { "type": "string" },
                    "status": { "$ref": "#/$defs/public.user_status" }
                  },
                  "required": ["name"]
                },
                "Update": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "integer" },
                    "name": { "type": "string" },
                    "status": { "$ref": "#/$defs/public.user_status" }
                  }
                }
              }
            }
          }
        },
        "Views": { ... },
        "Enums": {
          "type": "object",
          "properties": {
            "user_status": { "$ref": "#/$defs/public.user_status" }
          }
        },
        "CompositeTypes": { ... },
        "Functions": { ... }
      }
    }
  },
  "$defs": {
    "public.user_status": {
      "type": "string",
      "enum": ["active", "inactive"]
    }
  }
}
```

Each table produces three sub-schemas:

- **Row** — All columns in `required`.
- **Insert** — Only columns without defaults in `required`.
- **Update** — No `required` array (all columns optional).

Views and materialized views produce a Row schema only.

## Driver modes

The `db_driver_type` parameter controls how certain types are represented. JSON Schema is language-agnostic, so the differences are minimal.

### `direct` (default)

| PostgreSQL type | JSON Schema |
|---|---|
| `int8` | `{ "type": "integer" }` |

### `postgrest`

| PostgreSQL type | JSON Schema |
|---|---|
| `int8` | `{ "type": "string" }` (PostgREST serializes bigints as strings) |

Timestamps and dates use `"format": "date-time"` / `"format": "date"` in both modes. JSON Schema `format` is a hint — the consumer decides how to interpret the value.

## Type mapping

| PostgreSQL type | JSON Schema |
|---|---|
| `bool` | `{ "type": "boolean" }` |
| `int2`, `int4` | `{ "type": "integer" }` |
| `float4`, `float8`, `numeric` | `{ "type": "number" }` |
| `text`, `varchar`, `char`, `name`, `bpchar` | `{ "type": "string" }` |
| `uuid` | `{ "type": "string", "format": "uuid" }` |
| `json`, `jsonb` | `{}` (any value) |
| `timestamp`, `timestamptz` | `{ "type": "string", "format": "date-time" }` |
| `date` | `{ "type": "string", "format": "date" }` |
| `time`, `timetz` | `{ "type": "string", "format": "time" }` |
| `bytea` | `{ "type": "string" }` |
| `inet`, `cidr` | `{ "type": "string" }` |
| Range types | `{ "type": "string" }` |
| `void` | `{ "type": "null" }` |
| `record` | `{ "type": "object" }` |
| Array types | `{ "type": "array", "items": innerSchema }` |
| Enum types | `{ "$ref": "#/$defs/schema.enum_name" }` |
| Composite types | `{ "$ref": "#/$defs/schema.composite_name" }` |
| Unknown/unmapped | `{}` |

Nullable columns are wrapped with `{ "oneOf": [typeSchema, { "type": "null" }] }`.

## Features

- Targets JSON Schema Draft 2020-12 (the current stable specification)
- `$defs` and `$ref` for reusable enum and composite type definitions
- `required` arrays reflect column defaults and identity columns
- Driver-aware type mappings (`direct` vs `postgrest`)
- No external dependencies — output is plain JSON
