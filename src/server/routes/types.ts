import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      include_system_schemas?: string
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const includeSystemSchemas = request.query.include_system_schemas === 'true'

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.types.list({ includeSystemSchemas })
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(500)
      return { error: error.message }
    }

    return data
  })
}
