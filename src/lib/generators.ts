import PostgresMeta from './PostgresMeta.js'
import {
  PostgresColumn,
  PostgresForeignTable,
  PostgresFunction,
  PostgresMaterializedView,
  PostgresMetaResult,
  PostgresRelationship,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from './types.js'

export type GeneratorMetadata = {
  schemas: PostgresSchema[]
  tables: Omit<PostgresTable, 'columns'>[]
  foreignTables: Omit<PostgresForeignTable, 'columns'>[]
  views: Omit<PostgresView, 'columns'>[]
  materializedViews: Omit<PostgresMaterializedView, 'columns'>[]
  columns: PostgresColumn[]
  relationships: PostgresRelationship[]
  functions: PostgresFunction[]
  types: PostgresType[]
}

export async function getGeneratorMetadata(
  pgMeta: PostgresMeta,
  filters: { includedSchemas?: string[]; excludedSchemas?: string[] } = {
    includedSchemas: [],
    excludedSchemas: [],
  }
): Promise<PostgresMetaResult<GeneratorMetadata>> {
  const start = Date.now()
  console.log('getGeneratorMetadata start: ')
  const includedSchemas = filters.includedSchemas ?? []
  const excludedSchemas = filters.excludedSchemas ?? []

  const { data: schemas, error: schemasError } = await pgMeta.schemas.list()
  if (schemasError) {
    return { data: null, error: schemasError }
  }

  const { data: tables, error: tablesError } = await pgMeta.tables.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
    includeColumns: false,
  })
  if (tablesError) {
    return { data: null, error: tablesError }
  }

  const startForeignTables = Date.now()
  console.log('getGeneratorMetadata foreignTables start: ', startForeignTables)
  const { data: foreignTables, error: foreignTablesError } = await pgMeta.foreignTables.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
    includeColumns: false,
  })
  if (foreignTablesError) {
    return { data: null, error: foreignTablesError }
  }
  const endForeignTables = Date.now()
  console.log('getGeneratorMetadata foreignTables end: ', endForeignTables)
  console.log('elapsedForeignTables: ', endForeignTables - startForeignTables)

  const startViews = Date.now()
  console.log('getGeneratorMetadata views start: ', startViews)
  const { data: views, error: viewsError } = await pgMeta.views.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
    includeColumns: false,
  })
  if (viewsError) {
    return { data: null, error: viewsError }
  }

  const { data: materializedViews, error: materializedViewsError } =
    await pgMeta.materializedViews.list({
      includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
      excludedSchemas,
      includeColumns: false,
    })
  if (materializedViewsError) {
    return { data: null, error: materializedViewsError }
  }
  const endViews = Date.now()
  console.log('getGeneratorMetadata views end: ', endViews)
  console.log('elapsedViews: ', endViews - startViews)

  const startColumns = Date.now()
  console.log('getGeneratorMetadata columns start: ', startColumns)
  const { data: columns, error: columnsError } = await pgMeta.columns.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
  })
  if (columnsError) {
    return { data: null, error: columnsError }
  }
  const endColumns = Date.now()
  console.log('getGeneratorMetadata columns end: ', endColumns)
  console.log('elapsedColumns: ', endColumns - startColumns)

  const startRelationships = Date.now()
  console.log('getGeneratorMetadata relationships start: ', startRelationships)
  const { data: relationships, error: relationshipsError } = await pgMeta.relationships.list()
  if (relationshipsError) {
    return { data: null, error: relationshipsError }
  }
  const endRelationships = Date.now()
  console.log('getGeneratorMetadata relationships end: ', endRelationships)
  console.log('elapsedRelationships: ', endRelationships - startRelationships)

  const startFunctions = Date.now()
  console.log('getGeneratorMetadata functions start: ', startFunctions)
  const { data: functions, error: functionsError } = await pgMeta.functions.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
  })
  if (functionsError) {
    return { data: null, error: functionsError }
  }
  const endFunctions = Date.now()
  console.log('getGeneratorMetadata functions end: ', endFunctions)
  console.log('elapsedFunctions: ', endFunctions - startFunctions)

  const startTypes = Date.now()
  console.log('getGeneratorMetadata types start: ', startTypes)
  const { data: types, error: typesError } = await pgMeta.types.list({
    includeTableTypes: true,
    includeArrayTypes: true,
    includeSystemSchemas: true,
  })
  if (typesError) {
    return { data: null, error: typesError }
  }
  const endTypes = Date.now()
  console.log('getGeneratorMetadata types end: ', endTypes)
  console.log('elapsedTypes: ', endTypes - startTypes)

  await pgMeta.end()

  const end = Date.now()
  console.log('getGeneratorMetadata end: ', end)
  console.log('elapsed: ', end - start)

  return {
    data: {
      schemas: schemas.filter(
        ({ name }) =>
          !excludedSchemas.includes(name) &&
          (includedSchemas.length === 0 || includedSchemas.includes(name))
      ),
      tables,
      foreignTables,
      views,
      materializedViews,
      columns,
      relationships,
      functions: functions.filter(
        ({ return_type }) => !['trigger', 'event_trigger'].includes(return_type)
      ),
      types,
    },
    error: null,
  }
}
