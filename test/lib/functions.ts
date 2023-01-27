import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.functions.list()
  expect(res.data?.find(({ name }) => name === 'add')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    {
      "args": [
        {
          "has_default": false,
          "mode": "in",
          "name": "",
          "type_id": 23,
        },
        {
          "has_default": false,
          "mode": "in",
          "name": "",
          "type_id": 23,
        },
      ],
      "argument_types": "integer, integer",
      "behavior": "IMMUTABLE",
      "complete_statement": "CREATE OR REPLACE FUNCTION public.add(integer, integer)
     RETURNS integer
     LANGUAGE sql
     IMMUTABLE STRICT
    AS $function$select $1 + $2;$function$
    ",
      "config_params": null,
      "definition": "select $1 + $2;",
      "id": Any<Number>,
      "identity_argument_types": "integer, integer",
      "language": "sql",
      "name": "add",
      "return_type": "int4",
      "schema": "public",
      "security_definer": false,
    }
  `
  )
})

test('list functions with included schemas', async () => {
  let res = await pgMeta.functions.list({
    includedSchemas: ['public'],
  })

  expect(res.data?.length).toBeGreaterThan(0)

  res.data?.forEach((func) => {
    expect(func.schema).toBe('public')
  })
})

test('list functions with excluded schemas', async () => {
  let res = await pgMeta.functions.list({
    excludedSchemas: ['public'],
  })

  res.data?.forEach((func) => {
    expect(func.schema).not.toBe('public')
  })
})

test('list functions with excluded schemas and include System Schemas', async () => {
  let res = await pgMeta.functions.list({
    excludedSchemas: ['public'],
    includeSystemSchemas: true,
  })

  expect(res.data?.length).toBeGreaterThan(0)

  res.data?.forEach((func) => {
    expect(func.schema).not.toBe('public')
  })
})

test('retrieve, create, update, delete', async () => {
  const {
    data: { id: testSchemaId },
  }: any = await pgMeta.schemas.create({ name: 'test_schema' })

  let res = await pgMeta.functions.create({
    name: 'test_func',
    schema: 'public',
    args: ['a int2', 'b int2'],
    definition: 'select a + b',
    return_type: 'integer',
    language: 'sql',
    behavior: 'STABLE',
    security_definer: true,
    config_params: { search_path: 'hooks, auth', role: 'postgres' },
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    {
      "data": {
        "args": [
          {
            "has_default": false,
            "mode": "in",
            "name": "a",
            "type_id": 21,
          },
          {
            "has_default": false,
            "mode": "in",
            "name": "b",
            "type_id": 21,
          },
        ],
        "argument_types": "a smallint, b smallint",
        "behavior": "STABLE",
        "complete_statement": "CREATE OR REPLACE FUNCTION public.test_func(a smallint, b smallint)
     RETURNS integer
     LANGUAGE sql
     STABLE SECURITY DEFINER
     SET search_path TO 'hooks', 'auth'
     SET role TO 'postgres'
    AS $function$select a + b$function$
    ",
        "config_params": {
          "role": "postgres",
          "search_path": "hooks, auth",
        },
        "definition": "select a + b",
        "id": Any<Number>,
        "identity_argument_types": "a smallint, b smallint",
        "language": "sql",
        "name": "test_func",
        "return_type": "int4",
        "schema": "public",
        "security_definer": true,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.functions.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    {
      "data": {
        "args": [
          {
            "has_default": false,
            "mode": "in",
            "name": "a",
            "type_id": 21,
          },
          {
            "has_default": false,
            "mode": "in",
            "name": "b",
            "type_id": 21,
          },
        ],
        "argument_types": "a smallint, b smallint",
        "behavior": "STABLE",
        "complete_statement": "CREATE OR REPLACE FUNCTION public.test_func(a smallint, b smallint)
     RETURNS integer
     LANGUAGE sql
     STABLE SECURITY DEFINER
     SET search_path TO 'hooks', 'auth'
     SET role TO 'postgres'
    AS $function$select a + b$function$
    ",
        "config_params": {
          "role": "postgres",
          "search_path": "hooks, auth",
        },
        "definition": "select a + b",
        "id": Any<Number>,
        "identity_argument_types": "a smallint, b smallint",
        "language": "sql",
        "name": "test_func",
        "return_type": "int4",
        "schema": "public",
        "security_definer": true,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.functions.update(res.data!.id, {
    name: 'test_func_renamed',
    schema: 'test_schema',
    definition: 'select b - a',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    {
      "data": {
        "args": [
          {
            "has_default": false,
            "mode": "in",
            "name": "a",
            "type_id": 21,
          },
          {
            "has_default": false,
            "mode": "in",
            "name": "b",
            "type_id": 21,
          },
        ],
        "argument_types": "a smallint, b smallint",
        "behavior": "STABLE",
        "complete_statement": "CREATE OR REPLACE FUNCTION test_schema.test_func_renamed(a smallint, b smallint)
     RETURNS integer
     LANGUAGE sql
     STABLE SECURITY DEFINER
     SET role TO 'postgres'
     SET search_path TO 'hooks', 'auth'
    AS $function$select b - a$function$
    ",
        "config_params": {
          "role": "postgres",
          "search_path": "hooks, auth",
        },
        "definition": "select b - a",
        "id": Any<Number>,
        "identity_argument_types": "a smallint, b smallint",
        "language": "sql",
        "name": "test_func_renamed",
        "return_type": "int4",
        "schema": "test_schema",
        "security_definer": true,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.functions.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    {
      "data": {
        "args": [
          {
            "has_default": false,
            "mode": "in",
            "name": "a",
            "type_id": 21,
          },
          {
            "has_default": false,
            "mode": "in",
            "name": "b",
            "type_id": 21,
          },
        ],
        "argument_types": "a smallint, b smallint",
        "behavior": "STABLE",
        "complete_statement": "CREATE OR REPLACE FUNCTION test_schema.test_func_renamed(a smallint, b smallint)
     RETURNS integer
     LANGUAGE sql
     STABLE SECURITY DEFINER
     SET role TO 'postgres'
     SET search_path TO 'hooks', 'auth'
    AS $function$select b - a$function$
    ",
        "config_params": {
          "role": "postgres",
          "search_path": "hooks, auth",
        },
        "definition": "select b - a",
        "id": Any<Number>,
        "identity_argument_types": "a smallint, b smallint",
        "language": "sql",
        "name": "test_func_renamed",
        "return_type": "int4",
        "schema": "test_schema",
        "security_definer": true,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.functions.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a function with ID \d+$/),
    },
  })

  await pgMeta.schemas.remove(testSchemaId)
})
