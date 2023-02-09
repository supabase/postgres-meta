import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PostgresMeta } from '../../lib/index.js'
import { postgresTablePermissionSchema } from '../../lib/types.js'
import { DEFAULT_POOL_CONFIG } from '../constants.js'
import { extractRequestForLogging } from '../utils.js'
import { tablePermissionListSchema } from '../../lib/inputs.js'

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        querystring: tablePermissionListSchema,
        response: {
          200: Type.Array(postgresTablePermissionSchema),
          500: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const { table_schema, table_name, privilege, limit, offset } = request.query

      const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
      const { data, error } = await pgMeta.tablePermissions.list({
        table_schema,
        table_name,
        privilege,
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
    '/:table_name',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        params: Type.Object({
          table_name: Type.String(),
        }),
        body: Type.Object({
          table_schema: Type.String(),
          table_name: Type.String(),
          role: Type.String(),
          privilege: Type.Optional(
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
      const { data, error } = await pgMeta.tablePermissions.grant(
        request.params.table_name,
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
    '/:table_name',
    {
      schema: {
        headers: Type.Object({ pg: Type.String() }),
        params: Type.Object({
          table_name: Type.String(),
        }),
        body: Type.Object({
          table_schema: Type.String(),
          table_name: Type.String(),
          role: Type.String(),
          privilege: Type.Optional(
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
      const { data, error } = await pgMeta.tablePermissions.revoke(
        request.params.table_name,
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
