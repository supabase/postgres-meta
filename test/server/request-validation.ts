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

test('malformed JSON body returns 400', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: { 'content-type': 'application/json' },
    payload: '{"query": ',
  })
  expect(res.statusCode).toBe(400)
  expect(res.json()).toHaveProperty('error')
})

test('empty body with JSON content type returns 400', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: { 'content-type': 'application/json' },
    payload: '',
  })
  expect(res.statusCode).toBe(400)
  expect(res.json()).toHaveProperty('error')
})

test('unsupported content type returns 415', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: { 'content-type': 'text/xml' },
    payload: '<query>select 1</query>',
  })
  expect(res.statusCode).toBe(415)
  expect(res.json()).toHaveProperty('error')
})
