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
                      const type = types.find(({ id }) => id === type_id)
                      let tsType = 'unknown'
                      if (type) {
                        tsType = pgTypeToTsType(type.name, { types, schemas, tables, views })
                      }
                      return { name, type: tsType, has_default }
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
                      ({ id }) => id === return_type_relation_id
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
                    const type = types.find(({ id }) => id === return_type_id)
                    if (type) {
                      return pgTypeToTsType(type.name, { types, schemas, tables, views })
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
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
