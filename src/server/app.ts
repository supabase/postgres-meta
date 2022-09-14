import fastify from 'fastify'
import { PostgresMeta } from '../lib'
import {
  DEFAULT_POOL_CONFIG,
  EXPORT_DOCS,
  GENERATE_TYPES,
  GENERATE_TYPES_INCLUDED_SCHEMAS,
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
  PG_META_REQ_HEADER,
} from './constants'
import routes from './routes'
import { apply as applyTypescriptTemplate } from './templates/typescript'
import { extractRequestForLogging } from './utils'
import pino from 'pino'
import pkg from '../../package.json'
import { build as buildAdminApp } from './admin-app'

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
  app.register(require('fastify-swagger'), {
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
        types,
      })
    )
  })()
} else {
  app.ready(() => {
    app.listen(PG_META_PORT, PG_META_HOST, () => {
      app.log.info(`App started on port ${PG_META_PORT}`)
      const adminApp = buildAdminApp({ logger })
      const adminPort = PG_META_PORT + 1
      adminApp.listen(adminPort, PG_META_HOST, () => {
        adminApp.log.info(`Admin App started on port ${adminPort}`)
      })
    })
  })
}

app.register(require('fastify-cors'))

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
