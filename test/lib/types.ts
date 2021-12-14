import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.types.list()
  expect(res.data?.find(({ name }) => name === 'user_status')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    Object {
      "comment": null,
      "enums": Array [
        "ACTIVE",
        "INACTIVE",
      ],
      "format": "user_status",
      "id": Any<Number>,
      "name": "user_status",
      "schema": "public",
    }
  `
  )
})
