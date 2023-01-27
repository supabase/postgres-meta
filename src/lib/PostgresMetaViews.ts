import { literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants.js'
import { coalesceRowsToArray, filterByList } from './helpers.js'
import { columnsSql, viewsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresView } from './types.js'

export default class PostgresMetaViews {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list(options: {
    includeSystemSchemas?: boolean
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns: false
  }): Promise<PostgresMetaResult<(PostgresView & { columns: never })[]>>
  async list(options?: {
    includeSystemSchemas?: boolean
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns?: boolean
  }): Promise<PostgresMetaResult<(PostgresView & { columns: unknown[] })[]>>
  async list({
    includeSystemSchemas = false,
    includedSchemas,
    excludedSchemas,
    limit,
    offset,
    includeColumns = true,
  }: {
    includeSystemSchemas?: boolean
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
    includeColumns?: boolean
  } = {}): Promise<PostgresMetaResult<PostgresView[]>> {
    let sql = generateEnrichedViewsSql({ includeColumns })
    const filter = filterByList(
      includedSchemas,
      excludedSchemas,
      !includeSystemSchemas ? DEFAULT_SYSTEM_SCHEMAS : undefined
    )
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

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresView>>
  async retrieve({
    name,
    schema,
  }: {
    name: string
    schema: string
  }): Promise<PostgresMetaResult<PostgresView>>
  async retrieve({
    id,
    name,
    schema = 'public',
  }: {
    id?: number
    name?: string
    schema?: string
  }): Promise<PostgresMetaResult<PostgresView>> {
    if (id) {
      const sql = `${generateEnrichedViewsSql({
        includeColumns: true,
      })} where views.id = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a view with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${generateEnrichedViewsSql({
        includeColumns: true,
      })} where views.name = ${literal(name)} and views.schema = ${literal(schema)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: { message: `Cannot find a view named ${name} in schema ${schema}` },
        }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on view retrieve' } }
    }
  }
}

const generateEnrichedViewsSql = ({ includeColumns }: { includeColumns: boolean }) => `
with views as (${viewsSql})
  ${includeColumns ? `, columns as (${columnsSql})` : ''}
select
  *
  ${includeColumns ? `, ${coalesceRowsToArray('columns', 'columns.table_id = views.id')}` : ''}
from views`
