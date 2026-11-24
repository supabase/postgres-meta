import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib/index.js'
import { createConnectionConfig } from '../utils.js'
import { extractRequestForLogging } from '../utils.js'

const createPublicationBodySchema = Type.Object({
  name: Type.String(),
  publish_insert: Type.Optional(Type.Boolean()),
  publish_update: Type.Optional(Type.Boolean()),
  publish_delete: Type.Optional(Type.Boolean()),
  publish_truncate: Type.Optional(Type.Boolean()),
  tables: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
})

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Querystring: {
      limit?: number
      offset?: number
    }
  }>('/', async (request, reply) => {
    const config = createConnectionConfig(request)
    const limit = request.query.limit
    const offset = request.query.offset

    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.publications.list({ limit, offset })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Params: {
      id: string
    }
  }>('/:id(\\d+)', async (request, reply) => {
    const config = createConnectionConfig(request)
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.publications.retrieve({ id })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: any
  }>('/', { schema: { body: createPublicationBodySchema } }, async (request, reply) => {
    const config = createConnectionConfig(request)

    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.publications.create(request.body as any)
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(400)
      return { error: error.message }
    }

    return data
  })

  fastify.patch<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Params: {
      id: string
    }
    Body: any
  }>('/:id(\\d+)', async (request, reply) => {
    const config = createConnectionConfig(request)
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.publications.update(id, request.body as any)
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.delete<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Params: {
      id: string
    }
  }>('/:id(\\d+)', async (request, reply) => {
    const config = createConnectionConfig(request)
    const id = Number(request.params.id)

    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.publications.remove(id)
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })
}
