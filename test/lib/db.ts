import { randomUUID } from 'node:crypto'
import { expect, test } from 'vitest'
import { init } from '../../src/lib/db'
import { pgMeta, TEST_CONNECTION_STRING } from './utils'

test('end() resolves only after in-flight queries have finished', async () => {
  const applicationName = `pg-meta-end-${randomUUID()}`
  const db = init({
    max: 1,
    connectionString: TEST_CONNECTION_STRING,
    application_name: applicationName,
  })

  const inFlight = db.query('select pg_sleep(1)').then(() => 'query' as const)
  const teardown = db.end().then(() => 'end' as const)

  expect(await Promise.race([inFlight, teardown])).toBe('query')
  await teardown

  const { data } = await pgMeta.query(
    `select 1 from pg_stat_activity where application_name = '${applicationName}'`
  )
  expect(data).toHaveLength(0)

  await inFlight
})

test('query() after end() runs on a fresh pool', async () => {
  const db = init({ max: 1, connectionString: TEST_CONNECTION_STRING })
  await db.query('select 1')
  await db.end()

  const { data, error } = await db.query('select 1 as x')

  expect(error).toBe(null)
  expect(data).toStrictEqual([{ x: 1 }])
})
