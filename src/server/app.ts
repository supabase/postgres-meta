import swagger from '@fastify/swagger'
import cors from '@fastify/cors'
import { fastify } from 'fastify'
import { pino } from 'pino'
import { PostgresMeta } from '../lib/index.js'
import {
  DEFAULT_POOL_CONFIG,
  EXPORT_DOCS,
  GENERATE_TYPES,
  GENERATE_TYPES_INCLUDED_SCHEMAS,
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
  PG_META_REQ_HEADER,
} from './constants.js'
import routes from './routes/index.js'
import { apply as applyTypescriptTemplate } from './templates/typescript.js'
import { extractRequestForLogging } from './utils.js'
import { build as buildAdminApp } from './admin-app.js'
// Pseudo package declared only for this module
import pkg from '#package.json' assert { type: 'json' }

const logger = pino({
  formatters: {
    level(label) {
      return { level: label }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

const app = fastify({
  logger,
  disableRequestLogging: true,
  requestIdHeader: PG_META_REQ_HEADER,
})

app.setErrorHandler((error, request, reply) => {
  app.log.error({ error: error.toString(), request: extractRequestForLogging(request) })
  reply.code(500).send({ error: error.message })
})

app.setNotFoundHandler((request, reply) => {
  app.log.error({ error: 'Not found', request: extractRequestForLogging(request) })
  reply.code(404).send({ error: 'Not found' })
})

if (EXPORT_DOCS) {
  app.register(swagger, {
    openapi: {
      servers: [],
      info: {
        title: 'postgres-meta',
        description: 'A REST API to manage your Postgres database',
        version: pkg.version,
      },
    },
  })

  app.ready(() => {
    // @ts-ignore: app.swagger() is a Fastify decorator, so doesn't show up in the types
    console.log(JSON.stringify(app.swagger(), null, 2))
  })
} else if (GENERATE_TYPES === 'typescript') {
  ;(async () => {
    const pgMeta: PostgresMeta = new PostgresMeta({
      ...DEFAULT_POOL_CONFIG,
      connectionString: PG_CONNECTION,
    })
    const { data: schemas, error: schemasError } = await pgMeta.schemas.list()
    const { data: tables, error: tablesError } = await pgMeta.tables.list()
    const { data: views, error: viewsError } = await pgMeta.views.list()
    const { data: functions, error: functionsError } = await pgMeta.functions.list()
    const { data: types, error: typesError } = await pgMeta.types.list({
      includeArrayTypes: true,
      includeSystemSchemas: true,
    })
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
    if (functionsError) {
      throw new Error(functionsError.message)
    }
    if (typesError) {
      throw new Error(typesError.message)
    }

    console.log(
      applyTypescriptTemplate({
        schemas: schemas.filter(
          ({ name }) =>
            GENERATE_TYPES_INCLUDED_SCHEMAS.length === 0 ||
            GENERATE_TYPES_INCLUDED_SCHEMAS.includes(name)
        ),
        tables,
        views,
        functions: functions.filter(
          ({ return_type }) => !['trigger', 'event_trigger'].includes(return_type)
        ),
        types: types.filter(({ name }) => name[0] !== '_'),
        arrayTypes: types.filter(({ name }) => name[0] === '_'),
      })
    )
  })()
} else {
  app.ready(() => {
    app.listen({ port: PG_META_PORT, host: PG_META_HOST }, () => {
      app.log.info(`App started on port ${PG_META_PORT}`)
      const adminApp = buildAdminApp({ logger })
      const adminPort = PG_META_PORT + 1
      adminApp.listen({ port: adminPort, host: PG_META_HOST }, () => {
        adminApp.log.info(`Admin App started on port ${adminPort}`)
      })
    })
  })
}

app.register(cors)

app.get('/', async (_request, _reply) => {
  return {
    status: 200,
    name: pkg.name,
    version: pkg.version,
    documentation: 'https://github.com/supabase/postgres-meta',
  }
})

app.get('/health', async (_request, _reply) => {
  return { date: new Date() }
})

app.register(routes)
