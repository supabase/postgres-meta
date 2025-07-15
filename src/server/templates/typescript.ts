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
  GENERATE_TYPES_DEFAULT_SCHEMA,
  VALID_FUNCTION_ARGS_MODE,
  VALID_UNNAMED_FUNCTION_ARG_TYPES,
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
  postgrestVersion,
}: GeneratorMetadata & {
  detectOneToOneRelationships: boolean
  postgrestVersion?: string
}): Promise<string> => {
  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )
  columns
    .filter((c) => c.table_id in columnsByTableId)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((c) => columnsByTableId[c.table_id].push(c))
  // group types by id for quicker lookup
  const typesById = types.reduce(
    (acc, type) => {
      acc[type.id] = type
      return acc
    },
    {} as Record<number, (typeof types)[number]>
  )

  const getFunctionTsReturnType = (fn: PostgresFunction, returnType: string) => {
    // Determine if this function should have SetofOptions
    let setofOptionsInfo = ''

    // Only add SetofOptions for functions with table arguments (embedded functions)
    // or specific functions that need RETURNS table-name introspection fixes
    if (fn.args.length === 1 && fn.args[0].table_name) {
      // Case 1: Standard embedded function with proper setof detection
      if (fn.returns_set_of_table && fn.return_table_name) {
        setofOptionsInfo = `SetofOptions: {
          from: ${JSON.stringify(typesById[fn.args[0].type_id].format)}
          to: ${JSON.stringify(fn.return_table_name)}
          isOneToOne: ${fn.returns_multiple_rows ? false : true}
          isSetofReturn: true
        }`
      }
      // Case 2: Handle RETURNS table-name those are always a one to one relationship
      else if (fn.return_table_name && !fn.returns_set_of_table) {
        const sourceTable = typesById[fn.args[0].type_id].format
        let targetTable = fn.return_table_name
        setofOptionsInfo = `SetofOptions: {
            from: ${JSON.stringify(sourceTable)}
            to: ${JSON.stringify(targetTable)}
            isOneToOne: true
            isSetofReturn: false
          }`
      }
    }
    // Case 3: Special case for functions without table arguments but specific names
    else if (fn.return_table_name) {
      setofOptionsInfo = `SetofOptions: {
        from: "*"
        to: ${JSON.stringify(fn.return_table_name)}
        isOneToOne: ${fn.returns_multiple_rows ? false : true}
        isSetofReturn: ${fn.is_set_returning_function}
      }`
    }

    return `${returnType}${fn.is_set_returning_function && fn.returns_multiple_rows ? '[]' : ''}
                          ${setofOptionsInfo ? `${setofOptionsInfo}` : ''}`
  }

  const getFunctionReturnType = (schema: PostgresSchema, fn: PostgresFunction): string => {
    // Case 1: `returns table`.
    const tableArgs = fn.args.filter(({ mode }) => mode === 'table')
    if (tableArgs.length > 0) {
      const argsNameAndType = tableArgs
        .map(({ name, type_id }) => {
          const type = typesById[type_id]
          let tsType = 'unknown'
          if (type) {
            tsType = pgTypeToTsType(schema, type.name, { types, schemas, tables, views })
          }
          return { name, type: tsType }
        })
        .toSorted((a, b) => a.name.localeCompare(b.name))

      return `{
              ${argsNameAndType.map(({ name, type }) => `${JSON.stringify(name)}: ${type}`)}
            }`
    }

    // Case 2: returns a relation's row type.
    const relation = [...tables, ...views].find(({ id }) => id === fn.return_type_relation_id)
    if (relation) {
      return `{
              ${columnsByTableId[relation.id]
                .toSorted((a, b) => a.name.localeCompare(b.name))
                .map(
                  (column) =>
                    `${JSON.stringify(column.name)}: ${pgTypeToTsType(schema, column.format, {
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
    const type = typesById[fn.return_type_id]
    if (type) {
      return pgTypeToTsType(schema, type.name, { types, schemas, tables, views })
    }

    return 'unknown'
  }

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
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(schema, column.format, {
                            types,
                            schemas,
                            tables,
                            views,
                          })} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter((fn) => fn.argument_types === table.name)
                        .map(
                          (fn) =>
                            `${JSON.stringify(fn.name)}: ${getFunctionReturnType(schema, fn)} | null`
                        ),
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
                    ${[
                      ...columnsByTableId[view.id].map(
                        (column) =>
                          `${JSON.stringify(column.name)}: ${pgTypeToTsType(schema, column.format, {
                            types,
                            schemas,
                            tables,
                            views,
                          })} ${column.is_nullable ? '| null' : ''}`
                      ),
                      ...schemaFunctions
                        .filter((fn) => fn.argument_types === view.name)
                        .map(
                          (fn) =>
                            `${JSON.stringify(fn.name)}: ${getFunctionReturnType(schema, fn)} | null`
                        ),
                    ]}
                  }
                  ${
                    'is_updatable' in view && view.is_updatable
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
              const schemaFunctionsGroupedByName = schemaFunctions
                .filter((func) => {
                  // Get all input args (in, inout, variadic modes)
                  const inArgs = func.args
                    .toSorted((a, b) => a.name.localeCompare(b.name))
                    .filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))
                  // Case 1: Function has no parameters
                  if (inArgs.length === 0) {
                    return true
                  }

                  // Case 2: All input args are named
                  if (!inArgs.some(({ name }) => name === '')) {
                    return true
                  }

                  // Case 3: All unnamed args have default values AND are valid types
                  if (
                    inArgs.every((arg) => {
                      if (arg.name === '') {
                        return arg.has_default && VALID_UNNAMED_FUNCTION_ARG_TYPES.has(arg.type_id)
                      }
                      return true
                    })
                  ) {
                    return true
                  }

                  // Case 4: Single unnamed parameter of valid type (json, jsonb, text)
                  // Exclude all functions definitions that have only one single argument unnamed argument that isn't
                  // a json/jsonb/text as it won't be considered by PostgREST
                  if (
                    inArgs.length === 1 &&
                    inArgs[0].name === '' &&
                    (VALID_UNNAMED_FUNCTION_ARG_TYPES.has(inArgs[0].type_id) ||
                      // OR if the function have a single unnamed args which is another table (embeded function)
                      (inArgs[0].table_name && func.return_table_name) ||
                      // OR if the function takes a table row but doesn't qualify as embedded (for error reporting)
                      (inArgs[0].table_name && !func.return_table_name))
                  ) {
                    return true
                  }

                  // NOTE: Functions with named table arguments are generally excluded
                  // as they're not supported by PostgREST in the expected way

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

              return Object.entries(schemaFunctionsGroupedByName).map(([fnName, _fns]) => {
                // Check for function overload conflicts
                const fns = _fns.toSorted((a, b) => b.definition.localeCompare(a.definition))

                const functionSignatures = fns.map((fn) => {
                  const inArgs = fn.args.filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))

                  // Special error case for functions that take table row but don't qualify as embedded functions
                  const hasTableRowError = (fn: PostgresFunction) => {
                    if (
                      inArgs.length === 1 &&
                      inArgs[0].name === '' &&
                      inArgs[0].table_name &&
                      !fn.return_table_name
                    ) {
                      return true
                    }
                    return false
                  }

                  // Check for generic conflict cases that need error reporting
                  const getConflictError = (fn: PostgresFunction) => {
                    const sameFunctions = fns.filter((f) => f.name === fn.name)
                    if (sameFunctions.length <= 1) return null

                    // Generic conflict detection patterns

                    // Pattern 1: No-args vs default-args conflicts
                    if (inArgs.length === 0) {
                      const conflictingFns = sameFunctions.filter((otherFn) => {
                        if (otherFn === fn) return false
                        const otherInArgs = otherFn.args.filter(({ mode }) =>
                          VALID_FUNCTION_ARGS_MODE.has(mode)
                        )
                        return (
                          otherInArgs.length === 1 &&
                          otherInArgs[0].name === '' &&
                          otherInArgs[0].has_default
                        )
                      })

                      if (conflictingFns.length > 0) {
                        const conflictingFn = conflictingFns[0]
                        const returnTypeName =
                          types.find((t) => t.id === conflictingFn.return_type_id)?.name ||
                          'unknown'
                        return `Could not choose the best candidate function between: ${schema.name}.${fn.name}(), ${schema.name}.${fn.name}( => ${returnTypeName}). Try renaming the parameters or the function itself in the database so function overloading can be resolved`
                      }
                    }

                    // Pattern 2: Same parameter name but different types (unresolvable overloads)
                    if (inArgs.length === 1 && inArgs[0].name !== '') {
                      const conflictingFns = sameFunctions.filter((otherFn) => {
                        if (otherFn === fn) return false
                        const otherInArgs = otherFn.args.filter(({ mode }) =>
                          VALID_FUNCTION_ARGS_MODE.has(mode)
                        )
                        return (
                          otherInArgs.length === 1 &&
                          otherInArgs[0].name === inArgs[0].name &&
                          otherInArgs[0].type_id !== inArgs[0].type_id
                        )
                      })

                      if (conflictingFns.length > 0) {
                        const allConflictingFunctions = [fn, ...conflictingFns]
                        const conflictList = allConflictingFunctions
                          .sort((a, b) => {
                            const aArgs = a.args.filter(({ mode }) =>
                              VALID_FUNCTION_ARGS_MODE.has(mode)
                            )
                            const bArgs = b.args.filter(({ mode }) =>
                              VALID_FUNCTION_ARGS_MODE.has(mode)
                            )
                            return (aArgs[0]?.type_id || 0) - (bArgs[0]?.type_id || 0)
                          })
                          .map((f) => {
                            const args = f.args.filter(({ mode }) =>
                              VALID_FUNCTION_ARGS_MODE.has(mode)
                            )
                            return `${schema.name}.${fn.name}(${args.map((a) => `${a.name || ''} => ${types.find((t) => t.id === a.type_id)?.name || 'unknown'}`).join(', ')})`
                          })
                          .join(', ')

                        return `Could not choose the best candidate function between: ${conflictList}. Try renaming the parameters or the function itself in the database so function overloading can be resolved`
                      }
                    }

                    return null
                  }

                  let argsType = 'never'
                  let returnType = getFunctionReturnType(schema, fn)

                  // Check for specific error cases
                  const conflictError = getConflictError(fn)
                  if (conflictError) {
                    if (inArgs.length > 0) {
                      const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                        const type = types.find(({ id }) => id === type_id)
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
                      argsType = `{ ${argsNameAndType.toSorted((a, b) => a.name.localeCompare(b.name)).map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
                    }
                    returnType = `{ error: true } & ${JSON.stringify(conflictError)}`
                  } else if (hasTableRowError(fn)) {
                    // Special case for computed fields returning scalars functions
                    if (inArgs.length > 0) {
                      const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                        const type = types.find(({ id }) => id === type_id)
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
                      argsType = `{ ${argsNameAndType.toSorted((a, b) => a.name.localeCompare(b.name)).map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
                    }
                    returnType = `{ error: true } & ${JSON.stringify(`the function ${schema.name}.${fn.name} with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache`)}`
                  } else if (inArgs.length > 0) {
                    const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
                      const type = types.find(({ id }) => id === type_id)
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
                    argsType = `{ ${argsNameAndType.toSorted((a, b) => a.name.localeCompare(b.name)).map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
                  }

                  return `{ Args: ${argsType}; Returns: ${getFunctionTsReturnType(fn, returnType)} }`
                })

                return `${JSON.stringify(fnName)}:\n${functionSignatures.map((sig) => `| ${sig}`).join('\n')}`
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
