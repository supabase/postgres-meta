import { expect, test } from 'vitest'
import { app } from './utils'

test('function list with limit', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions?limit=5',
  })
  expect(res.statusCode).toBe(200)
  expect(res.json()).toHaveLength(5)
})

test('function list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/functions?included_schemas=public',
  })
  expect(res.statusCode).toBe(200)
  const functions = res.json()
  expect(functions.length).toBeGreaterThan(0)
  functions.forEach((func) => {
    expect(func.schema).toBe('public')
  })
})

test('function list with system schemas', async () => {
  const withoutSystem = await app.inject({ method: 'GET', path: '/functions' })
  expect(withoutSystem.json().filter((func) => func.schema === 'pg_catalog')).toHaveLength(0)
  const withSystem = await app.inject({
    method: 'GET',
    path: '/functions?included_schemas=pg_catalog&include_system_schemas=true',
  })
  expect(withSystem.statusCode).toBe(200)
  const functions = withSystem.json()
  expect(functions.length).toBeGreaterThan(0)
  functions.forEach((func) => {
    expect(func.schema).toBe('pg_catalog')
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
