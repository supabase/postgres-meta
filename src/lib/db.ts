import pg, { PoolConfig } from 'pg'
import { DatabaseError } from 'pg-protocol'
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
  // node-postgres ignores config.ssl if any of sslmode, sslca, sslkey, sslcert,
  // sslrootcert are in the connection string. Here we allow setting sslmode in
  // the connection string while setting the rest in config.ssl.
  if (config.connectionString) {
    const u = new URL(config.connectionString)
    const sslmode = u.searchParams.get('sslmode')
    u.searchParams.delete('sslmode')
    // For now, we don't support setting these from the connection string.
    u.searchParams.delete('sslca')
    u.searchParams.delete('sslkey')
    u.searchParams.delete('sslcert')
    u.searchParams.delete('sslrootcert')
    config.connectionString = u.toString()

    // sslmode:    null, 'disable', 'prefer', 'require', 'verify-ca', 'verify-full', 'no-verify'
    // config.ssl: true, false, {}
    if (sslmode === null) {
      // skip
    } else if (sslmode === 'disable') {
      config.ssl = false
    } else {
      if (typeof config.ssl !== 'object') {
        config.ssl = {}
      }
      config.ssl.rejectUnauthorized = sslmode !== 'no-verify'
    }
  }

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
      } catch (error: any) {
        if (error instanceof DatabaseError) {
          // Roughly based on:
          // - https://github.com/postgres/postgres/blob/fc4089f3c65a5f1b413a3299ba02b66a8e5e37d0/src/interfaces/libpq/fe-protocol3.c#L1018
          // - https://github.com/brianc/node-postgres/blob/b1a8947738ce0af004cb926f79829bb2abc64aa6/packages/pg/lib/native/query.js#L33
          let formattedError = ''
          {
            if (error.severity) {
              formattedError += `${error.severity}:  `
            }
            if (error.code) {
              formattedError += `${error.code}: `
            }
            if (error.message) {
              formattedError += error.message
            }
            formattedError += '\n'
            if (error.position) {
              // error.position is 1-based
              const position = Number(error.position) - 1

              let line = ''
              let lineNumber = 0
              let lineOffset = 0

              const lines = sql.split('\n')
              let currentOffset = 0
              for (let i = 0; i < lines.length; i++) {
                if (currentOffset + lines[i].length > position) {
                  line = lines[i]
                  lineNumber = i + 1 // 1-based
                  lineOffset = position - currentOffset
                  break
                }
                currentOffset += lines[i].length + 1 // 1 extra offset for newline
              }
              formattedError += `LINE ${lineNumber}: ${line}
${' '.repeat(5 + lineNumber.toString().length + 2 + lineOffset)}^
`
            }
            if (error.detail) {
              formattedError += `DETAIL:  ${error.detail}
`
            }
            if (error.hint) {
              formattedError += `HINT:  ${error.hint}
`
            }
            if (error.internalQuery) {
              formattedError += `QUERY:  ${error.internalQuery}
`
            }
            if (error.where) {
              formattedError += `CONTEXT:  ${error.where}
`
            }
          }

          return {
            data: null,
            error: {
              ...error,
              // error.message is non-enumerable
              message: error.message,
              formattedError,
            },
          }
        }

        return { data: null, error: { message: error.message } }
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
