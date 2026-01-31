# TypeScript Type Generator

Generates TypeScript type definitions from your PostgreSQL database schema. The output produces a single `Database` type containing all schemas, tables, views, functions, enums, and composite types. While designed to work with the [Supabase client libraries](https://github.com/supabase/supabase-js), the generated types are framework-agnostic and can be used with any TypeScript project that interacts with PostgreSQL.

## Endpoint

```
GET /generators/typescript
```

## Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `included_schemas` | string | — | Comma-separated list of schemas to include |
| `excluded_schemas` | string | — | Comma-separated list of schemas to exclude |
| `detect_one_to_one_relationships` | string | `false` | Set to `true` to detect and annotate one-to-one relationships |
| `postgrest_version` | string | — | PostgREST version string for version-specific type output |

## CLI usage

```bash
# Using the dev server (npm run dev must be running)
npm run gen:types:typescript

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:typescript

# With options
PG_META_GENERATE_TYPES=typescript \
PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS=public,auth \
PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS=true \
node --loader ts-node/esm src/server/server.ts
```

## Environment variables

| Variable | Description |
|---|---|
| `PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS` | Comma-separated list of schemas to include |
| `PG_META_GENERATE_TYPES_DEFAULT_SCHEMA` | Default schema (defaults to `public`) |
| `PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS` | Set to `true` to detect one-to-one relationships |
| `PG_META_POSTGREST_VERSION` | PostgREST version string |

## Output structure

The generator produces a single `Database` type with nested schemas:

```ts
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: number       // optional (has default)
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          created_at?: string
        }
        Relationships: [...]
      }
    }
    Views: { ... }
    Functions: { ... }
    Enums: { ... }
    CompositeTypes: { ... }
  }
}
```

Each table produces three sub-types:

- **Row** — The shape of a row returned from a `SELECT`.
- **Insert** — The shape accepted by `INSERT`. Columns with defaults or identity columns are optional.
- **Update** — The shape accepted by `UPDATE`. All columns are optional.

Views and materialized views produce a `Row` type only (unless the view is updatable).

## Type mapping

| PostgreSQL type | TypeScript type |
|---|---|
| `bool` | `boolean` |
| `int2`, `int4`, `float4`, `float8`, `numeric` | `number` |
| `int8` | `number` |
| `text`, `varchar`, `char`, `bpchar`, `citext`, `name` | `string` |
| `uuid` | `string` |
| `date`, `time`, `timetz`, `timestamp`, `timestamptz` | `string` |
| `json`, `jsonb` | `Json` |
| `bytea` | `string` |
| `void` | `undefined` |
| `record` | `Record<string, unknown>` |
| Array types | `T[]` (where T is the element type) |
| Enum types | Union of string literals |
| Composite types | Object type with typed fields |

Nullable columns produce `T \| null`.

## Features

- Helper utility types: `Tables`, `TablesInsert`, `TablesUpdate`, `Enums`, `CompositeTypes`
- Constants object with enum values for runtime use
- One-to-one relationship detection (opt-in)
- PostgREST version-aware output
- Formatted with Prettier
