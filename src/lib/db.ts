import { types, Pool, PoolConfig } from 'pg'
import { PostgresMetaResult } from './types'

types.setTypeParser(20, parseInt)

export const init: (
  config: PoolConfig
) => {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  end: () => Promise<void>
} = (config) => {
  // XXX: Race condition could happen here: one async task may be doing
  // `pool.end()` which invalidates the pool and subsequently all existing
  // handles to `query`. Normally you might only deal with one DB so you don't
  // need to call `pool.end()`, but since the server needs this, we make a
  // compromise: if we run `query` after `pool.end()` is called (i.e. pool is
  // `null`), we temporarily create a pool and close is right after.
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
      } catch (e) {
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
