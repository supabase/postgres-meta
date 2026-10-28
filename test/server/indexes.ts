import { expect, test } from 'vitest'
import { PostgresIndex } from '../../src/lib/types'
import { app } from './utils'

test('list indexes', async () => {
  const res = await app.inject({ method: 'GET', path: '/indexes' })
  const index = res
    .json<PostgresIndex[]>()
    .find(
      ({ index_definition }) =>
        index_definition === 'CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id)'
    )!
  expect(index).toMatchInlineSnapshot(
    `
    {
      "access_method": "btree",
      "check_xmin": false,
      "class": [
        3124,
      ],
      "collation": [
        0,
      ],
      "comment": null,
      "id": 16400,
      "index_attributes": [
        {
          "attribute_name": "id",
          "attribute_number": 1,
          "data_type": "bigint",
        },
      ],
      "index_definition": "CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id)",
      "index_predicate": null,
      "is_clustered": false,
      "is_exclusion": false,
      "is_immediate": true,
      "is_live": true,
      "is_primary": true,
      "is_ready": true,
      "is_replica_identity": false,
      "is_unique": true,
      "is_valid": true,
      "key_attributes": [
        1,
      ],
      "number_of_attributes": 1,
      "number_of_key_attributes": 1,
      "options": [
        0,
      ],
      "schema": "public",
      "table_id": 16393,
    }
  `
  )
})

test('index_definition is scoped to the index schema', async () => {
  let res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        drop schema if exists private cascade;
        drop table if exists public.dup_idx cascade;
        create schema private;
        create table public.dup_idx (id int primary key);
        create table private.dup_idx (id int primary key);
      `,
    },
  })
  if (res.json().error) {
    throw new Error(res.payload)
  }

  res = await app.inject({ method: 'GET', path: '/indexes' })
  const indexes = res.json<PostgresIndex[]>()
  const privatePkeys = indexes.filter(
    ({ schema, index_definition }) =>
      schema === 'private' && index_definition.includes('dup_idx_pkey')
  )

  expect(privatePkeys).toHaveLength(1)
  expect(privatePkeys[0].index_definition).toBe(
    'CREATE UNIQUE INDEX dup_idx_pkey ON private.dup_idx USING btree (id)'
  )
  expect(privatePkeys[0].index_definition).not.toContain('public.dup_idx')

  res = await app.inject({ method: 'GET', path: `/indexes/${privatePkeys[0].id}` })
  expect(res.json<PostgresIndex>().index_definition).toBe(privatePkeys[0].index_definition)

  res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `drop schema private cascade; drop table public.dup_idx cascade;`,
    },
  })
  if (res.json().error) {
    throw new Error(res.payload)
  }
})

test('retrieve index', async () => {
  const res = await app.inject({ method: 'GET', path: '/indexes/16400' })
  const index = res.json<PostgresIndex>()
  expect(index).toMatchInlineSnapshot(
    `
    {
      "access_method": "btree",
      "check_xmin": false,
      "class": [
        3124,
      ],
      "collation": [
        0,
      ],
      "comment": null,
      "id": 16400,
      "index_attributes": [
        {
          "attribute_name": "id",
          "attribute_number": 1,
          "data_type": "bigint",
        },
      ],
      "index_definition": "CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id)",
      "index_predicate": null,
      "is_clustered": false,
      "is_exclusion": false,
      "is_immediate": true,
      "is_live": true,
      "is_primary": true,
      "is_ready": true,
      "is_replica_identity": false,
      "is_unique": true,
      "is_valid": true,
      "key_attributes": [
        1,
      ],
      "number_of_attributes": 1,
      "number_of_key_attributes": 1,
      "options": [
        0,
      ],
      "schema": "public",
      "table_id": 16393,
    }
  `
  )
})
