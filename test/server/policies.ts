import { expect, test } from 'vitest'
import { app } from './utils'

test('policy list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/policies?included_schemas=public',
  })
  expect(res.statusCode).toBe(200)
  const policies = res.json()
  expect(policies.length).toBeGreaterThan(0)
  policies.forEach((policy) => {
    expect(policy.schema).toBe('public')
  })
})

test('policy list with unknown schema', async () => {
  const res = await app.inject({ method: 'GET', path: '/policies?included_schemas=nonexistent' })
  expect(res.statusCode).toBe(200)
  expect(res.json()).toHaveLength(0)
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
      action: 'PERMISSIVE',
      command: 'SELECT',
    },
  })
  expect(res.statusCode).toBe(400)
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
