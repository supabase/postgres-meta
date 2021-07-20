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
      ? enrichedFunctionsSql
      : `${enrichedFunctionsSql} WHERE NOT (schema IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(
          ','
        )}));`
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresFunction>>
  async retrieve({
    name,
    schema,
    args,
  }: {
    name: string
    schema: string
    args: string[]
  }): Promise<PostgresMetaResult<PostgresFunction>>
  async retrieve({
    id,
    name,
    schema = 'public',
    args = [],
  }: {
    id?: number
    name?: string
    schema?: string
    args?: string[]
  }): Promise<PostgresMetaResult<PostgresFunction>> {
    if (id) {
      const sql = `${enrichedFunctionsSql} WHERE id = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a function with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name && schema && args) {
      const argTypes = args.join(', ')
      const sql = `${enrichedFunctionsSql} WHERE schema = ${literal(schema)} AND name = ${literal(
        name
      )} AND argument_types = ${literal(argTypes)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: {
            message: `Cannot find function "${schema}"."${name}"(${argTypes})`,
          },
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
    args = [],
    definition,
    rettype = 'void',
    language = 'sql',
    behavior = 'VOLATILE',
    security_definer = false,
    config_params,
  }: {
    name: string
    schema?: string
    args?: string[]
    definition: string
    rettype?: string
    language?: string
    behavior?: 'IMMUTABLE' | 'STABLE' | 'VOLATILE'
    security_definer?: boolean
    config_params: { [key: string]: string[] }
  }): Promise<PostgresMetaResult<PostgresFunction>> {
    const sql = `
      CREATE FUNCTION ${ident(schema)}.${ident(name)}(${args.join(', ')})
      RETURNS ${rettype}
      AS ${literal(definition)}
      LANGUAGE ${language}
      ${behavior}
      ${security_definer ? 'SECURITY DEFINER' : 'SECURITY INVOKER'}
      ${Object.entries(config_params)
        .map(
          ([param, values]) =>
            `SET ${param} ${
              values[0] === 'FROM CURRENT' ? 'FROM CURRENT' : 'TO ' + values.map(ident).join(',')
            }`
        )
        .join('\n')}
      RETURNS NULL ON NULL INPUT;
    `
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name, schema, args })
  }

  async update(
    id: number,
    {
      name,
      schema,
    }: {
      name?: string
      schema?: string
    }
  ): Promise<PostgresMetaResult<PostgresFunction>> {
    const { data: old, error: retrieveError } = await this.retrieve({ id })
    if (retrieveError) {
      return { data: null, error: retrieveError }
    }

    const updateNameSql =
      name && name !== old!.name
        ? `ALTER FUNCTION ${ident(old!.schema)}.${ident(old!.name)}(${
            old!.argument_types
          }) RENAME TO ${ident(name)};`
        : ''

    const updateSchemaSql =
      schema && schema !== old!.schema
        ? `ALTER FUNCTION ${ident(old!.schema)}.${ident(name || old!.name)}(${
            old!.argument_types
          })  SET SCHEMA ${ident(schema)};`
        : ''

    const sql = `BEGIN; ${updateNameSql} ${updateSchemaSql} COMMIT;`

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
    const sql = `DROP FUNCTION ${ident(func!.schema)}.${ident(func!.name)}
    (${func!.argument_types})
    ${cascade ? 'CASCADE' : 'RESTRICT'};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: func!, error: null }
  }
}

const enrichedFunctionsSql = `
  WITH functions AS (
    ${functionsSql}
  )
  SELECT
    *
  FROM functions
`
