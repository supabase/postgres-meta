import { expect, test } from 'vitest'
import { pgMeta } from './utils'

test('relationships list includes columns for dotted schema names', async () => {
  await pgMeta.query(`
    create schema "odd.schema";
    create table "odd.schema".parent (id int8 primary key);
    create table "odd.schema".child (
      id int8 primary key,
      parent_id int8 references "odd.schema".parent (id)
    );
  `)

  const res = await pgMeta.relationships.list({
    includedSchemas: ['odd.schema'],
  })
  expect(res.error).toBeNull()

  const rel = res.data?.find((r) => r.schema === 'odd.schema' && r.relation === 'child')
  expect(rel).toMatchObject({
    schema: 'odd.schema',
    relation: 'child',
    referenced_schema: 'odd.schema',
    referenced_relation: 'parent',
    columns: ['parent_id'],
    referenced_columns: ['id'],
  })

  await pgMeta.query(`drop schema "odd.schema" cascade`)
})

test('relationships list includes columns for mixed-case schema names', async () => {
  await pgMeta.query(`
    create schema "MySchema";
    create table "MySchema".parent (id int8 primary key);
    create table "MySchema".child (
      id int8 primary key,
      parent_id int8 references "MySchema".parent (id)
    );
  `)

  const res = await pgMeta.relationships.list({
    includedSchemas: ['MySchema'],
  })
  expect(res.error).toBeNull()

  const rel = res.data?.find((r) => r.schema === 'MySchema' && r.relation === 'child')
  expect(rel?.columns).toEqual(['parent_id'])
  expect(rel?.referenced_columns).toEqual(['id'])

  await pgMeta.query(`drop schema "MySchema" cascade`)
})
