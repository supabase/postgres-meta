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
    const schemaEnums = types.filter((type) => type.schema === schema.name && type.enums.length > 0)
    return `${JSON.stringify(schema.name)}: {
          Tables: {
            ${
              schemaTables.length === 0
                ? '[_ in never]: never'
                : schemaTables.map(
                    (table) => `${JSON.stringify(table.name)}: {
                  Row: {
                    ${[
                      ...table.columns.map(
                        (column) =>
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                            column.format,
                            types,
                            schemas
                          )} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter((fn) => fn.argument_types === table.name)
                        .map(
                          (fn) =>
                            `${JSON.stringify(fn.name)}: ${pgTypeToTsType(
                              fn.return_type,
                              types,
                              schemas
                            )}`
                        ),
                    ]}
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

                      output += pgTypeToTsType(column.format, types, schemas)

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

                      output += `?: ${pgTypeToTsType(column.format, types, schemas)}`

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
                          types,
                          schemas
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

                      output += `?: ${pgTypeToTsType(column.format, types, schemas)} | null`

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

                      output += `?: ${pgTypeToTsType(column.format, types, schemas)} | null`

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
            ${(() => {
              if (schemaFunctions.length === 0) {
                return '[_ in never]: never'
              }

              const schemaFunctionsGroupedByName = schemaFunctions.reduce((acc, curr) => {
                acc[curr.name] ??= []
                acc[curr.name].push(curr)
                return acc
              }, {} as Record<string, PostgresFunction[]>)

              return Object.entries(schemaFunctionsGroupedByName).map(
                ([fnName, fns]) =>
                  `${JSON.stringify(fnName)}: ${fns
                    .map(
                      (fn) => `{
                  Args: ${(() => {
                    if (fn.argument_types === '') {
                      return 'Record<PropertyKey, never>'
                    }

                    const splitArgs = fn.argument_types.split(',').map((arg) => arg.trim())
                    if (splitArgs.some((arg) => arg.includes('"') || !arg.includes(' '))) {
                      return 'Record<string, unknown>'
                    }

                    const argsNameAndType = splitArgs.map((arg) => {
                      const [name, ...rest] = arg.split(' ')
                      const type = types.find((_type) => _type.format === rest.join(' '))
                      if (!type) {
                        return { name, type: 'unknown' }
                      }
                      return { name, type: pgTypeToTsType(type.name, types, schemas) }
                    })

                    return `{ ${argsNameAndType.map(
                      ({ name, type }) => `${JSON.stringify(name)}: ${type}`
                    )} }`
                  })()}
                  Returns: ${pgTypeToTsType(fn.return_type, types, schemas)}
                }`
                    )
                    .join('|')}`
              )
            })()}
          }
          Enums: {
            ${
              schemaEnums.length === 0
                ? '[_ in never]: never'
                : schemaEnums.map(
                    (enum_) =>
                      `${JSON.stringify(enum_.name)}: ${enum_.enums
                        .map((variant) => JSON.stringify(variant))
                        .join('|')}`
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
const pgTypeToTsType = (
  pgType: string,
  types: PostgresType[],
  schemas: PostgresSchema[]
): string => {
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
    return `(${pgTypeToTsType(pgType.substring(1), types, schemas)})[]`
  } else {
    const type = types.find((type) => type.name === pgType && type.enums.length > 0)
    if (type) {
      if (schemas.some(({ name }) => name === type.schema)) {
        return `Database[${JSON.stringify(type.schema)}]['Enums'][${JSON.stringify(type.name)}]`
      }
      return type.enums.map((variant) => JSON.stringify(variant)).join('|')
    }

    return 'unknown'
  }
}
