import prettier from 'prettier'
import type { GeneratorMetadata } from '../../lib/generators.js'
import type {
  PostgresColumn,
  PostgresFunction,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import {
  GENERATE_TYPES_DEFAULT_SCHEMA,
  VALID_FUNCTION_ARGS_MODE,
  VALID_UNNAMED_FUNCTION_ARG_TYPES,
} from '../constants.js'

type TsRelationship = Pick<
  GeneratorMetadata['relationships'][number],
  'foreign_key_name' | 'columns' | 'is_one_to_one' | 'referenced_relation' | 'referenced_columns'
>

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
  relationships.sort(
    (a, b) =>
      a.foreign_key_name.localeCompare(b.foreign_key_name) ||
      a.referenced_relation.localeCompare(b.referenced_relation) ||
      JSON.stringify(a.referenced_columns).localeCompare(JSON.stringify(b.referenced_columns))
  )
  const introspectionBySchema = Object.fromEntries<{
    tables: {
      table: Pick<PostgresTable, 'id' | 'name' | 'schema' | 'columns'>
      relationships: TsRelationship[]
    }[]
    views: {
      view: PostgresView
      relationships: TsRelationship[]
    }[]
    functions: { fn: PostgresFunction; inArgs: PostgresFunction['args'] }[]
    enums: PostgresType[]
    compositeTypes: PostgresType[]
  }>(
    schemas.map((s) => [
      s.name,
      { tables: [], views: [], functions: [], enums: [], compositeTypes: [] },
    ])
  )
  const columnsByTableId: Record<number, PostgresColumn[]> = {}
  const tablesNamesByTableId: Record<number, string> = {}
  const relationTypeByIds = new Map<number, (typeof types)[number]>()
  // group types by id for quicker lookup
  const typesById = new Map<number, (typeof types)[number]>()
  const tablesLike = [...tables, ...foreignTables, ...views, ...materializedViews]

  for (const tableLike of tablesLike) {
    columnsByTableId[tableLike.id] = []
    tablesNamesByTableId[tableLike.id] = tableLike.name
  }
  for (const column of columns) {
    if (column.table_id in columnsByTableId) {
      columnsByTableId[column.table_id].push(column)
    }
  }
  for (const tableId in columnsByTableId) {
    columnsByTableId[tableId].sort((a, b) => a.name.localeCompare(b.name))
  }

  for (const type of types) {
    typesById.set(type.id, type)
    // Save all the types that are relation types for quicker lookup
    if (type.type_relation_id) {
      relationTypeByIds.set(type.id, type)
    }
    if (type.schema in introspectionBySchema) {
      if (type.enums.length > 0) {
        introspectionBySchema[type.schema].enums.push(type)
      }
      if (type.attributes.length > 0) {
        introspectionBySchema[type.schema].compositeTypes.push(type)
      }
    }
  }

  function getRelationships(
    object: { schema: string; name: string },
    relationships: GeneratorMetadata['relationships']
  ): Pick<
    GeneratorMetadata['relationships'][number],
    'foreign_key_name' | 'columns' | 'is_one_to_one' | 'referenced_relation' | 'referenced_columns'
  >[] {
    return relationships.filter(
      (relationship) =>
        relationship.schema === object.schema &&
        relationship.referenced_schema === object.schema &&
        relationship.relation === object.name
    )
  }

  function generateRelationshiptTsDefinition(relationship: TsRelationship): string {
    return `{
      foreignKeyName: ${JSON.stringify(relationship.foreign_key_name)}
      columns: ${JSON.stringify(relationship.columns)}${detectOneToOneRelationships ? `\nisOneToOne: ${relationship.is_one_to_one}` : ''}
      referencedRelation: ${JSON.stringify(relationship.referenced_relation)}
      referencedColumns: ${JSON.stringify(relationship.referenced_columns)}
    }`
  }

  for (const table of tables) {
    if (table.schema in introspectionBySchema) {
      introspectionBySchema[table.schema].tables.push({
        table,
        relationships: getRelationships(table, relationships),
      })
    }
  }
  for (const table of foreignTables) {
    if (table.schema in introspectionBySchema) {
      introspectionBySchema[table.schema].tables.push({
        table,
        relationships: getRelationships(table, relationships),
      })
    }
  }
  for (const view of views) {
    if (view.schema in introspectionBySchema) {
      introspectionBySchema[view.schema].views.push({
        view,
        relationships: getRelationships(view, relationships),
      })
    }
  }
  for (const materializedView of materializedViews) {
    if (materializedView.schema in introspectionBySchema) {
      introspectionBySchema[materializedView.schema].views.push({
        view: {
          ...materializedView,
          is_updatable: false,
        },
        relationships: getRelationships(materializedView, relationships),
      })
    }
  }
  // Helper function to get table/view name from relation id
  const getTableNameFromRelationId = (
    relationId: number | null,
    returnTypeId: number | null
  ): string | null => {
    if (!relationId) return null

    if (tablesNamesByTableId[relationId]) return tablesNamesByTableId[relationId]
    // if it's a composite type we use the type name as relation name to allow sub-selecting fields of the composite type
    const reltype = returnTypeId ? relationTypeByIds.get(returnTypeId) : null
    return reltype ? reltype.name : null
  }

  for (const func of functions) {
    if (func.schema in introspectionBySchema) {
      func.args.sort((a, b) => a.name.localeCompare(b.name))
      // Get all input args (in, inout, variadic modes)
      const inArgs = func.args.filter(({ mode }) => VALID_FUNCTION_ARGS_MODE.has(mode))

      if (
        // Case 1: Function has no parameters
        inArgs.length === 0 ||
        // Case 2: All input args are named
        !inArgs.some(({ name }) => name === '') ||
        // Case 3: All unnamed args have default values AND are valid types
        inArgs.every((arg) => {
          if (arg.name === '') {
            return arg.has_default && VALID_UNNAMED_FUNCTION_ARG_TYPES.has(arg.type_id)
          }
          return true
        }) ||
        // Case 4: Single unnamed parameter of valid type (json, jsonb, text)
        // Exclude all functions definitions that have only one single argument unnamed argument that isn't
        // a json/jsonb/text as it won't be considered by PostgREST
        (inArgs.length === 1 &&
          inArgs[0].name === '' &&
          (VALID_UNNAMED_FUNCTION_ARG_TYPES.has(inArgs[0].type_id) ||
            // OR if the function have a single unnamed args which is another table (embeded function)
            (relationTypeByIds.get(inArgs[0].type_id) &&
              getTableNameFromRelationId(func.return_type_relation_id, func.return_type_id)) ||
            // OR if the function takes a table row but doesn't qualify as embedded (for error reporting)
            (relationTypeByIds.get(inArgs[0].type_id) &&
              !getTableNameFromRelationId(func.return_type_relation_id, func.return_type_id))))
      ) {
        introspectionBySchema[func.schema].functions.push({ fn: func, inArgs })
      }
    }
  }
  for (const schema in introspectionBySchema) {
    introspectionBySchema[schema].tables.sort((a, b) => a.table.name.localeCompare(b.table.name))
    introspectionBySchema[schema].views.sort((a, b) => a.view.name.localeCompare(b.view.name))
    introspectionBySchema[schema].functions.sort((a, b) => a.fn.name.localeCompare(b.fn.name))
    introspectionBySchema[schema].enums.sort((a, b) => a.name.localeCompare(b.name))
    introspectionBySchema[schema].compositeTypes.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getFunctionTsReturnType = (fn: PostgresFunction, returnType: string) => {
    // Determine if this function should have SetofOptions
    let setofOptionsInfo = ''

    const returnTableName = getTableNameFromRelationId(
      fn.return_type_relation_id,
      fn.return_type_id
    )
    const returnsSetOfTable = fn.is_set_returning_function && fn.return_type_relation_id !== null
    const returnsMultipleRows = fn.prorows !== null && fn.prorows > 1
    // Case 1: if the function returns a table, we need to add SetofOptions to allow selecting sub fields of the table
    // Those can be used in rpc to select sub fields of a table
    if (returnTableName) {
      setofOptionsInfo = `SetofOptions: {
        from: "*"
        to: ${JSON.stringify(returnTableName)}
        isOneToOne: ${Boolean(!returnsMultipleRows)}
        isSetofReturn: ${fn.is_set_returning_function}
      }`
    }
    // Case 2: if the function has a single table argument, we need to add SetofOptions to allow selecting sub fields of the table
    // and set the right "from" and "to" values to allow selecting from a table row
    if (fn.args.length === 1) {
      const relationType = relationTypeByIds.get(fn.args[0].type_id)

      // Only add SetofOptions for functions with table arguments (embedded functions)
      // or specific functions that RETURNS table-name
      if (relationType) {
        const sourceTable = relationType.format
        // Case 1: Standard embedded function with proper setof detection
        if (returnsSetOfTable && returnTableName) {
          setofOptionsInfo = `SetofOptions: {
          from: ${JSON.stringify(sourceTable)}
          to: ${JSON.stringify(returnTableName)}
          isOneToOne: ${Boolean(!returnsMultipleRows)}
          isSetofReturn: true
        }`
        }
        // Case 2: Handle RETURNS table-name those are always a one to one relationship
        else if (returnTableName && !returnsSetOfTable) {
          const targetTable = returnTableName
          setofOptionsInfo = `SetofOptions: {
            from: ${JSON.stringify(sourceTable)}
            to: ${JSON.stringify(targetTable)}
            isOneToOne: true
            isSetofReturn: false
          }`
        }
      }
    }

    return `${returnType}${fn.is_set_returning_function && returnsMultipleRows ? '[]' : ''}
                          ${setofOptionsInfo ? `${setofOptionsInfo}` : ''}`
  }

  const getFunctionReturnType = (schema: PostgresSchema, fn: PostgresFunction): string => {
    // Case 1: `returns table`.
    const tableArgs = fn.args.filter(({ mode }) => mode === 'table')
    if (tableArgs.length > 0) {
      const argsNameAndType = tableArgs.map(({ name, type_id }) => {
        const type = typesById.get(type_id)
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
              ${argsNameAndType.map(({ name, type }) => `${JSON.stringify(name)}: ${type}`)}
            }`
    }

    // Case 2: returns a relation's row type.
    const relation =
      introspectionBySchema[schema.name]?.tables.find(
        ({ table: { id } }) => id === fn.return_type_relation_id
      )?.table ||
      introspectionBySchema[schema.name]?.views.find(
        ({ view: { id } }) => id === fn.return_type_relation_id
      )?.view
    if (relation) {
      return `{
              ${columnsByTableId[relation.id]
                .map((column) =>
                  generateColumnTsDefinition(
                    schema,
                    {
                      name: column.name,
                      format: column.format,
                      is_nullable: column.is_nullable,
                      is_optional: false,
                    },
                    {
                      types,
                      schemas,
                      tables,
                      views,
                    }
                  )
                )
                .join(',\n')}
            }`
    }

    // Case 3: returns base/array/composite/enum type.
    const type = typesById.get(fn.return_type_id)
    if (type) {
      return pgTypeToTsType(schema, type.name, {
        types,
        schemas,
        tables,
        views,
      })
    }

    return 'unknown'
  }
  // Special error case for functions that take table row but don't qualify as embedded functions
  const hasTableRowError = (fn: PostgresFunction, inArgs: PostgresFunction['args']) => {
    if (
      inArgs.length === 1 &&
      inArgs[0].name === '' &&
      relationTypeByIds.get(inArgs[0].type_id) &&
      !getTableNameFromRelationId(fn.return_type_relation_id, fn.return_type_id)
    ) {
      return true
    }
    return false
  }

  // Check for generic conflict cases that need error reporting
  const getConflictError = (
    schema: PostgresSchema,
    fns: Array<{ fn: PostgresFunction; inArgs: PostgresFunction['args'] }>,
    fn: PostgresFunction,
    inArgs: PostgresFunction['args']
  ) => {
    // If there is a single function definition, there is no conflict
    if (fns.length <= 1) return null

    // Generic conflict detection patterns
    // Pattern 1: No-args vs default-args conflicts
    if (inArgs.length === 0) {
      const conflictingFns = fns.filter(({ fn: otherFn, inArgs: otherInArgs }) => {
        if (otherFn === fn) return false
        return otherInArgs.length === 1 && otherInArgs[0].name === '' && otherInArgs[0].has_default
      })

      if (conflictingFns.length > 0) {
        const conflictingFn = conflictingFns[0]
        const returnTypeName = typesById.get(conflictingFn.fn.return_type_id)?.name || 'unknown'
        return `Could not choose the best candidate function between: ${schema.name}.${fn.name}(), ${schema.name}.${fn.name}( => ${returnTypeName}). Try renaming the parameters or the function itself in the database so function overloading can be resolved`
      }
    }

    // Pattern 2: Same parameter name but different types (unresolvable overloads)
    if (inArgs.length === 1 && inArgs[0].name !== '') {
      const conflictingFns = fns.filter(({ fn: otherFn, inArgs: otherInArgs }) => {
        if (otherFn === fn) return false
        return (
          otherInArgs.length === 1 &&
          otherInArgs[0].name === inArgs[0].name &&
          otherInArgs[0].type_id !== inArgs[0].type_id
        )
      })

      if (conflictingFns.length > 0) {
        const allConflictingFunctions = [{ fn, inArgs }, ...conflictingFns]
        const conflictList = allConflictingFunctions
          .sort((a, b) => {
            const aArgs = a.inArgs
            const bArgs = b.inArgs
            return (aArgs[0]?.type_id || 0) - (bArgs[0]?.type_id || 0)
          })
          .map((f) => {
            const args = f.inArgs
            return `${schema.name}.${fn.name}(${args.map((a) => `${a.name || ''} => ${typesById.get(a.type_id)?.name || 'unknown'}`).join(', ')})`
          })
          .join(', ')

        return `Could not choose the best candidate function between: ${conflictList}. Try renaming the parameters or the function itself in the database so function overloading can be resolved`
      }
    }

    return null
  }

  const getFunctionSignatures = (
    schema: PostgresSchema,
    fns: Array<{ fn: PostgresFunction; inArgs: PostgresFunction['args'] }>
  ) => {
    return fns
      .map(({ fn, inArgs }) => {
        let argsType = 'never'
        let returnType = getFunctionReturnType(schema, fn)

        // Check for specific error cases
        const conflictError = getConflictError(schema, fns, fn, inArgs)
        if (conflictError) {
          if (inArgs.length > 0) {
            const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
              const type = typesById.get(type_id)
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
            argsType = `{ ${argsNameAndType.map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
          }
          returnType = `{ error: true } & ${JSON.stringify(conflictError)}`
        } else if (hasTableRowError(fn, inArgs)) {
          // Special case for computed fields returning scalars functions
          if (inArgs.length > 0) {
            const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
              const type = typesById.get(type_id)
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
            argsType = `{ ${argsNameAndType.map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
          }
          returnType = `{ error: true } & ${JSON.stringify(`the function ${schema.name}.${fn.name} with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache`)}`
        } else if (inArgs.length > 0) {
          const argsNameAndType = inArgs.map(({ name, type_id, has_default }) => {
            const type = typesById.get(type_id)
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
          argsType = `{ ${argsNameAndType.map(({ name, type, has_default }) => `${JSON.stringify(name)}${has_default ? '?' : ''}: ${type}`)} }`
        }

        return `{ Args: ${argsType}; Returns: ${getFunctionTsReturnType(fn, returnType)} }`
      })
      .join(' |\n')
  }

  const internal_supabase_schema = postgrestVersion
    ? `// Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '${postgrestVersion}'
  }`
    : ''

  function generateNullableUnionTsType(tsType: string, isNullable: boolean) {
    // Only add the null union if the type is not unknown as unknown already includes null
    if (tsType === 'unknown' || tsType === 'any' || !isNullable) {
      return tsType
    }
    return `${tsType} | null`
  }

  function generateColumnTsDefinition(
    schema: PostgresSchema,
    column: {
      name: string
      format: string
      is_nullable: boolean
      is_optional: boolean
    },
    context: {
      types: PostgresType[]
      schemas: PostgresSchema[]
      tables: PostgresTable[]
      views: PostgresView[]
    }
  ) {
    return `${JSON.stringify(column.name)}${column.is_optional ? '?' : ''}: ${generateNullableUnionTsType(pgTypeToTsType(schema, column.format, context), column.is_nullable)}`
  }

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
                    ({ table, relationships }) => `${JSON.stringify(table.name)}: {
                  Row: {
                    ${[
                      ...columnsByTableId[table.id].map((column) =>
                        generateColumnTsDefinition(
                          schema,
                          {
                            name: column.name,
                            format: column.format,
                            is_nullable: column.is_nullable,
                            is_optional: false,
                          },
                          { types, schemas, tables, views }
                        )
                      ),
                      ...schemaFunctions
                        .filter(({ fn }) => fn.argument_types === table.name)
                        .map(({ fn }) => {
                          return `${JSON.stringify(fn.name)}: ${generateNullableUnionTsType(getFunctionReturnType(schema, fn), true)}`
                        }),
                    ]}
                  }
                  Insert: {
                    ${columnsByTableId[table.id].map((column) => {
                      if (column.identity_generation === 'ALWAYS') {
                        return `${JSON.stringify(column.name)}?: never`
                      }
                      return generateColumnTsDefinition(
                        schema,
                        {
                          name: column.name,
                          format: column.format,
                          is_nullable: column.is_nullable,
                          is_optional:
                            column.is_nullable ||
                            column.is_identity ||
                            column.default_value !== null,
                        },
                        { types, schemas, tables, views }
                      )
                    })}
                  }
                  Update: {
                    ${columnsByTableId[table.id].map((column) => {
                      if (column.identity_generation === 'ALWAYS') {
                        return `${JSON.stringify(column.name)}?: never`
                      }

                      return generateColumnTsDefinition(
                        schema,
                        {
                          name: column.name,
                          format: column.format,
                          is_nullable: column.is_nullable,
                          is_optional: true,
                        },
                        { types, schemas, tables, views }
                      )
                    })}
                  }
                  Relationships: [
                    ${relationships.map(generateRelationshiptTsDefinition)}
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
                    ({ view, relationships }) => `${JSON.stringify(view.name)}: {
                  Row: {
                    ${[
                      ...columnsByTableId[view.id].map((column) =>
                        generateColumnTsDefinition(
                          schema,
                          {
                            name: column.name,
                            format: column.format,
                            is_nullable: column.is_nullable,
                            is_optional: false,
                          },
                          { types, schemas, tables, views }
                        )
                      ),
                      ...schemaFunctions
                        .filter(({ fn }) => fn.argument_types === view.name)
                        .map(
                          ({ fn }) =>
                            `${JSON.stringify(fn.name)}: ${generateNullableUnionTsType(getFunctionReturnType(schema, fn), true)}`
                        ),
                    ]}
                  }
                  ${
                    view.is_updatable
                      ? `Insert: {
                           ${columnsByTableId[view.id].map((column) => {
                             if (!column.is_updatable) {
                               return `${JSON.stringify(column.name)}?: never`
                             }
                             return generateColumnTsDefinition(
                               schema,
                               {
                                 name: column.name,
                                 format: column.format,
                                 is_nullable: true,
                                 is_optional: true,
                               },
                               { types, schemas, tables, views }
                             )
                           })}
                         }
                         Update: {
                           ${columnsByTableId[view.id].map((column) => {
                             if (!column.is_updatable) {
                               return `${JSON.stringify(column.name)}?: never`
                             }
                             return generateColumnTsDefinition(
                               schema,
                               {
                                 name: column.name,
                                 format: column.format,
                                 is_nullable: true,
                                 is_optional: true,
                               },
                               { types, schemas, tables, views }
                             )
                           })}
                         }
                        `
                      : ''
                  }Relationships: [
                    ${relationships.map(generateRelationshiptTsDefinition)}
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
                schemaFunctionsGroupedByName[fnName].sort(
                  (a, b) =>
                    a.fn.argument_types.localeCompare(b.fn.argument_types) ||
                    a.fn.return_type.localeCompare(b.fn.return_type)
                )
              }

              return Object.entries(schemaFunctionsGroupedByName)
                .map(([fnName, fns]) => {
                  const functionSignatures = getFunctionSignatures(schema, fns)
                  return `${JSON.stringify(fnName)}:\n${functionSignatures}`
                })
                .join(',\n')
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
                          const type = typesById.get(type_id)
                          let tsType = 'unknown'
                          if (type) {
                            tsType = `${generateNullableUnionTsType(
                              pgTypeToTsType(schema, type.name, {
                                types,
                                schemas,
                                tables,
                                views,
                              }),
                              true
                            )}`
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
  ${schemas.map((schema) => {
    const schemaEnums = introspectionBySchema[schema.name].enums
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
