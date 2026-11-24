import { expect, test } from 'vitest'
import { app } from './utils'

test('format empty query returns empty output', async () => {
  const res = await app.inject({ method: 'POST', path: '/query/format', payload: { query: '' } })
  expect(res.statusCode).toBe(200)
  expect(res.body).toBe('')
})

test('format without query returns 400', async () => {
  const res = await app.inject({ method: 'POST', path: '/query/format', payload: {} })
  expect(res.statusCode).toBe(400)
})

test('create publication with non-boolean publish_insert returns 400', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/publications',
    payload: {
      name: 'invalid_publish_insert',
      publish_insert: 'invalid',
      tables: ['public.users'],
    },
  })
  expect(res.statusCode).toBe(400)
  const list = await app.inject({ method: 'GET', path: '/publications' })
  expect(list.json().map((p) => p.name)).not.toContain('invalid_publish_insert')
})

test('query string failing a route schema returns 400', async () => {
  const res = await app.inject({ method: 'GET', path: '/column-privileges?limit=abc' })
  expect(res.statusCode).toBe(400)
})
