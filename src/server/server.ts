import closeWithGrace from 'close-with-grace'
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
  GENERATE_TYPES_SWIFT_ACCESS_CONTROL,
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
  POSTGREST_VERSION,
} from './constants.js'
import { apply as applyTypescriptTemplate } from './templates/typescript.js'
import { apply as applyGoTemplate } from './templates/go.js'
import { apply as applySwiftTemplate } from './templates/swift.js'
import { apply as applyPythonTemplate } from './templates/python.js'
import { apply as applyDartTemplate } from './templates/dart.js'

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

async function getTypeOutput(): Promise<string | null> {
  const pgMeta: PostgresMeta = new PostgresMeta({
    ...DEFAULT_POOL_CONFIG,
    connectionString: PG_CONNECTION,
  })
  const [
    { data: schemas, error: schemasError },
    { data: tables, error: tablesError },
    { data: foreignTables, error: foreignTablesError },
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
    pgMeta.foreignTables.list({
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
      includeTableTypes: true,
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
  if (foreignTablesError) {
    throw new Error(foreignTablesError.message)
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

  const config = {
    schemas: schemas!.filter(
      ({ name }) =>
        GENERATE_TYPES_INCLUDED_SCHEMAS.length === 0 ||
        GENERATE_TYPES_INCLUDED_SCHEMAS.includes(name)
    ),
    tables: tables!,
    foreignTables: foreignTables!,
    views: views!,
    materializedViews: materializedViews!,
    columns: columns!,
    relationships: relationships!,
    functions: functions!.filter(
      ({ return_type }) => !['trigger', 'event_trigger'].includes(return_type)
    ),
    types: types!,
    detectOneToOneRelationships: GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
    postgrestVersion: POSTGREST_VERSION,
  }

  switch (GENERATE_TYPES?.toLowerCase()) {
    case 'typescript':
      return await applyTypescriptTemplate(config)
    case 'swift':
      return await applySwiftTemplate({
        ...config,
        accessControl: GENERATE_TYPES_SWIFT_ACCESS_CONTROL,
      })
    case 'go':
      return applyGoTemplate(config)
    case 'python':
      return applyPythonTemplate(config)
    case 'dart':
      return applyDartTemplate(config)
    default:
      throw new Error(`Unsupported language for GENERATE_TYPES: ${GENERATE_TYPES}`)
  }
}

if (EXPORT_DOCS) {
  // TODO: Move to a separate script.
  await app.ready()
  // @ts-ignore: app.swagger() is a Fastify decorator, so doesn't show up in the types
  console.log(JSON.stringify(app.swagger(), null, 2))
} else if (GENERATE_TYPES) {
  console.log(await getTypeOutput())
} else {
  const closeListeners = closeWithGrace(async ({ err, signal, manual }) => {
    if (err) {
      app.log.error({ err }, 'server closing with error')
    } else {
      app.log.error(
        { err: new Error('Signal Received') },
        `${signal} signal received, server closing, close manual received: ${manual}`
      )
    }
    try {
      await app.close()
    } catch (err) {
      app.log.error({ err }, `Failed to close app`)
      throw err
    }
    try {
      await adminApp.close()
    } catch (err) {
      app.log.error({ err }, `Failed to close adminApp`)
      throw err
    }
  })
  app.addHook('onClose', async () => {
    try {
      closeListeners.uninstall()
      await adminApp.close()
    } catch (err) {
      app.log.error({ err }, `Failed to close adminApp in app onClose hook`)
      throw err
    }
  })
  adminApp.addHook('onClose', async () => {
    try {
      closeListeners.uninstall()
      await app.close()
    } catch (err) {
      app.log.error({ err }, `Failed to close app in adminApp onClose hook`)
      throw err
    }
  })

  app.listen({ port: PG_META_PORT, host: PG_META_HOST }, (err) => {
    if (err) {
      app.log.error({ err }, 'Uncaught error in app, exit(1)')
      process.exit(1)
    }
    const adminPort = PG_META_PORT + 1
    adminApp.listen({ port: adminPort, host: PG_META_HOST }, (err) => {
      if (err) {
        app.log.error({ err }, 'Uncaught error in adminApp, exit(1)')
        process.exit(1)
      }
    })
  })
}
