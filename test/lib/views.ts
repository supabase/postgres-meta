import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.views.list()
  expect(res.data?.find(({ name }) => name === 'todos_view')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    Object {
      "columns": Array [
        Object {
          "comment": null,
          "data_type": "bigint",
          "default_value": null,
          "enums": Array [],
          "format": "int8",
          "id": "16420.1",
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "id",
          "ordinal_position": 1,
          "schema": "public",
          "table": "todos_view",
          "table_id": 16420,
        },
        Object {
          "comment": null,
          "data_type": "text",
          "default_value": null,
          "enums": Array [],
          "format": "text",
          "id": "16420.2",
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "details",
          "ordinal_position": 2,
          "schema": "public",
          "table": "todos_view",
          "table_id": 16420,
        },
        Object {
          "comment": null,
          "data_type": "bigint",
          "default_value": null,
          "enums": Array [],
          "format": "int8",
          "id": "16420.3",
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "user-id",
          "ordinal_position": 3,
          "schema": "public",
          "table": "todos_view",
          "table_id": 16420,
        },
      ],
      "comment": null,
      "id": Any<Number>,
      "is_updatable": true,
      "name": "todos_view",
      "schema": "public",
    }
  `
  )
})
