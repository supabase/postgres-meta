import { expect, test } from 'vitest'
import { app } from './utils'
import { DEFAULT_POOL_CONFIG } from '../../src/server/constants'

test('query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: 'SELECT * FROM users' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "id": 1,
        "name": "Joe Bloggs",
        "status": "ACTIVE",
      },
      {
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

test('query timeout', async () => {
  const defaultTimeout = DEFAULT_POOL_CONFIG.query_timeout
  DEFAULT_POOL_CONFIG.query_timeout = 100

  const res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: "select pg_sleep_for('1 minute');" },
  })
  expect(res.json()?.error).toMatchInlineSnapshot(`"Query read timeout"`)

  DEFAULT_POOL_CONFIG.query_timeout = defaultTimeout
})
