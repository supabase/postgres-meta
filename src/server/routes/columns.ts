import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib/index.js'
import { DEFAULT_POOL_CONFIG } from '../constants.js'
import { extractRequestForLogging } from '../utils.js'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      include_system_schemas?: string
      // Note: this only supports comma separated values (e.g., ".../columns?included_schemas=public,core")
      included_schemas?: string
      excluded_schemas?: string
      limit?: number
      offset?: number
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const includeSystemSchemas = request.query.include_system_schemas === 'true'
    const includedSchemas = request.query.included_schemas?.split(',')
    const excludedSchemas = request.query.excluded_schemas?.split(',')
    const limit = request.query.limit
    const offset = request.query.offset

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.list({
      includeSystemSchemas,
      includedSchemas,
      excludedSchemas,
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
      tableId: string
      ordinalPosition: string
    }
    Querystring: {
      include_system_schemas?: string
      limit?: string
      offset?: string
    }
  }>('/:tableId(^\\d+):ordinalPosition', async (request, reply) => {
    if (request.params.ordinalPosition === '') {
      const {
        headers: { pg: connectionString },
        query: { limit, offset },
        params: { tableId },
      } = request
      const includeSystemSchemas = request.query.include_system_schemas === 'true'

      const pgMeta: PostgresMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.columns.list({
        tableId: Number(tableId),
        includeSystemSchemas,
        limit: Number(limit),
        offset: Number(offset),
      })
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(500)
        return { error: error.message }
      }

      return data
    } else if (/^\.\d+$/.test(request.params.ordinalPosition)) {
      const {
        headers: { pg: connectionString },
        params: { tableId, ordinalPosition: ordinalPositionWithDot },
      } = request
      const ordinalPosition = ordinalPositionWithDot.slice(1)

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.columns.retrieve({ id: `${tableId}.${ordinalPosition}` })
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      return data
    } else {
      return reply.callNotFound()
    }
  })

  fastify.post<{
    Headers: { pg: string }
    Body: any
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.create(request.body as any)
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
    const { data, error } = await pgMeta.columns.update(request.params.id, request.body as any)
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
    const cascade = request.query.cascade === 'true'

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data, error } = await pgMeta.columns.remove(request.params.id, { cascade })
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
