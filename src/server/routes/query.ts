import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'

export default async (fastify: FastifyInstance) => {
  fastify.post<{
    Headers: { pg: string }
    Body: {
      query: string
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.query(request.body.query)
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      return { error: error.message }
    }

    return data || []
  })
}
