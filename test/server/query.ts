import { expect, test } from 'vitest'
import { app } from './utils'

test('query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: 'SELECT * FROM users' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "decimal": null,
        "id": 1,
        "name": "Joe Bloggs",
        "status": "ACTIVE",
      },
      {
        "decimal": null,
        "id": 2,
        "name": "Jane Doe",
        "status": "ACTIVE",
      },
    ]
  `)
})

test('error', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: 'DROP TABLE missing_table' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    {
      "code": "42P01",
      "error": "ERROR:  42P01: table "missing_table" does not exist
    ",
      "file": "tablecmds.c",
      "formattedError": "ERROR:  42P01: table "missing_table" does not exist
    ",
      "length": 108,
      "line": "1259",
      "message": "table "missing_table" does not exist",
      "name": "error",
      "routine": "DropErrorMsgNonExistent",
      "severity": "ERROR",
    }
  `)
})

test('parser select statements', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/parse',
    payload: { query: 'SELECT id, name FROM users where user_id = 1234' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "RawStmt": {
          "stmt": {
            "SelectStmt": {
              "fromClause": [
                {
                  "RangeVar": {
                    "inh": true,
                    "location": 21,
                    "relname": "users",
                    "relpersistence": "p",
                  },
                },
              ],
              "limitOption": "LIMIT_OPTION_DEFAULT",
              "op": "SETOP_NONE",
              "targetList": [
                {
                  "ResTarget": {
                    "location": 7,
                    "val": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "id",
                            },
                          },
                        ],
                        "location": 7,
                      },
                    },
                  },
                },
                {
                  "ResTarget": {
                    "location": 11,
                    "val": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "name",
                            },
                          },
                        ],
                        "location": 11,
                      },
                    },
                  },
                },
              ],
              "whereClause": {
                "A_Expr": {
                  "kind": "AEXPR_OP",
                  "lexpr": {
                    "ColumnRef": {
                      "fields": [
                        {
                          "String": {
                            "str": "user_id",
                          },
                        },
                      ],
                      "location": 33,
                    },
                  },
                  "location": 41,
                  "name": [
                    {
                      "String": {
                        "str": "=",
                      },
                    },
                  ],
                  "rexpr": {
                    "A_Const": {
                      "location": 43,
                      "val": {
                        "Integer": {
                          "ival": 1234,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "stmt_location": 0,
        },
      },
    ]
  `)
})

test('parser comments', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/parse',
    payload: {
      query: `
-- test comments
`,
    },
  })
  expect(res.json()).toMatchInlineSnapshot(`[]`)
})

test('parser create schema', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/parse',
    payload: {
      query: `
create schema if not exists test_schema;
`,
    },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "RawStmt": {
          "stmt": {
            "CreateSchemaStmt": {
              "if_not_exists": true,
              "schemaname": "test_schema",
            },
          },
          "stmt_len": 40,
          "stmt_location": 0,
        },
      },
    ]
  `)
})

