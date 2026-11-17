import { expect, test } from 'vitest'
import { app } from './utils'

test('publication with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/publications/99999999',
  })
  expect(res.statusCode).toBe(404)
})

// The route coerces non-boolean publish_* values and creates the publication; it should reject them with 400.
test.todo('create publication with non-boolean publish_insert returns 400')

test('create publication with empty name', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/publications',
    payload: {
      name: '',
      publish_insert: true,
      publish_update: true,
      publish_delete: true,
      publish_truncate: true,
      tables: ['public.users'],
    },
  })
  expect(res.statusCode).toBe(400)
})

test('update publication with invalid id', async () => {
  const res = await app.inject({
    method: 'PATCH',
    path: '/publications/99999999',
    payload: {
      name: 'renamed_publication',
    },
  })
  expect(res.statusCode).toBe(404)
})

test('delete publication with invalid id', async () => {
  const res = await app.inject({
    method: 'DELETE',
    path: '/publications/99999999',
  })
  expect(res.statusCode).toBe(404)
})
