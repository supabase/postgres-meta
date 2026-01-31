# Swift Type Generator

Generates Swift struct and enum definitions from your PostgreSQL database schema. Structs conform to `Codable`, `Hashable`, and `Sendable` protocols, and include `CodingKeys` enums for JSON serialization.

## Endpoint

```
GET /generators/swift
```

## Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `included_schemas` | string | — | Comma-separated list of schemas to include |
| `excluded_schemas` | string | — | Comma-separated list of schemas to exclude |
| `access_control` | string | `internal` | Swift access control level: `internal`, `public`, `private`, or `package` |

## CLI usage

```bash
# Using the dev server (npm run dev must be running)
npm run gen:types:swift

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:swift

# With options
PG_META_GENERATE_TYPES=swift \
PG_META_GENERATE_TYPES_SWIFT_ACCESS_CONTROL=public \
node --loader ts-node/esm src/server/server.ts
```

## Environment variables

| Variable | Description |
|---|---|
| `PG_META_GENERATE_TYPES_SWIFT_ACCESS_CONTROL` | Access control level: `internal` (default), `public`, `private`, or `package` |

## Output structure

The generator produces structs organized by schema, with each table generating `Select`, `Insert`, and `Update` variants.

```swift
enum PublicSchema {
  // Enums
  enum UserStatus: String, Codable, Hashable, Sendable {
    case active = "active"
    case inactive = "inactive"
  }

  // Tables
  struct UsersSelect: Codable, Hashable, Sendable {
    let id: Int32
    let name: String
    let email: String
    let status: UserStatus
    let createdAt: String

    enum CodingKeys: String, CodingKey {
      case id
      case name
      case email
      case status
      case createdAt = "created_at"
    }
  }

  struct UsersInsert: Codable, Hashable, Sendable {
    let id: Int32?
    let name: String
    let email: String
    let status: UserStatus?
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
      case id
      case name
      case email
      case status
      case createdAt = "created_at"
    }
  }

  struct UsersUpdate: Codable, Hashable, Sendable {
    let id: Int32?
    let name: String?
    let email: String?
    let status: UserStatus?
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
      case id
      case name
      case email
      case status
      case createdAt = "created_at"
    }
  }
}
```

Each table produces three structs:

- **Select** — Fields returned from a query.
- **Insert** — Columns with defaults are optional (`?`).
- **Update** — All columns are optional.

Views and materialized views produce a `Select` struct only.

Types with identity columns also conform to `Identifiable`.

## Type mapping

| PostgreSQL type | Swift type |
|---|---|
| `bool` | `Bool` |
| `int2` | `Int16` |
| `int4` | `Int32` |
| `int8` | `Int64` |
| `float4` | `Float` |
| `float8` | `Double` |
| `numeric`, `decimal` | `Decimal` |
| `uuid` | `UUID` |
| `text`, `varchar`, `bpchar`, `citext` | `String` |
| `date`, `time`, `timetz`, `timestamp`, `timestamptz` | `String` |
| `bytea` | `String` |
| `vector` | `String` |
| `json`, `jsonb` | `AnyJSON` |
| `void` | `Void` |
| `record` | `JSONObject` |
| Array types | `[T]` (where T is the element type) |
| Enum types | Generated Swift enum with `String` raw value |
| Composite types | Reference to generated struct (with `Select` suffix) |

Nullable columns use Swift optionals (`T?`).

## Features

- Protocol conformance: `Codable`, `Hashable`, `Sendable`
- `Identifiable` conformance for tables with identity columns
- `CodingKeys` enum for mapping between Swift property names (camelCase) and database column names (snake_case)
- Configurable access control level
- Formatted with Prettier
