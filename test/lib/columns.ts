import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.columns.list()
  expect(res.data?.find(({ name }) => name === 'user-id')).toMatchInlineSnapshot(
    {
      id: expect.stringMatching(/^\d+\.3$/),
      table_id: expect.any(Number),
    },
    `
    Object {
      "comment": null,
      "data_type": "bigint",
      "default_value": null,
      "enums": Array [],
      "format": "int8",
      "id": StringMatching /\\^\\\\d\\+\\\\\\.3\\$/,
      "identity_generation": null,
      "is_generated": false,
      "is_identity": false,
      "is_nullable": false,
      "is_unique": false,
      "is_updatable": true,
      "name": "user-id",
      "ordinal_position": 3,
      "schema": "public",
      "table": "todos",
      "table_id": Any<Number>,
    }
  `
  )
})

test('list from a single table', async () => {
  const { data: testTable }: any = await pgMeta.tables.create({ name: 't' })
  await pgMeta.query('alter table t add c1 text, add c2 text')

  const res = await pgMeta.columns.list({ tableId: testTable!.id })
  expect(res).toMatchInlineSnapshot(
    {
      data: [
        {
          id: expect.stringMatching(/^\d+\.\d+$/),
          table_id: expect.any(Number),
        },
        {
          id: expect.stringMatching(/^\d+\.\d+$/),
          table_id: expect.any(Number),
        },
      ],
    },
    `
    Object {
      "data": Array [
        Object {
          "comment": null,
          "data_type": "text",
          "default_value": null,
          "enums": Array [],
          "format": "text",
          "id": StringMatching /\\^\\\\d\\+\\\\\\.\\\\d\\+\\$/,
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "c1",
          "ordinal_position": 1,
          "schema": "public",
          "table": "t",
          "table_id": Any<Number>,
        },
        Object {
          "comment": null,
          "data_type": "text",
          "default_value": null,
          "enums": Array [],
          "format": "text",
          "id": StringMatching /\\^\\\\d\\+\\\\\\.\\\\d\\+\\$/,
          "identity_generation": null,
          "is_generated": false,
          "is_identity": false,
          "is_nullable": true,
          "is_unique": false,
          "is_updatable": true,
          "name": "c2",
          "ordinal_position": 2,
          "schema": "public",
          "table": "t",
          "table_id": Any<Number>,
        },
      ],
      "error": null,
    }
  `
  )

  await pgMeta.tables.remove(testTable!.id)
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
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.stringMatching(/^\d+\.1$/), table_id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "comment": "foo",
        "data_type": "smallint",
        "default_value": "'42'::smallint",
        "enums": Array [],
        "format": "int2",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.columns.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    {
      data: { id: expect.stringMatching(/^\d+\.1$/), table_id: expect.any(Number) },
    },
    `
    Object {
      "data": Object {
        "comment": "foo",
        "data_type": "smallint",
        "default_value": "'42'::smallint",
        "enums": Array [],
        "format": "int2",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.columns.update(res.data!.id, {
    name: 'c1',
    type: 'int4',
    drop_default: true,
    is_identity: true,
    identity_generation: 'ALWAYS',
    is_nullable: false,
    comment: 'bar',
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: { id: expect.stringMatching(/^\d+\.1$/), table_id: expect.any(Number) },
    },
    `
    Object {
      "data": Object {
        "comment": "bar",
        "data_type": "integer",
        "default_value": null,
        "enums": Array [],
        "format": "int4",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": "ALWAYS",
        "is_generated": false,
        "is_identity": true,
        "is_nullable": false,
        "is_unique": false,
        "is_updatable": true,
        "name": "c1",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.columns.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    {
      data: { id: expect.stringMatching(/^\d+\.1$/), table_id: expect.any(Number) },
    },
    `
    Object {
      "data": Object {
        "comment": "bar",
        "data_type": "integer",
        "default_value": null,
        "enums": Array [],
        "format": "int4",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": "ALWAYS",
        "is_generated": false,
        "is_identity": true,
        "is_nullable": false,
        "is_unique": false,
        "is_updatable": true,
        "name": "c1",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
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
  expect(res.data!.find(({ table }) => table === 't')).toMatchInlineSnapshot(
    {
      id: expect.stringMatching(/^\d+\.1$/),
      table_id: expect.any(Number),
    },
    `
    Object {
      "comment": null,
      "data_type": "USER-DEFINED",
      "default_value": null,
      "enums": Array [
        "v",
      ],
      "format": "T",
      "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
      "identity_generation": null,
      "is_generated": false,
      "is_identity": false,
      "is_nullable": true,
      "is_unique": false,
      "is_updatable": true,
      "name": "c",
      "ordinal_position": 1,
      "schema": "public",
      "table": "t",
      "table_id": Any<Number>,
    }
  `
  )

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
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "ARRAY",
        "default_value": null,
        "enums": Array [],
        "format": "_int2",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

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
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "timestamp with time zone",
        "default_value": "now()",
        "enums": Array [],
        "format": "timestamptz",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

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
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "smallint",
        "default_value": null,
        "enums": Array [],
        "format": "int2",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

  await pgMeta.tables.remove(testTable!.id)
})

test('update with array types', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'text',
  })
  res = await pgMeta.columns.update(res.data!.id, {
    type: 'text[]',
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "ARRAY",
        "default_value": null,
        "enums": Array [],
        "format": "_text",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

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
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "integer",
        "default_value": null,
        "enums": Array [],
        "format": "int4",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

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
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "text",
        "default_value": null,
        "enums": Array [],
        "format": "text",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": true,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.columns.update(res.data!.id, { is_unique: false })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "text",
        "default_value": null,
        "enums": Array [],
        "format": "text",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

  await pgMeta.tables.remove(testTable!.id)
})

// https://github.com/supabase/supabase/issues/3553
test('alter column to type with uppercase', async () => {
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })
  await pgMeta.query('CREATE TYPE "T" AS ENUM ()')

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: 'text',
    is_unique: false,
  })
  res = await pgMeta.columns.update(res.data!.id, { type: 'T' })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "USER-DEFINED",
        "default_value": null,
        "enums": Array [],
        "format": "T",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

  await pgMeta.tables.remove(testTable!.id)
  await pgMeta.query('DROP TYPE "T"')
})

test('enums are populated in enum array columns', async () => {
  await pgMeta.query(`create type test_enum as enum ('a')`)
  const { data: testTable } = await pgMeta.tables.create({ name: 't' })

  let res = await pgMeta.columns.create({
    table_id: testTable!.id,
    name: 'c',
    type: '_test_enum',
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.stringMatching(/^\d+\.1$/),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "comment": null,
        "data_type": "ARRAY",
        "default_value": null,
        "enums": Array [
          "a",
        ],
        "format": "_test_enum",
        "id": StringMatching /\\^\\\\d\\+\\\\\\.1\\$/,
        "identity_generation": null,
        "is_generated": false,
        "is_identity": false,
        "is_nullable": true,
        "is_unique": false,
        "is_updatable": true,
        "name": "c",
        "ordinal_position": 1,
        "schema": "public",
        "table": "t",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )

  await pgMeta.tables.remove(testTable!.id)
  await pgMeta.query(`drop type test_enum`)
})
