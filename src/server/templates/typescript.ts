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
import {
  VALID_UNNAMED_FUNCTION_ARG_TYPES,
  GENERATE_TYPES_DEFAULT_SCHEMA,
  VALID_FUNCTION_ARGS_MODE,
} from '../constants.js'

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
  // group types by id for quicker lookup
  const typesById = types.reduce(
    (acc, type) => {
      acc[type.id] = type
      return acc
    },
    {} as Record<string, (typeof types)[number]>
  )

  const getReturnType = (fn: PostgresFunction): string => {
    // Case 1: `returns table`.
    const tableArgs = fn.args.filter(({ mode }) => mode === 'table')
    if (tableArgs.length > 0) {
      const argsNameAndType = tableArgs
        .map(({ name, type_id }) => {
          const type = types.find(({ id }) => id === type_id)
          let tsType = 'unknown'
          if (type) {
            tsType = pgTypeToTsType(type.name, { types, schemas, tables, views })
          }
          return { name, type: tsType }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      return `{
        ${argsNameAndType.map(({ name, type }) => `${JSON.stringify(name)}: ${type}`)}
      }`
    }

    // Case 2: returns a relation's row type.
    const relation = [...tables, ...views].find(({ id }) => id === fn.return_type_relation_id)
    if (relation) {
      return `{
        ${columnsByTableId[relation.id]
          .map(
            (column) =>
              `${JSON.stringify(column.name)}: ${pgTypeToTsType(column.format, {
                types,
                schemas,
                tables,
                views,
              })} ${column.is_nullable ? '| null' : ''}`
          )
          .sort()
          .join(',\n')}
      }`
    }

    // Case 3: returns base/array/composite/enum type.
    const type = types.find(({ id }) => id === fn.return_type_id)
    if (type) {
      return pgTypeToTsType(type.name, { types, schemas, tables, views })
    }

    return 'unknown'
  }

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
                        .map((fn) => `${JSON.stringify(fn.name)}: ${getReturnType(fn)} | null`),
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
              const schemaFunctionsGroupedByName = schemaFunctions
                .filter((func) => {
                  // Get all input args (in, inout, variadic modes)

                  const inArgs = func.args.filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))
                  // Case 1: Function has no parameters
                  if (inArgs.length === 0) {
                    return true
                  }

                  // Case 2: All input args are named
                  if (!inArgs.some(({ name }) => name === '')) {
                    return true
                  }

                  // Case 3: All unnamed args have default values
                  if (inArgs.every((arg) => (arg.name === '' ? arg.has_default : true))) {
                    return true
                  }

                  // Case 4: Single unnamed parameter of valid type (json, jsonb, text)
                  // Exclude all functions definitions that have only one single argument unnamed argument that isn't
                  // a json/jsonb/text as it won't be considered by PostgREST
                  if (
                    inArgs.length === 1 &&
                    inArgs[0].name === '' &&
                    VALID_UNNAMED_FUNCTION_ARG_TYPES.has(inArgs[0].type_id)
                  ) {
                    return true
                  }

                  return false
                })
                .reduce(
                  (acc, curr) => {
                    acc[curr.name] ??= []
                    acc[curr.name].push(curr)
                    return acc
                  },
                  {} as Record<string, PostgresFunction[]>
                )

              return Object.entries(schemaFunctionsGroupedByName).map(([fnName, fns]) => {
                // Group functions by their argument names signature to detect conflicts
                const fnsByArgNames = new Map<string, PostgresFunction[]>()
                fns.sort((fn1, fn2) => fn1.id - fn2.id)

                fns.forEach((fn) => {
                  const namedInArgs = fn.args
                    .filter(({ mode, name }) => VALID_FUNCTION_ARGS_MODE.has(mode) && name !== '')
                    .map((arg) => arg.name)
                    .sort()
                    .join(',')

                  if (!fnsByArgNames.has(namedInArgs)) {
                    fnsByArgNames.set(namedInArgs, [])
                  }
                  fnsByArgNames.get(namedInArgs)!.push(fn)
                })

                // For each group of functions sharing the same argument names, check if they have conflicting types
                const conflictingSignatures = new Set<string>()
                fnsByArgNames.forEach((groupedFns, argNames) => {
                  if (groupedFns.length > 1) {
                    // Check if any args have different types within this group
                    const firstFn = groupedFns[0]
                    const firstFnArgTypes = new Map(
                      firstFn.args
                        .filter(
                          ({ mode, name }) => VALID_FUNCTION_ARGS_MODE.has(mode) && name !== ''
                        )
                        .map((arg) => [arg.name, String(arg.type_id)])
                    )

                    const hasConflict = groupedFns.some((fn) => {
                      const fnArgTypes = new Map(
                        fn.args
                          .filter(
                            ({ mode, name }) => VALID_FUNCTION_ARGS_MODE.has(mode) && name !== ''
                          )
                          .map((arg) => [arg.name, String(arg.type_id)])
                      )

                      return [...firstFnArgTypes.entries()].some(
                        ([name, typeId]) => fnArgTypes.get(name) !== typeId
                      )
                    })

                    if (hasConflict) {
                      conflictingSignatures.add(argNames)
                    }
                  }
                })

                // Generate all possible function signatures as a union
                const signatures = (() => {
                  const allSignatures: string[] = []

                  // First check if we have a no-param function
                  const noParamFns = fns.filter((fn) => fn.args.length === 0)
                  const unnamedFns = fns.filter((fn) => {
                    // Only include unnamed functions that:
                    // 1. Have a single unnamed parameter
                    // 2. The parameter is of a valid type (json, jsonb, text)
                    // 3. All parameters have default values
                    const inArgs = fn.args.filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))
                    return (
                      inArgs.length === 1 &&
                      inArgs[0].name === '' &&
                      (VALID_UNNAMED_FUNCTION_ARG_TYPES.has(inArgs[0].type_id) ||
                        inArgs[0].has_default)
                    )
                  })

                  // Special case: one no-param function and unnamed param function exist
                  if (noParamFns.length === 1) {
                    const noParamFn = noParamFns[0]
                    const unnamedWithDefaultsFn = unnamedFns.find((fn) =>
                      fn.args.every((arg) => arg.has_default)
                    )

                    // If we have a function with unnamed params that all have defaults, it creates a conflict
                    if (unnamedWithDefaultsFn) {
                      // Only generate the error signature in this case
                      const conflictDesc = [
                        `${fnName}()`,
                        `${fnName}( => ${typesById[unnamedWithDefaultsFn.args[0].type_id]?.name || 'unknown'})`,
                      ]
                        .sort()
                        .join(', ')

                      allSignatures.push(`{
                        Args: Record<PropertyKey, never>
                        Returns: { error: true } & "Could not choose the best candidate function between: ${conflictDesc}. Try renaming the parameters or the function itself in the database so function overloading can be resolved"
                      }`)
                    } else {
                      // No conflict - just add the no params signature
                      allSignatures.push(`{
                        Args: Record<PropertyKey, never>
                        Returns: ${getReturnType(noParamFn)}${noParamFn.is_set_returning_function && noParamFn.returns_multiple_rows ? '[]' : ''}
                      }`)
                    }
                  }
                  if (unnamedFns.length > 0) {
                    // If we don't have a no-param function, process the unnamed args
                    // Take only the first function with unnamed parameters that has a valid type
                    const validUnnamedFn = unnamedFns.find(
                      (fn) =>
                        fn.args.length === 1 &&
                        fn.args[0].name === '' &&
                        VALID_UNNAMED_FUNCTION_ARG_TYPES.has(fn.args[0].type_id)
                    )

                    if (validUnnamedFn) {
                      const firstArgType = typesById[validUnnamedFn.args[0].type_id]
                      const tsType = firstArgType
                        ? pgTypeToTsType(firstArgType.name, { types, schemas, tables, views })
                        : 'unknown'

                      allSignatures.push(`{
                        Args: { "": ${tsType} }
                        Returns: ${getReturnType(validUnnamedFn)}${validUnnamedFn.is_set_returning_function && validUnnamedFn.returns_multiple_rows ? '[]' : ''}
                      }`)
                    }
                  }

                  // For functions with named parameters, generate all signatures
                  const namedFns = fns.filter((fn) => !fn.args.some(({ name }) => name === ''))
                  namedFns.forEach((fn) => {
                    const inArgs = fn.args.filter(({ mode }) => mode === 'in')
                    const namedInArgs = inArgs
                      .filter((arg) => arg.name !== '')
                      .map((arg) => arg.name)
                      .sort()
                      .join(',')

                    // If this argument combination would cause a conflict, return an error type signature
                    if (conflictingSignatures.has(namedInArgs)) {
                      const conflictingFns = fnsByArgNames.get(namedInArgs)!
                      const conflictDesc = conflictingFns
                        .map((cfn) => {
                          const argsStr = cfn.args
                            .filter(({ mode }) => mode === 'in')
                            .map((arg) => {
                              const type = typesById[arg.type_id]
                              return `${arg.name} => ${type?.name || 'unknown'}`
                            })
                            .sort()
                            .join(', ')
                          return `${fnName}(${argsStr})`
                        })
                        .sort()
                        .join(', ')

                      allSignatures.push(`{
                        Args: { ${inArgs
                          .map((arg) => `${JSON.stringify(arg.name)}: unknown`)
                          .sort()
                          .join(', ')} }
                        Returns: { error: true } & "Could not choose the best candidate function between: ${conflictDesc}. Try renaming the parameters or the function itself in the database so function overloading can be resolved"
                      }`)
                    } else if (inArgs.length > 0) {
                      // Generate normal function signature
                      const returnType = getReturnType(fn)
                      allSignatures.push(`{
                        Args: ${`{ ${inArgs
                          .map(({ name, type_id, has_default }) => {
                            const type = typesById[type_id]
                            let tsType = 'unknown'
                            if (type) {
                              tsType = pgTypeToTsType(type.name, {
                                types,
                                schemas,
                                tables,
                                views,
                              })
                            }
                            return `${JSON.stringify(name)}${has_default ? '?' : ''}: ${tsType}`
                          })
                          .sort()
                          .join(', ')} }`}
                        Returns: ${returnType}${fn.is_set_returning_function && fn.returns_multiple_rows ? '[]' : ''}
                        ${
                          fn.returns_set_of_table
                            ? `SetofOptions: {
                            from: ${
                              fn.args.length > 0 && fn.args[0].table_name
                                ? JSON.stringify(typesById[fn.args[0].type_id].format)
                                : '"*"'
                            }
                            to: ${JSON.stringify(fn.return_table_name)}
                            isOneToOne: ${fn.returns_multiple_rows ? false : true}
                          }`
                            : ''
                        }
                      }`)
                    }
                  })

                  // Remove duplicates and sort
                  return Array.from(new Set(allSignatures)).sort()
                })()

                // Remove duplicates, sort, and join with |
                return `${JSON.stringify(fnName)}: ${signatures.join('\n    | ')}`
              })
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
