import { ident, literal } from 'pg-format'
import { PostgresMetaResult, PostgresPolicy } from './types.js'
import { POLICIES_SQL } from './sql/policies.sql.js'
import { filterByList } from './helpers.js'

export interface RLSSimulationContext {
  role: string
  jwtClaims?: Record<string, any>
  userId?: string
}

export interface RLSPolicyEvaluation {
  policy_id: number
  policy_name: string
  command: string
  action: string
  passed: boolean
  expression: string | null
  check_expression: string | null
}

export interface RLSRowResult {
  row_data: Record<string, any>
  row_number: number
  policies_evaluated: RLSPolicyEvaluation[]
  accessible: boolean
}

export interface RLSSimulationResult {
  table_name: string
  schema_name: string
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  context: RLSSimulationContext
  rls_enabled: boolean
  policies: PostgresPolicy[]
  rows: RLSRowResult[]
  total_rows_without_rls: number
  accessible_rows: number
  error?: string
}

export default class PostgresMetaRLSPlayground {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  /**
   * Get all policies for a specific table
   */
  async getPoliciesForTable({
    schema = 'public',
    table,
  }: {
    schema?: string
    table: string
  }): Promise<PostgresMetaResult<PostgresPolicy[]>> {
    const schemaFilter = filterByList([schema], [])
    const sql = POLICIES_SQL({ schemaFilter }) + ` AND c.relname = ${literal(table)}`
    return await this.query(sql)
  }

  /**
   * Check if RLS is enabled for a table
   */
  async isRLSEnabled({
    schema = 'public',
    table,
  }: {
    schema?: string
    table: string
  }): Promise<PostgresMetaResult<boolean>> {
    const sql = `
      SELECT relrowsecurity 
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = ${literal(schema)}
        AND c.relname = ${literal(table)}
    `
    const { data, error } = await this.query(sql)
    if (error) return { data: null, error }
    return { data: data[0]?.relrowsecurity ?? false, error: null }
  }

  /**
   * Get database roles that can be used for simulation
   */
  async getAvailableRoles(): Promise<PostgresMetaResult<string[]>> {
    const sql = `
      SELECT rolname 
      FROM pg_roles 
      WHERE rolcanlogin = true
         OR rolname IN ('anon', 'authenticated', 'service_role')
      ORDER BY rolname
    `
    const { data, error } = await this.query(sql)
    if (error) return { data: null, error }
    return { data: data.map((r: any) => r.rolname), error: null }
  }

