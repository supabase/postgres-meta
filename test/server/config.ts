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

test('config with invalid endpoint', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/config/invalid',
  })
  expect(res.statusCode).toBe(404)
})
