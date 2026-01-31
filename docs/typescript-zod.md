# TypeScript Zod Type Generator

Generates [Zod](https://zod.dev/) schema definitions from your PostgreSQL database schema. Unlike the [TypeScript generator](typescript.md) which produces static types only, this generator produces runtime validation schemas that can parse and validate data at runtime.

**Status:** Planned (not yet implemented)

## Usage

Save the generated output to a file (e.g., `database/zod.ts`) in your project, then import schemas to validate data at runtime.

### Validating query results

```ts
import { schemas } from "@/database/zod";

const { Row: UserRow } = schemas.public.Tables.users;

// Parse validates and returns typed data — throws on invalid input
const user = UserRow.parse(row);
//    ^ typed as { id: number; name: string; email: string; ... }

// safeParse returns a result object instead of throwing
const result = UserRow.safeParse(row);
if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.issues);
}
```

### Validating data before inserting

```ts
import { schemas } from "@/database/zod";

const { Insert: UserInsert } = schemas.public.Tables.users;

// Validate user input before sending to the database
const newUser = UserInsert.parse({
  name: "Alice",
  email: "alice@example.com",
  // id, status, created_at are optional (have defaults)
});
```

### Validating API request bodies

```ts
import { schemas } from "@/database/zod";

const { Update: UserUpdate } = schemas.public.Tables.users;

app.patch("/users/:id", (req, res) => {
  // All fields are optional for updates — rejects unknown fields
  const body = UserUpdate.parse(req.body);
  // ...update the database with validated data
});
```

### Deriving static types from schemas

You don't need both the TypeScript generator and the Zod generator. Zod schemas can produce static types directly:

```ts
import { z } from "zod";
import { schemas } from "@/database/zod";

type UserRow = z.infer<typeof schemas.public.Tables.users.Row>;
//   ^ { id: number; name: string; email: string; status: ...; ... }

type UserInsert = z.infer<typeof schemas.public.Tables.users.Insert>;
//   ^ { name: string; email: string; id?: number; status?: ...; ... }
```

## Endpoint

```
GET /generators/typescript-zod
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
npm run gen:types:typescript-zod

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:typescript-zod
```

## Output structure

Schemas are nested under per-schema namespace objects to avoid name collisions when the same table name exists in multiple schemas (e.g., `public.users` and `auth.users`). This mirrors the structure of the TypeScript generator's `Database` type.

```ts
import { z } from "zod";

const userStatusSchema = z.enum(["active", "inactive"]);

const usersRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  status: userStatusSchema,
  created_at: z.coerce.date(),
  metadata: z.unknown().nullable(),
});

const usersInsertSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  status: userStatusSchema.optional(),
  created_at: z.coerce.date().optional(),
  metadata: z.unknown().nullable().optional(),
});

const usersUpdateSchema = usersRowSchema.partial();

export const schemas = {
  public: {
    Tables: {
      users: {
        Row: usersRowSchema,
        Insert: usersInsertSchema,
        Update: usersUpdateSchema,
      },
    },
    Views: {},
    Enums: {
      user_status: userStatusSchema,
    },
    CompositeTypes: {},
    Functions: {},
  },
};
```

Access schemas via `schemas.public.Tables.users.Row`.

Each table produces three schemas:

- **Row** — Validates data returned from a `SELECT`.
- **Insert** — Columns with defaults or identity columns are `.optional()`.
- **Update** — All fields are `.partial()` (all optional).

Views and materialized views produce a Row schema only (unless the view is updatable).

## Driver modes

The `db_driver_type` parameter controls how driver-sensitive types are mapped. This matters because PostgREST and direct PostgreSQL drivers return different runtime types for certain columns.

### `direct` (default)

Types reflect what a direct PostgreSQL driver like `node-postgres` returns:

| PostgreSQL type | Zod validator |
|---|---|
| `timestamp`, `timestamptz` | `z.coerce.date()` |
| `date` | `z.coerce.date()` |
| `int8` | `z.string()` (node-postgres returns bigint as string by default) |

### `postgrest`

Types reflect PostgREST JSON serialization:

| PostgreSQL type | Zod validator |
|---|---|
| `timestamp`, `timestamptz` | `z.string().datetime()` |
| `date` | `z.string().date()` |
| `int8` | `z.string()` |

## Type mapping

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
| Range types | `z.string()` |
| `void` | `z.void()` |
| `record` | `z.record(z.unknown())` |
| Array types | `z.array(innerSchema)` |
| Enum types | `z.enum(["val1", "val2"])` |
| Composite types | `z.object({ ... })` |
| Unknown/unmapped | `z.unknown()` |

Nullable columns append `.nullable()`. Insert schemas append `.optional()` for columns with defaults.

## Features

- Runtime validation schemas (not just static types)
- Schema namespacing to handle cross-schema table name collisions
- Driver-aware type mappings (`direct` vs `postgrest`)
- Enum, composite type, and array support
- Formatted with Prettier
- No runtime dependencies in this package — consumers install `zod` themselves
