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

test('index attributes for indexes not on the leading table columns', async () => {
  let res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        drop table if exists public.index_attr_test cascade;
        create table public.index_attr_test (id int, name text, email text);
        create index idx_attr_single_email on public.index_attr_test (email);
        create index idx_attr_composite on public.index_attr_test (email, name);
      `,
    },
  })
  if (res.json().error) {
    throw new Error(res.payload)
  }

  res = await app.inject({ method: 'GET', path: '/indexes' })
  const indexes = res.json<PostgresIndex[]>()

  const single = indexes.find(
    ({ index_definition }) =>
      index_definition ===
      'CREATE INDEX idx_attr_single_email ON public.index_attr_test USING btree (email)'
  )!
  expect(single.index_attributes).toEqual([
    { attribute_name: 'email', attribute_number: 1, data_type: 'text' },
  ])

  const composite = indexes.find(
    ({ index_definition }) =>
      index_definition ===
      'CREATE INDEX idx_attr_composite ON public.index_attr_test USING btree (email, name)'
  )!
  expect(composite.index_attributes).toEqual([
    { attribute_name: 'email', attribute_number: 1, data_type: 'text' },
    { attribute_name: 'name', attribute_number: 2, data_type: 'text' },
  ])

  res = await app.inject({ method: 'GET', path: `/indexes/${single.id}` })
  expect(res.json<PostgresIndex>().id).toBe(single.id)

  res = await app.inject({
    method: 'POST',
    path: '/query',
    payload: { query: `drop table public.index_attr_test;` },
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
