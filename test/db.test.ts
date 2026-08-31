import pg from 'pg'
import { afterEach, expect, test, vi } from 'vitest'
import { init } from '../src/lib/db.js'

afterEach(() => {
  vi.restoreAllMocks()
})

test('successful queries remove their temporary pool error listeners', async () => {
  let pool: pg.Pool | undefined
  vi.spyOn(pg.Pool.prototype, 'query').mockImplementation(function (this: pg.Pool) {
    pool = this
    return Promise.resolve({ rows: [] }) as ReturnType<pg.Pool['query']>
  })

  const db = init({})
  for (let i = 0; i < 12; i++) {
    await db.query('select 1')
  }

  expect(pool).toBeDefined()
  expect(pool!.listenerCount('error')).toBe(0)

  await db.end()
})

test('query rejections remove their temporary pool error listener', async () => {
  let pool: pg.Pool | undefined
  vi.spyOn(pg.Pool.prototype, 'query').mockImplementation(function (this: pg.Pool) {
    pool = this
    return Promise.reject(new Error('query failed')) as ReturnType<pg.Pool['query']>
  })

  const db = init({})
  const result = await db.query('select 1')

  expect(result.error?.message).toBe('query failed')
  expect(pool!.listenerCount('error')).toBe(0)

  await db.end()
})

test('connection-level pool errors still reject the active query', async () => {
  let pool: pg.Pool | undefined
  const pending = Promise.withResolvers<pg.QueryResult>()
  vi.spyOn(pg.Pool.prototype, 'query').mockImplementation(function (this: pg.Pool) {
    pool = this
    return pending.promise as ReturnType<pg.Pool['query']>
  })

  const db = init({})
  const resultPromise = db.query('select 1')
  pool!.emit('error', new Error('connection failed'))
  const result = await resultPromise

  expect(result.error?.message).toBe('connection failed')
  expect(pool!.listenerCount('error')).toBe(0)

  await db.end()
})