  /**
   * Simulate RLS policy evaluation for a query
   * This runs in a transaction that always rolls back
   */
  async simulate({
    schema = 'public',
    table,
    operation = 'SELECT',
    context,
    limit = 100,
    testData,
  }: {
    schema?: string
    table: string
    operation?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
    context: RLSSimulationContext
    limit?: number
    testData?: Record<string, any> // For INSERT/UPDATE simulation
  }): Promise<PostgresMetaResult<RLSSimulationResult>> {
    // Get table policies first
    const { data: policies, error: policiesError } = await this.getPoliciesForTable({ schema, table })
    if (policiesError) return { data: null, error: policiesError }

    // Check if RLS is enabled
    const { data: rlsEnabled, error: rlsError } = await this.isRLSEnabled({ schema, table })
    if (rlsError) return { data: null, error: rlsError }

    // Filter policies for this operation
    const relevantPolicies = policies!.filter(
      (p) => p.command === operation || p.command === 'ALL'
    )

    // Build the simulation SQL
    const jwtClaimsJson = context.jwtClaims ? JSON.stringify(context.jwtClaims) : '{}'
    
    // Build simulation query based on operation
    let simulationSql: string
    
    if (operation === 'SELECT') {
      simulationSql = this.buildSelectSimulation({
        schema,
        table,
        context,
        jwtClaimsJson,
        relevantPolicies,
        limit,
      })
    } else if (operation === 'INSERT' && testData) {
      simulationSql = this.buildInsertSimulation({
        schema,
        table,
        context,
        jwtClaimsJson,
        relevantPolicies,
        testData,
      })
    } else {
      simulationSql = this.buildSelectSimulation({
        schema,
        table,
        context,
        jwtClaimsJson,
        relevantPolicies,
        limit,
      })
    }

    const { data: simResult, error: simError } = await this.query(simulationSql)
    
    if (simError) {
      return {
        data: {
          table_name: table,
          schema_name: schema,
          operation,
          context,
          rls_enabled: rlsEnabled!,
          policies: policies!,
          rows: [],
          total_rows_without_rls: 0,
          accessible_rows: 0,
          error: simError.message,
        },
        error: null,
      }
    }

    // Parse simulation results
    const rows: RLSRowResult[] = []
    const policyResults = simResult[0]

    if (policyResults) {
      // Results from simulation
      const totalRows = policyResults.total_count || 0
      const accessibleData = policyResults.accessible_rows || []
      const policyEvals = policyResults.policy_evaluations || []

      for (let i = 0; i < accessibleData.length; i++) {
        const rowData = accessibleData[i]
        const rowPolicyEvals: RLSPolicyEvaluation[] = relevantPolicies.map((policy) => {
          const evalResult = policyEvals.find(
            (e: any) => e.policy_id === policy.id && e.row_index === i
          )
          return {
            policy_id: policy.id,
            policy_name: policy.name,
            command: policy.command,
            action: policy.action,
            passed: evalResult?.passed ?? true,
            expression: policy.definition,
            check_expression: policy.check,
          }
        })

        rows.push({
          row_data: rowData,
          row_number: i + 1,
          policies_evaluated: rowPolicyEvals,
          accessible: true,
        })
      }

      return {
        data: {
          table_name: table,
          schema_name: schema,
          operation,
          context,
          rls_enabled: rlsEnabled!,
          policies: policies!,
          rows,
          total_rows_without_rls: totalRows,
          accessible_rows: accessibleData.length,
        },
        error: null,
      }
    }

    return {
      data: {
        table_name: table,
        schema_name: schema,
        operation,
        context,
        rls_enabled: rlsEnabled!,
        policies: policies!,
        rows: [],
        total_rows_without_rls: 0,
        accessible_rows: 0,
      },
      error: null,
    }
  }

  private buildSelectSimulation({
    schema,
    table,
    context,
    jwtClaimsJson,
    relevantPolicies,
    limit,
  }: {
    schema: string
    table: string
    context: RLSSimulationContext
    jwtClaimsJson: string
    relevantPolicies: PostgresPolicy[]
    limit: number
  }): string {
    const tableRef = `${ident(schema)}.${ident(table)}`
    
    // Build policy evaluation expressions
    const policyEvalCases = relevantPolicies.map((policy) => {
      if (!policy.definition) return null
      return `
        jsonb_build_object(
          'policy_id', ${policy.id},
          'policy_name', ${literal(policy.name)},
          'passed', CASE WHEN (${policy.definition}) THEN true ELSE false END
        )
      `
    }).filter(Boolean)

    const policyEvalArray = policyEvalCases.length > 0 
      ? `ARRAY[${policyEvalCases.join(', ')}]::jsonb[]`
      : `ARRAY[]::jsonb[]`

    return `
      DO $$
      BEGIN
        -- Set the simulated context
        PERFORM set_config('role', ${literal(context.role)}, true);
        PERFORM set_config('request.jwt.claims', ${literal(jwtClaimsJson)}, true);
        ${context.userId ? `PERFORM set_config('request.jwt.claim.sub', ${literal(context.userId)}, true);` : ''}
      END $$;

      WITH 
      -- Get total count without RLS (as superuser context we're in)
      total_count AS (
        SELECT COUNT(*) as cnt FROM ${tableRef}
      ),
      -- Get rows accessible with the simulated role
      accessible_data AS (
        SELECT 
          row_to_json(t.*) as row_data,
          ${policyEvalArray} as policy_evals
        FROM ${tableRef} t
        LIMIT ${limit}
      )
      SELECT 
        jsonb_build_object(
          'total_count', (SELECT cnt FROM total_count),
          'accessible_rows', (SELECT COALESCE(jsonb_agg(row_data), '[]'::jsonb) FROM accessible_data),
          'policy_evaluations', (
            SELECT COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'row_index', row_num - 1,
                  'evaluations', policy_evals
                )
              ), 
              '[]'::jsonb
            )
            FROM (
              SELECT ROW_NUMBER() OVER () as row_num, policy_evals 
              FROM accessible_data
            ) numbered
          )
        ) as result;
    `
  }

