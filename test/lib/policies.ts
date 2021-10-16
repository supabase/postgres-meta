import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.policies.list()
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "action": "PERMISSIVE",
      "check": null,
      "command": "UPDATE",
      "definition": "(current_setting('my.username'::text) = name)",
      "id": 16437,
      "name": "categories_update_policy",
      "roles": Array [
        "postgres",
      ],
      "schema": "public",
      "table": "category",
      "table_id": 16428,
    },
  ],
  "error": null,
}
`)
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.policies.create({
    name: 'test policy',
    schema: 'public',
    table: 'memes',
    action: 'RESTRICTIVE',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "action": "RESTRICTIVE",
    "check": null,
    "command": "ALL",
    "definition": null,
    "id": 16674,
    "name": "test policy",
    "roles": Array [
      "public",
    ],
    "schema": "public",
    "table": "memes",
    "table_id": 16447,
  },
  "error": null,
}
`)
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "action": "RESTRICTIVE",
    "check": null,
    "command": "ALL",
    "definition": null,
    "id": 16674,
    "name": "test policy",
    "roles": Array [
      "public",
    ],
    "schema": "public",
    "table": "memes",
    "table_id": 16447,
  },
  "error": null,
}
`)
  res = await pgMeta.policies.update(res.data!.id, {
    name: 'policy updated',
    definition: "current_setting('my.username') IN (name)",
    check: "current_setting('my.username') IN (name)",
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "action": "RESTRICTIVE",
    "check": "(current_setting('my.username'::text) = name)",
    "command": "ALL",
    "definition": "(current_setting('my.username'::text) = name)",
    "id": 16674,
    "name": "policy updated",
    "roles": Array [
      "public",
    ],
    "schema": "public",
    "table": "memes",
    "table_id": 16447,
  },
  "error": null,
}
`)
  res = await pgMeta.policies.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "action": "RESTRICTIVE",
    "check": "(current_setting('my.username'::text) = name)",
    "command": "ALL",
    "definition": "(current_setting('my.username'::text) = name)",
    "id": 16674,
    "name": "policy updated",
    "roles": Array [
      "public",
    ],
    "schema": "public",
    "table": "memes",
    "table_id": 16447,
  },
  "error": null,
}
`)
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a policy with ID \d+$/),
    },
  })
})
