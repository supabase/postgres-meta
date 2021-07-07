import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.triggers.list()
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
    const { data, error } = await pgMeta.triggers.retrieve({ id })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, req: request.body })
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
    const { data, error } = await pgMeta.triggers.create(request.body)
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
    const { data, error } = await pgMeta.triggers.update(id, request.body)
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
    Querystring: {
      cascade?: string
    }
  }>('/:id(\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg
    const id = Number(request.params.id)
    const cascade = request.query.cascade === 'true'

    const pgMeta = new PostgresMeta({ connectionString, max: 1 })
    const { data, error } = await pgMeta.triggers.remove(id, { cascade })
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
