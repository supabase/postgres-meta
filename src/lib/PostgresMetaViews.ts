import { literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { viewsSql } from './sql'
import { PostgresMetaResult, PostgresView } from './types'

export default class PostgresMetaViews {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    includeSystemSchemas = false,
    limit,
    offset,
  }: {
    includeSystemSchemas?: boolean
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresView[]>> {
    let sql = viewsSql
    if (!includeSystemSchemas) {
      sql = `${sql} AND n.nspname NOT IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')})`
    }
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }
}
