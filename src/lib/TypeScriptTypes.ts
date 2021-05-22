import { parse } from "path"
import { string } from "pg-format"
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

const parseColumn = (columnData: PostgresColumn) => {
  let dataType: string = ''
  switch (columnData.format) {
    // adapted from https://github.com/jawj/zapatos/blob/master/src/generate/pgTypes.ts
    case 'int8':
    case 'int2':
    case 'int4':
    case 'float4':
    case 'float8':
    case 'numeric':
    case 'money':
    case 'oid':
      dataType = 'number'
      break
    case 'date':
    case 'timestamp':
    case 'timestamptz':
      dataType = 'Date'
      break
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
      dataType = 'string'
      break
    case 'bool':
      dataType = 'boolean'
      break
    default:
      dataType = 'any'
      break
  }

  const nullableSuffix = columnData.is_nullable ? '?' : ''

  return `${columnData.name}${nullableSuffix}: ${dataType}`
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
