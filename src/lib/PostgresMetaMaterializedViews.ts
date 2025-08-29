import { literal } from 'pg-format'
import { filterByList, coalesceRowsToArray } from './helpers.js'
import { PostgresMetaResult, PostgresMaterializedView } from './types.js'
import { MATERIALIZED_VIEWS_SQL, COLUMNS_SQL } from './sql/index.js'

export default class PostgresMetaMaterializedViews {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

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
    const schemaFilter = filterByList(includedSchemas, excludedSchemas, undefined)
    let sql = generateEnrichedMaterializedViewsSql({ includeColumns, schemaFilter, limit, offset })
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
    const schemaFilter = schema ? filterByList([schema], []) : undefined
    if (id) {
      const sql = `${generateEnrichedMaterializedViewsSql({
        includeColumns: true,
        schemaFilter,
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
        schemaFilter,
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

const generateEnrichedMaterializedViewsSql = ({
  includeColumns,
  schemaFilter,
  limit,
  offset,
}: {
  includeColumns: boolean
  schemaFilter?: string
  limit?: number
  offset?: number
}) => `
with materialized_views as (${MATERIALIZED_VIEWS_SQL({ schemaFilter, limit, offset })})
  ${includeColumns ? `, columns as (${COLUMNS_SQL({ schemaFilter, limit, offset })}` : ''}
select
  *
  ${
    includeColumns
      ? `, ${coalesceRowsToArray('columns', 'columns.table_id = materialized_views.id')}`
      : ''
  }
from materialized_views`
