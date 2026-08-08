import { expect, test } from 'vitest'
import { app } from './utils'

test('function list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const functions = res.json()
  expect(Array.isArray(functions)).toBe(true)
  expect(functions.length).toBeLessThanOrEqual(5)
})

test('function list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions?includedSchemas=public',
  })
  expect(res.statusCode).toBe(200)
  const functions = res.json()
  expect(Array.isArray(functions)).toBe(true)
  // All functions should be in the public schema
  functions.forEach((func) => {
    expect(func.schema).toBe('public')
  })
})

test('function list exclude system schemas', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions?includeSystemSchemas=false',
  })
  expect(res.statusCode).toBe(200)
  const functions = res.json()
  expect(Array.isArray(functions)).toBe(true)
  // No functions should be in pg_ schemas
  functions.forEach((func) => {
    expect(func.schema).not.toMatch(/^pg_/)
  })
})

test('function with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('create function with invalid arguments', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/functions',
    payload: {
      name: 'invalid_function',
      schema: 'public',
      // Missing required args
    },
  })
  expect(res.statusCode).toBe(400)
})

test('update function with invalid id', async () => {
  const res = await app.inject({
    method: 'PATCH',
    path: '/functions/99999999',
    payload: {
      name: 'renamed_function',
    },
  })
  expect(res.statusCode).toBe(404)
})

test('delete function with invalid id', async () => {
  const res = await app.inject({
    method: 'DELETE',
    path: '/functions/99999999',
  })
  expect(res.statusCode).toBe(404)
})
