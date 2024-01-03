import type { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../../lib/index.js'
import { DEFAULT_POOL_CONFIG } from '../../constants.js'
import { extractRequestForLogging } from '../../utils.js'
import { apply as applyTypescriptTemplate } from '../../templates/typescript.js'
import { getGeneratorMetadata } from '../../../lib/generators.js'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      excluded_schemas?: string
      included_schemas?: string
      detect_one_to_one_relationships?: string
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const excludedSchemas =
      request.query.excluded_schemas?.split(',').map((schema) => schema.trim()) ?? []
    const includedSchemas =
      request.query.included_schemas?.split(',').map((schema) => schema.trim()) ?? []
    const detectOneToOneRelationships = request.query.detect_one_to_one_relationships === 'true'

    const pgMeta: PostgresMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data: generatorMeta, error: generatorMetaError } = await getGeneratorMetadata(pgMeta, {
      includedSchemas,
      excludedSchemas,
    })
    if (generatorMetaError) {
      request.log.error({ error: generatorMetaError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: generatorMetaError.message }
    }

    return applyTypescriptTemplate({
      ...generatorMeta,
      detectOneToOneRelationships,
    })
  })
}
