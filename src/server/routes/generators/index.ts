import type { FastifyInstance } from 'fastify'
import { InvalidOptionError, type OptionValues, type TypegenLanguage } from '@supabase/typegen'
import { PostgresMeta } from '../../../lib/index.js'
import { createConnectionConfig, extractRequestForLogging } from '../../utils.js'
import { declaredOptions, getGeneratorMetadata } from '../../../lib/generators.js'
import { GENERATE_TYPES_DEFAULT_SCHEMA } from '../../constants.js'
import { generateTypes, FormatQueueFullError } from '../../format-pool.js'

/** Registry option name of each query parameter a generator route accepts. */
const QUERY_PARAMETER_OPTIONS = {
  detect_one_to_one_relationships: 'detect-one-to-one-relationships',
  postgrest_version: 'postgrest-version',
  access_control: 'swift-access-control',
} as const

type QueryParameter = keyof typeof QUERY_PARAMETER_OPTIONS

const queryParameterFor = (option: string): QueryParameter | undefined =>
  (Object.keys(QUERY_PARAMETER_OPTIONS) as QueryParameter[]).find(
    (parameter) => QUERY_PARAMETER_OPTIONS[parameter] === option
  )

/**
 * Route for one in-process language of `@supabase/typegen`. Every query
 * parameter is listed once; each language receives only the options it
 * declares, so a parameter another language uses is ignored rather than
 * rejected. An empty value counts as absent, as it did before the registry.
 */
export default (language: TypegenLanguage) => async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Querystring: {
      excluded_schemas?: string
      included_schemas?: string
    } & Partial<Record<QueryParameter, string>>
  }>('/', async (request, reply) => {
    const config = createConnectionConfig(request)
    const excludedSchemas =
      request.query.excluded_schemas?.split(',').map((schema) => schema.trim()) ?? []
    const includedSchemas =
      request.query.included_schemas?.split(',').map((schema) => schema.trim()) ?? []
    let options: OptionValues
    try {
      options = declaredOptions(language, {
        [QUERY_PARAMETER_OPTIONS.detect_one_to_one_relationships]:
          request.query.detect_one_to_one_relationships === 'true',
        [QUERY_PARAMETER_OPTIONS.postgrest_version]: request.query.postgrest_version || undefined,
        [QUERY_PARAMETER_OPTIONS.access_control]: request.query.access_control || undefined,
        'default-schema': GENERATE_TYPES_DEFAULT_SCHEMA,
      })
    } catch (error) {
      if (!(error instanceof InvalidOptionError)) {
        throw error
      }
      reply.code(400)
      const parameter = queryParameterFor(error.option)
      return {
        error: parameter
          ? `Query parameter "${parameter}" is invalid: ${error.message}`
          : error.message,
      }
    }

    const pgMeta: PostgresMeta = new PostgresMeta(config)
    const { data: generatorMeta, error: generatorMetaError } = await getGeneratorMetadata(pgMeta, {
      includedSchemas,
      excludedSchemas,
    })
    if (generatorMetaError) {
      request.log.error({ error: generatorMetaError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: generatorMetaError.message }
    }

    try {
      return await generateTypes(language, generatorMeta!, options)
    } catch (error) {
      // Anything else is a genuine failure and is already logged and turned
      // into a 500 by the app-level error handler.
      if (!(error instanceof FormatQueueFullError)) {
        throw error
      }
      // Load shedding, not a fault: 503 tells the caller it is transient and
      // worth retrying.
      request.log.warn({ error, request: extractRequestForLogging(request) })
      reply.code(503)
      return { error: error.message }
    }
  })
}
