import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib'
import {
  PostgresSchemaCreate,
  PostgresSchemaUpdate,
  postgresSchemaSchema,
  postgresSchemaCreateSchema,
  postgresSchemaUpdateSchema,
} from '../../lib/types'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      include_system_schemas?: string
    }
  }>(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        querystring: Type.Object({
          include_system_schemas: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(postgresSchemaSchema),
          500: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const includeSystemSchemas = request.query.include_system_schemas === 'true'

      const pgMeta = new PostgresMeta({ connectionString, max: 1 })
      const { data, error } = await pgMeta.schemas.list({ includeSystemSchemas })
      await pgMeta.end()
      if (error) {
        request.log.error(JSON.stringify({ error, req: request.body }))
        reply.code(500)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.get<{
    Headers: { pg: string }
    Params: {
      id: string
    }
  }>(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.RegEx(/\d+/),
        }),
        response: {
          200: postgresSchemaSchema,
          404: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg
      const id = Number(request.params.id)

      const pgMeta = new PostgresMeta({ connectionString, max: 1 })
      const { data, error } = await pgMeta.schemas.retrieve({ id })
      await pgMeta.end()
      if (error) {
        request.log.error(JSON.stringify({ error, req: request.body }))
        reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.post<{
    Headers: { pg: string }
    Body: PostgresSchemaCreate
  }>(
    '/',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        body: postgresSchemaCreateSchema,
        response: {
          200: postgresSchemaSchema,
          400: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const connectionString = request.headers.pg

      const pgMeta = new PostgresMeta({ connectionString, max: 1 })
      const { data, error } = await pgMeta.schemas.create(request.body)
      await pgMeta.end()
      if (error) {
        request.log.error(JSON.stringify({ error, req: request.body }))
        reply.code(400)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.patch<{
    Headers: { pg: string }
    Params: {
      id: string
    }
    Body: PostgresSchemaUpdate
  }>(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.RegEx(/\d+/),
        }),
        body: postgresSchemaUpdateSchema,
        response: {
          200: postgresSchemaSchema,
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
      const id = Number(request.params.id)

      const pgMeta = new PostgresMeta({ connectionString, max: 1 })
      const { data, error } = await pgMeta.schemas.update(id, request.body)
      await pgMeta.end()
      if (error) {
        request.log.error({ error, req: request.body })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )

  fastify.delete<{
    Headers: { pg: string }
    Params: {
      id: string
    }
    Querystring: {
      cascade?: string
    }
  }>(
    '/:id(\\d+)',
    {
      schema: {
        headers: Type.Object({
          pg: Type.String(),
        }),
        params: Type.Object({
          id: Type.RegEx(/\d+/),
        }),
        querystring: Type.Object({
          cascade: Type.Optional(Type.String()),
        }),
        response: {
          200: postgresSchemaSchema,
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
      const id = Number(request.params.id)
      const cascade = request.query.cascade === 'true'

      const pgMeta = new PostgresMeta({ connectionString, max: 1 })
      const { data, error } = await pgMeta.schemas.remove(id, { cascade })
      await pgMeta.end()
      if (error) {
        request.log.error({ error, req: request.body })
        reply.code(400)
        if (error.message.startsWith('Cannot find')) reply.code(404)
        return { error: error.message }
      }

      return data
    }
  )
}
