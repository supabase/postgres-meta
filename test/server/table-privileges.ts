import { expect, test } from 'vitest'
import { PostgresMeta } from '../../src/lib'
import { PostgresTablePrivileges } from '../../src/lib/types'
import { app } from './utils'

test('list table privileges', async () => {
  const res = await app.inject({ method: 'GET', path: '/table-privileges' })
  expect(
    res
      .json<PostgresTablePrivileges[]>()
      .find(({ schema, name }) => schema === 'public' && name === 'todos')
  ).toMatchInlineSnapshot(
    { relation_id: expect.any(Number) },
    `
    {
      "kind": "table",
      "name": "todos",
      "privileges": [
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "INSERT",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "SELECT",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "UPDATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "DELETE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRUNCATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "REFERENCES",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRIGGER",
        },
      ],
      "relation_id": Any<Number>,
      "schema": "public",
    }
  `
  )
})

test('revoke & grant table privileges', async () => {
  let res = await app.inject({ method: 'GET', path: '/table-privileges' })
  const { relation_id } = res
    .json<PostgresTablePrivileges[]>()
    .find(({ schema, name }) => schema === 'public' && name === 'todos')!

  res = await app.inject({
    method: 'DELETE',
    path: '/table-privileges',
    payload: [
      {
        relation_id,
        grantee: 'postgres',
        privilege_type: 'ALL',
      },
    ],
  })
  let privs = res.json<PostgresTablePrivileges[]>()
  expect(privs.length).toBe(1)
  expect(privs[0]).toMatchInlineSnapshot(
    { relation_id: expect.any(Number) },
    `
    {
      "kind": "table",
      "name": "todos",
      "privileges": [],
      "relation_id": Any<Number>,
      "schema": "public",
    }
  `
  )

  res = await app.inject({
    method: 'POST',
    path: '/table-privileges',
    payload: [
      {
        relation_id,
        grantee: 'postgres',
        privilege_type: 'ALL',
      },
    ],
  })
  privs = res.json<PostgresTablePrivileges[]>()
  expect(privs.length).toBe(1)
  expect(privs[0]).toMatchInlineSnapshot(
    { relation_id: expect.any(Number) },
    `
    {
      "kind": "table",
      "name": "todos",
      "privileges": [
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRIGGER",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "REFERENCES",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRUNCATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "DELETE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "UPDATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "SELECT",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "INSERT",
        },
      ],
      "relation_id": Any<Number>,
      "schema": "public",
    }
  `
  )
})

test('revoke & grant table privileges w/ quoted table name', async () => {
  let res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `create role r; create schema "s 1"; create table "s 1"."t 1"();`,
    },
  })
  if (res.json().error) {
    throw new Error(res.payload)
  }

  res = await app.inject({ method: 'GET', path: '/table-privileges' })
  const { relation_id } = res
    .json<PostgresTablePrivileges[]>()
    .find(({ schema, name }) => schema === 's 1' && name === 't 1')!

  res = await app.inject({
    method: 'POST',
    path: '/table-privileges',
    payload: [
      {
        relation_id,
        grantee: 'r',
        privilege_type: 'ALL',
      },
    ],
  })
  let privs = res.json<PostgresTablePrivileges[]>()
  expect(privs.length).toBe(1)
  expect(privs[0]).toMatchInlineSnapshot(
    { relation_id: expect.any(Number) },
    `
    {
      "kind": "table",
      "name": "t 1",
      "privileges": [
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRIGGER",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "REFERENCES",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRUNCATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "DELETE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "UPDATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "SELECT",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "INSERT",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRIGGER",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "REFERENCES",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRUNCATE",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "DELETE",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "UPDATE",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "SELECT",
        },
        {
          "grantee": "r",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "INSERT",
        },
      ],
      "relation_id": Any<Number>,
      "schema": "s 1",
    }
  `
  )

  res = await app.inject({
    method: 'DELETE',
    path: '/table-privileges',
    payload: [
      {
        relation_id,
        grantee: 'r',
        privilege_type: 'ALL',
      },
    ],
  })
  privs = res.json<PostgresTablePrivileges[]>()
  expect(privs.length).toBe(1)
  expect(privs[0]).toMatchInlineSnapshot(
    { relation_id: expect.any(Number) },
    `
    {
      "kind": "table",
      "name": "t 1",
      "privileges": [
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRIGGER",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "REFERENCES",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "TRUNCATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "DELETE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "UPDATE",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "SELECT",
        },
        {
          "grantee": "postgres",
          "grantor": "postgres",
          "is_grantable": false,
          "privilege_type": "INSERT",
        },
      ],
      "relation_id": Any<Number>,
      "schema": "s 1",
    }
  `
  )

  res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `drop role r; drop schema "s 1" cascade;`,
    },
  })
  if (res.json().error) {
    throw new Error(res.payload)
  }
})

test('lists privileges for a non-owner role', async () => {
  const admin = new PostgresMeta({
    max: 1,
    connectionString: 'postgresql://postgres:postgres@localhost:5432',
  })
  const role = `table_priv_reader_${Date.now()}`
  const reader = new PostgresMeta({
    max: 1,
    connectionString: `postgresql://${role}:reader@localhost:5432/postgres`,
  })

  let roleCreated = false

  try {
    const created = await admin.query(`create role "${role}" login password 'reader'`)
    expect(created.error, JSON.stringify(created.error)).toBeNull()
    roleCreated = true

    const granted = await admin.query(`grant select on table public.todos to "${role}"`)
    expect(granted.error, JSON.stringify(granted.error)).toBeNull()

    const res = await reader.tablePrivileges.list()
    expect(res.error, JSON.stringify(res.error)).toBeNull()

    const todos = res.data?.find(({ schema, name }) => schema === 'public' && name === 'todos')
    expect(todos).toBeDefined()
    expect(todos?.privileges).toContainEqual({
      grantee: role,
      grantor: 'postgres',
      is_grantable: false,
      privilege_type: 'SELECT',
    })
  } finally {
    await reader.end()
    if (roleCreated) {
      await admin.query(`drop owned by "${role}"`)
    }
    await admin.query(`drop role if exists "${role}"`)
    await admin.end()
  }
})
