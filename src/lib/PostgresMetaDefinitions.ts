import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { literal } from 'pg-format'
import minify from 'pg-minify'
import { format } from 'sql-formatter'
import { PostgresDefinition, PostgresMetaResult } from './types.js'

export default class PostgresMetaDefinitions {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  connectionString?: string

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>, connectionString?: string) {
    this.query = query
    this.connectionString = connectionString
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresDefinition>> {
    const { data, error } = await this.query(/* SQL */ `
      select
        c.oid::int8 as "id",
        nc.nspname as "schema",
        c.relname as "name"
      from
        pg_namespace nc
        join pg_class c on nc.oid = c.relnamespace
      where
        c.relkind in ('r', 'v', 'm', 'f', 'p')
        and not pg_is_other_temp_schema(nc.oid)
        and (
          pg_has_role(c.relowner, 'USAGE')
          or has_table_privilege(
            c.oid,
            'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
          )
          or has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
        )
        and c.oid = ${literal(id)}
      limit 1;
    `)
    if (error) {
      return { data, error }
    }

    if (data.length <= 0) {
      return { data, error: new Error(`Definition not found`) }
    }

    try {
      const { schema, name } = data[0]

      const pg_restore = spawn('pg_dump', [
        '-s',
        '-n',
        schema,
        '-t',
        name,
        '--no-owner',
        '--no-privileges',
        '--no-sync',
        '-d',
        this.connectionString,
      ])

      const fullDefinition = await this._promisifySpawn(pg_restore)

      return {
        data: {
          definition: format(minify(fullDefinition.substring(fullDefinition.indexOf('CREATE'))), {
            language: 'postgresql',
            keywordCase: 'lower',
          }),
        },
        error,
      }
    } catch (error: any) {
      if (typeof error === 'string') {
        error = new Error(error)
      }

      return { data, error }
    }
  }

  _promisifySpawn(child: ChildProcessWithoutNullStreams) {
    return new Promise<string>((resolve, reject) => {
      let data: string

      child.stdout.on('data', (d) => {
        data += d.toString()
      })
      child.stderr.on('data', (d) => {
        data += d.toString()
      })
      child.on('error', (d) => {
        data += d.toString()
      })

      child.on('close', (code) => {
        if (code === 0) {
          resolve(data)
        } else {
          reject(data)
        }
      })
    })
  }
}
