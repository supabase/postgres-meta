import type { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../../lib/index.js'
import { DEFAULT_POOL_CONFIG } from '../../constants.js'
import { extractRequestForLogging } from '../../utils.js'
import { apply as applyTypescriptTemplate } from '../../templates/typescript.js'

export default async (fastify: FastifyInstance) => {
  fastify.get<{
    Headers: { pg: string }
    Querystring: {
      excluded_schemas?: string
      included_schemas?: string
      detect_one_to_one_relationships?: string
    }
  }>('/', async (request, reply) => {
    const connectionString = request.headers.pg
    const excludedSchemas =
      request.query.excluded_schemas?.split(',').map((schema) => schema.trim()) ?? []
    const includedSchemas =
      request.query.included_schemas?.split(',').map((schema) => schema.trim()) ?? []
    const detectOneToOneRelationships = request.query.detect_one_to_one_relationships === 'true'

    const pgMeta: PostgresMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    const { data: schemas, error: schemasError } = await pgMeta.schemas.list()
    const { data: tables, error: tablesError } = await pgMeta.tables.list({
      includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
      excludedSchemas,
      includeColumns: false,
    })
    const { data: views, error: viewsError } = await pgMeta.views.list({
      includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
      excludedSchemas,
      includeColumns: false,
    })
    const { data: materializedViews, error: materializedViewsError } =
      await pgMeta.materializedViews.list({
        includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
        excludedSchemas,
        includeColumns: false,
      })
    const { data: columns, error: columnsError } = await pgMeta.columns.list({
      includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
      excludedSchemas,
    })
    const { data: relationships, error: relationshipsError } = await pgMeta.relationships.list()
    const { data: functions, error: functionsError } = await pgMeta.functions.list({
      includedSchemas: includedSchemas.length > 0 ? includedSchemas : undefined,
      excludedSchemas,
    })
    const { data: types, error: typesError } = await pgMeta.types.list({
      includeArrayTypes: true,
      includeSystemSchemas: true,
    })
    await pgMeta.end()

    if (schemasError) {
      request.log.error({ error: schemasError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: schemasError.message }
    }
    if (tablesError) {
      request.log.error({ error: tablesError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: tablesError.message }
    }
    if (viewsError) {
      request.log.error({ error: viewsError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: viewsError.message }
    }
    if (materializedViewsError) {
      request.log.error({
        error: materializedViewsError,
        request: extractRequestForLogging(request),
      })
      reply.code(500)
      return { error: materializedViewsError.message }
    }
    if (columnsError) {
      request.log.error({ error: columnsError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: columnsError.message }
    }
    if (relationshipsError) {
      request.log.error({ error: relationshipsError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: relationshipsError.message }
    }
    if (functionsError) {
      request.log.error({ error: functionsError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: functionsError.message }
    }
    if (typesError) {
      request.log.error({ error: typesError, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: typesError.message }
    }

    return applyTypescriptTemplate({
      schemas: schemas.filter(
        ({ name }) =>
          !excludedSchemas.includes(name) &&
          (includedSchemas.length === 0 || includedSchemas.includes(name))
      ),
      tables,
      views,
      materializedViews,
      columns,
      relationships,
      functions: functions.filter(
        ({ return_type }) => !['trigger', 'event_trigger'].includes(return_type)
      ),
      types: types.filter(({ name }) => name[0] !== '_'),
      arrayTypes: types.filter(({ name }) => name[0] === '_'),
      detectOneToOneRelationships,
    })
  })
}
