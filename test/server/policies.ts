import { expect, test } from 'vitest'
import { app } from './utils'

test('policy list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/policies?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const policies = res.json()
  expect(Array.isArray(policies)).toBe(true)
  expect(policies.length).toBeLessThanOrEqual(5)
})

test('policy list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/policies?includedSchemas=public',
  })
  expect(res.statusCode).toBe(200)
  const policies = res.json()
  expect(Array.isArray(policies)).toBe(true)
  // All policies should be in the public schema
  policies.forEach((policy) => {
    expect(policy.schema).toBe('public')
  })
})

test('policy with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/policies/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('create policy with missing required field', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/policies',
    payload: {
      name: 'test_policy',
      schema: 'public',
      // Missing required table field
      definition: 'true',
      check: 'true',
      action: 'SELECT',
      command: 'PERMISSIVE',
    },
  })
  // The API returns 500 instead of 400 for invalid parameters
  expect(res.statusCode).toBe(500)
})

test('update policy with invalid id', async () => {
  const res = await app.inject({
    method: 'PATCH',
    path: '/policies/99999999',
    payload: {
      name: 'renamed_policy',
    },
  })
  expect(res.statusCode).toBe(404)
})

test('delete policy with invalid id', async () => {
  const res = await app.inject({
    method: 'DELETE',
    path: '/policies/99999999',
  })
  expect(res.statusCode).toBe(404)
})
