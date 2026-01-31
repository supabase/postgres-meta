# Go Type Generator

Generates Go struct definitions from your PostgreSQL database schema. Produces `Select`, `Insert`, and `Update` structs for each table, with JSON struct tags for serialization.

## Usage

Save the generated output to a file (e.g., `database.go`) in your project, then use the structs in your code.

### Reading rows

```go
package main

import (
    "database/sql"
    "encoding/json"

    db "myproject/database"
)

func GetUser(row *sql.Row) (db.PublicUsersSelect, error) {
    var user db.PublicUsersSelect
    err := row.Scan(&user.Id, &user.Name, &user.Email, &user.CreatedAt, &user.Metadata)
    return user, err
}
```

### Inserting rows

```go
newUser := db.PublicUsersInsert{
    Name:  "Alice",
    Email: "alice@example.com",
}

// Marshal to JSON for an API request
body, _ := json.Marshal(newUser)
```

### Partial updates

```go
// Update structs use pointers so you can distinguish
// between "not set" (nil) and "set to zero value"
name := "Bob"
update := db.PublicUsersUpdate{
    Name: &name,
    // other fields are nil — won't be included
}
```

## Endpoint

```
GET /generators/go
```

## Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `included_schemas` | string | — | Comma-separated list of schemas to include |
| `excluded_schemas` | string | — | Comma-separated list of schemas to exclude |

## CLI usage

```bash
# Using the dev server (npm run dev must be running)
npm run gen:types:go

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:go
```

## Output structure

All structs are generated in a single `database` package. Struct names are derived from the schema name and table name in PascalCase, suffixed with the operation type.

```go
package database

type PublicUsersSelect struct {
    Id        int32       `json:"id"`
    Name      string      `json:"name"`
    Email     string      `json:"email"`
    CreatedAt string      `json:"created_at"`
    Metadata  interface{} `json:"metadata"`
}

type PublicUsersInsert struct {
    Id        int32       `json:"id"`
    Name      string      `json:"name"`
    Email     string      `json:"email"`
    CreatedAt string      `json:"created_at"`
    Metadata  interface{} `json:"metadata"`
}

type PublicUsersUpdate struct {
    Id        *int32      `json:"id"`
    Name      *string     `json:"name"`
    Email     *string     `json:"email"`
    CreatedAt *string     `json:"created_at"`
    Metadata  interface{} `json:"metadata"`
}
```

Each table produces three structs:

- **Select** — Fields returned from a query.
- **Insert** — Fields for inserting a row.
- **Update** — All fields are pointers (nullable) to allow partial updates.

Views and materialized views produce a `Select` struct only.

## Type mapping

| PostgreSQL type | Go type | Nullable Go type |
|---|---|---|
| `bool` | `bool` | `*bool` |
| `int2` | `int16` | `*int16` |
| `int4` | `int32` | `*int32` |
| `int8` | `int64` | `*int64` |
| `float4` | `float32` | `*float32` |
| `float8`, `numeric` | `float64` | `*float64` |
| `text`, `varchar`, `bpchar`, `citext` | `string` | `*string` |
| `uuid` | `string` | `*string` |
| `date`, `time`, `timetz`, `timestamp`, `timestamptz` | `string` | `*string` |
| `bytea` | `[]byte` | `[]byte` |
| `json`, `jsonb` | `interface{}` | `interface{}` |
| `vector` | `string` | `*string` |
| Range types | `string` | `*string` |
| Array types | `[]T` (where T is the element type) | `[]T` |
| Enum types | `string` | `*string` |
| Composite types | `map[string]interface{}` | `map[string]interface{}` |

## Features

- Struct fields are aligned for readability
- JSON struct tags match the database column names
- Composite types are supported (mapped to `map[string]interface{}`)
