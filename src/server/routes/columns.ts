import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'
import {
  PostgresColumnCreate,
  postgresColumnSchema,
  postgresColumnCreateSchema,
} from '../../lib/types'
import { DEFAULT_POOL_CONFIG } from '../constants'
import { extractRequestForLogging } from '../utils'

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

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.list({
      includeSystemSchemas,
      limit,
      offset,
    })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
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

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.retrieve({ id: request.params.id })
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(400)
      if (error.message.startsWith('Cannot find')) reply.code(404)
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string }
    Body: PostgresColumnCreate | PostgresColumnCreate[]
  }>(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        body: Type.Union([postgresColumnCreateSchema, Type.Array(postgresColumnCreateSchema)]),
        response: {
          200: Type.Union([postgresColumnSchema, Type.Array(postgresColumnSchema)]),
          400: Type.Object({
            error: Type.String(),
          }),
          404: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      if (!Array.isArray(request.body)) {
        request.body = [request.body]
      }

      const { data, error } = await pgMeta.columns.batchCreate(request.body)
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      if (Array.isArray(request.body)) {
        return data
      }
      return data[0]
    }
  )

  fastify.patch<{
    Headers: { pg: string }
    Params: {
      id: string
    }
    Body: any
  }>('/:id(\\d+\\.\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.update(request.params.id, request.body)
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
    Headers: { pg: string }
    Params: {
      id: string
    }
    Querystring: {
      cascade?: string
    }
  }>('/:id(\\d+\\.\\d+)', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.remove(request.params.id)
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
