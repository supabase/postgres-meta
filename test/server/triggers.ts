import { expect, test } from 'vitest'
import { app } from './utils'

test('trigger list filtering', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/triggers?limit=5',
  })
  expect(res.statusCode).toBe(200)
  const triggers = res.json()
  expect(Array.isArray(triggers)).toBe(true)
  expect(triggers.length).toBeLessThanOrEqual(5)
})

test('trigger list with specific included schema', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/triggers?includedSchemas=public',
  })
  expect(res.statusCode).toBe(200)
  const triggers = res.json()
  expect(Array.isArray(triggers)).toBe(true)
  // All triggers should be in the public schema
  triggers.forEach((trigger) => {
    expect(trigger.schema).toBe('public')
  })
})

test('trigger with invalid id', async () => {
  const res = await app.inject({
    method: 'GET',
    path: '/triggers/99999999',
  })
  expect(res.statusCode).toBe(404)
})

test('create trigger with invalid parameters', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/triggers',
    payload: {
      name: 'test_trigger',
      schema: 'public',
      table: 'non_existent_table',
      function_schema: 'public',
      function_name: 'test_trigger_function',
      function_args: [],
      activation: 'BEFORE',
      events: ['INSERT'],
      orientation: 'ROW',
      condition: null,
    },
  })
  // Should fail because table doesn't exist
  expect(res.statusCode).toBe(400)
})

test('update trigger with invalid id', async () => {
  const res = await app.inject({
    method: 'PATCH',
    path: '/triggers/99999999',
    payload: {
      enabled: false,
    },
  })
  expect(res.statusCode).toBe(404)
})

test('delete trigger with invalid id', async () => {
  const res = await app.inject({
    method: 'DELETE',
    path: '/triggers/99999999',
  })
  expect(res.statusCode).toBe(404)
})
