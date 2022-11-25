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
    includeArrayTypes = false,
    includeSystemSchemas = false,
    limit,
    offset,
  }: {
    includeArrayTypes?: boolean
    includeSystemSchemas?: boolean
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
    if (!includeSystemSchemas) {
      sql += ` and n.nspname not in (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')})`
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
