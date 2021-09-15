import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.columns.list()
  expect(res.data?.find(({ name }) => name === 'user-id')).toMatchInlineSnapshot(`
Object {
  "comment": null,
  "data_type": "bigint",
  "default_value": null,
  "enums": Array [],
  "format": "int8",
  "id": "16402.3",
  "identity_generation": null,
  "is_identity": false,
  "is_nullable": false,
  "is_updatable": true,
  "name": "user-id",
  "ordinal_position": 3,
  "schema": "public",
  "table": "todos",
  "table_id": 16402,
}
`)
})

test('retrieve, create, update, delete', async () => {
  const { data: testTable }: any = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'int2',
    default_value: 42,
    comment: 'foo',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "foo",
    "data_type": "smallint",
    "default_value": "'42'::smallint",
    "enums": Array [],
    "format": "int2",
    "id": "16474.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16474,
  },
  "error": null,
}
`)
  res = await pgMeta.columns.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "foo",
    "data_type": "smallint",
    "default_value": "'42'::smallint",
    "enums": Array [],
    "format": "int2",
    "id": "16474.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16474,
  },
  "error": null,
}
`)
  res = await pgMeta.columns.update(res.data!.id, {
    name: 'c1',
    type: 'int4',
    drop_default: true,
    is_identity: true,
    identity_generation: 'ALWAYS',
    is_nullable: false,
    comment: 'bar',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "bar",
    "data_type": "integer",
    "default_value": null,
    "enums": Array [],
    "format": "int4",
    "id": "16474.1",
    "identity_generation": "ALWAYS",
    "is_identity": true,
    "is_nullable": false,
    "is_updatable": true,
    "name": "c1",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16474,
  },
  "error": null,
}
`)
  res = await pgMeta.columns.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": "bar",
    "data_type": "integer",
    "default_value": null,
    "enums": Array [],
    "format": "int4",
    "id": "16474.1",
    "identity_generation": "ALWAYS",
    "is_identity": true,
    "is_nullable": false,
    "is_updatable": true,
    "name": "c1",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16474,
  },
  "error": null,
}
`)
  res = await pgMeta.columns.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a column with ID \d+.1$/),
    },
  })

  await pgMeta.tables.remove(testTable!.id)
})

test('enum column with quoted name', async () => {
  await pgMeta.query('CREATE TYPE "T" AS ENUM (\'v\'); CREATE TABLE t ( c "T" );')

  const res = await pgMeta.columns.list()
  expect(res.data!.find(({ table }) => table === 't')).toMatchInlineSnapshot(`
Object {
  "comment": null,
  "data_type": "USER-DEFINED",
  "default_value": null,
  "enums": Array [
    "v",
  ],
  "format": "T",
  "id": "16487.1",
  "identity_generation": null,
  "is_identity": false,
  "is_nullable": true,
  "is_updatable": true,
  "name": "c",
  "ordinal_position": 1,
  "schema": "public",
  "table": "t",
  "table_id": 16487,
}
`)

  await pgMeta.query('DROP TABLE t; DROP TYPE "T";')
})

test('primary key column', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'int2',
    is_primary_key: true,
  })
  const res = await pgMeta.query(`
SELECT a.attname
FROM   pg_index i
JOIN   pg_attribute a ON a.attrelid = i.indrelid
                     AND a.attnum = ANY(i.indkey)
WHERE  i.indrelid = '${testTable!.name}'::regclass
AND    i.indisprimary;
`)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "attname": "c",
    },
  ],
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('unique column', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'int2',
    is_unique: true,
  })
  const res = await pgMeta.query(`
SELECT a.attname
FROM   pg_index i
JOIN   pg_constraint c ON c.conindid = i.indexrelid
JOIN   pg_attribute a ON a.attrelid = i.indrelid
                    AND a.attnum = ANY(i.indkey)
WHERE  i.indrelid = '${testTable!.name}'::regclass
AND    i.indisunique;
`)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "attname": "c",
    },
  ],
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('array column', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  const res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'int2[]',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "ARRAY",
    "default_value": null,
    "enums": Array [],
    "format": "_int2",
    "id": "16500.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16500,
  },
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('column with default value', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  const res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'timestamptz',
    default_value: 'NOW()',
    default_value_format: 'expression',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "timestamp with time zone",
    "default_value": "now()",
    "enums": Array [],
    "format": "timestamptz",
    "id": "16506.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16506,
  },
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('column with constraint', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'text',
    check: "description <> ''",
  })
  const res = await pgMeta.query(`
SELECT pg_get_constraintdef((
  SELECT c.oid
  FROM   pg_constraint c
  WHERE  c.conrelid = '${testTable!.name}'::regclass
));
`)
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Array [
    Object {
      "pg_get_constraintdef": null,
    },
  ],
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('update with name unchanged', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'int2',
  })
  res = await pgMeta.columns.update(res.data!.id, {
    name: 'c',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "smallint",
    "default_value": null,
    "enums": Array [],
    "format": "int2",
    "id": "16513.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16513,
  },
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('update with incompatible types', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'text',
  })
  res = await pgMeta.columns.update(res.data!.id, {
    type: 'int4',
  })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "integer",
    "default_value": null,
    "enums": Array [],
    "format": "int4",
    "id": "16516.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16516,
  },
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})

test('update is_unique', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'text',
    is_unique: false,
  })
  res = await pgMeta.columns.update(res.data!.id, { is_unique: true })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "text",
    "default_value": null,
    "enums": Array [],
    "format": "text",
    "id": "16525.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_unique": true,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16525,
  },
  "error": null,
}
`)
  res = await pgMeta.columns.update(res.data!.id, { is_unique: false })
  expect(res).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "comment": null,
    "data_type": "text",
    "default_value": null,
    "enums": Array [],
    "format": "text",
    "id": "16525.1",
    "identity_generation": null,
    "is_identity": false,
    "is_nullable": true,
    "is_unique": false,
    "is_updatable": true,
    "name": "c",
    "ordinal_position": 1,
    "schema": "public",
    "table": "t",
    "table_id": 16525,
  },
  "error": null,
}
`)

  await pgMeta.tables.remove(testTable!.id)
})
