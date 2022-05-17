import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.roles.list()

  const role: any = res.data?.find(({ name }) => name === 'postgres')

  expect(role).toMatchInlineSnapshot(
    { active_connections: expect.any(Number), id: expect.any(Number) },
    `
    Object {
      "active_connections": Any<Number>,
      "can_bypass_rls": true,
      "can_create_db": true,
      "can_create_role": true,
      "can_login": true,
      "config": null,
      "connection_limit": 100,
      "id": Any<Number>,
      "inherit_role": true,
      "is_replication_role": true,
      "is_superuser": true,
      "name": "postgres",
      "password": "********",
      "valid_until": null,
    }
  `
  )
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.roles.create({
    name: 'r',
    is_superuser: true,
    can_create_db: true,
    can_create_role: true,
    inherit_role: false,
    can_login: true,
    is_replication_role: true,
    can_bypass_rls: true,
    connection_limit: 100,
    valid_until: '2020-01-01T00:00:00.000Z',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "active_connections": 0,
        "can_bypass_rls": true,
        "can_create_db": true,
        "can_create_role": true,
        "can_login": true,
        "config": null,
        "connection_limit": 100,
        "id": Any<Number>,
        "inherit_role": false,
        "is_replication_role": true,
        "is_superuser": true,
        "name": "r",
        "password": "********",
        "valid_until": "2020-01-01 00:00:00+00",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.roles.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "active_connections": 0,
        "can_bypass_rls": true,
        "can_create_db": true,
        "can_create_role": true,
        "can_login": true,
        "config": null,
        "connection_limit": 100,
        "id": Any<Number>,
        "inherit_role": false,
        "is_replication_role": true,
        "is_superuser": true,
        "name": "r",
        "password": "********",
        "valid_until": "2020-01-01 00:00:00+00",
      },
      "error": null,
    }
  `
  )
  await pgMeta.roles.remove(res.data!.id)
  res = await pgMeta.roles.create({
    name: 'r',
  })
  res = await pgMeta.roles.update(res.data!.id, {
    name: 'rr',
    is_superuser: true,
    can_create_db: true,
    can_create_role: true,
    inherit_role: false,
    can_login: true,
    is_replication_role: true,
    can_bypass_rls: true,
    connection_limit: 100,
    valid_until: '2020-01-01T00:00:00.000Z',
  })
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "active_connections": 0,
        "can_bypass_rls": true,
        "can_create_db": true,
        "can_create_role": true,
        "can_login": true,
        "config": null,
        "connection_limit": 100,
        "id": Any<Number>,
        "inherit_role": false,
        "is_replication_role": true,
        "is_superuser": true,
        "name": "rr",
        "password": "********",
        "valid_until": "2020-01-01 00:00:00+00",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.roles.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    { data: { id: expect.any(Number) } },
    `
    Object {
      "data": Object {
        "active_connections": 0,
        "can_bypass_rls": true,
        "can_create_db": true,
        "can_create_role": true,
        "can_login": true,
        "config": null,
        "connection_limit": 100,
        "id": Any<Number>,
        "inherit_role": false,
        "is_replication_role": true,
        "is_superuser": true,
        "name": "rr",
        "password": "********",
        "valid_until": "2020-01-01 00:00:00+00",
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.roles.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a role with ID \d+$/),
    },
  })
})
