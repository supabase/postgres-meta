import { ident, literal } from 'pg-format'
import { extensionsSql } from './sql/index.js'
import { PostgresMetaResult, PostgresExtension } from './types.js'

export default class PostgresMetaExtensions {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    limit,
    offset,
  }: {
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresExtension[]>> {
    let sql = extensionsSql
    if (limit) {
      sql = `${sql} LIMIT ${limit}`
    }
    if (offset) {
      sql = `${sql} OFFSET ${offset}`
    }
    return await this.query(sql)
  }

  async retrieve({ name }: { name: string }): Promise<PostgresMetaResult<PostgresExtension>> {
    const sql = `${extensionsSql} WHERE name = ${literal(name)};`
    const { data, error } = await this.query(sql)
    if (error) {
      return { data, error }
    } else if (data.length === 0) {
      return { data: null, error: { message: `Cannot find an extension named ${name}` } }
    } else {
      return { data: data[0], error }
    }
  }

  async create({
    name,
    schema,
    version,
    cascade = false,
  }: {
    name: string
    schema?: string
    version?: string
    cascade?: boolean
  }): Promise<PostgresMetaResult<PostgresExtension>> {
    const sql = `
CREATE EXTENSION ${ident(name)}
  ${schema === undefined ? '' : `SCHEMA ${ident(schema)}`}
  ${version === undefined ? '' : `VERSION ${literal(version)}`}
  ${cascade ? 'CASCADE' : ''};`
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name })
  }

  async update(
    name: string,
    {
      update = false,
      version,
      schema,
    }: {
      update?: boolean
      version?: string
      schema?: string
    }
  ): Promise<PostgresMetaResult<PostgresExtension>> {
    let updateSql = ''
    if (update) {
      updateSql = `ALTER EXTENSION ${ident(name)} UPDATE ${
        version === undefined ? '' : `TO ${literal(version)}`
      };`
    }
    const schemaSql =
      schema === undefined ? '' : `ALTER EXTENSION ${ident(name)} SET SCHEMA ${ident(schema)};`

    const sql = `BEGIN; ${updateSql} ${schemaSql} COMMIT;`
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name })
  }

  async remove(
    name: string,
    { cascade = false } = {}
  ): Promise<PostgresMetaResult<PostgresExtension>> {
    const { data: extension, error } = await this.retrieve({ name })
    if (error) {
      return { data: null, error }
    }
    const sql = `DROP EXTENSION ${ident(name)} ${cascade ? 'CASCADE' : 'RESTRICT'};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: extension!, error: null }
  }
}
