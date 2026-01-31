import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PostgresMeta } from '../../lib/index.js'
import { dependencyGraphSchema } from '../../lib/types.js'
import {
  createConnectionConfig,
  extractRequestForLogging,
  translateErrorToResponseCode,
} from '../utils.js'

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
          'x-pg-application-name': Type.Optional(Type.String()),
        }),
        querystring: Type.Object({
          include_system_schemas: Type.Optional(Type.Boolean()),
          included_schemas: Type.Optional(Type.String()),
          excluded_schemas: Type.Optional(Type.String()),
          included_types: Type.Optional(Type.String()),
        }),
        response: {
          200: dependencyGraphSchema,
          500: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const includeSystemSchemas = request.query.include_system_schemas
      const includedSchemas = request.query.included_schemas?.split(',')
      const excludedSchemas = request.query.excluded_schemas?.split(',')
      const includedTypes = request.query.included_types?.split(',')

      const config = createConnectionConfig(request)
      const pgMeta = new PostgresMeta(config)
      const { data, error } = await pgMeta.dependencyGraph.get({
        includeSystemSchemas,
        includedSchemas,
        excludedSchemas,
        includedTypes,
      })
      await pgMeta.end()

      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(translateErrorToResponseCode(error, 500))
        return { error: error.message }
      }

      return data
    }
  )
}

export default route
