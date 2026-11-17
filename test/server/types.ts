import { expect, test } from 'vitest'
import { app } from './utils'

test('type list with limit', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types?limit=2',
  })
  expect(res.statusCode).toBe(200)
  expect(res.json()).toHaveLength(2)
})

test('type list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/types?included_schemas=public',
  })
  expect(res.statusCode).toBe(200)
  const types = res.json()
  expect(types.length).toBeGreaterThan(0)
  types.forEach((type) => {
    expect(type.schema).toBe('public')
  })
})

test('type list with array types', async () => {
  const isArray = (type) => type.name.startsWith('_')
  const without = await app.inject({ method: 'GET', path: '/types?included_schemas=public' })
  expect(without.json().filter(isArray)).toHaveLength(0)
  const withArrays = await app.inject({
    method: 'GET',
    path: '/types?included_schemas=public&include_array_types=true',
  })
  expect(withArrays.statusCode).toBe(200)
  expect(withArrays.json().filter(isArray).length).toBeGreaterThan(0)
})

test('type list with unknown schema', async () => {
  const res = await app.inject({ method: 'GET', path: '/types?included_schemas=nonexistent' })
  expect(res.statusCode).toBe(200)
  expect(res.json()).toHaveLength(0)
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
