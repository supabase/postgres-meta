import { expect, test } from 'vitest'
import { app } from './utils'

test('typescript generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).contain('public')
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
    path: '/generators/typescript?included_schemas=private',
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  // the only schema is excluded database should be empty
  expect(res.body).toContain('Database = {}')
})

test('invalid generator route', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/generators/openapi',
  })
  expect(res.statusCode).toBe(404)
})
