import { types, Pool, PoolConfig } from 'pg'
import { parse as parseArray } from 'postgres-array'
import { PostgresMetaResult } from './types'

types.setTypeParser(types.builtins.INT8, parseInt)
types.setTypeParser(types.builtins.DATE, (x) => x)
types.setTypeParser(types.builtins.TIMESTAMP, (x) => x)
types.setTypeParser(types.builtins.TIMESTAMPTZ, (x) => x)
types.setTypeParser(1115, parseArray) // _timestamp
types.setTypeParser(1182, parseArray) // _date
types.setTypeParser(1185, parseArray) // _timestamptz

export const init: (config: PoolConfig) => {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  queryArrayMode: (sql: string) => Promise<any>
  end: () => Promise<void>
} = (config) => {
  // NOTE: Race condition could happen here: one async task may be doing
  // `pool.end()` which invalidates the pool and subsequently all existing
  // handles to `query`. Normally you might only deal with one DB so you don't
  // need to call `pool.end()`, but since the server needs this, we make a
  // compromise: if we run `query` after `pool.end()` is called (i.e. pool is
  // `null`), we temporarily create a pool and close it right after.
  let pool: Pool | null = new Pool(config)
  return {
    async query(sql) {
      try {
        if (!pool) {
          const pool = new Pool(config)
          const { rows } = await pool.query(sql)
          await pool.end()
          return { data: rows, error: null }
        }

        const { rows } = await pool.query(sql)
        return { data: rows, error: null }
      } catch (e: any) {
        return { data: null, error: { message: e.message } }
      }
    },

    async queryArrayMode(sql) {
      try {
        if (!pool) {
          const pool = new Pool(config)
          let res: any = await pool.query({
            rowMode: 'array',
            text: sql,
          })
          if (!Array.isArray(res)) {
            res = [res]
          }
          return {
            data: res.map(({ fields, rows }: any) => ({
              columns: fields.map((x: any) => x.name),
              rows,
            })),
            error: null,
          }
        }

        let res: any = await pool.query({
          rowMode: 'array',
          text: sql,
        })
        if (!Array.isArray(res)) {
          res = [res]
        }
        return {
          data: res.map(({ fields, rows }: any) => ({
            columns: fields.map((x: any) => x.name),
            rows,
          })),
          error: null,
        }
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
