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
  expect(formattedQuery).toMatchInlineSnapshot(`
    "SELECT
      id,
      name
    FROM
      users
    WHERE
      status = 'ACTIVE'
    "
  `)
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
  expect(res.body).toMatchInlineSnapshot(`
    "SELECT
      u.id,
      u.name,
      p.title,
      p.created_at
    FROM
      users u
      JOIN posts p ON u.id = p.user_id
    WHERE
      u.status = 'ACTIVE'
      AND p.published = true
    ORDER BY
      p.created_at DESC
    LIMIT
      10
    "
  `)
})

test('format invalid SQL query', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query/format',
    payload: { query: 'SELECT FROM WHERE;' },
  })
  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toContain('text/plain')
  expect(res.body).toMatchInlineSnapshot(`
    "SELECT
    FROM
    WHERE;
    "
  `)
})

// Both currently return 500; a missing query should be a 400 and an empty one a 200 with empty output.
test.todo('format empty query returns 200')
test.todo('format with missing query parameter returns 400')
