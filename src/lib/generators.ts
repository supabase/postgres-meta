import PostgresMeta from "./PostgresMeta.js";
import { PostgresColumn, PostgresFunction, PostgresMaterializedView, PostgresRelationship, PostgresSchema, PostgresTable, PostgresType, PostgresView } from "./types.js";
import { PostgresMetaResult } from "./types.js";

type GeneratorMetadata = {
  schemas: PostgresSchema[];
  tables: PostgresTable[];
  views: PostgresView[];
  materializedViews: PostgresMaterializedView[];
  columns: PostgresColumn[];
  relationships: PostgresRelationship[];
  functions: PostgresFunction[];
  types: PostgresType[];
  arrayTypes: PostgresType[];
}

export async function getGeneratorMetadata(pgMeta: PostgresMeta, filters: { includedSchemas?: string[]; excludedSchemas?: string[] } = { includedSchemas: [], excludedSchemas: [] }): Promise<PostgresMetaResult<GeneratorMetadata>> {
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

  const nonArrayTypes = types.filter(({ name }) => name[0] !== '_')
  const arrayTypes = types.filter(({ name }) => name[0] === '_')

  await pgMeta.end()

  return {
    data: {
      schemas,
      tables,
      views,
      materializedViews,
      columns,
      relationships,
      functions,
      types: nonArrayTypes,
      arrayTypes,
    },
    error: null,
  }
}
