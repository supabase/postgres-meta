import { pgMeta } from './utils'

test('retrieve', async () => {
  const res = await pgMeta.version.retrieve()
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        version: expect.stringMatching(/^PostgreSQL/),
        version_number: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "active_connections": 6,
        "max_connections": 100,
        "version": StringMatching /\\^PostgreSQL/,
        "version_number": Any<Number>,
      },
      "error": null,
    }
  `
  )
})
