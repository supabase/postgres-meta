import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PostgresMeta } from '../../lib/index.js'
import { postgresColumnPermissionSchema } from '../../lib/types.js'
import { DEFAULT_POOL_CONFIG } from '../constants.js'
import { extractRequestForLogging } from '../utils.js'

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        querystring: Type.Object({
          table_schema: Type.Optional(Type.String()),
          table_name: Type.Optional(Type.String()),
          column_name: Type.Optional(Type.String()),
          privilege_type: Type.Optional(
            Type.Union([Type.Literal('SELECT'), Type.Literal('INSERT'), Type.Literal('UPDATE')])
          ),
          limit: Type.Optional(Type.Integer()),
          offset: Type.Optional(Type.Integer()),
        }),
        response: {
          200: Type.Array(postgresColumnPermissionSchema),
          500: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const table_schema = request.query.table_schema
      const table_name = request.query.table_name
      const column_name = request.query.column_name
      const privilege_type = request.query.privilege_type
      const limit = request.query.limit
      const offset = request.query.offset

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.columnPermissions.list({
        table_schema,
        table_name,
        column_name,
        privilege_type,
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
    }
  )

  fastify.post(
    '/:column_name',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        params: Type.Object({
          column_name: Type.String(),
        }),
        body: Type.Object({
          table_schema: Type.String(),
          table_name: Type.String(),
          role: Type.String(),
          privilege_type: Type.Optional(
            Type.Union([Type.Literal('SELECT'), Type.Literal('INSERT'), Type.Literal('UPDATE')])
          ),
        }),
        response: {
          200: Type.Literal('OK'),
          404: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.columnPermissions.grant(
        request.params.column_name,
        request.body
      )
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
    '/:column_name',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        params: Type.Object({
          column_name: Type.String(),
        }),
        body: Type.Object({
          table_schema: Type.String(),
          table_name: Type.String(),
          role: Type.String(),
          privilege_type: Type.Optional(
            Type.Union([Type.Literal('SELECT'), Type.Literal('INSERT'), Type.Literal('UPDATE')])
          ),
        }),
        response: {
          200: Type.Literal('OK'),
          404: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.columnPermissions.revoke(
        request.params.column_name,
        request.body
      )
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
