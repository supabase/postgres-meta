import { expect, test } from 'vitest'
import { app } from './utils'

test('extension list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/extensions?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const extensions = res.json()
  expect(Array.isArray(extensions)).toBe(true)
  expect(extensions.length).toBeLessThanOrEqual(5)
})

test('extension with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/extensions/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('create extension with invalid name', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/extensions',
    payload: {
      name: 'invalid_extension_name_that_doesnt_exist',
      schema: 'public',
      version: '1.0',
      cascade: false,
    },
  })
  expect(res.statusCode).toBe(400)
})

test('delete extension with invalid id', async () => {
  const res = await app.inject({
    method: 'DELETE',
    path: '/extensions/99999999',
  })
  expect(res.statusCode).toBe(404)
})
