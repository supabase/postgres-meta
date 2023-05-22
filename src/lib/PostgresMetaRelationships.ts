import { tableRelationshipsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresRelationship } from './types.js'

export default class PostgresMetaRelationships {
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
  } = {}): Promise<PostgresMetaResult<PostgresRelationship[]>> {
    let sql = tableRelationshipsSql
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }
}
