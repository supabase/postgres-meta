import { FastifyInstance, FastifyRequest } from 'fastify'
import { PostgresMeta } from '../../lib/index.js'
import * as Parser from '../../lib/Parser.js'
import {
  createConnectionConfig,
  extractRequestForLogging,
  translateErrorToResponseCode,
} from '../utils.js'

const errorOnEmptyQuery = (request: FastifyRequest) => {
  if (!(request.body as any).query) {
    throw new Error('query not found')
  }
}

export default async (fastify: FastifyInstance) => {
  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      query: string
    }
  }>('/', async (request, reply) => {
    errorOnEmptyQuery(request)
    const config = createConnectionConfig(request)
    const pgMeta = new PostgresMeta(config)
    const { data, error } = await pgMeta.query(request.body.query, false)
    await pgMeta.end()
    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(translateErrorToResponseCode(error))
      return { error: error.formattedError ?? error.message, ...error }
    }

    return data || []
  })

  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      query: string
    }
  }>('/format', async (request, reply) => {
    errorOnEmptyQuery(request)
    const { data, error } = await Parser.Format(request.body.query)

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(translateErrorToResponseCode(error))
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      query: string
    }
  }>('/parse', async (request, reply) => {
    errorOnEmptyQuery(request)
    const { data, error } = Parser.Parse(request.body.query)

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(translateErrorToResponseCode(error))
      return { error: error.message }
    }

    return data
  })

  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      ast: object
    }
  }>('/deparse', async (request, reply) => {
    const { data, error } = Parser.Deparse(request.body.ast)

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(translateErrorToResponseCode(error))
      return { error: error.message }
    }

    return data
  })
}
