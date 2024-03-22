import PostgresMeta from './PostgresMeta.js'
import {
  PostgresColumn,
  PostgresForeignTable,
  PostgresFunction,
  PostgresMaterializedView,
  PostgresRelationship,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from './types.js'
import { PostgresMetaResult } from './types.js'

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

  const { data: foreignTables, error: foreignTablesError } = await pgMeta.foreignTables.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
    includeColumns: false,
  })
  if (foreignTablesError) {
    return { data: null, error: foreignTablesError }
  }

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

  const { data: columns, error: columnsError } = await pgMeta.columns.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
  })
  if (columnsError) {
    return { data: null, error: columnsError }
  }

  const { data: relationships, error: relationshipsError } = await pgMeta.relationships.list()
  if (relationshipsError) {
    return { data: null, error: relationshipsError }
  }

  const { data: functions, error: functionsError } = await pgMeta.functions.list({
    includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
    excludedSchemas,
  })
  if (functionsError) {
    return { data: null, error: functionsError }
  }

  const { data: types, error: typesError } = await pgMeta.types.list({
    includeArrayTypes: true,
    includeSystemSchemas: true,
  })
  if (typesError) {
    return { data: null, error: typesError }
  }

  await pgMeta.end()

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
