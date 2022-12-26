import { versionSql } from './sql/index.js'
import { PostgresMetaResult, PostgresVersion } from './types.js'

export default class PostgresMetaVersion {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async retrieve(): Promise<PostgresMetaResult<PostgresVersion>> {
    const { data, error } = await this.query(versionSql)
    if (error) {
      return { data, error }
    }
    return { data: data[0], error }
  }
}
