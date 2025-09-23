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
import { GENERATE_TYPES_DEFAULT_SCHEMA, VALID_FUNCTION_ARGS_MODE } from '../constants.js'

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
  postgrestVersion,
}: GeneratorMetadata & {
  detectOneToOneRelationships: boolean
  postgrestVersion?: string
}): Promise<string> => {
  schemas.sort((a, b) => a.name.localeCompare(b.name))

  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )
  for (const column of columns) {
    if (column.table_id in columnsByTableId) {
      columnsByTableId[column.table_id].push(column)
    }
  }
  for (const tableId in columnsByTableId) {
    columnsByTableId[tableId].sort((a, b) => a.name.localeCompare(b.name))
  }

  const introspectionBySchema = Object.fromEntries<{
    tables: Pick<PostgresTable, 'id' | 'name' | 'schema' | 'columns'>[]
    views: PostgresView[]
    functions: { fn: PostgresFunction; inArgs: PostgresFunction['args'] }[]
    enums: PostgresType[]
    compositeTypes: PostgresType[]
  }>(
    schemas.map((s) => [
      s.name,
      { tables: [], views: [], functions: [], enums: [], compositeTypes: [] },
    ])
  )
  for (const table of tables) {
    if (table.schema in introspectionBySchema) {
      introspectionBySchema[table.schema].tables.push(table)
    }
  }
  for (const table of foreignTables) {
    if (table.schema in introspectionBySchema) {
      introspectionBySchema[table.schema].tables.push(table)
    }
  }
  for (const view of views) {
    if (view.schema in introspectionBySchema) {
      introspectionBySchema[view.schema].views.push(view)
    }
  }
  for (const materializedView of materializedViews) {
    if (materializedView.schema in introspectionBySchema) {
      introspectionBySchema[materializedView.schema].views.push({
        ...materializedView,
        is_updatable: false,
      })
    }
  }
  for (const func of functions) {
    if (func.schema in introspectionBySchema) {
      func.args.sort((a, b) => a.name.localeCompare(b.name))
      // Either:
      // 1. All input args are be named, or
      // 2. There is only one input arg which is unnamed
      const inArgs = func.args.filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))

      if (
        // Case 1: Function has a single parameter
        inArgs.length === 1 ||
        // Case 2: All input args are named
        !inArgs.some(({ name }) => name === '')
      ) {
        introspectionBySchema[func.schema].functions.push({ fn: func, inArgs })
      }
    }
  }
  for (const type of types) {
    if (type.schema in introspectionBySchema) {
      if (type.enums.length > 0) {
        introspectionBySchema[type.schema].enums.push(type)
      }
      if (type.attributes.length > 0) {
        introspectionBySchema[type.schema].compositeTypes.push(type)
      }
    }
  }
  for (const schema in introspectionBySchema) {
    introspectionBySchema[schema].tables.sort((a, b) => a.name.localeCompare(b.name))
    introspectionBySchema[schema].views.sort((a, b) => a.name.localeCompare(b.name))
    introspectionBySchema[schema].functions.sort((a, b) => a.fn.name.localeCompare(b.fn.name))
    introspectionBySchema[schema].enums.sort((a, b) => a.name.localeCompare(b.name))
    introspectionBySchema[schema].compositeTypes.sort((a, b) => a.name.localeCompare(b.name))
  }

  // group types by id for quicker lookup
  const typesById = types.reduce(
    (acc, type) => {
      acc[type.id] = type
      return acc
    },
    {} as Record<number, (typeof types)[number]>
  )

  const internal_supabase_schema = postgrestVersion
    ? `// Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '${postgrestVersion}'
  }`
    : ''

  let output = `
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  ${internal_supabase_schema}
  ${schemas.map((schema) => {
    const {
      tables: schemaTables,
      views: schemaViews,
      functions: schemaFunctions,
      enums: schemaEnums,
      compositeTypes: schemaCompositeTypes,
    } = introspectionBySchema[schema.name]
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
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(schema, column.format, {
                            types,
                            schemas,
                            tables,
                            views,
                          })} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter(({ fn }) => fn.argument_types === table.name)
                        .map(({ fn }) => {
                          const type = typesById[fn.return_type_id]
                          let tsType = 'unknown'
                          if (type) {
                            tsType = pgTypeToTsType(schema, type.name, {
                              types,
                              schemas,
                              tables,
                              views,
                            })
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

                      output += pgTypeToTsType(schema, column.format, {
                        types,
                        schemas,
                        tables,
                        views,
                      })

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

                      output += `?: ${pgTypeToTsType(schema, column.format, {
                        types,
                        schemas,
                        tables,
                        views,
                      })}`

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
                        `${JSON.stringify(column.name)}: ${pgTypeToTsType(schema, column.format, {
                          types,
                          schemas,
                          tables,
                          views,
                        })} ${column.is_nullable ? '| null' : ''}`
                    )}
                  }
                  ${
                    view.is_updatable
                      ? `Insert: {
                           ${columnsByTableId[view.id].map((column) => {
                             let output = JSON.stringify(column.name)

                             if (!column.is_updatable) {
                               return `${output}?: never`
                             }

                             output += `?: ${pgTypeToTsType(schema, column.format, {
                               types,
                               schemas,
                               tables,
                               views,
                             })} | null`

                             return output
                           })}
                         }
                         Update: {
                           ${columnsByTableId[view.id].map((column) => {
                             let output = JSON.stringify(column.name)

                             if (!column.is_updatable) {
                               return `${output}?: never`
                             }

                             output += `?: ${pgTypeToTsType(schema, column.format, {
                               types,
                               schemas,
                               tables,
                               views,
                             })} | null`

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
                  acc[curr.fn.name] ??= []
                  acc[curr.fn.name].push(curr)
                  return acc
                },
                {} as Record<string, typeof schemaFunctions>
              )
              for (const fnName in schemaFunctionsGroupedByName) {
                schemaFunctionsGroupedByName[fnName].sort((a, b) =>
                  b.fn.definition.localeCompare(a.fn.definition)
                )
              }

              return Object.entries(schemaFunctionsGroupedByName).map(
                ([fnName, fns]) =>
                  `${JSON.stringify(fnName)}: {
                      Args: ${fns
                        .map(({ inArgs }) => {
                          if (inArgs.length === 0) {
                            return 'Record<PropertyKey, never>'
                          }

                          const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                            const type = typesById[type_id]
                            let tsType = 'unknown'
                            if (type) {
                              tsType = pgTypeToTsType(schema, type.name, {
                                types,
                                schemas,
                                tables,
                                views,
                              })
                            }
                            return { name, type: tsType, has_default }
                          })
                          return `{ ${argsNameAndType.map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
                        })
                        .toSorted()
                        // A function can have multiples definitions with differents args, but will always return the same type
                        .join(' | ')}
                      Returns: ${(() => {
                        // Case 1: `returns table`.
                        const tableArgs = fns[0].fn.args.filter(({ mode }) => mode === 'table')
                        if (tableArgs.length > 0) {
                          const argsNameAndType = tableArgs.map(({ name, type_id }) => {
                            const type = typesById[type_id]
                            let tsType = 'unknown'
                            if (type) {
                              tsType = pgTypeToTsType(schema, type.name, {
                                types,
                                schemas,
                                tables,
                                views,
                              })
                            }
                            return { name, type: tsType }
                          })

                          return `{
                            ${argsNameAndType
                              .toSorted((a, b) => a.name.localeCompare(b.name))
                              .map(({ name, type }) => `${JSON.stringify(name)}: ${type}`)}
                          }`
                        }

                        // Case 2: returns a relation's row type.
                        const relation = [...tables, ...views].find(
                          ({ id }) => id === fns[0].fn.return_type_relation_id
                        )
                        if (relation) {
                          return `{
                            ${columnsByTableId[relation.id]
                              .toSorted((a, b) => a.name.localeCompare(b.name))
                              .map(
                                (column) =>
                                  `${JSON.stringify(column.name)}: ${pgTypeToTsType(
                                    schema,
                                    column.format,
                                    {
                                      types,
                                      schemas,
                                      tables,
                                      views,
                                    }
                                  )} ${column.is_nullable ? '| null' : ''}`
                              )}
                          }`
                        }

                        // Case 3: returns base/array/composite/enum type.
                        const type = typesById[fns[0].fn.return_type_id]
                        if (type) {
                          return pgTypeToTsType(schema, type.name, {
                            types,
                            schemas,
                            tables,
                            views,
                          })
                        }

                        return 'unknown'
                      })()}${fns[0].fn.is_set_returning_function ? '[]' : ''}
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
                          const type = typesById[type_id]
                          let tsType = 'unknown'
                          if (type) {
                            tsType = `${pgTypeToTsType(schema, type.name, {
                              types,
                              schemas,
                              tables,
                              views,
                            })} | null`
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, ${JSON.stringify(GENERATE_TYPES_DEFAULT_SCHEMA)}>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
  schema: PostgresSchema,
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
    return `(${pgTypeToTsType(schema, pgType.substring(1), {
      types,
      schemas,
      tables,
      views,
    })})[]`
  } else {
    const enumTypes = types.filter((type) => type.name === pgType && type.enums.length > 0)
    if (enumTypes.length > 0) {
      const enumType = enumTypes.find((type) => type.schema === schema.name) || enumTypes[0]
      if (schemas.some(({ name }) => name === enumType.schema)) {
        return `Database[${JSON.stringify(enumType.schema)}]['Enums'][${JSON.stringify(
          enumType.name
        )}]`
      }
      return enumType.enums.map((variant) => JSON.stringify(variant)).join('|')
    }

    const compositeTypes = types.filter(
      (type) => type.name === pgType && type.attributes.length > 0
    )
    if (compositeTypes.length > 0) {
      const compositeType =
        compositeTypes.find((type) => type.schema === schema.name) || compositeTypes[0]
      if (schemas.some(({ name }) => name === compositeType.schema)) {
        return `Database[${JSON.stringify(
          compositeType.schema
        )}]['CompositeTypes'][${JSON.stringify(compositeType.name)}]`
      }
      return 'unknown'
    }

    const tableRowTypes = tables.filter((table) => table.name === pgType)
    if (tableRowTypes.length > 0) {
      const tableRowType =
        tableRowTypes.find((type) => type.schema === schema.name) || tableRowTypes[0]
      if (schemas.some(({ name }) => name === tableRowType.schema)) {
        return `Database[${JSON.stringify(tableRowType.schema)}]['Tables'][${JSON.stringify(
          tableRowType.name
        )}]['Row']`
      }
      return 'unknown'
    }

    const viewRowTypes = views.filter((view) => view.name === pgType)
    if (viewRowTypes.length > 0) {
      const viewRowType =
        viewRowTypes.find((type) => type.schema === schema.name) || viewRowTypes[0]
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
