import { coalesceRowsToArray } from './helpers.js'
import { columnsSql, foreignTablesSql } from './sql/index.js'
import { PostgresMetaResult, PostgresForeignTable } from './types.js'

export default class PostgresMetaForeignTables {
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
  } = {}): Promise<PostgresMetaResult<PostgresForeignTable[]>> {
    let sql = enrichedForeignTablesSql
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }
}

const enrichedForeignTablesSql = `
WITH foreign_tables AS (${foreignTablesSql}),
  columns AS (${columnsSql})
SELECT
  *,
  ${coalesceRowsToArray('columns', 'columns.table_id = foreign_tables.id')}
FROM foreign_tables`
