import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib/index.js'
import { DEFAULT_POOL_CONFIG } from '../constants.js'
import { extractRequestForLogging } from '../utils.js'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Params: {
      id: string
    }
  }>('/:id(\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.definitions.retrieve({ id })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(404)
      return { error: error.message }
    }

    return data
  })
}
