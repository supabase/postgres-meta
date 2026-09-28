import closeWithGrace from 'close-with-grace'
import { pino } from 'pino'
import { PostgresMeta } from '../lib/index.js'
import { build as buildApp } from './app.js'
import { build as buildAdminApp } from './admin-app.js'
import {
  DEFAULT_POOL_CONFIG,
  EXPORT_DOCS,
  GENERATE_TYPES,
  GENERATE_TYPES_DEFAULT_SCHEMA,
  GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
  GENERATE_TYPES_INCLUDED_SCHEMAS,
  GENERATE_TYPES_SWIFT_ACCESS_CONTROL,
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
  POSTGREST_VERSION,
  SHUTDOWN_GRACE_PERIOD_MS,
} from './constants.js'
import { findLanguage } from '@supabase/typegen'
import { declaredOptions, getGeneratorMetadata } from '../lib/generators.js'
import { destroyFormatPool, generateTypes } from './format-pool.js'

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

async function getTypeOutput(): Promise<string> {
  const language = findLanguage(GENERATE_TYPES!.toLowerCase())
  if (!language?.inProcess) {
    throw new Error(`Unsupported language for GENERATE_TYPES: ${GENERATE_TYPES}`)
  }

  const pgMeta: PostgresMeta = new PostgresMeta({
    ...DEFAULT_POOL_CONFIG,
    connectionString: PG_CONNECTION,
  })
  // `getGeneratorMetadata` ends the pool. The CLI path only supports included schemas.
  const { data: generatorMetadata, error } = await getGeneratorMetadata(pgMeta, {
    includedSchemas:
      GENERATE_TYPES_INCLUDED_SCHEMAS.length > 0 ? GENERATE_TYPES_INCLUDED_SCHEMAS : undefined,
  })
  if (error) {
    throw new Error(error.message)
  }

  return generateTypes(
    language,
    generatorMetadata!,
    declaredOptions(language, {
      'detect-one-to-one-relationships': GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
      'postgrest-version': POSTGREST_VERSION,
      'default-schema': GENERATE_TYPES_DEFAULT_SCHEMA,
      'swift-access-control': GENERATE_TYPES_SWIFT_ACCESS_CONTROL,
    })
  )
}

if (EXPORT_DOCS) {
  // TODO: Move to a separate script.
  await app.ready()
  // @ts-ignore: app.swagger() is a Fastify decorator, so doesn't show up in the types
  console.log(JSON.stringify(app.swagger(), null, 2))
} else if (GENERATE_TYPES) {
  process.stdout.write(await getTypeOutput())
} else {
  closeWithGrace({ delay: SHUTDOWN_GRACE_PERIOD_MS }, async ({ err, signal, manual }) => {
    if (err) {
      app.log.error({ err }, 'server closing with error')
    } else {
      app.log.info(`${signal} signal received, server closing, close manual received: ${manual}`)
    }
    await app.close().catch((err) => app.log.error({ err }, 'Failed to close app'))
    await adminApp.close().catch((err) => app.log.error({ err }, 'Failed to close adminApp'))
    // worker threads keep the event loop alive, so the process would not exit
    await destroyFormatPool().catch((err) =>
      app.log.error({ err }, 'Failed to destroy format pool')
    )
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
