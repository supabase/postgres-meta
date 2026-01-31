import { FastifyInstance } from 'fastify'
import { PostgresMeta } from '../../lib/index.js'
import PostgresMetaRLSPlayground, {
  RLSSimulationContext,
  RLSSimulationResult,
} from '../../lib/PostgresMetaRLSPlayground.js'
import { createConnectionConfig } from '../utils.js'
import { extractRequestForLogging } from '../utils.js'

export default async (fastify: FastifyInstance) => {
  /**
   * GET /rls-playground/roles
   * Get available roles for simulation
   */
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
  }>('/roles', async (request, reply) => {
    const config = createConnectionConfig(request)
    const pgMeta = new PostgresMeta(config)
    const rlsPlayground = new PostgresMetaRLSPlayground(pgMeta.query)

    const { data, error } = await rlsPlayground.getAvailableRoles()
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  /**
   * GET /rls-playground/policies/:schema/:table
   * Get policies for a specific table
   */
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Params: {
      schema: string
      table: string
    }
  }>('/policies/:schema/:table', async (request, reply) => {
    const config = createConnectionConfig(request)
    const { schema, table } = request.params

    const pgMeta = new PostgresMeta(config)
    const rlsPlayground = new PostgresMetaRLSPlayground(pgMeta.query)

    const { data, error } = await rlsPlayground.getPoliciesForTable({ schema, table })
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  /**
   * GET /rls-playground/rls-status/:schema/:table
   * Check if RLS is enabled for a table
   */
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Params: {
      schema: string
      table: string
    }
  }>('/rls-status/:schema/:table', async (request, reply) => {
    const config = createConnectionConfig(request)
    const { schema, table } = request.params

    const pgMeta = new PostgresMeta(config)
    const rlsPlayground = new PostgresMetaRLSPlayground(pgMeta.query)

    const { data, error } = await rlsPlayground.isRLSEnabled({ schema, table })
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return { rls_enabled: data }
  })

  /**
   * POST /rls-playground/simulate
   * Simulate RLS policy evaluation
   */
  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      schema?: string
      table: string
      operation?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
      context: RLSSimulationContext
      limit?: number
      testData?: Record<string, any>
    }
  }>('/simulate', async (request, reply) => {
    const config = createConnectionConfig(request)
    const { schema, table, operation, context, limit, testData } = request.body

    if (!table) {
      reply.code(400)
      return { error: 'table is required' }
    }

    if (!context || !context.role) {
      reply.code(400)
      return { error: 'context.role is required' }
    }

    const pgMeta = new PostgresMeta(config)
    const rlsPlayground = new PostgresMetaRLSPlayground(pgMeta.query)

    const { data, error } = await rlsPlayground.simulate({
      schema: schema || 'public',
      table,
      operation: operation || 'SELECT',
      context,
      limit: limit || 100,
      testData,
    })
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  /**
   * POST /rls-playground/evaluate-expression
   * Evaluate a single policy expression
   */
  fastify.post<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Body: {
      schema?: string
      table: string
      expression: string
      context: RLSSimulationContext
      testRow?: Record<string, any>
    }
  }>('/evaluate-expression', async (request, reply) => {
    const config = createConnectionConfig(request)
    const { schema, table, expression, context, testRow } = request.body

    if (!table || !expression || !context) {
      reply.code(400)
      return { error: 'table, expression, and context are required' }
    }

    const pgMeta = new PostgresMeta(config)
    const rlsPlayground = new PostgresMetaRLSPlayground(pgMeta.query)

    const { data, error } = await rlsPlayground.evaluateExpression({
      schema: schema || 'public',
      table,
      expression,
      context,
      testRow,
    })
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })

  /**
   * GET /rls-playground/tables
   * Get tables with their RLS status
   */
  fastify.get<{
    Headers: { pg: string; 'x-pg-application-name'?: string }
    Querystring: {
      schema?: string
    }
  }>('/tables', async (request, reply) => {
    const config = createConnectionConfig(request)
    const schema = request.query.schema || 'public'

    const pgMeta = new PostgresMeta(config)
    
    // Use parameterized query to prevent SQL injection
    const { literal } = await import('pg-format')
    const sql = `
      SELECT 
        c.oid::int8 as id,
        n.nspname as schema,
        c.relname as name,
        c.relrowsecurity as rls_enabled,
        c.relforcerowsecurity as rls_forced,
        (
          SELECT COUNT(*)::int 
          FROM pg_policy pol 
          WHERE pol.polrelid = c.oid
        ) as policy_count
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r'
        AND n.nspname = ${literal(schema)}
        AND n.nspname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY c.relname
    `

    const { data, error } = await pgMeta.query(sql)
    await pgMeta.end()

    if (error) {
      request.log.error({ error, request: extractRequestForLogging(request) })
      reply.code(500)
      return { error: error.message }
    }

    return data
  })
}