test('parser create statements', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/parse',
    payload: {
      query: `
CREATE TABLE table_name (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  data jsonb,
  name text
);
`,
    },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "RawStmt": {
          "stmt": {
            "CreateStmt": {
              "oncommit": "ONCOMMIT_NOOP",
              "relation": {
                "inh": true,
                "location": 14,
                "relname": "table_name",
                "relpersistence": "p",
              },
              "tableElts": [
                {
                  "ColumnDef": {
                    "colname": "id",
                    "constraints": [
                      {
                        "Constraint": {
                          "contype": "CONSTR_IDENTITY",
                          "generated_when": "d",
                          "location": 39,
                        },
                      },
                      {
                        "Constraint": {
                          "contype": "CONSTR_PRIMARY",
                          "location": 72,
                        },
                      },
                    ],
                    "is_local": true,
                    "location": 29,
                    "typeName": {
                      "location": 32,
                      "names": [
                        {
                          "String": {
                            "str": "pg_catalog",
                          },
                        },
                        {
                          "String": {
                            "str": "int8",
                          },
                        },
                      ],
                      "typemod": -1,
                    },
                  },
                },
                {
                  "ColumnDef": {
                    "colname": "inserted_at",
                    "constraints": [
                      {
                        "Constraint": {
                          "contype": "CONSTR_DEFAULT",
                          "location": 124,
                          "raw_expr": {
                            "FuncCall": {
                              "args": [
                                {
                                  "TypeCast": {
                                    "arg": {
                                      "A_Const": {
                                        "location": 141,
                                        "val": {
                                          "String": {
                                            "str": "utc",
                                          },
                                        },
                                      },
                                    },
                                    "location": 146,
                                    "typeName": {
                                      "location": 148,
                                      "names": [
                                        {
                                          "String": {
                                            "str": "text",
                                          },
                                        },
                                      ],
                                      "typemod": -1,
                                    },
                                  },
                                },
                                {
                                  "FuncCall": {
                                    "funcname": [
                                      {
                                        "String": {
                                          "str": "now",
                                        },
                                      },
                                    ],
                                    "location": 154,
                                  },
                                },
                              ],
                              "funcname": [
                                {
                                  "String": {
                                    "str": "timezone",
                                  },
                                },
                              ],
                              "location": 132,
                            },
                          },
                        },
                      },
                      {
                        "Constraint": {
                          "contype": "CONSTR_NOTNULL",
                          "location": 161,
                        },
                      },
                    ],
                    "is_local": true,
                    "location": 87,
                    "typeName": {
                      "location": 99,
                      "names": [
                        {
                          "String": {
                            "str": "pg_catalog",
                          },
                        },
                        {
                          "String": {
                            "str": "timestamptz",
                          },
                        },
                      ],
                      "typemod": -1,
                    },
                  },
                },
                {
                  "ColumnDef": {
                    "colname": "updated_at",
                    "constraints": [
                      {
                        "Constraint": {
                          "contype": "CONSTR_DEFAULT",
                          "location": 209,
                          "raw_expr": {
                            "FuncCall": {
                              "args": [
                                {
                                  "TypeCast": {
                                    "arg": {
                                      "A_Const": {
                                        "location": 226,
                                        "val": {
                                          "String": {
                                            "str": "utc",
                                          },
                                        },
                                      },
                                    },
                                    "location": 231,
                                    "typeName": {
                                      "location": 233,
                                      "names": [
                                        {
                                          "String": {
                                            "str": "text",
                                          },
                                        },
                                      ],
                                      "typemod": -1,
                                    },
                                  },
                                },
                                {
                                  "FuncCall": {
                                    "funcname": [
                                      {
                                        "String": {
                                          "str": "now",
                                        },
                                      },
                                    ],
                                    "location": 239,
                                  },
                                },
                              ],
                              "funcname": [
                                {
                                  "String": {
                                    "str": "timezone",
                                  },
                                },
                              ],
                              "location": 217,
                            },
                          },
                        },
                      },
                      {
                        "Constraint": {
                          "contype": "CONSTR_NOTNULL",
                          "location": 246,
                        },
                      },
                    ],
                    "is_local": true,
                    "location": 173,
                    "typeName": {
                      "location": 184,
                      "names": [
                        {
                          "String": {
                            "str": "pg_catalog",
                          },
                        },
                        {
                          "String": {
                            "str": "timestamptz",
                          },
                        },
                      ],
                      "typemod": -1,
                    },
                  },
                },
                {
                  "ColumnDef": {
                    "colname": "data",
                    "is_local": true,
                    "location": 258,
                    "typeName": {
                      "location": 263,
                      "names": [
                        {
                          "String": {
                            "str": "jsonb",
                          },
                        },
                      ],
                      "typemod": -1,
                    },
                  },
                },
                {
                  "ColumnDef": {
                    "colname": "name",
                    "is_local": true,
                    "location": 272,
                    "typeName": {
                      "location": 277,
                      "names": [
                        {
                          "String": {
                            "str": "text",
                          },
                        },
                      ],
                      "typemod": -1,
                    },
                  },
                },
              ],
            },
          },
          "stmt_len": 283,
          "stmt_location": 0,
        },
      },
    ]
  `)

  const deparse = await app.inject({
    method: 'POST',
    path: '/query/deparse',
    payload: { ast: res.json() },
  })
  expect(deparse.body).toMatchInlineSnapshot(`
    "CREATE TABLE table_name (
     	id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    	inserted_at pg_catalog.timestamptz DEFAULT ( timezone('utc'::text, now()) ) NOT NULL,
    	updated_at pg_catalog.timestamptz DEFAULT ( timezone('utc'::text, now()) ) NOT NULL,
    	data jsonb,
    	name text 
    );"
  `)
})

test('formatter', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: { query: 'SELECT id, name FROM users where user_id = 1234' },
  })
  expect(res.body).toMatchInlineSnapshot(`
    "SELECT
      id,
      name
    FROM
      users
    where
      user_id = 1234
    "
  `)
})

test('very big number', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `SELECT ${Number.MAX_SAFE_INTEGER + 1}::int8, ARRAY[${
        Number.MIN_SAFE_INTEGER - 1
      }::int8]`,
    },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "array": [
          "-9007199254740992",
        ],
        "int8": "9007199254740992",
      },
    ]
  `)
})

// issue: https://github.com/supabase/supabase/issues/27626
test('return interval as string', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `SELECT '1 day 1 hour 45 minutes'::interval`,
    },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "interval": "1 day 01:45:00",
      },
    ]
  `)
})

test('line position error', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: 'SELECT *\nFROM pg_class\nWHERE relname = missing_quotes;' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    {
      "code": "42703",
      "error": "ERROR:  42703: column "missing_quotes" does not exist
    LINE 3: WHERE relname = missing_quotes;
                            ^
    ",
      "file": "parse_relation.c",
      "formattedError": "ERROR:  42703: column "missing_quotes" does not exist
    LINE 3: WHERE relname = missing_quotes;
                            ^
    ",
      "length": 114,
      "line": "3589",
      "message": "column "missing_quotes" does not exist",
      "name": "error",
      "position": "40",
      "routine": "errorMissingColumn",
      "severity": "ERROR",
    }
  `)
})

