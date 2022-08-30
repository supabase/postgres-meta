import prettier from 'prettier'
import type {
  PostgresFunction,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib'

export const apply = ({
  schemas,
  tables,
  views,
  functions,
  types,
}: {
  schemas: PostgresSchema[]
  tables: PostgresTable[]
  views: PostgresView[]
  functions: PostgresFunction[]
  types: PostgresType[]
}): string => {
  let output = `
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  ${schemas.map((schema) => {
    const schemaTables = tables.filter((table) => table.schema === schema.name)
    const schemaViews = views.filter((view) => view.schema === schema.name)
    const schemaFunctions = functions.filter((func) => func.schema === schema.name)
    return `${JSON.stringify(schema.name)}: {
          Tables: {
            ${
              schemaTables.length === 0
                ? '[_ in never]: never'
                : schemaTables.map(
                    (table) => `${JSON.stringify(table.name)}: {
                  Row: {
                    ${table.columns.map(
                      (column) =>
                        `${JSON.stringify(column.name)}: ${pgTypeToTsType(column.format, types)} ${
                          column.is_nullable ? '| null' : ''
                        }`
                    )}
                  }
                  Insert: {
                    ${table.columns.map((column) => {
                      let output = JSON.stringify(column.name)

                      if (column.identity_generation === 'ALWAYS') {
                        return `${output}?: never`
                      }

                      if (
                        column.is_nullable ||
                        column.is_identity ||
                        column.default_value !== null
                      ) {
                        output += '?:'
                      } else {
                        output += ':'
                      }

                      output += pgTypeToTsType(column.format, types)

                      if (column.is_nullable) {
                        output += '| null'
                      }

                      return output
                    })}
                  }
                  Update: {
                    ${table.columns.map((column) => {
                      let output = JSON.stringify(column.name)

                      if (column.identity_generation === 'ALWAYS') {
                        return `${output}?: never`
                      }

                      output += `?: ${pgTypeToTsType(column.format, types)}`

                      if (column.is_nullable) {
                        output += '| null'
                      }

                      return output
                    })}
                  }
                }`
                  )
            }
          }
          Views: {
            ${
              schemaViews.length === 0
                ? '[_ in never]: never'
                : schemaViews.map(
                    (view) => `${JSON.stringify(view.name)}: {
                  Row: {
                    ${view.columns.map(
                      (column) =>
                        `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                          column.format,
                          types
                        )} | null`
                    )}
                  }
                  ${
                    view.is_updatable
                      ? `Insert: {
                    ${view.columns.map((column) => {
                      let output = JSON.stringify(column.name)

                      if (!column.is_updatable) {
                        return `${output}?: never`
                      }

                      output += `?: ${pgTypeToTsType(column.format, types)} | null`

                      return output
                    })}
                  }`
                      : ''
                  }
                  ${
                    view.is_updatable
                      ? `Update: {
                    ${view.columns.map((column) => {
                      let output = JSON.stringify(column.name)

                      if (!column.is_updatable) {
                        return `${output}?: never`
                      }

                      output += `?: ${pgTypeToTsType(column.format, types)} | null`

                      return output
                    })}
                  }`
                      : ''
                  }
                }`
                  )
            }
          }
          Functions: {
            ${
              schemaFunctions.length === 0
                ? '[_ in never]: never'
                : schemaFunctions.map(
                    (func) => `${JSON.stringify(func.name)}: {
                  Args: ${(() => {
                    if (func.argument_types === '') {
                      return 'Record<PropertyKey, never>'
                    }

                    const splitArgs = func.argument_types.split(',').map((arg) => arg.trim())
                    if (splitArgs.some((arg) => arg.includes('"') || !arg.includes(' '))) {
                      return 'Record<string, unknown>'
                    }

                    const argsNameAndType = splitArgs.map((arg) => {
                      const [name, ...rest] = arg.split(' ')
                      const type = types.find((_type) => _type.format === rest.join(' '))
                      if (!type) {
                        return { name, type: 'unknown' }
                      }
                      return { name, type: pgTypeToTsType(type.name, types) }
                    })

                    return `{ ${argsNameAndType.map(
                      ({ name, type }) => `${JSON.stringify(name)}: ${type}`
                    )} }`
                  })()}
                  Returns: ${pgTypeToTsType(func.return_type, types)}
                }`
                  )
            }
          }
        }`
  })}
}`

  output = prettier.format(output, {
    parser: 'typescript',
  })
  return output
}

// TODO: Make this more robust. Currently doesn't handle composite types - returns them as unknown.
const pgTypeToTsType = (pgType: string, types: PostgresType[]): string => {
  if (pgType === 'bool') {
    return 'boolean'
  } else if (['int2', 'int4', 'int8', 'float4', 'float8', 'numeric'].includes(pgType)) {
    return 'number'
  } else if (
    [
      'bytea',
      'bpchar',
      'varchar',
      'date',
      'text',
      'time',
      'timetz',
      'timestamp',
      'timestamptz',
      'uuid',
    ].includes(pgType)
  ) {
    return 'string'
  } else if (['json', 'jsonb'].includes(pgType)) {
    return 'Json'
  } else if (pgType === 'void') {
    return 'undefined'
  } else if (pgType === 'record') {
    return 'Record<string, unknown>[]'
  } else if (pgType.startsWith('_')) {
    return `(${pgTypeToTsType(pgType.substring(1), types)})[]`
  } else {
    const type = types.find((type) => type.name === pgType && type.enums.length > 0)
    if (type) {
      return type.enums.map((variant) => JSON.stringify(variant)).join('|')
    }

    return 'unknown'
  }
}
