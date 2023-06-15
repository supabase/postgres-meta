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
  expect(privs.length === 1)
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
  expect(privs.length === 1)
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
