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
  PG_CONNECTION,
  PG_META_HOST,
  PG_META_PORT,
} from './constants.js'
import { apply as applyTypescriptTemplate } from './templates/typescript.js'
import { apply as applyGoTemplate } from './templates/go.js'
import { getGeneratorMetadata } from '../lib/generators.js'

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
  const { data: generatorMetadata, error: generatorMetadataError } = await getGeneratorMetadata(
    pgMeta,
    {
      includedSchemas: GENERATE_TYPES_INCLUDED_SCHEMAS,
    }
  )
  if (generatorMetadataError) {
    throw new Error(generatorMetadataError.message)
  }

  let output: string | null = null
  switch (GENERATE_TYPES) {
    case 'typescript':
      output = await applyTypescriptTemplate({
        ...generatorMetadata,
        detectOneToOneRelationships: GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS,
      })
      break
    case 'go':
      output = applyGoTemplate(generatorMetadata)
      break
  }

  return output
}

if (EXPORT_DOCS) {
  // TODO: Move to a separate script.
  await app.ready()
  // @ts-ignore: app.swagger() is a Fastify decorator, so doesn't show up in the types
  console.log(JSON.stringify(app.swagger(), null, 2))
} else if (GENERATE_TYPES) {
  const typeOutput = await getTypeOutput()
  if (typeOutput) {
    console.log(typeOutput)
    process.exit(0)
  }
} else {
  const closeListeners = closeWithGrace(async ({ err }) => {
    if (err) {
      app.log.error(err)
    }
    await app.close()
  })
  app.addHook('onClose', async () => {
    closeListeners.uninstall()
  })

  app.listen({ port: PG_META_PORT, host: PG_META_HOST }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    const adminPort = PG_META_PORT + 1
    adminApp.listen({ port: adminPort, host: PG_META_HOST })
  })
}

app.listen({ port: PG_META_PORT, host: PG_META_HOST }, () => {
  const adminPort = PG_META_PORT + 1
  adminApp.listen({ port: adminPort, host: PG_META_HOST })
})
