import prettier from "prettier"
import parserTypescript from "prettier/parser-typescript"

import { PostgresMeta } from "."
import { PostgresColumn } from "./types"

const parseColumns = (columns: PostgresColumn[]) => {
  const tableGroupings = columns.reduce((prev, current) => {
    if (current.table in prev) {
      prev[current.table].push(current)
    } else {
      prev[current.table] = [current]
    }

    return prev
  }, {} as { [key: string]: PostgresColumn[] })

  return Object
    .entries(tableGroupings)
    .map(([table, columns]: [string, PostgresColumn[]]) => {
      return `${table}: { ${columns.map(parseColumn).join(';')} };`
    }).join('')
}

const parseColumn = (column: PostgresColumn) => {
  const dataType = postgresToTypescriptType(column.format)
  const nullableSuffix = column.is_nullable ? '?' : ''

  return `${column.name}${nullableSuffix}: ${dataType}`
}

const postgresToTypescriptType = (format: string) => {
  switch (format) {
    // adapted from https://github.com/jawj/zapatos/blob/master/src/generate/pgTypes.ts
    case 'int8':
    case 'int2':
    case 'int4':
    case 'float4':
    case 'float8':
    case 'numeric':
    case 'money':
    case 'oid':
      return 'number'
    case 'date':
    case 'timestamp':
    case 'timestamptz':
      return 'Date'
    case 'bpchar':
    case 'char':
    case 'varchar':
    case 'text':
    case 'citext':
    case 'uuid':
    case 'bytea':
    case 'inet':
    case 'time':
    case 'timetz':
    case 'interval':
    case 'name':
    case 'json':
    case 'jsonb':
      return 'string'
    case 'bool':
      return 'boolean'
    default:
      return 'any'
  }
}

export default class TypeScriptTypes {
  pgMeta: PostgresMeta

  constructor({ pgMeta }: { pgMeta: PostgresMeta }) {
    this.pgMeta = pgMeta
  }

  async dump(): Promise<any> {
    const { data, error } = await this.pgMeta.columns.list()
    // TODO: handle error

    if (data) {
      const tableDefString = parseColumns(data)
      let output = `export interface definitions { ${tableDefString} };`

      // Prettify output
      let prettierOptions: prettier.Options = {
        parser: "typescript",
        plugins: [parserTypescript],
      };
      return prettier.format(output, prettierOptions);
    }
  }
}
