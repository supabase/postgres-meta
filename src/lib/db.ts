import pg, { PoolConfig } from 'pg'
import { parse as parseArray } from 'postgres-array'
import { PostgresMetaResult } from './types.js'

pg.types.setTypeParser(pg.types.builtins.INT8, (x) => {
  const asNumber = Number(x)
  if (Number.isSafeInteger(asNumber)) {
    return asNumber
  } else {
    return x
  }
})
pg.types.setTypeParser(pg.types.builtins.DATE, (x) => x)
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (x) => x)
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (x) => x)
pg.types.setTypeParser(1115, parseArray) // _timestamp
pg.types.setTypeParser(1182, parseArray) // _date
pg.types.setTypeParser(1185, parseArray) // _timestamptz
pg.types.setTypeParser(600, (x) => x) // point
pg.types.setTypeParser(1017, (x) => x) // _point

export const init: (config: PoolConfig) => {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  end: () => Promise<void>
} = (config) => {
  // NOTE: Race condition could happen here: one async task may be doing
  // `pool.end()` which invalidates the pool and subsequently all existing
  // handles to `query`. Normally you might only deal with one DB so you don't
  // need to call `pool.end()`, but since the server needs this, we make a
  // compromise: if we run `query` after `pool.end()` is called (i.e. pool is
  // `null`), we temporarily create a pool and close it right after.
  let pool: pg.Pool | null = new pg.Pool(config)
  return {
    async query(sql) {
      try {
        if (!pool) {
          const pool = new pg.Pool(config)
          let res = await pool.query(sql)
          if (Array.isArray(res)) {
            res = res.reverse().find((x) => x.rows.length !== 0) ?? { rows: [] }
          }
          await pool.end()
          return { data: res.rows, error: null }
        }

        let res = await pool.query(sql)
        if (Array.isArray(res)) {
          res = res.reverse().find((x) => x.rows.length !== 0) ?? { rows: [] }
        }
        return { data: res.rows, error: null }
      } catch (e: any) {
        return { data: null, error: { message: e.message } }
      }
    },

    async end() {
      const _pool = pool
      pool = null
      // Gracefully wait for active connections to be idle, then close all
      // connections in the pool.
      if (_pool) await _pool.end()
    },
  }
}
