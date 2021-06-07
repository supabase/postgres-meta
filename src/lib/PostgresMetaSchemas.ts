import { ident, literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { schemasSql } from './sql'
import {
  PostgresMetaResult,
  PostgresSchema,
  PostgresSchemaCreate,
  PostgresSchemaUpdate,
} from './types'

export default class PostgresMetaSchemas {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({ includeSystemSchemas = false } = {}): Promise<PostgresMetaResult<PostgresSchema[]>> {
    const sql = includeSystemSchemas
      ? schemasSql
      : `${schemasSql} AND NOT (n.nspname IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')}));`
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresSchema>>
  async retrieve({ name }: { name: string }): Promise<PostgresMetaResult<PostgresSchema>>
  async retrieve({
    id,
    name,
  }: {
    id?: number
    name?: string
  }): Promise<PostgresMetaResult<PostgresSchema>> {
    if (id) {
      const sql = `${schemasSql} AND n.oid = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a schema with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${schemasSql} AND n.nspname = ${literal(name)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a schema named ${name}` } }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on schema retrieve' } }
    }
  }

  async create({
    name,
    owner = 'postgres',
  }: PostgresSchemaCreate): Promise<PostgresMetaResult<PostgresSchema>> {
    const sql = `CREATE SCHEMA ${ident(name)} AUTHORIZATION ${ident(owner)};`
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name })
  }

  async update(
    id: number,
    { name, owner }: PostgresSchemaUpdate
  ): Promise<PostgresMetaResult<PostgresSchema>> {
    const { data: old, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }
    const nameSql =
      name === undefined ? '' : `ALTER SCHEMA ${ident(old!.name)} RENAME TO ${ident(name)};`
    const ownerSql =
      owner === undefined ? '' : `ALTER SCHEMA ${ident(old!.name)} OWNER TO ${ident(owner)};`
    const sql = `BEGIN; ${ownerSql} ${nameSql} COMMIT;`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return await this.retrieve({ id })
  }

  async remove(id: number, { cascade = false } = {}): Promise<PostgresMetaResult<PostgresSchema>> {
    const { data: schema, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }
    const sql = `DROP SCHEMA ${ident(schema!.name)} ${cascade ? 'CASCADE' : 'RESTRICT'};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: schema!, error: null }
  }
}
