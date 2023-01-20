import { coalesceRowsToArray } from './helpers.js'
import { columnsSql, foreignTablesSql } from './sql/index.js'
import { PostgresMetaResult, PostgresForeignTable } from './types.js'

export default class PostgresMetaForeignTables {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list(options: {
    limit?: number
    offset?: number
    includeColumns: false
  }): Promise<PostgresMetaResult<(PostgresForeignTable & { columns: never })[]>>
  async list(options?: {
    limit?: number
    offset?: number
    includeColumns?: boolean
  }): Promise<PostgresMetaResult<(PostgresForeignTable & { columns: unknown[] })[]>>
  async list({
    limit,
    offset,
    includeColumns = true,
  }: {
    limit?: number
    offset?: number
    includeColumns?: boolean
  } = {}): Promise<PostgresMetaResult<PostgresForeignTable[]>> {
    let sql = generateEnrichedForeignTablesSql({ includeColumns })
    if (limit) {
      sql += ` limit ${limit}`
    }
    if (offset) {
      sql += ` offset ${offset}`
    }
    return await this.query(sql)
  }
}

const generateEnrichedForeignTablesSql = ({ includeColumns }: { includeColumns: boolean }) => `
with foreign_tables as (${foreignTablesSql})
  ${includeColumns ? `, columns as (${columnsSql})` : ''}
select
  *
  ${
    includeColumns
      ? `, ${coalesceRowsToArray('columns', 'columns.table_id = foreign_tables.id')}`
      : ''
  }
from foreign_tables`
