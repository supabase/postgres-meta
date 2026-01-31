# Plan: Add Zod Type Generator & JSON Schema Generator

## Overview

The `postgres-meta` project has an established pattern for type generators. Each language has a route handler, a template, and tests, plus registration in shared files. We'll follow this exact pattern to add two new generators:

1. **Zod** — Generates TypeScript code using the `zod` library for runtime validation (unlike the existing TypeScript generator which only produces static types).
2. **JSON Schema** — Generates a language-agnostic [JSON Schema](https://json-schema.org/) (Draft 2020-12) document describing the database schema.

Both generators consume the existing `GeneratorMetadata` type from `src/lib/generators.ts` — no changes to the core introspection layer are needed.

---

## 1. Zod Type Generator

### What it produces

TypeScript source code that imports from `zod` and exports schema objects for every table, view, enum, composite type, and function in the database.

Example output (`db_driver_type=direct`, the default):

```ts
import { z } from "zod";

export const userStatusSchema = z.enum(["active", "inactive"]);

export const usersRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  status: userStatusSchema,
  created_at: z.coerce.date(),  // Date object in direct mode
  metadata: z.unknown().nullable(),
});

export const usersInsertSchema = z.object({
  id: z.number().int().optional(),        // has default (identity)
  name: z.string(),
  email: z.string(),
  status: userStatusSchema.optional(),     // has default
  created_at: z.coerce.date().optional(),
  metadata: z.unknown().nullable().optional(),
});

export const usersUpdateSchema = usersRowSchema.partial();
```

With `db_driver_type=postgrest`, `created_at` would instead be `z.string().datetime()` (since PostgREST serializes timestamps as ISO strings).

### Type mapping (`PG_TYPE_TO_ZOD_MAP`)

These generators support two output modes, controlled by a `db_driver_type` query parameter:

- **`direct`** (default) — Types reflect what a direct PostgreSQL driver like `node-postgres` returns (e.g., timestamps as `Date`, `int8` as `string` by default in pg).
- **`postgrest`** — Types reflect PostgREST serialization behavior (e.g., timestamps and dates are returned as strings, `int8` as string).

The base type map is shared; only the types that differ between modes are listed below.

#### Base types (same in both modes)

| PostgreSQL type | Zod validator |
|---|---|
| `bool` | `z.boolean()` |
| `int2`, `int4` | `z.number().int()` |
| `float4`, `float8`, `numeric` | `z.number()` |
| `text`, `varchar`, `char`, `name`, `bpchar` | `z.string()` |
| `uuid` | `z.string().uuid()` |
| `json`, `jsonb` | `z.unknown()` |
| `time`, `timetz` | `z.string()` |
| `bytea` | `z.string()` |
| `inet`, `cidr` | `z.string()` |
| `macaddr`, `macaddr8` | `z.string()` |
| `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange` | `z.string()` |
| `void` | `z.void()` |
| `record` | `z.record(z.unknown())` |
| Array types (prefix `_`) | `z.array(innerSchema)` |
| Enum types | Reference to generated enum schema |
| Composite types | Reference to generated composite schema |
| Unknown/unmapped | `z.unknown()` |

#### Types that differ by mode

| PostgreSQL type | `postgrest` mode | `direct` mode |
|---|---|---|
| `int8` | `z.string()` (PostgREST returns bigints as strings) | `z.string()` (node-postgres also returns bigint as string by default) |
| `timestamptz`, `timestamp` | `z.string().datetime()` | `z.coerce.date()` |
| `date` | `z.string().date()` | `z.coerce.date()` |

**Nullable handling:** Append `.nullable()` when the column is nullable.

**Insert schemas:** Columns with defaults or identity columns get `.optional()`.

**Update schemas:** All fields are `.partial()`.

### Generation structure

Per schema, generate:

1. Enum schemas (`z.enum([...])`)
2. Composite type schemas (`z.object({...})`)
3. Table Row / Insert / Update schemas
4. View Row schemas (Insert/Update only if the view is updatable)
5. Materialized view Row schemas
6. Function input/output schemas

Use `prettier` for formatting (same as the existing TypeScript generator).

### Query parameters

| Parameter | Description |
|---|---|
| `included_schemas` | Comma-separated schema whitelist |
| `excluded_schemas` | Comma-separated schema blacklist |
| `db_driver_type` | `direct` (default) or `postgrest` — controls type mappings for driver-sensitive types |

### Files

| Action | File |
|---|---|
| **Create** | `src/server/templates/zod.ts` |
| **Create** | `src/server/routes/generators/zod.ts` |
| Modify | `src/server/routes/index.ts` — register route |
| Modify | `src/server/server.ts` — add CLI case |
| Modify | `package.json` — add `gen:types:zod` script |
| Modify | `test/server/typegen.ts` — add snapshot tests |

---

## 2. JSON Schema Generator

### What it produces

A JSON document conforming to JSON Schema Draft 2020-12, describing every table, view, enum, composite type, and function in the database.

Example output:

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
        "Views": { "..." : "..." },
        "Enums": {
          "type": "object",
          "properties": {
            "user_status": { "$ref": "#/$defs/public.user_status" }
          }
        },
        "CompositeTypes": { "..." : "..." },
        "Functions": { "..." : "..." }
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

### Type mapping (`PG_TYPE_TO_JSON_SCHEMA_MAP`)

Like the Zod generator, the JSON Schema generator supports a `db_driver_type` query parameter (`direct` or `postgrest`). JSON Schema is language-agnostic, so the differences are smaller — mainly around whether `int8` is represented as a string or integer.

#### Base types (same in both modes)

| PostgreSQL type | JSON Schema |
|---|---|
| `bool` | `{ "type": "boolean" }` |
| `int2`, `int4` | `{ "type": "integer" }` |
| `float4`, `float8`, `numeric` | `{ "type": "number" }` |
| `text`, `varchar`, `char`, `name`, `bpchar` | `{ "type": "string" }` |
| `uuid` | `{ "type": "string", "format": "uuid" }` |
| `json`, `jsonb` | `{}` (any value) |
| `timestamptz`, `timestamp` | `{ "type": "string", "format": "date-time" }` |
| `date` | `{ "type": "string", "format": "date" }` |
| `time`, `timetz` | `{ "type": "string", "format": "time" }` |
| `bytea` | `{ "type": "string" }` |
| `inet`, `cidr` | `{ "type": "string" }` |
| Range types | `{ "type": "string" }` |
| `void` | `{ "type": "null" }` |
| `record` | `{ "type": "object" }` |
| Array types (prefix `_`) | `{ "type": "array", "items": innerSchema }` |
| Enum types | `{ "$ref": "#/$defs/schema.enum_name" }` |
| Composite types | `{ "$ref": "#/$defs/schema.composite_name" }` |
| Unknown/unmapped | `{}` |

#### Types that differ by mode

| PostgreSQL type | `postgrest` mode | `direct` mode |
|---|---|---|
| `int8` | `{ "type": "string" }` (PostgREST serializes bigints as strings) | `{ "type": "integer" }` |

Note: `timestamp`/`date` use `"format": "date-time"` / `"format": "date"` in both modes. JSON Schema `format` is a hint, not a type constraint — the consumer decides whether to interpret the value as a string or a Date object.

**Nullable handling:** Wrap with `{ "oneOf": [typeSchema, { "type": "null" }] }`

**Insert schemas:** Only columns without defaults go in `required`.

**Update schemas:** Empty `required` array (all fields optional).

### Generation structure

The top-level JSON object has:
- `$schema` — the JSON Schema draft URI
- `type: "object"` with a property per database schema
- Each schema property contains `Tables`, `Views`, `Enums`, `CompositeTypes`, `Functions`
- `$defs` — shared definitions for enums and composite types (referenced via `$ref`)

Output is `JSON.stringify(schema, null, 2)` — no external formatter needed.

### Query parameters

| Parameter | Description |
|---|---|
| `included_schemas` | Comma-separated schema whitelist |
| `excluded_schemas` | Comma-separated schema blacklist |
| `db_driver_type` | `direct` (default) or `postgrest` — controls type mappings for driver-sensitive types |

### Files

| Action | File |
|---|---|
| **Create** | `src/server/templates/jsonschema.ts` |
| **Create** | `src/server/routes/generators/jsonschema.ts` |
| Modify | `src/server/routes/index.ts` — register route |
| Modify | `src/server/server.ts` — add CLI case |
| Modify | `package.json` — add `gen:types:jsonschema` script |
| Modify | `test/server/typegen.ts` — add snapshot tests |

---

## 3. Shared modifications summary

### `src/server/routes/index.ts`

```ts
import ZodTypeGenRoute from './generators/zod.js'
import JsonSchemaTypeGenRoute from './generators/jsonschema.js'

// inside registration:
fastify.register(ZodTypeGenRoute, { prefix: '/generators/zod' })
fastify.register(JsonSchemaTypeGenRoute, { prefix: '/generators/jsonschema' })
```

### `src/server/server.ts`

Add two new template imports and two new cases in the `getTypeOutput()` switch:

```ts
case 'zod':
  return applyZodTemplate({ ...generatorMeta })
case 'jsonschema':
  return applyJsonSchemaTemplate({ ...generatorMeta })
```

### `package.json`

```json
"gen:types:zod": "PG_META_GENERATE_TYPES=zod ...",
"gen:types:jsonschema": "PG_META_GENERATE_TYPES=jsonschema ..."
```

---

## 4. Testing

Add to `test/server/typegen.ts`:

- **`test('typegen: zod')`** — Inline snapshot test validating Zod output for the test database (enums, tables, views, composite types, functions, nullable fields, arrays, identity columns, defaults).
- **`test('typegen: jsonschema')`** — Inline snapshot test validating JSON Schema output structure, `$defs`, `$ref` usage, `required` arrays, and nullable handling.

Both tests use the same `app.inject()` pattern as existing tests.

---

## 5. Implementation order

| Step | Task | Depends on |
|---|---|---|
| 1 | Create `src/server/templates/zod.ts` | — |
| 2 | Create `src/server/routes/generators/zod.ts` | Step 1 |
| 3 | Create `src/server/templates/jsonschema.ts` | — |
| 4 | Create `src/server/routes/generators/jsonschema.ts` | Step 3 |
| 5 | Modify `src/server/routes/index.ts` (register both routes) | Steps 2, 4 |
| 6 | Modify `src/server/server.ts` (add CLI support) | Steps 1, 3 |
| 7 | Modify `package.json` (add npm scripts) | — |
| 8 | Add tests to `test/server/typegen.ts` | Steps 1–6 |
| 9 | Run `tsc` type check, fix any issues | Steps 1–7 |
| 10 | Run tests, update snapshots | Step 8 |

---

## 6. Design decisions

- **No new dependencies.** Zod output is plain TypeScript source code — users install `zod` themselves. JSON Schema is a plain JSON object built with standard library.
- **Reuse `GeneratorMetadata` as-is.** Both generators consume the same metadata interface, requiring zero changes to `src/lib/generators.ts`.
- **Follow existing patterns exactly.** Route handler structure, template `apply()` signature, error handling, and test approach all mirror existing generators.
- **Driver-aware type modes.** Both generators accept a `db_driver_type` query parameter (`direct` or `postgrest`). The default is `direct`, producing types that match what a standard PostgreSQL driver returns (e.g., `Date` for timestamps). Users going through PostgREST can pass `db_driver_type=postgrest` to get string-based types matching PostgREST's JSON serialization. This avoids forcing a single serialization assumption on all users.
- **JSON Schema uses `$ref` for reusability.** Enums and composite types are placed in `$defs` and referenced via `$ref`, keeping the output DRY and composable.
