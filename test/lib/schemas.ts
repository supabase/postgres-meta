import { pgMeta } from './utils'

test('list with system schemas', async () => {
  const res = await pgMeta.schemas.list({ includeSystemSchemas: true })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "id": 13111,
      "name": "information_schema",
      "owner": "postgres",
    },
    Object {
      "id": 2200,
      "name": "public",
      "owner": "postgres",
    },
    Object {
      "id": 11,
      "name": "pg_catalog",
      "owner": "postgres",
    },
    Object {
      "id": 99,
      "name": "pg_toast",
      "owner": "postgres",
    },
  ],
  "error": null,
}
`)
})

test('list without system schemas', async () => {
  const res = await pgMeta.schemas.list({ includeSystemSchemas: false })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "id": 2200,
      "name": "public",
      "owner": "postgres",
    },
  ],
  "error": null,
}
`)
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.schemas.create({ name: 's' })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16462,
    "name": "s",
    "owner": "postgres",
  },
  "error": null,
}
`)
  res = await pgMeta.schemas.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16462,
    "name": "s",
    "owner": "postgres",
  },
  "error": null,
}
`)
  res = await pgMeta.schemas.update(res.data!.id, { name: 'ss', owner: 'postgres' })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16462,
    "name": "ss",
    "owner": "postgres",
  },
  "error": null,
}
`)
  res = await pgMeta.schemas.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16462,
    "name": "ss",
    "owner": "postgres",
  },
  "error": null,
}
`)
  res = await pgMeta.schemas.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a schema with ID \d+$/),
    },
  })
})
