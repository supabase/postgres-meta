import { types, Client, ClientConfig, Pool } from 'pg'
import { PostgresMetaResult } from './types'

types.setTypeParser(20, parseInt)

export const init = (
  config: ClientConfig,
  { pooled = true } = {}
): ((sql: string) => Promise<PostgresMetaResult<any>>) => {
  const client = pooled ? new Pool(config) : new Client(config)
  return async (sql: string) => {
    try {
      const { rows } = await client.query(sql)
      return { data: rows, error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }
}
