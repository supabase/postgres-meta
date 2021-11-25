import { FastifyInstance } from 'fastify'
import PgMetaCache from '../pgMetaCache'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      include_system_schemas?: string
      limit?: number
      offset?: number
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const includeSystemSchemas = request.query.include_system_schemas === 'true'
    const limit = request.query.limit
    const offset = request.query.offset

    const pgMeta = PgMetaCache.get(connectionString)
    const { data, error } = await pgMeta.columns.list({
      includeSystemSchemas,
      limit,
      offset,
    })
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  fastify.get<{
    Headers: { pg: string }
    Params: {
      id: string
    }
  }>('/:id(\\d+\\.\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = PgMetaCache.get(connectionString)
    const { data, error } = await pgMeta.columns.retrieve({ id: request.params.id })
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string }
    Body: any
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = PgMetaCache.get(connectionString)
    const { data, error } = await pgMeta.columns.create(request.body)
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.patch<{
    Headers: { pg: string }
    Params: {
      id: string
    }
    Body: any
  }>('/:id(\\d+\\.\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = PgMetaCache.get(connectionString)
    const { data, error } = await pgMeta.columns.update(request.params.id, request.body)
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.delete<{
    Headers: { pg: string }
    Params: {
      id: string
    }
    Querystring: {
      cascade?: string
    }
  }>('/:id(\\d+\\.\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = PgMetaCache.get(connectionString)
    const { data, error } = await pgMeta.columns.remove(request.params.id)
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })
}
