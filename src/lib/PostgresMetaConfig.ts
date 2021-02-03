import { configSql } from './sql'
import { PostgresMetaResult, PostgresConfig } from './types'

export default class PostgresMetaConfig {
  query: Function

  constructor(query: Function) {
    this.query = query
  }

  async list(): Promise<PostgresMetaResult<PostgresConfig[]>> {
    return await this.query(configSql)
  }
}
