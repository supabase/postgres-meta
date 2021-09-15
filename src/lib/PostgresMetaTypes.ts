import { literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { typesSql } from './sql'
import { PostgresMetaResult, PostgresType } from './types'

export default class PostgresMetaTypes {
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
  } = {}): Promise<PostgresMetaResult<PostgresType[]>> {
    let sql = typesSql
    if (!includeSystemSchemas) {
      sql = `${sql} AND NOT (n.nspname IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')}))`
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
