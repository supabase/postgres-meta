import { pgMeta } from './utils'

test('query', async () => {
  const res = await pgMeta.query('SELECT * FROM users')
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
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
      ],
      "error": null,
    }
  `)
})

test('error', async () => {
  const res = await pgMeta.query('DROP TABLE missing_table')
  expect(res).toMatchInlineSnapshot(`
    {
      "data": null,
      "error": {
        "code": "42P01",
        "column": undefined,
        "constraint": undefined,
        "dataType": undefined,
        "detail": undefined,
        "file": "tablecmds.c",
        "formattedError": "ERROR:  42P01: table "missing_table" does not exist
    ",
        "hint": undefined,
        "internalPosition": undefined,
        "internalQuery": undefined,
        "length": 108,
        "line": "1259",
        "message": "table "missing_table" does not exist",
        "name": "error",
        "position": undefined,
        "routine": "DropErrorMsgNonExistent",
        "schema": undefined,
        "severity": "ERROR",
        "table": undefined,
        "where": undefined,
      },
    }
  `)
})

test('parser select statements', async () => {
  const res = pgMeta.parse('SELECT id, name FROM users where user_id = 1234')
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
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
            "stmt_len": undefined,
            "stmt_location": 0,
          },
        },
      ],
      "error": null,
    }
  `)
})

test('parser comments', async () => {
  const res = pgMeta.parse(`
-- test comments
`)
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [],
      "error": null,
    }
  `)
})

test('parser create schema', async () => {
  const res = pgMeta.parse(`
create schema if not exists test_schema;
`)
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
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
      ],
      "error": null,
    }
  `)
})

test('parser create statements', async () => {
  const query = `
CREATE TABLE table_name (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  data jsonb,
  name text
);
`
  const res = pgMeta.parse(query)
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
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
      ],
      "error": null,
    }
  `)

  const deparse = pgMeta.deparse(res.data!)
  expect(deparse.data).toMatchInlineSnapshot(`
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
  const res = pgMeta.format('SELECT id, name FROM users where user_id = 1234')
  expect(res).toMatchInlineSnapshot(`
    {
      "data": "SELECT
      id,
      name
    FROM
      users
    where
      user_id = 1234
    ",
      "error": null,
    }
  `)
})

test('very big number', async () => {
  const res = await pgMeta.query(
    `SELECT ${Number.MAX_SAFE_INTEGER + 1}::int8, ARRAY[${Number.MIN_SAFE_INTEGER - 1}::int8]`
  )
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
        {
          "array": [
            "-9007199254740992",
          ],
          "int8": "9007199254740992",
        },
      ],
      "error": null,
    }
  `)
})
