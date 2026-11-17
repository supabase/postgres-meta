import { expect, test } from 'vitest'
import { app } from './utils'

test('trigger list with limit and included schema', async () => {
  const setup = await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        create function public.pr920_noop() returns trigger language plpgsql as 'begin return new; end';
        create trigger pr920_a before insert on public.users for each row execute function public.pr920_noop();
        create trigger pr920_b before update on public.users for each row execute function public.pr920_noop();`,
    },
  })
  expect(setup.statusCode).toBe(200)
  try {
    const limited = await app.inject({ method: 'GET', path: '/triggers?limit=1' })
    expect(limited.json()).toHaveLength(1)

    const pub = await app.inject({ method: 'GET', path: '/triggers?included_schemas=public' })
    expect(pub.statusCode).toBe(200)
    const names = pub.json().map((t) => t.name)
    expect(names).toEqual(expect.arrayContaining(['pr920_a', 'pr920_b']))
    pub.json().forEach((trigger) => {
      expect(trigger.schema).toBe('public')
    })

    const other = await app.inject({
      method: 'GET',
      path: '/triggers?included_schemas=nonexistent',
    })
    expect(other.json()).toHaveLength(0)
  } finally {
    await app.inject({
      method: 'POST',
      path: '/query',
      payload: { query: 'drop function public.pr920_noop() cascade;' },
    })
  }
})

test('get trigger with invalid id', async () => {
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
