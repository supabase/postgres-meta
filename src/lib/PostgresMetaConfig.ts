import { configSql } from './sql'
import { PostgresMetaResult, PostgresConfig } from './types'

export default class PostgresMetaConfig {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    limit,
    offset,
  }: {
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresConfig[]>> {
    let sql = configSql
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }
}
