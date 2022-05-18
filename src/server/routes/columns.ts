import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'
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
    Params: { tableId: number }
    Querystring: {
      include_system_schemas?: string
      limit?: number
      offset?: number
    }
  }>('/:tableId(^\\d+$)', async (request, reply) => {
    const {
      headers: { pg: connectionString },
      query: { limit, offset },
      params: { tableId },
    } = request
    const includeSystemSchemas = request.query.include_system_schemas === 'true'

    const pgMeta: PostgresMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.list({
      tableId,
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
    Body: any
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.create(request.body)
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
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