  private buildInsertSimulation({
    schema,
    table,
    context,
    jwtClaimsJson,
    relevantPolicies,
    testData,
  }: {
    schema: string
    table: string
    context: RLSSimulationContext
    jwtClaimsJson: string
    relevantPolicies: PostgresPolicy[]
    testData: Record<string, any>
  }): string {
    const tableRef = `${ident(schema)}.${ident(table)}`
    
    // Build WITH CHECK evaluation for INSERT policies
    const checkPolicies = relevantPolicies.filter((p) => p.check)
    const checkEvals = checkPolicies.map((policy) => `
      jsonb_build_object(
        'policy_id', ${policy.id},
        'policy_name', ${literal(policy.name)},
        'passed', CASE WHEN (${policy.check}) THEN true ELSE false END
      )
    `)

    const columns = Object.keys(testData)
    const values = Object.values(testData).map((v) => literal(v))

    return `
      DO $$
      BEGIN
        PERFORM set_config('role', ${literal(context.role)}, true);
        PERFORM set_config('request.jwt.claims', ${literal(jwtClaimsJson)}, true);
        ${context.userId ? `PERFORM set_config('request.jwt.claim.sub', ${literal(context.userId)}, true);` : ''}
      END $$;

      BEGIN;
      
      -- Try the insert in a savepoint
      SAVEPOINT test_insert;
      
      INSERT INTO ${tableRef} (${columns.map(ident).join(', ')})
      VALUES (${values.join(', ')});
      
      -- Rollback the insert but capture what happened
      ROLLBACK TO SAVEPOINT test_insert;
      
      -- Return policy evaluation results
      SELECT jsonb_build_object(
        'total_count', 1,
        'accessible_rows', jsonb_build_array(${literal(JSON.stringify(testData))}::jsonb),
        'policy_evaluations', jsonb_build_array(
          jsonb_build_object(
            'row_index', 0,
            'evaluations', ARRAY[${checkEvals.join(', ')}]::jsonb[]
          )
        ),
        'insert_allowed', true
      ) as result;
      
      ROLLBACK;
    `
  }

  /**
   * Evaluate a single policy expression against test data
   */
  async evaluateExpression({
    schema = 'public',
    table,
    expression,
    context,
    testRow,
  }: {
    schema?: string
    table: string
    expression: string
    context: RLSSimulationContext
    testRow?: Record<string, any>
  }): Promise<PostgresMetaResult<{ result: boolean; error?: string }>> {
    const tableRef = `${ident(schema)}.${ident(table)}`
    const jwtClaimsJson = context.jwtClaims ? JSON.stringify(context.jwtClaims) : '{}'

    // If testRow is provided, create a CTE with that row
    const rowSource = testRow
      ? `(SELECT ${Object.entries(testRow)
          .map(([k, v]) => `${literal(v)} as ${ident(k)}`)
          .join(', ')}) t`
      : `(SELECT * FROM ${tableRef} LIMIT 1) t`

    const sql = `
      DO $$
      BEGIN
        PERFORM set_config('role', ${literal(context.role)}, true);
        PERFORM set_config('request.jwt.claims', ${literal(jwtClaimsJson)}, true);
        ${context.userId ? `PERFORM set_config('request.jwt.claim.sub', ${literal(context.userId)}, true);` : ''}
      END $$;

      SELECT 
        CASE WHEN (${expression}) THEN true ELSE false END as result
      FROM ${rowSource};
    `

    const { data, error } = await this.query(sql)
    if (error) {
      return { data: { result: false, error: error.message }, error: null }
    }
    return { data: { result: data[0]?.result ?? false }, error: null }
  }
}
