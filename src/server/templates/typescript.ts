import prettier from 'prettier'
import type {
  PostgresColumn,
  PostgresFunction,
  PostgresMaterializedView,
  PostgresRelationship,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'

export const apply = ({
  schemas,
  tables,
  views,
  materializedViews,
  columns,
  relationships,
  functions,
  types,
  arrayTypes,
  detectOneToOneRelationships,
}: {
  schemas: PostgresSchema[]
  tables: Omit<PostgresTable, 'columns'>[]
  views: Omit<PostgresView, 'columns'>[]
  materializedViews: Omit<PostgresMaterializedView, 'columns'>[]
  columns: PostgresColumn[]
  relationships: PostgresRelationship[]
  functions: PostgresFunction[]
  types: PostgresType[]
  arrayTypes: PostgresType[]
  detectOneToOneRelationships: boolean
}): string => {
  const columnsByTableId = columns
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .reduce((acc, curr) => {
      acc[curr.table_id] ??= []
      acc[curr.table_id].push(curr)
      return acc
    }, {} as Record<string, PostgresColumn[]>)

  let output = `
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  ${schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .map((schema) => {
      const schemaTables = tables
        .filter((table) => table.schema === schema.name)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      const schemaViews = [...views, ...materializedViews]
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
      const schemaCompositeTypes = types
        .filter((type) => type.schema === schema.name && type.attributes.length > 0)
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
                      ...columnsByTableId[table.id].map(
                        (column) =>
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                            column.format,
                            types,
                            schemas
                          )} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter((fn) => fn.argument_types === table.name)
                        .map((fn) => {
                          const type = types.find(({ id }) => id === fn.return_type_id)
                          let tsType = 'unknown'
                          if (type) {
                            tsType = pgTypeToTsType(type.name, types, schemas)
                          }
                          return `${JSON.stringify(fn.name)}: ${tsType} | null`
                        }),
                    ]}
                  }
                  Insert: {
                    ${columnsByTableId[table.id].map((column) => {
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
                    ${columnsByTableId[table.id].map((column) => {
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
                  Relationships: [
                    ${relationships
                      .filter(
                        (relationship) =>
                          relationship.schema === table.schema &&
                          relationship.relation === table.name
                      )
                      .sort(
                        (a, b) =>
                          a.foreign_key_name.localeCompare(b.foreign_key_name) ||
                          a.referenced_relation.localeCompare(b.referenced_relation)
                      )
                      .map(
                        (relationship) => `{
                        foreignKeyName: ${JSON.stringify(relationship.foreign_key_name)}
                        columns: ${JSON.stringify(relationship.columns)}
                        ${
                          detectOneToOneRelationships
                            ? `isOneToOne: ${relationship.is_one_to_one};`
                            : ''
                        }referencedRelation: ${JSON.stringify(relationship.referenced_relation)}
                        referencedColumns: ${JSON.stringify(relationship.referenced_columns)}
                      }`
                      )}
                  ]
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
                    ${columnsByTableId[view.id].map(
                      (column) =>
                        `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                          column.format,
                          types,
                          schemas
                        )} ${column.is_nullable ? '| null' : ''}`
                    )}
                  }
                  ${
                    'is_updatable' in view && view.is_updatable
                      ? `Insert: {
                           ${columnsByTableId[view.id].map((column) => {
                             let output = JSON.stringify(column.name)

                             if (!column.is_updatable) {
                               return `${output}?: never`
                             }

                             output += `?: ${pgTypeToTsType(column.format, types, schemas)} | null`

                             return output
                           })}
                         }
                         Update: {
                           ${columnsByTableId[view.id].map((column) => {
                             let output = JSON.stringify(column.name)

                             if (!column.is_updatable) {
                               return `${output}?: never`
                             }

                             output += `?: ${pgTypeToTsType(column.format, types, schemas)} | null`

                             return output
                           })}
                         }
                        `
                      : ''
                  }Relationships: [
                    ${relationships
                      .filter(
                        (relationship) =>
                          relationship.schema === view.schema && relationship.relation === view.name
                      )
                      .sort(({ foreign_key_name: a }, { foreign_key_name: b }) =>
                        a.localeCompare(b)
                      )
                      .map(
                        (relationship) => `{
                        foreignKeyName: ${JSON.stringify(relationship.foreign_key_name)}
                        columns: ${JSON.stringify(relationship.columns)}
                        ${
                          detectOneToOneRelationships
                            ? `isOneToOne: ${relationship.is_one_to_one};`
                            : ''
                        }referencedRelation: ${JSON.stringify(relationship.referenced_relation)}
                        referencedColumns: ${JSON.stringify(relationship.referenced_columns)}
                      }`
                      )}
                  ]
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
                      ({
                        args,
                        return_type_id,
                        return_type_relation_id,
                        is_set_returning_function,
                      }) => `{
                  Args: ${(() => {
                    const inArgs = args.filter(({ mode }) => mode === 'in')

                    if (inArgs.length === 0) {
                      return 'Record<PropertyKey, never>'
                    }

                    const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                      let type = arrayTypes.find(({ id }) => id === type_id)
                      if (type) {
                        // If it's an array type, the name looks like `_int8`.
                        const elementTypeName = type.name.substring(1)
                        return {
                          name,
                          type: `(${pgTypeToTsType(elementTypeName, types, schemas)})[]`,
                          has_default,
                        }
                      }
                      type = types.find(({ id }) => id === type_id)
                      if (type) {
                        return {
                          name,
                          type: pgTypeToTsType(type.name, types, schemas),
                          has_default,
                        }
                      }
                      return { name, type: 'unknown', has_default }
                    })

                    return `{
                      ${argsNameAndType.map(
                        ({ name, type, has_default }) =>
                          `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`
                      )}
                    }`
                  })()}
                  Returns: (${(() => {
                    // Case 1: `returns table`.
                    const tableArgs = args.filter(({ mode }) => mode === 'table')
                    if (tableArgs.length > 0) {
                      const argsNameAndType = tableArgs.map(({ name, type_id }) => {
                        let type = arrayTypes.find(({ id }) => id === type_id)
                        if (type) {
                          // If it's an array type, the name looks like `_int8`.
                          const elementTypeName = type.name.substring(1)
                          return {
                            name,
                            type: `(${pgTypeToTsType(elementTypeName, types, schemas)})[]`,
                          }
                        }
                        type = types.find(({ id }) => id === type_id)
                        if (type) {
                          return { name, type: pgTypeToTsType(type.name, types, schemas) }
                        }
                        return { name, type: 'unknown' }
                      })

                      return `{
                        ${argsNameAndType.map(
                          ({ name, type }) => `${JSON.stringify(name)}: ${type}`
                        )}
                      }`
                    }

                    // Case 2: returns a relation's row type.
                    const relation = [...tables, ...views].find(
                      ({ id }) => id === return_type_relation_id
                    )
                    if (relation) {
                      return `{
                        ${columnsByTableId[relation.id].map(
                          (column) =>
                            `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                              column.format,
                              types,
                              schemas
                            )} ${column.is_nullable ? '| null' : ''}`
                        )}
                      }`
                    }

                    // Case 3: returns base/composite/enum type.
                    const type = types.find(({ id }) => id === return_type_id)
                    if (type) {
                      return pgTypeToTsType(type.name, types, schemas)
                    }

                    return 'unknown'
                  })()})${is_set_returning_function ? '[]' : ''}
                }`
                    )
                    // We only sorted by name on schemaFunctions - here we sort by arg names, arg types, and return type.
                    .sort()
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
          CompositeTypes: {
            ${
              schemaCompositeTypes.length === 0
                ? '[_ in never]: never'
                : schemaCompositeTypes.map(
                    ({ name, attributes }) =>
                      `${JSON.stringify(name)}: {
                        ${attributes.map(({ name, type_id }) => {
                          const type = types.find(({ id }) => id === type_id)
                          if (type) {
                            return `${JSON.stringify(name)}: ${pgTypeToTsType(
                              type.name,
                              types,
                              schemas
                            )}`
                          }
                          return `${JSON.stringify(name)}: unknown`
                        })}
                      }`
                  )
            }
          }
        }`
    })}
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
`

  output = prettier.format(output, {
    parser: 'typescript',
    semi: false,
  })
  return output
}

// TODO: Make this more robust. Currently doesn't handle range types - returns them as unknown.
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
      'citext',
      'time',
      'timetz',
      'timestamp',
      'timestamptz',
      'uuid',
      'vector',
    ].includes(pgType)
  ) {
    return 'string'
  } else if (['json', 'jsonb'].includes(pgType)) {
    return 'Json'
  } else if (pgType === 'void') {
    return 'undefined'
  } else if (pgType === 'record') {
    return 'Record<string, unknown>'
  } else if (pgType.startsWith('_')) {
    return `(${pgTypeToTsType(pgType.substring(1), types, schemas)})[]`
  } else {
    const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
    if (enumType) {
      if (schemas.some(({ name }) => name === enumType.schema)) {
        return `Database[${JSON.stringify(enumType.schema)}]['Enums'][${JSON.stringify(
          enumType.name
        )}]`
      }
      return enumType.enums.map((variant) => JSON.stringify(variant)).join('|')
    }

    const compositeType = types.find((type) => type.name === pgType && type.attributes.length > 0)
    if (compositeType) {
      if (schemas.some(({ name }) => name === compositeType.schema)) {
        return `Database[${JSON.stringify(
          compositeType.schema
        )}]['CompositeTypes'][${JSON.stringify(compositeType.name)}]`
      }
      return 'unknown'
    }

    return 'unknown'
  }
}
