import { types, Client, ClientConfig, Pool } from 'pg'
types.setTypeParser(20, parseInt)

export const init = (config: ClientConfig, { pooled = true } = {}) => {
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
