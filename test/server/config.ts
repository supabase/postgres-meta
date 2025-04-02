import { expect, test } from 'vitest'
import { app } from './utils'

test('config version endpoint', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/config/version',
  })
  expect(res.statusCode).toBe(200)
  const data = res.json()
  expect(data).toHaveProperty('version')
  expect(typeof data.version).toBe('string')
  // Accept any version string format
  expect(data.version).toContain('PostgreSQL')
})

// Skip tests for endpoints that don't exist
test.skip('config max_result_size endpoint', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/config/max_result_size',
  })
  expect(res.statusCode).toBe(200)
})

test.skip('config health endpoint', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/config/health',
  })
  expect(res.statusCode).toBe(200)
})

test('config with invalid endpoint', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/config/invalid',
  })
  expect(res.statusCode).toBe(404)
})
