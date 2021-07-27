import { ident, literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { functionsSql } from './sql'
import { PostgresMetaResult, PostgresFunction, PostgresFunctionCreate } from './types'

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

    const retrieveFunctionSql = this.generateRetrieveFunctionSql({
      schema: currentFunc!.schema,
      name: currentFunc!.name,
      args,
    })

    const updateNameSql =
      name && name !== currentFunc!.name
        ? `ALTER FUNCTION ${ident(currentFunc!.schema)}.${ident(currentFunc!.name)}(${
            currentFunc!.argument_types
          }) RENAME TO ${ident(name)};`
        : ''

    const updateSchemaSql =
      schema && schema !== currentFunc!.schema
        ? `ALTER FUNCTION ${ident(currentFunc!.schema)}.${ident(name || currentFunc!.name)}(${
            currentFunc!.argument_types
          })  SET SCHEMA ${ident(schema)};`
        : ''

    const sql = `
      DO LANGUAGE plpgsql $$
      DECLARE
        function record;
      BEGIN
        IF ${typeof definition === 'string' ? 'TRUE' : 'FALSE'} THEN
          ${updateDefinitionSql}

          ${retrieveFunctionSql} INTO function;

          IF function.id != ${id} THEN
            RAISE EXCEPTION 'Cannot find function "${currentFunc!.schema}"."${currentFunc!.name}"(${
      currentFunc!.argument_types
    })';
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
                ([param, value]) =>
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
