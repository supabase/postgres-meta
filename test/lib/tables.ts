import { pgMeta } from './utils'

const cleanNondet = (x: any) => {
  const {
    data: { columns, primary_keys, relationships, ...rest2 },
    ...rest1
  } = x

  return {
    data: {
      columns: columns.map(({ id, table_id, ...rest }: any) => rest),
      primary_keys: primary_keys.map(({ table_id, ...rest }: any) => rest),
      relationships: relationships.map(({ id, ...rest }: any) => rest),
      ...rest2,
    },
    ...rest1,
  }
}

test('list schemas', async () => {
  const res = await pgMeta.tables.list({ schemas: ['private'] })
  const data = res.data?.find(({ name }) => name === 'users')
  expect(data).toBeUndefined()
})

test('list', async () => {
  const res = await pgMeta.tables.list()

  const { columns, primary_keys, relationships, ...rest }: any = res.data?.find(
    ({ name }) => name === 'users'
  )

  expect({
    columns: columns.map(({ id, table_id, ...rest }: any) => rest),
    primary_keys: primary_keys.map(({ table_id, ...rest }: any) => rest),
    relationships: relationships.map(({ id, ...rest }: any) => rest),
    ...rest,
  }).toMatchInlineSnapshot(
    {
      bytes: expect.any(Number),
      dead_rows_estimate: expect.any(Number),
      id: expect.any(Number),
      live_rows_estimate: expect.any(Number),
      size: expect.any(String),
    },
    `
    Object {
      "bytes": Any<Number>,
      "columns": Array [
        Object {
          "comment": null,
          "data_type": "bigint",
          "default_value": null,
          "enums": Array [],
          "format": "int8",
          "identity_generation": "BY DEFAULT",
          "is_generated": false,
          "is_identity": true,
          "is_nullable": false,
          "is_unique": false,
          "is_updatable": true,
          "name": "id",
          "ordinal_position": 1,
          "schema": "public",
          "table": "users",
        },
        Object {
          "comment": null,
          "data_type": "text",
          "default_value": null,
          "enums": Array [],
          "format": "text",
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "name",
          "ordinal_position": 2,
          "schema": "public",
          "table": "users",
        },
        Object {
          "comment": null,
          "data_type": "USER-DEFINED",
          "default_value": "'ACTIVE'::user_status",
          "enums": Array [
            "ACTIVE",
            "INACTIVE",
          ],
          "format": "user_status",
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "status",
          "ordinal_position": 3,
          "schema": "public",
          "table": "users",
        },
      ],
      "comment": null,
      "dead_rows_estimate": Any<Number>,
      "id": Any<Number>,
      "live_rows_estimate": Any<Number>,
      "name": "users",
      "primary_keys": Array [
        Object {
          "name": "id",
          "schema": "public",
          "table_name": "users",
        },
      ],
      "relationships": Array [
        Object {
          "constraint_name": "todos_user-id_fkey",
          "source_column_name": "user-id",
          "source_schema": "public",
          "source_table_name": "todos",
          "target_column_name": "id",
          "target_table_name": "users",
          "target_table_schema": "public",
        },
      ],
      "replica_identity": "DEFAULT",
      "rls_enabled": false,
      "rls_forced": false,
      "schema": "public",
      "size": Any<String>,
    }
  `
  )
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.tables.create({ name: 'test', comment: 'foo' })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": "foo",
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "test",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "DEFAULT",
        "rls_enabled": false,
        "rls_forced": false,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.tables.retrieve({ id: res.data!.id })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": "foo",
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "test",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "DEFAULT",
        "rls_enabled": false,
        "rls_forced": false,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.tables.update(res.data!.id, {
    name: 'test a',
    rls_enabled: true,
    rls_forced: true,
    replica_identity: 'NOTHING',
    comment: 'foo',
  })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": "foo",
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "test a",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "NOTHING",
        "rls_enabled": true,
        "rls_forced": true,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.tables.remove(res.data!.id)
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": "foo",
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "test a",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "NOTHING",
        "rls_enabled": true,
        "rls_forced": true,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.tables.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a table with ID \d+$/),
    },
  })
})

test('update with name unchanged', async () => {
  let res = await pgMeta.tables.create({ name: 't' })
  res = await pgMeta.tables.update(res.data!.id, {
    name: 't',
  })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": null,
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "t",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "DEFAULT",
        "rls_enabled": false,
        "rls_forced": false,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  await pgMeta.tables.remove(res.data!.id)
})

test("allow ' in comments", async () => {
  let res = await pgMeta.tables.create({ name: 't', comment: "'" })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "bytes": 0,
        "columns": Array [],
        "comment": "'",
        "dead_rows_estimate": 0,
        "id": Any<Number>,
        "live_rows_estimate": 0,
        "name": "t",
        "primary_keys": Array [],
        "relationships": Array [],
        "replica_identity": "DEFAULT",
        "rls_enabled": false,
        "rls_forced": false,
        "schema": "public",
        "size": "0 bytes",
      },
      "error": null,
    }
  `
  )
  await pgMeta.tables.remove(res.data!.id)
})

test('primary keys', async () => {
  let res = await pgMeta.tables.create({ name: 't' })
  await pgMeta.columns.create({ table_id: res.data!.id, name: 'c', type: 'int8' })
  await pgMeta.columns.create({ table_id: res.data!.id, name: 'cc', type: 'text' })
  res = await pgMeta.tables.update(res.data!.id, {
    primary_keys: [{ name: 'c' }, { name: 'cc' }],
  })
  expect(cleanNondet(res)).toMatchInlineSnapshot(
    {
      data: {
        bytes: expect.any(Number),
        dead_rows_estimate: expect.any(Number),
        id: expect.any(Number),
        live_rows_estimate: expect.any(Number),
        size: expect.any(String),
      },
    },
    `
    Object {
      "data": Object {
        "bytes": Any<Number>,
        "columns": Array [
          Object {
            "comment": null,
            "data_type": "bigint",
            "default_value": null,
            "enums": Array [],
            "format": "int8",
            "identity_generation": null,
            "is_generated": false,
            "is_identity": false,
            "is_nullable": false,
            "is_unique": false,
            "is_updatable": true,
            "name": "c",
            "ordinal_position": 1,
            "schema": "public",
            "table": "t",
          },
          Object {
            "comment": null,
            "data_type": "text",
            "default_value": null,
            "enums": Array [],
            "format": "text",
            "identity_generation": null,
            "is_generated": false,
            "is_identity": false,
            "is_nullable": false,
            "is_unique": false,
            "is_updatable": true,
            "name": "cc",
            "ordinal_position": 2,
            "schema": "public",
            "table": "t",
          },
        ],
        "comment": null,
        "dead_rows_estimate": Any<Number>,
        "id": Any<Number>,
        "live_rows_estimate": Any<Number>,
        "name": "t",
        "primary_keys": Array [
          Object {
            "name": "c",
            "schema": "public",
            "table_name": "t",
          },
          Object {
            "name": "cc",
            "schema": "public",
            "table_name": "t",
          },
        ],
        "relationships": Array [],
        "replica_identity": "DEFAULT",
        "rls_enabled": false,
        "rls_forced": false,
        "schema": "public",
        "size": Any<String>,
      },
      "error": null,
    }
  `
  )
  await pgMeta.tables.remove(res.data!.id)
})
