import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.config.list()
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  fastify.get<{
    Headers: { pg: string }
  }>('/version', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.version.retrieve()
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(500)
      return { error: error.message }
    }

    return data
  })
}
