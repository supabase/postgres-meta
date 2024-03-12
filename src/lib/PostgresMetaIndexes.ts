import { ident, literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants.js'
import { filterByList } from './helpers.js'
import { indexesSql } from './sql/index.js'
import { PostgresMetaResult, PostgresIndex } from './types.js'

export default class PostgresMetaFunctions {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    includeSystemSchemas = false,
    includedSchemas,
    excludedSchemas,
    limit,
    offset,
  }: {
    includeSystemSchemas?: boolean
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresIndex[]>> {
    let sql = enrichedSql
    const filter = filterByList(
      includedSchemas,
      excludedSchemas,
      !includeSystemSchemas ? DEFAULT_SYSTEM_SCHEMAS : undefined
    )
    if (filter) {
      sql += ` WHERE schema ${filter}`
    }
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresIndex>>
  async retrieve({
    name,
    schema,
    args,
  }: {
    name: string
    schema: string
    args: string[]
  }): Promise<PostgresMetaResult<PostgresIndex>>
  async retrieve({
    id,
    args = [],
  }: {
    id?: number
    args?: string[]
  }): Promise<PostgresMetaResult<PostgresIndex>> {
    if (id) {
      const sql = `${enrichedSql} WHERE id = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a index with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on function retrieve' } }
    }
  }
}

const enrichedSql = `
  WITH x AS (
    ${indexesSql}
  )
  SELECT
    x.*
  FROM x
`
