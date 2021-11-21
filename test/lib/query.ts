import { pgMeta } from './utils'

test('query', async () => {
  const res = await pgMeta.query('SELECT * FROM users')
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "id": 1,
      "name": "Joe Bloggs",
      "status": "ACTIVE",
    },
    Object {
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
Object {
  "data": null,
  "error": Object {
    "message": "table \\"missing_table\\" does not exist",
  },
}
`)
})

test('parser', async () => {
  const res = await pgMeta.parse('SELECT id, name FROM users where user_id = 1234')
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "ast": Object {
      "columns": Array [
        Object {
          "as": null,
          "expr": Object {
            "array_index": null,
            "column": "id",
            "table": null,
            "type": "column_ref",
          },
          "type": "expr",
        },
        Object {
          "as": null,
          "expr": Object {
            "array_index": null,
            "column": "name",
            "table": null,
            "type": "column_ref",
          },
          "type": "expr",
        },
      ],
      "distinct": null,
      "from": Array [
        Object {
          "as": null,
          "db": null,
          "table": "users",
        },
      ],
      "groupby": null,
      "having": null,
      "limit": null,
      "options": null,
      "orderby": null,
      "type": "select",
      "where": Object {
        "left": Object {
          "column": "user_id",
          "table": null,
          "type": "column_ref",
        },
        "operator": "=",
        "right": Object {
          "type": "number",
          "value": 1234,
        },
        "type": "binary_expr",
      },
      "with": null,
    },
    "columnList": Array [
      "select::null::id",
      "select::null::name",
      "select::null::user_id",
    ],
    "tableList": Array [
      "select::null::users",
    ],
  },
  "error": null,
}
`)
})

test('formatter', async () => {
  const res = await pgMeta.format('SELECT id, name FROM users where user_id = 1234')
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": "SELECT
  id,
  name
FROM
  users
where
  user_id = 1234",
  "error": null,
}
`)
})
