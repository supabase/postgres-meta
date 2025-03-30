import prettier from 'prettier'
import type {
  PostgresColumn,
  PostgresFunction,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'
import { GENERATE_TYPES_DEFAULT_SCHEMA } from '../constants.js'

export const apply = async ({
  schemas,
  tables,
  foreignTables,
  views,
  materializedViews,
  columns,
  relationships,
  functions,
  types,
  detectOneToOneRelationships,
}: GeneratorMetadata & {
  detectOneToOneRelationships: boolean
}): Promise<string> => {
  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )
  columns
    .filter((c) => c.table_id in columnsByTableId)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((c) => columnsByTableId[c.table_id].push(c))

  let output = `
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  ${schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .map((schema) => {
      const schemaTables = [...tables, ...foreignTables]
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
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(column.format, {
                            types,
                            schemas,
                            tables,
                            views,
                          })} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter((fn) => fn.argument_types === table.name)
                        .map((fn) => {
                          const type = types.find(({ id }) => id === fn.return_type_id)
                          let tsType = 'unknown'
                          if (type) {
                            tsType = pgTypeToTsType(type.name, { types, schemas, tables, views })
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

                      output += pgTypeToTsType(column.format, { types, schemas, tables, views })

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

                      output += `?: ${pgTypeToTsType(column.format, { types, schemas, tables, views })}`

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
                          relationship.referenced_schema === table.schema &&
                          relationship.relation === table.name
                      )
                      .sort(
                        (a, b) =>
                          a.foreign_key_name.localeCompare(b.foreign_key_name) ||
                          a.referenced_relation.localeCompare(b.referenced_relation) ||
                          JSON.stringify(a.referenced_columns).localeCompare(
                            JSON.stringify(b.referenced_columns)
                          )
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
                        `${JSON.stringify(column.name)}: ${pgTypeToTsType(column.format, {
                          types,
                          schemas,
                          tables,
                          views,
                        })} ${column.is_nullable ? '| null' : ''}`
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

                             output += `?: ${pgTypeToTsType(column.format, { types, schemas, tables, views })} | null`

                             return output
                           })}
                         }
                         Update: {
                           ${columnsByTableId[view.id].map((column) => {
                             let output = JSON.stringify(column.name)

                             if (!column.is_updatable) {
                               return `${output}?: never`
                             }

                             output += `?: ${pgTypeToTsType(column.format, { types, schemas, tables, views })} | null`

                             return output
                           })}
                         }
                        `
                      : ''
                  }Relationships: [
                    ${relationships
                      .filter(
                        (relationship) =>
                          relationship.schema === view.schema &&
                          relationship.referenced_schema === view.schema &&
                          relationship.relation === view.name
                      )
                      .sort(
                        (a, b) =>
                          a.foreign_key_name.localeCompare(b.foreign_key_name) ||
                          a.referenced_relation.localeCompare(b.referenced_relation) ||
                          JSON.stringify(a.referenced_columns).localeCompare(
                            JSON.stringify(b.referenced_columns)
                          )
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

              const schemaFunctionsGroupedByName = schemaFunctions.reduce(
                (acc, curr) => {
                  acc[curr.name] ??= []
                  acc[curr.name].push(curr)
                  return acc
                },
                {} as Record<string, PostgresFunction[]>
              )

              return Object.entries(schemaFunctionsGroupedByName).map(
                ([fnName, fns]) =>
                  `${JSON.stringify(fnName)}: {
                      Args: ${fns
                        .map(({ args }) => {
                          const inArgs = args.filter(({ mode }) => mode === 'in')

                          if (inArgs.length === 0) {
                            return 'Record<PropertyKey, never>'
                          }

                          const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                            const type = types.find(({ id }) => id === type_id)
                            let tsType = 'unknown'
                            if (type) {
                              tsType = pgTypeToTsType(type.name, { types, schemas, tables, views })
                            }
                            return { name, type: tsType, has_default }
                          })
                          return `{ ${argsNameAndType.map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
                        })
                        // A function can have multiples definitions with differents args, but will always return the same type
                        .join(' | ')}
                      Returns: ${(() => {
                        // Case 1: `returns table`.
                        const tableArgs = fns[0].args.filter(({ mode }) => mode === 'table')
                        if (tableArgs.length > 0) {
                          const argsNameAndType = tableArgs.map(({ name, type_id }) => {
                            const type = types.find(({ id }) => id === type_id)
                            let tsType = 'unknown'
                            if (type) {
                              tsType = pgTypeToTsType(type.name, { types, schemas, tables, views })
                            }
                            return { name, type: tsType }
                          })

                          return `{
                            ${argsNameAndType.map(
                              ({ name, type }) => `${JSON.stringify(name)}: ${type}`
                            )}
                          }`
                        }

                        // Case 2: returns a relation's row type.
                        const relation = [...tables, ...views].find(
                          ({ id }) => id === fns[0].return_type_relation_id
                        )
                        if (relation) {
                          return `{
                            ${columnsByTableId[relation.id].map(
                              (column) =>
                                `${JSON.stringify(column.name)}: ${pgTypeToTsType(column.format, {
                                  types,
                                  schemas,
                                  tables,
                                  views,
                                })} ${column.is_nullable ? '| null' : ''}`
                            )}
                          }`
                        }

                        // Case 3: returns base/array/composite/enum type.
                        const type = types.find(({ id }) => id === fns[0].return_type_id)
                        if (type) {
                          return pgTypeToTsType(type.name, { types, schemas, tables, views })
                        }

                        return 'unknown'
                      })()}${fns[0].is_set_returning_function && fns[0].returns_multiple_rows ? '[]' : ''}
                      ${
                        // if the function return a set of a table and some definition take in parameter another table
                        fns[0].returns_set_of_table &&
                        fns.some((fnd) => fnd.args.length === 1 && fnd.args[0].table_name)
                          ? `SetofOptions: {
                        from: ${fns
                          // if the function take a row as first parameter
                          .filter((fnd) => fnd.args.length === 1 && fnd.args[0].table_name)
                          .map((fnd) => {
                            const arg_type = types.find((t) => t.id === fnd.args[0].type_id)
                            return JSON.stringify(arg_type?.format)
                          })
                          .join(' | ')}
                        to: ${JSON.stringify(fns[0].return_table_name)}
                        isOneToOne: ${fns[0].returns_multiple_rows ? false : true}
                      }
                      `
                          : ''
                      }
                    }`
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
                          let tsType = 'unknown'
                          if (type) {
                            tsType = `${pgTypeToTsType(type.name, { types, schemas, tables, views })} | null`
                          }
                          return `${JSON.stringify(name)}: ${tsType}`
                        })}
                      }`
                  )
            }
          }
        }`
    })}
}

type DefaultSchema = Database[Extract<keyof Database, ${JSON.stringify(GENERATE_TYPES_DEFAULT_SCHEMA)}>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  ${schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .map((schema) => {
      const schemaEnums = types
        .filter((type) => type.schema === schema.name && type.enums.length > 0)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      return `${JSON.stringify(schema.name)}: {
          Enums: {
            ${schemaEnums.map(
              (enum_) =>
                `${JSON.stringify(enum_.name)}: [${enum_.enums
                  .map((variant) => JSON.stringify(variant))
                  .join(', ')}]`
            )}
          }
        }`
    })}
} as const
`

  output = await prettier.format(output, {
    parser: 'typescript',
    semi: false,
  })
  return output
}

// TODO: Make this more robust. Currently doesn't handle range types - returns them as unknown.
const pgTypeToTsType = (
  pgType: string,
  {
    types,
    schemas,
    tables,
    views,
  }: {
    types: PostgresType[]
    schemas: PostgresSchema[]
    tables: PostgresTable[]
    views: PostgresView[]
  }
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
    return `(${pgTypeToTsType(pgType.substring(1), { types, schemas, tables, views })})[]`
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

    const tableRowType = tables.find((table) => table.name === pgType)
    if (tableRowType) {
      if (schemas.some(({ name }) => name === tableRowType.schema)) {
        return `Database[${JSON.stringify(tableRowType.schema)}]['Tables'][${JSON.stringify(
          tableRowType.name
        )}]['Row']`
      }
      return 'unknown'
    }

    const viewRowType = views.find((view) => view.name === pgType)
    if (viewRowType) {
      if (schemas.some(({ name }) => name === viewRowType.schema)) {
        return `Database[${JSON.stringify(viewRowType.schema)}]['Views'][${JSON.stringify(
          viewRowType.name
        )}]['Row']`
      }
      return 'unknown'
    }

    return 'unknown'
  }
}
