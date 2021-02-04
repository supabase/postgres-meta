import { configSql } from './sql'
import { PostgresMetaResult, PostgresConfig } from './types'

export default class PostgresMetaConfig {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list(): Promise<PostgresMetaResult<PostgresConfig[]>> {
    return await this.query(configSql)
  }
}
