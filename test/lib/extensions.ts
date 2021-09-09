import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.extensions.list()
  expect(res.data?.find(({ name }) => name === 'hstore')).toMatchInlineSnapshot(`
Object {
  "comment": "data type for storing sets of (key, value) pairs",
  "default_version": "1.7",
  "installed_version": null,
  "name": "hstore",
  "schema": null,
}
`)
})

test('retrieve, create, update, delete', async () => {
  const { data: testSchema } = await pgMeta.schemas.create({ name: 'extensions' })

  let res = await pgMeta.extensions.create({ name: 'hstore', version: '1.4' })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "data type for storing sets of (key, value) pairs",
    "default_version": "1.7",
    "installed_version": "1.4",
    "name": "hstore",
    "schema": "public",
  },
  "error": null,
}
`)
  res = await pgMeta.extensions.retrieve({ name: res.data!.name })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "data type for storing sets of (key, value) pairs",
    "default_version": "1.7",
    "installed_version": "1.4",
    "name": "hstore",
    "schema": "public",
  },
  "error": null,
}
`)
  res = await pgMeta.extensions.update(res.data!.name, { update: true, schema: 'extensions' })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "data type for storing sets of (key, value) pairs",
    "default_version": "1.7",
    "installed_version": "1.7",
    "name": "hstore",
    "schema": "extensions",
  },
  "error": null,
}
`)
  res = await pgMeta.extensions.remove(res.data!.name)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "data type for storing sets of (key, value) pairs",
    "default_version": "1.7",
    "installed_version": "1.7",
    "name": "hstore",
    "schema": "extensions",
  },
  "error": null,
}
`)
  res = await pgMeta.extensions.retrieve({ name: res.data!.name })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "data type for storing sets of (key, value) pairs",
    "default_version": "1.7",
    "installed_version": null,
    "name": "hstore",
    "schema": null,
  },
  "error": null,
}
`)

  await pgMeta.schemas.remove(testSchema!.id)
})
