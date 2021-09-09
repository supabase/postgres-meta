import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.types.list()
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "comment": null,
      "enums": Array [
        "ACTIVE",
        "INACTIVE",
      ],
      "format": "user_status",
      "id": 16385,
      "name": "user_status",
      "schema": "public",
    },
    Object {
      "comment": null,
      "enums": Array [
        "new",
        "old",
        "retired",
      ],
      "format": "meme_status",
      "id": 16439,
      "name": "meme_status",
      "schema": "public",
    },
  ],
  "error": null,
}
`)
})
