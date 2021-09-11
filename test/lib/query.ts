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
