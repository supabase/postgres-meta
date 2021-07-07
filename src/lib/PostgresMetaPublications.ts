import { ident, literal } from 'pg-format'
import { publicationsSql } from './sql'
import { PostgresMetaResult, PostgresPublication } from './types'

export default class PostgresMetaPublications {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list(): Promise<PostgresMetaResult<PostgresPublication[]>> {
    return await this.query(publicationsSql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresPublication>>
  async retrieve({ name }: { name: string }): Promise<PostgresMetaResult<PostgresPublication>>
  async retrieve({
    id,
    name,
  }: {
    id?: number
    name?: string
  }): Promise<PostgresMetaResult<PostgresPublication>> {
    if (id) {
      const sql = `${publicationsSql} WHERE p.oid = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a publication with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${publicationsSql} WHERE p.pubname = ${literal(name)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a publication named ${name}` } }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on publication retrieve' } }
    }
  }

  async create({
    name,
    publish_insert = false,
    publish_update = false,
    publish_delete = false,
    publish_truncate = false,
    tables,
  }: {
    name: string
    publish_insert?: boolean
    publish_update?: boolean
    publish_delete?: boolean
    publish_truncate?: boolean
    tables?: string[]
  }): Promise<PostgresMetaResult<PostgresPublication>> {
    let tableClause: string
    if (tables === undefined) {
      tableClause = 'FOR ALL TABLES'
    } else if (tables.length === 0) {
      tableClause = ''
    } else {
      tableClause = `FOR TABLE ${tables
        .map((t) => {
          if (!t.includes('.')) {
            return ident(t)
          }

          const [schema, ...rest] = t.split('.')
          const table = rest.join('.')
          return `${ident(schema)}.${ident(table)}`
        })
        .join(',')}`
    }

    let publishOps = []
    if (publish_insert) publishOps.push('insert')
    if (publish_update) publishOps.push('update')
    if (publish_delete) publishOps.push('delete')
    if (publish_truncate) publishOps.push('truncate')

    const sql = `
CREATE PUBLICATION ${ident(name)} ${tableClause}
  WITH (publish = '${publishOps.join(',')}');`
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name })
  }

  async update(
    id: number,
    {
      name,
      owner,
      publish_insert,
      publish_update,
      publish_delete,
      publish_truncate,
      tables,
    }: {
      name?: string
      owner?: string
      publish_insert?: boolean
      publish_update?: boolean
      publish_delete?: boolean
      publish_truncate?: boolean
      tables?: string[]
    }
  ): Promise<PostgresMetaResult<PostgresPublication>> {
    const { data: old, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }

    // Need to work around the limitations of the SQL. Can't add/drop tables from
    // a publication with FOR ALL TABLES. Can't use the SET TABLE clause without
    // at least one table.
    //
    //                              new tables
    //
    //                      | undefined |    string[]     |
    //             ---------|-----------|-----------------|
    //                 null |    ''     | 400 Bad Request |
    // old tables  ---------|-----------|-----------------|
    //             object[] |    ''     |    See below    |
    //
    //                              new tables
    //
    //                      |    []     |      [...]      |
    //             ---------|-----------|-----------------|
    //                   [] |    ''     |    SET TABLE    |
    // old tables  ---------|-----------|-----------------|
    //                [...] | DROP all  |    SET TABLE    |
    //
    let tableSql: string
    if (tables === undefined) {
      tableSql = ''
    } else if (old!.tables === null) {
      throw new Error('Tables cannot be added to or dropped from FOR ALL TABLES publications')
    } else if (tables.length > 0) {
      tableSql = `ALTER PUBLICATION ${ident(old!.name)} SET TABLE ${tables
        .map((t) => {
          if (!t.includes('.')) {
            return ident(t)
          }

          const [schema, ...rest] = t.split('.')
          const table = rest.join('.')
          return `${ident(schema)}.${ident(table)}`
        })
        .join(',')};`
    } else if (old!.tables.length === 0) {
      tableSql = ''
    } else {
      tableSql = `ALTER PUBLICATION ${ident(old!.name)} DROP TABLE ${old!.tables
        .map((table) => `${ident(table.schema)}.${ident(table.name)}`)
        .join(',')};`
    }

    let publishOps = []
    if (publish_insert ?? old!.publish_insert) publishOps.push('insert')
    if (publish_update ?? old!.publish_update) publishOps.push('update')
    if (publish_delete ?? old!.publish_delete) publishOps.push('delete')
    if (publish_truncate ?? old!.publish_truncate) publishOps.push('truncate')
    const publishSql = `ALTER PUBLICATION ${ident(old!.name)} SET (publish = '${publishOps.join(
      ','
    )}');`

    const ownerSql =
      owner === undefined ? '' : `ALTER PUBLICATION ${ident(old!.name)} OWNER TO ${ident(owner)};`

    const nameSql =
      name === undefined || name === old!.name
        ? ''
        : `ALTER PUBLICATION ${ident(old!.name)} RENAME TO ${ident(name)};`

    // nameSql must be last
    const sql = `BEGIN; ${tableSql} ${publishSql} ${ownerSql} ${nameSql} COMMIT;`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return await this.retrieve({ id })
  }

  async remove(id: number): Promise<PostgresMetaResult<PostgresPublication>> {
    const { data: publication, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }
    const sql = `DROP PUBLICATION IF EXISTS ${ident(publication!.name)};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: publication!, error: null }
  }
}
