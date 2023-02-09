import { ident, literal } from 'pg-format'
import { PermissionListSchema } from './inputs.js'
import { permissionsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresPermission } from './types.js'

export default class PostgresMetaColumns {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    table_schema,
    table_name,
    column_name,
    privilege,
    include_system_schemas = false,
    limit,
    offset,
  }: PermissionListSchema = {}): Promise<PostgresMetaResult<PostgresPermission[]>> {
    let sql = `
WITH
  permissions AS (${permissionsSql})
SELECT
  *
FROM
  permissions
WHERE
  true`
    if (table_schema) {
      sql += ` AND table_schema = ${literal(table_schema)}`
    }
    if (table_name) {
      sql += ` AND table_name = ${literal(table_name)}`
    }
    if (column_name) {
      sql += ` AND column_name = ${literal(column_name)}`
    }
    if (privilege) {
      sql += ` AND privilege = ${literal(privilege)}`
    }
    if (!include_system_schemas) {
      sql += ` AND table_schema NOT LIKE 'pg_%'`
      sql += ` AND table_schema != 'information_schema'`
    }
    if (limit) {
      sql += ` LIMIT ${limit}`
    }
    if (offset) {
      sql += ` OFFSET ${offset}`
    }
    console.log(sql)
    return await this.query(sql)
  }
}
