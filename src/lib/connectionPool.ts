import pg = require('pg')
import { SQLStatement } from 'sql-template-strings'
// HACK: Number has 53 bits of precision, may overflow with bigint (64 bits).
// Maybe use BigInt?
// TODO: Use Date object for timestamptz?
pg.types.setTypeParser(20, 'text', parseInt)
const { Pool } = pg

export const RunQuery = async (connectionString: any, sql: string|SQLStatement) => {
  const pool = new Pool({ connectionString })
  try {
    const results = await pool.query(sql)
    return { data: results.rows, error: null }
  } catch (error) {
    console.log('PG Error')
    throw error
  } finally {
    // Try to close the connection
    // Not necessary?
    try {
      pool.end()
    } catch (error) {
      console.log('pool.end error', error)
    }
  }
}
