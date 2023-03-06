import { ident, literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants.js'
import { filterByList } from './helpers.js'
import { functionsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresFunction, PostgresFunctionCreate } from './types.js'

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
  } = {}): Promise<PostgresMetaResult<PostgresFunction[]>> {
    let sql = enrichedFunctionsSql
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
      const sql = this.generateRetrieveFunctionSql({ name, schema, args })
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return {
          data: null,
          error: {
            message: `Cannot find function "${schema}"."${name}"(${args.join(', ')})`,
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
    return_type = 'void',
    language = 'sql',
    behavior = 'VOLATILE',
    security_definer = false,
    config_params = {},
  }: PostgresFunctionCreate): Promise<PostgresMetaResult<PostgresFunction>> {
    const sql = this.generateCreateFunctionSql({
      name,
      schema,
      args,
      definition,
      return_type,
      language,
      behavior,
      security_definer,
      config_params,
    })
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
      definition,
    }: {
      name?: string
      schema?: string
      definition?: string
    }
  ): Promise<PostgresMetaResult<PostgresFunction>> {
    const { data: currentFunc, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }

    const args = currentFunc!.argument_types.split(', ')
    const identityArgs = currentFunc!.identity_argument_types

    const updateDefinitionSql =
      typeof definition === 'string'
        ? this.generateCreateFunctionSql(
            {
              ...currentFunc!,
              definition,
              args,
              config_params: currentFunc!.config_params ?? {},
            },
            { replace: true }
          )
        : ''

    const updateNameSql =
      name && name !== currentFunc!.name
        ? `ALTER FUNCTION ${ident(currentFunc!.schema)}.${ident(
            currentFunc!.name
          )}(${identityArgs}) RENAME TO ${ident(name)};`
        : ''

    const updateSchemaSql =
      schema && schema !== currentFunc!.schema
        ? `ALTER FUNCTION ${ident(currentFunc!.schema)}.${ident(
            name || currentFunc!.name
          )}(${identityArgs})  SET SCHEMA ${ident(schema)};`
        : ''

    const sql = `
      DO LANGUAGE plpgsql $$
      BEGIN
        IF ${typeof definition === 'string' ? 'TRUE' : 'FALSE'} THEN
          ${updateDefinitionSql}

          IF (
            SELECT id
            FROM (${functionsSql}) AS f
            WHERE f.schema = ${literal(currentFunc!.schema)}
            AND f.name = ${literal(currentFunc!.name)}
            AND f.identity_argument_types = ${literal(identityArgs)}
          ) != ${id} THEN
            RAISE EXCEPTION 'Cannot find function "${currentFunc!.schema}"."${
      currentFunc!.name
    }"(${identityArgs})';
          END IF;
        END IF;

        ${updateNameSql}

        ${updateSchemaSql}
      END;
      $$;
    `

    {
      const { error } = await this.query(sql)

      if (error) {
        return { data: null, error }
      }
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
    (${func!.identity_argument_types})
    ${cascade ? 'CASCADE' : 'RESTRICT'};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: func!, error: null }
  }

  private generateCreateFunctionSql(
    {
      name,
      schema,
      args,
      definition,
      return_type,
      language,
      behavior,
      security_definer,
      config_params,
    }: PostgresFunctionCreate,
    { replace = false } = {}
  ): string {
    return `
      CREATE ${replace ? 'OR REPLACE' : ''} FUNCTION ${ident(schema!)}.${ident(name!)}(${
      args?.join(', ') || ''
    })
      RETURNS ${return_type}
      AS ${literal(definition)}
      LANGUAGE ${language}
      ${behavior}
      CALLED ON NULL INPUT
      ${security_definer ? 'SECURITY DEFINER' : 'SECURITY INVOKER'}
      ${
        config_params
          ? Object.entries(config_params)
              .map(
                ([param, value]: string[]) =>
                  `SET ${param} ${value[0] === 'FROM CURRENT' ? 'FROM CURRENT' : 'TO ' + value}`
              )
              .join('\n')
          : ''
      };
    `
  }

  private generateRetrieveFunctionSql({
    schema,
    name,
    args,
  }: {
    schema: string
    name: string
    args: string[]
  }): string {
    return `${enrichedFunctionsSql} JOIN pg_proc AS p ON id = p.oid WHERE schema = ${literal(
      schema
    )} AND name = ${literal(name)} AND p.proargtypes::text = ${
      args.length
        ? `(
          SELECT STRING_AGG(type_oid::text, ' ') FROM (
            SELECT (
              split_args.arr[
                array_length(
                  split_args.arr,
                  1
                )
              ]::regtype::oid
            ) AS type_oid FROM (
              SELECT STRING_TO_ARRAY(
                UNNEST(
                  ARRAY[${args.map(literal)}]
                ),
                ' '
              ) AS arr
            ) AS split_args
          ) args
    )`
        : literal('')
    }`
  }
}

const enrichedFunctionsSql = `
  WITH f AS (
    ${functionsSql}
  )
  SELECT
    f.*
  FROM f
`
