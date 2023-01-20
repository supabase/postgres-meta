import { literal } from 'pg-format'
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

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresForeignTable>>
  async retrieve({
    name,
    schema,
  }: {
    name: string
    schema: string
  }): Promise<PostgresMetaResult<PostgresForeignTable>>
  async retrieve({
    id,
    name,
    schema = 'public',
  }: {
    id?: number
    name?: string
    schema?: string
  }): Promise<PostgresMetaResult<PostgresForeignTable>> {
    if (id) {
      const sql = `${generateEnrichedForeignTablesSql({
        includeColumns: true,
      })} where foreign_tables.id = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a foreign table with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${generateEnrichedForeignTablesSql({
        includeColumns: true,
      })} where foreign_tables.name = ${literal(name)} and foreign_tables.schema = ${literal(
        schema
      )};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: { message: `Cannot find a foreign table named ${name} in schema ${schema}` },
        }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on foreign table retrieve' } }
    }
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
