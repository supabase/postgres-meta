import { ident, literal } from 'pg-format'
import { tablePermissionsSql } from './sql/index.js'
import type { TablePermissionListSchema } from './inputs.js'
import type { PostgresMetaResult, PostgresTablePermission } from './types.js'

export default class PostgresMetaColumns {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    table_schema,
    table_name,
    privilege,
    include_system_schemas = false,
    limit,
    offset,
  }: TablePermissionListSchema = {}): Promise<PostgresMetaResult<PostgresTablePermission[]>> {
    let sql = `
WITH
  table_permissions AS (${tablePermissionsSql})
SELECT
  *
FROM
  table_permissions
WHERE
  true`
    if (table_schema) {
      sql += ` AND table_schema = ${literal(table_schema)}`
    }
    if (table_name) {
      sql += ` AND table_name = ${literal(table_name)}`
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

  async grant(
    table_name: string,
    {
      table_schema,
      privilege_type,
      role,
    }: {
      table_schema: string
      privilege_type?: 'SELECT' | 'INSERT' | 'UPDATE'
      role: string
    }
  ): Promise<PostgresMetaResult<'OK'>> {
    let sql = 'GRANT '
    sql += privilege_type ?? 'ALL PRIVILEGES'
    sql += ` on ${ident(table_schema)}.${ident(table_name)}`
    sql += ` to ${ident(role)}`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: 'OK', error: null }
  }

  async revoke(
    table_name: string,
    {
      table_schema,
      privilege_type,
      role,
    }: {
      table_schema: string
      privilege_type?: 'SELECT' | 'INSERT' | 'UPDATE'
      role: string
    }
  ): Promise<PostgresMetaResult<'OK'>> {
    let sql = 'REVOKE '
    sql += privilege_type ?? 'ALL PRIVILEGES'
    sql += ` on ${ident(table_schema)}.${ident(table_name)}`
    sql += ` to ${ident(role)}`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: 'OK', error: null }
  }
}
