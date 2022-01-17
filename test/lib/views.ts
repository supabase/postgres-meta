import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.views.list()
  expect(res.data?.find(({ name }) => name === 'todos_view')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    Object {
      "comment": null,
      "id": Any<Number>,
      "name": "todos_view",
      "schema": "public",
    }
  `
  )
})
