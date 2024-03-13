import { literal } from 'pg-format'
import { coalesceRowsToArray, filterByList } from './helpers.js'
import { columnsSql, materializedViewsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresMaterializedView } from './types.js'

export default class PostgresMetaMaterializedViews {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list(options: {
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns: true
  }): Promise<PostgresMetaResult<(PostgresMaterializedView & { columns: unknown[] })[]>>
  async list(options?: {
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns?: boolean
  }): Promise<PostgresMetaResult<(PostgresMaterializedView & { columns: never })[]>>
  async list({
    includedSchemas,
    excludedSchemas,
    limit,
    offset,
    includeColumns = false,
  }: {
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns?: boolean
  } = {}): Promise<PostgresMetaResult<PostgresMaterializedView[]>> {
    let sql = generateEnrichedMaterializedViewsSql({ includeColumns })
    const filter = filterByList(includedSchemas, excludedSchemas, undefined)
    if (filter) {
      sql += ` where schema ${filter}`
    }
    if (limit) {
      sql += ` limit ${limit}`
    }
    if (offset) {
      sql += ` offset ${offset}`
    }
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresMaterializedView>>
  async retrieve({
    name,
    schema,
  }: {
    name: string
    schema: string
  }): Promise<PostgresMetaResult<PostgresMaterializedView>>
  async retrieve({
    id,
    name,
    schema = 'public',
  }: {
    id?: number
    name?: string
    schema?: string
  }): Promise<PostgresMetaResult<PostgresMaterializedView>> {
    if (id) {
      const sql = `${generateEnrichedMaterializedViewsSql({
        includeColumns: true,
      })} where materialized_views.id = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a materialized view with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${generateEnrichedMaterializedViewsSql({
        includeColumns: true,
      })} where materialized_views.name = ${literal(
        name
      )} and materialized_views.schema = ${literal(schema)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: { message: `Cannot find a materialized view named ${name} in schema ${schema}` },
        }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on materialized view retrieve' } }
    }
  }
}

const generateEnrichedMaterializedViewsSql = ({ includeColumns }: { includeColumns: boolean }) => `
with materialized_views as (${materializedViewsSql})
  ${includeColumns ? `, columns as (${columnsSql})` : ''}
select
  *
  ${
    includeColumns
      ? `, ${coalesceRowsToArray('columns', 'columns.table_id = materialized_views.id')}`
      : ''
  }
from materialized_views`
