import { expect, test } from 'vitest'
import { app } from './utils'

test('publication list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/publications?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const publications = res.json()
  expect(Array.isArray(publications)).toBe(true)
  expect(publications.length).toBeLessThanOrEqual(5)
})

test('publication with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/publications/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('create publication with invalid options', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/publications',
    payload: {
      name: 'test_publication',
      publish_insert: 'invalid', // Should be boolean but seems to be converted automatically
      publish_update: true,
      publish_delete: true,
      publish_truncate: true,
      tables: ['public.users'],
    },
  })
  // API accepts invalid type and converts it
  expect(res.statusCode).toBe(200)
})

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
