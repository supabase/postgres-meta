import { expect, test } from 'vitest'
import { app } from './utils'

test('type list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const types = res.json()
  expect(Array.isArray(types)).toBe(true)
  expect(types.length).toBeLessThanOrEqual(5)
})

test('type list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types?includedSchemas=public',
  })
  expect(res.statusCode).toBe(200)
  const types = res.json()
  expect(Array.isArray(types)).toBe(true)
  // All types should be in the public schema
  types.forEach((type) => {
    expect(type.schema).toBe('public')
  })
})

test('type list excluding array types', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types?includeArrayTypes=false',
  })
  expect(res.statusCode).toBe(200)
  const types = res.json()
  expect(Array.isArray(types)).toBe(true)
  // Should not include array types
  const arrayTypes = types.filter((type) => type.name.startsWith('_'))
  expect(arrayTypes.length).toBe(0)
})

test('type with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('type with enum values', async () => {
  // Find an enum type first
  const listRes = await app.inject({
    method: 'GET',
    path: '/types',
  })
  expect(listRes.statusCode).toBe(200)
  const types = listRes.json()
  const enumType = types.find((t) => t.name === 'meme_status')

  expect(Array.isArray(enumType.enums)).toBe(true)
  expect(enumType.enums.length).toBeGreaterThan(0)
})
