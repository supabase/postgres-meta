import { pgMeta } from './utils'

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.publications.create({
    name: 'a',
    publish_insert: true,
    publish_update: true,
    publish_delete: true,
    publish_truncate: false,
    tables: ['users'],
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16656,
    "name": "a",
    "owner": "postgres",
    "publish_delete": true,
    "publish_insert": true,
    "publish_truncate": false,
    "publish_update": true,
    "tables": Array [
      Object {
        "id": 16391,
        "name": "users",
        "schema": "public",
      },
    ],
  },
  "error": null,
}
`)
  res = await pgMeta.publications.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16656,
    "name": "a",
    "owner": "postgres",
    "publish_delete": true,
    "publish_insert": true,
    "publish_truncate": false,
    "publish_update": true,
    "tables": Array [
      Object {
        "id": 16391,
        "name": "users",
        "schema": "public",
      },
    ],
  },
  "error": null,
}
`)
  res = await pgMeta.publications.update(res.data!.id, {
    name: 'b',
    publish_insert: false,
    tables: [],
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16656,
    "name": "b",
    "owner": "postgres",
    "publish_delete": true,
    "publish_insert": false,
    "publish_truncate": false,
    "publish_update": true,
    "tables": Array [],
  },
  "error": null,
}
`)
  res = await pgMeta.publications.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16656,
    "name": "b",
    "owner": "postgres",
    "publish_delete": true,
    "publish_insert": false,
    "publish_truncate": false,
    "publish_update": true,
    "tables": Array [],
  },
  "error": null,
}
`)
  res = await pgMeta.publications.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a publication with ID \d+$/),
    },
  })
})

test('tables with uppercase', async () => {
  const {
    data: { id: testTableId },
  }: any = await pgMeta.tables.create({ name: 'T' })

  let res = await pgMeta.publications.create({
    name: 'pub',
    tables: ['T'],
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16661,
    "name": "pub",
    "owner": "postgres",
    "publish_delete": false,
    "publish_insert": false,
    "publish_truncate": false,
    "publish_update": false,
    "tables": Array [
      Object {
        "id": 16658,
        "name": "T",
        "schema": "public",
      },
    ],
  },
  "error": null,
}
`)
  res = await pgMeta.publications.update(res.data!.id, {
    tables: ['T'],
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16661,
    "name": "pub",
    "owner": "postgres",
    "publish_delete": false,
    "publish_insert": false,
    "publish_truncate": false,
    "publish_update": false,
    "tables": Array [
      Object {
        "id": 16658,
        "name": "T",
        "schema": "public",
      },
    ],
  },
  "error": null,
}
`)
  await pgMeta.publications.remove(res.data!.id)

  await pgMeta.tables.remove(testTableId)
})

test('FOR ALL TABLES', async () => {
  let res = await pgMeta.publications.create({
    name: 'for_all',
    publish_insert: true,
    publish_update: true,
    publish_delete: true,
    publish_truncate: false,
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "id": 16663,
    "name": "for_all",
    "owner": "postgres",
    "publish_delete": true,
    "publish_insert": true,
    "publish_truncate": false,
    "publish_update": true,
    "tables": null,
  },
  "error": null,
}
`)
  await pgMeta.publications.remove(res.data!.id)
})
