import pg = require('pg')
import { SQLStatement } from 'sql-template-strings'
// TODO: Use Date object for timestamptz?
// HACK: Number has 53 bits of precision, may overflow with bigint (64 bits).
// Maybe use BigInt?
pg.types.setTypeParser(20, 'text', parseInt)
const { Pool } = pg

export const RunQuery = async (connectionString: any, sql: string | SQLStatement) => {
  const pool = new Pool({ connectionString })
  const results = await pool.query(sql)
  // Try to close the connection
  // Not necessary?
  pool.end()
  return { data: results.rows, error: null }
}
