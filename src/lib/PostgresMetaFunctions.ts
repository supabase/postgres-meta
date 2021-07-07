import { ident, literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { functionsSql } from './sql'
import { PostgresMetaResult, PostgresFunction } from './types'

export default class PostgresMetaFunctions {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({ includeSystemSchemas = false } = {}): Promise<
    PostgresMetaResult<PostgresFunction[]>
  > {
    const sql = includeSystemSchemas
      ? functionsSql
      : `${functionsSql} WHERE NOT (n.nspname IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(
          ','
        )}));`
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresFunction>>
  async retrieve({
    name,
    schema,
  }: {
    name: string
    schema: string
  }): Promise<PostgresMetaResult<PostgresFunction>>
  async retrieve({
    id,
    name,
  }: {
    id?: number
    name?: string
  }): Promise<PostgresMetaResult<PostgresFunction>> {
    if (id) {
      const sql = `${functionsSql} WHERE p.oid = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a function with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${functionsSql} WHERE p.proname = ${literal(name)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: { message: `Cannot find a function named ${name}` },
        }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on function retrieve' } }
    }
  }

  async create({
    name,
    schema = 'public',
    params,
    definition,
    rettype = 'void',
    language = 'sql',
  }: {
    name: string
    schema?: string
    params?: string[]
    definition: string
    rettype?: string
    language?: string
  }): Promise<PostgresMetaResult<PostgresFunction>> {
    const sql = `
      CREATE FUNCTION ${ident(schema)}.${ident(name)}
      ${params && params.length ? `(${params.join(',')})` : '()'}
      RETURNS ${rettype || 'void'}
      AS '${definition}'
      LANGUAGE ${language}
      RETURNS NULL ON NULL INPUT;
      `
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name, schema })
  }

  async update(
    id: number,
    {
      name,
      schema = 'public',
      params,
      extension,
    }: {
      name: string
      schema?: string
      params?: string[] //optional params for overloaded functions
      extension?: string //e.g. sqrt DEPENDS ON EXTENSION mathlib
    }
  ): Promise<PostgresMetaResult<PostgresFunction>> {
    const { data: old, error: retrieveError } = await this.retrieve({ id })
    if (retrieveError) {
      return { data: null, error: retrieveError }
    }

    let alter = `ALTER FUNCTION ${ident(old!.schema)}.${ident(old!.name)}${
      params && params.length ? `(${params.join(',')})` : ''
    }`

    let schemaSql = ''
    if (schema !== undefined && schema !== old!.schema) {
      schemaSql = `${alter} SET SCHEMA ${ident(schema)};`
      alter = `ALTER FUNCTION ${ident(schema)}.${ident(old!.name)}${
        params && params.length ? `(${params.join(',')})` : ''
      }`
    }

    const nameSql =
      name === undefined || name == old!.name ? '' : `${alter} RENAME TO ${ident(name)};`

    //Note: leaving out search_path and owner - should these be alterable from this api?
    //Note: also leaving out extensions - to enable extensions, they would have to already be
    //installed. Current Postgres docker image has no extensions installed

    const sql = `BEGIN;${schemaSql} ${nameSql} COMMIT;`

    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ id })
  }

  async remove(
    id: number,
    { cascade = false } = {}
  ): Promise<PostgresMetaResult<PostgresFunction>> {
    const { data: func, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }
    const sql = `DROP FUNCTION ${ident(func!.schema)}.${ident(func!.name)} ${
      cascade ? 'CASCADE' : 'RESTRICT'
    };`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: func!, error: null }
  }
}
