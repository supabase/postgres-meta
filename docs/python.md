# Python Type Generator

Generates Python type definitions from your PostgreSQL database schema using [Pydantic](https://docs.pydantic.dev/) `BaseModel` classes for row types and `TypedDict` classes for insert and update types.

## Usage

Save the generated output to a file (e.g., `database_types.py`) in your project, then import the types.

### Validating query results

```python
from database_types import Users

# Pydantic BaseModel validates and parses data
user = Users.model_validate(row_dict)
print(user.name)        # str
print(user.created_at)  # datetime.datetime
```

### Typing inserts

```python
from database_types import UsersInsert

# TypedDict gives you type checking without runtime validation
new_user: UsersInsert = {
    "name": "Alice",
    "email": "alice@example.com",
    # id, status, created_at are NotRequired — they have defaults
}
```

### Typing updates

```python
from database_types import UsersUpdate

# All fields are NotRequired for partial updates
update: UsersUpdate = {
    "name": "Bob",
}
```

### Using with FastAPI

```python
from fastapi import FastAPI
from database_types import Users, UsersInsert

app = FastAPI()

@app.get("/users/{user_id}", response_model=Users)
async def get_user(user_id: int):
    row = await db.fetch_one("SELECT * FROM users WHERE id = $1", user_id)
    return Users.model_validate(dict(row))

@app.post("/users", response_model=Users)
async def create_user(user: UsersInsert):
    # Pydantic validates the request body automatically
    ...
```

### Using enums

```python
from database_types import UserStatus

# UserStatus is a Literal type alias
def check_status(status: UserStatus):
    if status == "active":
        ...
```

## Endpoint

```
GET /generators/python
```

## Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `included_schemas` | string | — | Comma-separated list of schemas to include |
| `excluded_schemas` | string | — | Comma-separated list of schemas to exclude |

## CLI usage

```bash
# Using the dev server (npm run dev must be running)
npm run gen:types:python

# With a custom database
PG_META_DB_URL=postgresql://user:pass@host:5432/db npm run gen:types:python
```

## Output structure

The generator produces Pydantic `BaseModel` classes for row types and `TypedDict` classes for insert/update operations.

```python
from __future__ import annotations

import datetime
import uuid
from typing import (
    Annotated,
    Any,
    List,
    Literal,
    NotRequired,
    Optional,
    TypeAlias,
    TypedDict,
)

from pydantic import BaseModel, Field, Json


# Enums
UserStatus: TypeAlias = Literal["active", "inactive"]


# Tables
class Users(BaseModel):
    id: int
    name: str
    email: str
    status: UserStatus
    created_at: datetime.datetime
    metadata: Any | None


class UsersInsert(TypedDict):
    id: NotRequired[int]
    name: str
    email: str
    status: NotRequired[UserStatus]
    created_at: NotRequired[datetime.datetime]
    metadata: NotRequired[Any | None]


class UsersUpdate(TypedDict):
    id: NotRequired[int]
    name: NotRequired[str]
    email: NotRequired[str]
    status: NotRequired[UserStatus]
    created_at: NotRequired[datetime.datetime]
    metadata: NotRequired[Any | None]
```

Each table produces three types:

- **BaseModel class** (Row) — A Pydantic model representing a row returned from a query.
- **Insert TypedDict** — Fields with defaults use `NotRequired`.
- **Update TypedDict** — All fields use `NotRequired`.

Views and materialized views produce a BaseModel class only.

## Type mapping

| PostgreSQL type | Python type |
|---|---|
| `bool` | `bool` |
| `int2`, `int4`, `int8` | `int` |
| `float4`, `float8`, `numeric` | `float` |
| `text`, `varchar`, `char`, `bpchar`, `citext`, `name` | `str` |
| `uuid` | `uuid.UUID` |
| `date` | `datetime.date` |
| `time`, `timetz` | `datetime.time` |
| `timestamp`, `timestamptz` | `datetime.datetime` |
| `json`, `jsonb` | `Any` |
| `bytea` | `str` |
| Array types | `List[T]` (where T is the element type) |
| Enum types | `TypeAlias = Literal["val1", "val2"]` |
| Composite types | Generated Pydantic BaseModel class |

Nullable columns use `Optional[T]` (or `T \| None`).

## Features

- Pydantic `BaseModel` for row types with full validation support
- `TypedDict` for insert/update types for compatibility with dict-based APIs
- Field aliases via `Field(alias=...)` when column names conflict with Python reserved words
- Enum types as `Literal` type aliases
- Composite type support as nested BaseModel classes
