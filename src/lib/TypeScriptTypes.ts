import { parse } from "path"
import { string } from "pg-format"
import prettier from "prettier"
import parserTypescript from "prettier/parser-typescript"

import { PostgresMeta } from "."
import { PostgresColumn } from "./types"

// TODO: move to it's own class/file later
const parseColumn = (columnData: { name: string, format: string }) => {
  let dataType: string = ''
  switch (columnData.format) {
    case 'int8':
      dataType = 'number'
      break
    default:
      dataType = 'any'
      break
  }

  return `${columnData.name}: ${dataType}`
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
      const tableGroupings = data.reduce((prev, current) => {
        if (current.table in prev) {
          prev[current.table].push(current)
        } else {
          prev[current.table] = [current]
        }

        return prev
      }, {} as { [key: string]: PostgresColumn[] })

      const tableDefString = Object
        .entries(tableGroupings)
        .map(([table, columns]: [string, PostgresColumn[]]) => {
          return `${table}: { ${columns.map(parseColumn).join(';')} };`
        }).join('')

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
