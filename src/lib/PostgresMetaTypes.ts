import { DEFAULT_SYSTEM_SCHEMAS } from './constants.js'
import { filterByList } from './helpers.js'
import { typesSql } from './sql/index.js'
import { PostgresMetaResult, PostgresType } from './types.js'

export default class PostgresMetaTypes {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    includeArrayTypes = false,
    includeSystemSchemas = false,
    includedSchemas,
    excludedSchemas,
    limit,
    offset,
  }: {
    includeArrayTypes?: boolean
    includeSystemSchemas?: boolean
    includedSchemas?: string[]
    excludedSchemas?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresType[]>> {
    let sql = typesSql
    if (!includeArrayTypes) {
      sql += ` and not exists (
                 select
                 from
                   pg_type el
                 where
                   el.oid = t.typelem
                   and el.typarray = t.oid
               )`
    }
    const filter = filterByList(
      includedSchemas,
      excludedSchemas,
      !includeSystemSchemas ? DEFAULT_SYSTEM_SCHEMAS : undefined
    )
    if (filter) {
      sql += ` and n.nspname ${filter}`
    }
    if (limit) {
      sql += ` limit ${limit}`
    }
    if (offset) {
      sql += ` offset ${offset}`
    }
    return await this.query(sql)
  }
}