test('error with additional details', async () => {
  // This query will generate an error with details
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `DO $$ 
      DECLARE 
          my_var int;
      BEGIN
          -- This will trigger an error with detail, hint, and context
          SELECT * INTO STRICT my_var FROM (VALUES (1), (2)) AS t(v);
      END $$;`,
    },
  })

  expect(res.json()).toMatchInlineSnapshot(`
    {
      "code": "P0003",
      "error": "ERROR:  P0003: query returned more than one row
    HINT:  Make sure the query returns a single row, or use LIMIT 1.
    CONTEXT:  PL/pgSQL function inline_code_block line 6 at SQL statement
    ",
      "file": "pl_exec.c",
      "formattedError": "ERROR:  P0003: query returned more than one row
    HINT:  Make sure the query returns a single row, or use LIMIT 1.
    CONTEXT:  PL/pgSQL function inline_code_block line 6 at SQL statement
    ",
      "hint": "Make sure the query returns a single row, or use LIMIT 1.",
      "length": 216,
      "line": "4349",
      "message": "query returned more than one row",
      "name": "error",
      "routine": "exec_stmt_execsql",
      "severity": "ERROR",
      "where": "PL/pgSQL function inline_code_block line 6 at SQL statement",
    }
  `)
})

test('error with all formatting properties', async () => {
  // This query will generate an error with all formatting properties
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
      DO $$ 
      BEGIN
        -- Using EXECUTE to force internal query to appear
        EXECUTE 'SELECT * FROM nonexistent_table WHERE id = 1';
      EXCEPTION WHEN OTHERS THEN
        -- Re-raise with added context
        RAISE EXCEPTION USING 
          ERRCODE = SQLSTATE,
          MESSAGE = SQLERRM,
          DETAIL = 'This is additional detail information',
          HINT = 'This is a hint for fixing the issue',
          SCHEMA = 'public';
      END $$;
      `,
    },
  })

  expect(res.json()).toMatchInlineSnapshot(`
    {
      "code": "42P01",
      "detail": "This is additional detail information",
      "error": "ERROR:  42P01: relation "nonexistent_table" does not exist
    DETAIL:  This is additional detail information
    HINT:  This is a hint for fixing the issue
    CONTEXT:  PL/pgSQL function inline_code_block line 7 at RAISE
    ",
      "file": "pl_exec.c",
      "formattedError": "ERROR:  42P01: relation "nonexistent_table" does not exist
    DETAIL:  This is additional detail information
    HINT:  This is a hint for fixing the issue
    CONTEXT:  PL/pgSQL function inline_code_block line 7 at RAISE
    ",
      "hint": "This is a hint for fixing the issue",
      "length": 242,
      "line": "3859",
      "message": "relation "nonexistent_table" does not exist",
      "name": "error",
      "routine": "exec_stmt_raise",
      "schema": "public",
      "severity": "ERROR",
      "where": "PL/pgSQL function inline_code_block line 7 at RAISE",
    }
  `)
})

test('error with internalQuery property', async () => {
  // First create a function that will execute a query internally
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
      CREATE OR REPLACE FUNCTION test_internal_query() RETURNS void AS $$
      BEGIN
        -- This query will be the "internal query" when it fails
        EXECUTE 'SELECT * FROM nonexistent_table';
        RETURN;
      END;
      $$ LANGUAGE plpgsql;
      `,
    },
  })

  // Now call the function to trigger the error with internalQuery
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: 'SELECT test_internal_query();',
    },
  })

  expect(res.json()).toMatchInlineSnapshot(`
    {
      "code": "42P01",
      "error": "ERROR:  42P01: relation "nonexistent_table" does not exist
    QUERY:  SELECT * FROM nonexistent_table
    CONTEXT:  PL/pgSQL function test_internal_query() line 4 at EXECUTE
    ",
      "file": "parse_relation.c",
      "formattedError": "ERROR:  42P01: relation "nonexistent_table" does not exist
    QUERY:  SELECT * FROM nonexistent_table
    CONTEXT:  PL/pgSQL function test_internal_query() line 4 at EXECUTE
    ",
      "internalPosition": "15",
      "internalQuery": "SELECT * FROM nonexistent_table",
      "length": 208,
      "line": "1381",
      "message": "relation "nonexistent_table" does not exist",
      "name": "error",
      "routine": "parserOpenTable",
      "severity": "ERROR",
      "where": "PL/pgSQL function test_internal_query() line 4 at EXECUTE",
    }
  `)
})

test('custom application_name', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-pg-application-name': 'test',
    },
    payload: {
      query: 'SHOW application_name;',
    },
  })

  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "application_name": "test",
      },
    ]
  `)
})
