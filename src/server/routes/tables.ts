import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PostgresMeta } from '../../lib/index.js'
import {
  postgresTableCreateSchema,
  postgresTableSchema,
  postgresTableUpdateSchema,
} from '../../lib/types.js'
import { DEFAULT_POOL_CONFIG } from '../constants.js'
import { extractRequestForLogging, translateErrorToResponseCode } from '../utils.js'

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        querystring: Type.Object({
          include_system_schemas: Type.Optional(Type.Boolean()),
          // Note: this only supports comma separated values (e.g., ".../tables?included_schemas=public,core")
          included_schemas: Type.Optional(Type.String()),
          excluded_schemas: Type.Optional(Type.String()),
          limit: Type.Optional(Type.Integer()),
          offset: Type.Optional(Type.Integer()),
          include_columns: Type.Optional(Type.Boolean()),
        }),
        response: {
          200: Type.Array(postgresTableSchema),
          500: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const includeSystemSchemas = request.query.include_system_schemas
      const includedSchemas = request.query.included_schemas?.split(',')
      const excludedSchemas = request.query.excluded_schemas?.split(',')
      const limit = request.query.limit
      const offset = request.query.offset
      const includeColumns = request.query.include_columns

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tables.list({
        includeSystemSchemas,
        includedSchemas,
        excludedSchemas,
        limit,
        offset,
        includeColumns,
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

  fastify.get(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          200: postgresTableSchema,
          404: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const id = request.params.id

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tables.retrieve({ id })
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.post(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        body: postgresTableCreateSchema,
        response: {
          200: postgresTableSchema,
          400: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tables.create(request.body)
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(400)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.patch(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.Integer(),
        }),
        body: postgresTableUpdateSchema,
        response: {
          200: postgresTableSchema,
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
      const id = request.params.id

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tables.update(id, request.body)
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.delete(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.Integer(),
        }),
        querystring: Type.Object({
          cascade: Type.Optional(Type.Boolean()),
        }),
        response: {
          200: postgresTableSchema,
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
      const id = request.params.id
      const cascade = request.query.cascade

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tables.remove(id, { cascade })
      await pgMeta.end()
      if (error) {
        request.log.error({ error, request: extractRequestForLogging(request) })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )
}
export default route
