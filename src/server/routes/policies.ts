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
    const { data, error } = await pgMeta.policies.list({ includeSystemSchemas })
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
    Params: {
      id: string
    }
  }>('/:id(\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.policies.retrieve({ id })
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string }
    Body: any
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.policies.create(request.body)
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
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
  }>('/:id(\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.policies.update(id, request.body)
    await pgMeta.end()
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
  }>('/:id(\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.policies.remove(id)
    await pgMeta.end()
    if (error) {
      request.log.error(JSON.stringify({ error, req: request.body }))
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })
}
