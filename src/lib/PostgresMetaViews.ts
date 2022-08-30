import { literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { coalesceRowsToArray } from './helpers'
import { columnsSql, viewsSql } from './sql'
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
    let sql = enrichedViewsSql
    if (!includeSystemSchemas) {
      sql = `${sql} WHERE schema NOT IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')})`
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

const enrichedViewsSql = `
WITH views AS (${viewsSql}),
  columns AS (${columnsSql})
SELECT
  *,
  ${coalesceRowsToArray('columns', 'columns.table_id = views.id')}
FROM views`
