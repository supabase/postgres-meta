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
  ${schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .map((schema) => {
      const schemaTables = tables
        .filter((table) => table.schema === schema.name)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      const schemaViews = views
        .filter((view) => view.schema === schema.name)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      const schemaFunctions = functions
        .filter((func) => {
          if (func.schema !== schema.name) {
            return false
          }

          // Either:
          // 1. All input args are be named, or
          // 2. There is only one input arg which is unnamed
          const inArgs = func.args.filter(({ mode }) => ['in', 'inout', 'variadic'].includes(mode))

          if (!inArgs.some(({ name }) => name === '')) {
            return true
          }

          if (inArgs.length === 1) {
            return true
          }

          return false
        })
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      const schemaEnums = types
        .filter((type) => type.schema === schema.name && type.enums.length > 0)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
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
                        )} ${column.is_nullable ? '| null' : ''}`
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
                      ({ args, return_type }) => `{
                  Args: ${(() => {
                    const inArgs = args.filter(({ mode }) => mode === 'in')

                    if (inArgs.length === 0) {
                      return 'Record<PropertyKey, never>'
                    }

                    const argsNameAndType = inArgs.map(({ name, type_id }) => {
                      const type = types.find(({ id }) => id === type_id)
                      if (!type) {
                        return { name, type: 'unknown' }
                      }
                      return { name, type: pgTypeToTsType(type.name, types, schemas) }
                    })

                    return `{ ${argsNameAndType.map(
                      ({ name, type }) => `${JSON.stringify(name)}: ${type}`
                    )} }`
                  })()}
                  Returns: ${pgTypeToTsType(return_type, types, schemas)}
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
    semi: false,
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
