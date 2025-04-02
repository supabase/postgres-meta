import { expect, test } from 'vitest'
import { app } from './utils'

test('format SQL query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: { query: "SELECT id,name FROM users WHERE status='ACTIVE'" },
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  const formattedQuery = res.body
  expect(formattedQuery).toContain('SELECT')
  expect(formattedQuery).toContain('FROM')
  expect(formattedQuery).toContain('WHERE')
})

test('format complex SQL query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: {
      query:
        "SELECT u.id, u.name, p.title, p.created_at FROM users u JOIN posts p ON u.id = p.user_id WHERE u.status = 'ACTIVE' AND p.published = true ORDER BY p.created_at DESC LIMIT 10",
    },
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

test('format invalid SQL query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: { query: 'SELECT FROM WHERE;' },
  })
  // Even invalid SQL can be formatted
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toBeTruthy()
})

test('format empty query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: { query: '' },
  })
  expect(res.statusCode).toBe(500)
})

test('format with missing query parameter', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: {},
  })
  expect(res.statusCode).toBe(500)
})
