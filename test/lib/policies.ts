import { expect, test } from 'vitest'
import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.policies.list()
  expect(res.data?.find(({ name }) => name === 'categories_update_policy')).toMatchInlineSnapshot(
    { id: expect.any(Number), table_id: expect.any(Number) },
    `
    {
      "action": "PERMISSIVE",
      "check": null,
      "command": "UPDATE",
      "definition": "(current_setting('my.username'::text) = name)",
      "id": Any<Number>,
      "name": "categories_update_policy",
      "roles": [
        "postgres",
      ],
      "schema": "public",
      "table": "category",
      "table_id": Any<Number>,
    }
  `
  )
})

test('list policies with included schemas', async () => {
  let res = await pgMeta.policies.list({
    includedSchemas: ['public'],
  })

  expect(res.data?.length).toBeGreaterThan(0)

  res.data?.forEach((policy) => {
    expect(policy.schema).toBe('public')
  })
})

test('list policies with excluded schemas', async () => {
  let res = await pgMeta.policies.list({
    excludedSchemas: ['public'],
  })

  res.data?.forEach((policy) => {
    expect(policy.schema).not.toBe('public')
  })
})

test('list policies with excluded schemas and include System Schemas', async () => {
  let res = await pgMeta.policies.list({
    excludedSchemas: ['public'],
    includeSystemSchemas: true,
  })

  res.data?.forEach((policy) => {
    expect(policy.schema).not.toBe('public')
  })
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.policies.create({
    name: 'test policy',
    schema: 'public',
    table: 'memes',
    action: 'RESTRICTIVE',
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    {
      "data": {
        "action": "RESTRICTIVE",
        "check": null,
        "command": "ALL",
        "definition": null,
        "id": Any<Number>,
        "name": "test policy",
        "roles": [
          "public",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    {
      "data": {
        "action": "RESTRICTIVE",
        "check": null,
        "command": "ALL",
        "definition": null,
        "id": Any<Number>,
        "name": "test policy",
        "roles": [
          "public",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.update(res.data!.id, {
    name: 'policy updated',
    definition: "current_setting('my.username') IN (name)",
    check: "current_setting('my.username') IN (name)",
    roles: ['postgres'],
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    {
      "data": {
        "action": "RESTRICTIVE",
        "check": "(current_setting('my.username'::text) = name)",
        "command": "ALL",
        "definition": "(current_setting('my.username'::text) = name)",
        "id": Any<Number>,
        "name": "policy updated",
        "roles": [
          "postgres",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    {
      "data": {
        "action": "RESTRICTIVE",
        "check": "(current_setting('my.username'::text) = name)",
        "command": "ALL",
        "definition": "(current_setting('my.username'::text) = name)",
        "id": Any<Number>,
        "name": "policy updated",
        "roles": [
          "postgres",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a policy with ID \d+$/),
    },
  })
})

test('update roles to an empty array falls back to public', async () => {
  let res = await pgMeta.policies.create({
    name: 'test empty roles policy',
    schema: 'public',
    table: 'memes',
    roles: ['postgres'],
  })
  const policyId = res.data!.id
  expect(res.data!.roles).toStrictEqual(['postgres'])

  // An empty array means "all roles" — the same default `create` applies.
  // `name` is typed as required even though `update` treats it as optional, and
  // renaming a policy to its own name errors, so it has to be omitted here.
  res = await pgMeta.policies.update(policyId, { roles: [] } as any)

  expect(res.error).toBeNull()
  expect(res.data!.roles).toStrictEqual(['public'])

  await pgMeta.policies.remove(policyId)
})
