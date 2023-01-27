import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.types.list()
  expect(res.data?.find(({ name }) => name === 'user_status')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    {
      "attributes": [],
      "comment": null,
      "enums": [
        "ACTIVE",
        "INACTIVE",
      ],
      "format": "user_status",
      "id": Any<Number>,
      "name": "user_status",
      "schema": "public",
    }
  `
  )
})

test('list types with included schemas', async () => {
  let res = await pgMeta.types.list({
    includedSchemas: ['public'],
  })

  expect(res.data?.length).toBeGreaterThan(0)

  res.data?.forEach((type) => {
    expect(type.schema).toBe('public')
  })
})

test('list types with excluded schemas', async () => {
  let res = await pgMeta.types.list({
    excludedSchemas: ['public'],
  })

  res.data?.forEach((type) => {
    expect(type.schema).not.toBe('public')
  })
})

test('list types with excluded schemas and include System Schemas', async () => {
  let res = await pgMeta.types.list({
    excludedSchemas: ['public'],
    includeSystemSchemas: true,
  })

  expect(res.data?.length).toBeGreaterThan(0)

  res.data?.forEach((type) => {
    expect(type.schema).not.toBe('public')
  })
})

test('composite type attributes', async () => {
  await pgMeta.query(`create type test_composite as (id int8, data text);`)

  const res = await pgMeta.types.list()
  expect(res.data?.find(({ name }) => name === 'test_composite')).toMatchInlineSnapshot(
    { id: expect.any(Number) },
    `
    {
      "attributes": [
        {
          "name": "id",
          "type_id": 20,
        },
        {
          "name": "data",
          "type_id": 25,
        },
      ],
      "comment": null,
      "enums": [],
      "format": "test_composite",
      "id": Any<Number>,
      "name": "test_composite",
      "schema": "public",
    }
  `
  )

  await pgMeta.query(`drop type test_composite;`)
})
