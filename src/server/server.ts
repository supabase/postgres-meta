import { pino } from 'pino'
import { PostgresMeta } from '../lib/index.js'
import { build as buildApp } from './app.js'
import { build as buildAdminApp } from './admin-app.js'
import {
  DEFAULT_POOL_CONFIG,
  EXPORT_DOCS,
  GENERATE_TYPES,
  GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
  GENERATE_TYPES_INCLUDED_SCHEMAS,
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
} from './constants.js'
import { apply as applyTypescriptTemplate } from './templates/typescript.js'

const logger = pino({
  formatters: {
    level(label) {
      return { level: label }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

const app = buildApp({ logger })
const adminApp = buildAdminApp({ logger })

if (EXPORT_DOCS) {
  // TODO: Move to a separate script.
  await app.ready()
  // @ts-ignore: app.swagger() is a Fastify decorator, so doesn't show up in the types
  console.log(JSON.stringify(app.swagger(), null, 2))
} else if (GENERATE_TYPES === 'typescript') {
  // TODO: Move to a separate script.
  const pgMeta: PostgresMeta = new PostgresMeta({
    ...DEFAULT_POOL_CONFIG,
    connectionString: PG_CONNECTION,
  })
  const [
    { data: schemas, error: schemasError },
    { data: tables, error: tablesError },
    { data: views, error: viewsError },
    { data: materializedViews, error: materializedViewsError },
    { data: columns, error: columnsError },
    { data: relationships, error: relationshipsError },
    { data: functions, error: functionsError },
    { data: types, error: typesError },
  ] = await Promise.all([
    pgMeta.schemas.list(),
    pgMeta.tables.list({
      includedSchemas:
        GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
      includeColumns: false,
    }),
    pgMeta.views.list({
      includedSchemas:
        GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
      includeColumns: false,
    }),
    pgMeta.materializedViews.list({
      includedSchemas:
        GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
      includeColumns: false,
    }),
    pgMeta.columns.list({
      includedSchemas:
        GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
    }),
    pgMeta.relationships.list(),
    pgMeta.functions.list({
      includedSchemas:
        GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
    }),
    pgMeta.types.list({
      includeArrayTypes: true,
      includeSystemSchemas: true,
    }),
  ])
  await pgMeta.end()

  if (schemasError) {
    throw new Error(schemasError.message)
  }
  if (tablesError) {
    throw new Error(tablesError.message)
  }
  if (viewsError) {
    throw new Error(viewsError.message)
  }
  if (materializedViewsError) {
    throw new Error(materializedViewsError.message)
  }
  if (columnsError) {
    throw new Error(columnsError.message)
  }
  if (relationshipsError) {
    throw new Error(relationshipsError.message)
  }
  if (functionsError) {
    throw new Error(functionsError.message)
  }
  if (typesError) {
    throw new Error(typesError.message)
  }

  console.log(
    applyTypescriptTemplate({
      schemas: schemas!.filter(
        ({ name }) =>
          GENERATE_TYPES_INCLUDED_SCHEMAS.length === 0 ||
          GENERATE_TYPES_INCLUDED_SCHEMAS.includes(name)
      ),
      tables: tables!,
      views: views!,
      materializedViews: materializedViews!,
      columns: columns!,
      relationships: relationships!,
      functions: functions!.filter(
        ({ return_type }) => !['trigger', 'event_trigger'].includes(return_type)
      ),
      types: types!.filter(({ name }) => name[0] !== '_'),
      arrayTypes: types!.filter(({ name }) => name[0] === '_'),
      detectOneToOneRelationships: GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
    })
  )
} else {
  app.listen({ port: PG_META_PORT, host: PG_META_HOST }, () => {
    const adminPort = PG_META_PORT + 1
    adminApp.listen({ port: adminPort, host: PG_META_HOST })
  })
}
