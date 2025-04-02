import { expect, test } from 'vitest'
import { app } from './utils'

test('typescript generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

test('go generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/go',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

test('swift generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/swift',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

test('generator routes with includedSchemas parameter', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/typescript?includedSchemas=public',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

// Skip this test as the OpenAPI endpoint is not implemented
test.skip('openapi generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/openapi',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('application/json')
  const body = JSON.parse(res.body)
  expect(body.openapi).toBeTruthy()
  expect(body.paths).toBeTruthy()
})
