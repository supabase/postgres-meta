import { pgMeta } from './utils'

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.triggers.create({
    name: 'test_trigger',
    schema: 'public',
    table: 'users_audit',
    function_schema: 'public',
    function_name: 'audit_action',
    function_args: ['test1', 'test2'],
    activation: 'AFTER',
    events: ['UPDATE'],
    orientation: 'ROW',
    condition: '(old.* IS DISTINCT FROM new.*)',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": "(old.* IS DISTINCT FROM new.*)",
        "enabled_mode": "ORIGIN",
        "events": [
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_trigger",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.triggers.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": "(old.* IS DISTINCT FROM new.*)",
        "enabled_mode": "ORIGIN",
        "events": [
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_trigger",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.triggers.update(res.data!.id, {
    name: 'test_trigger_renamed',
    enabled_mode: 'DISABLED',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": "(old.* IS DISTINCT FROM new.*)",
        "enabled_mode": "DISABLED",
        "events": [
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_trigger_renamed",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.triggers.update(res.data!.id, {
    enabled_mode: 'REPLICA',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": "(old.* IS DISTINCT FROM new.*)",
        "enabled_mode": "REPLICA",
        "events": [
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_trigger_renamed",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.triggers.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": "(old.* IS DISTINCT FROM new.*)",
        "enabled_mode": "REPLICA",
        "events": [
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_trigger_renamed",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.triggers.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a trigger with ID \d+$/),
    },
  })
})

test('multi event', async () => {
  let res = await pgMeta.triggers.create({
    name: 'test_multi_event_trigger',
    schema: 'public',
    table: 'users_audit',
    function_schema: 'public',
    function_name: 'audit_action',
    function_args: ['test1', 'test2'],
    activation: 'AFTER',
    events: ['insert', 'update', 'delete'],
    orientation: 'ROW',
    condition: '',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number), table_id: expect.any(Number) } },
    `
    {
      "data": {
        "activation": "AFTER",
        "condition": null,
        "enabled_mode": "ORIGIN",
        "events": [
          "INSERT",
          "DELETE",
          "UPDATE",
        ],
        "function_args": [
          "test1",
          "test2",
        ],
        "function_name": "audit_action",
        "function_schema": "public",
        "id": Any<Number>,
        "name": "test_multi_event_trigger",
        "orientation": "ROW",
        "schema": "public",
        "table": "users_audit",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  await pgMeta.triggers.remove(res.data!.id)
})
