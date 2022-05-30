import { FastifyInstance } from 'fastify'
import ejs from 'ejs'
import { PostgresMeta } from '../../../lib'
import template from '../../../lib/templates/typescript'
import { DEFAULT_POOL_CONFIG } from '../../constants'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const responseFormat = request.headers.responseFormat || 'text/plain'

    const pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })

    const { data: tables } = await pgMeta.tables.list({})
    const { data: functions } = await pgMeta.functions.list({})
    const definition = ejs.render(template, { tables, functions })

    return reply.header('content-type', responseFormat).send(definition)
  })
}
