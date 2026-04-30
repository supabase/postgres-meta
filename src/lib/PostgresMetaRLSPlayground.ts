import { ident, literal } from 'pg-format'
import { PostgresMetaResult, PostgresPolicy } from './types.js'
import { POLICIES_SQL } from './sql/policies.sql.js'
import { filterByList } from './helpers.js'

/**
 * Validate that an expression is safe for RLS policy evaluation.
 * Rejects expressions containing dangerous SQL patterns.
 */
function validateRLSExpression(expression: string): { valid: boolean; error?: string } {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: 'Expression must be a non-empty string' }
  }

  // Normalize for checking (case-insensitive)
  const normalized = expression.toUpperCase().replace(/\s+/g, ' ')

  // List of dangerous patterns that should never appear in RLS policy expressions
  const dangerousPatterns = [
    // DDL statements
    /\b(CREATE|DROP|ALTER|TRUNCATE|RENAME)\b/i,
    // DML that modifies data
    /\b(INSERT|UPDATE|DELETE)\b/i,
    // Transaction control
    /\b(COMMIT|ROLLBACK|SAVEPOINT|BEGIN)\b/i,
    // Security-sensitive commands
    /\b(GRANT|REVOKE|SET\s+ROLE|RESET\s+ROLE|SET\s+SESSION)\b/i,
    // Dangerous functions
    /\b(pg_read_file|pg_read_binary_file|pg_write_file|pg_terminate_backend|pg_cancel_backend)\s*\(/i,
    /\b(lo_import|lo_export|lo_unlink)\s*\(/i,
    /\b(pg_execute_server_program|pg_file_write|copy)\s*\(/i,
    // System info functions that could leak data
    /\b(pg_ls_dir|pg_stat_file)\s*\(/i,
    // Extension manipulation
    /\b(CREATE\s+EXTENSION|DROP\s+EXTENSION)\b/i,
    // COPY command
    /\bCOPY\b/i,
    // DO blocks (arbitrary code execution)
    /\bDO\s*\$/i,
    // EXECUTE for dynamic SQL
    /\bEXECUTE\b/i,
    // Comment injection attempts  
    /--/,
    /\/\*/,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(expression)) {
      return { valid: false, error: `Expression contains forbidden SQL pattern: ${pattern.source}` }
    }
  }

  // Check for semicolons (statement separators) which could indicate SQL injection
  if (expression.includes(';')) {
    return { valid: false, error: 'Expression must not contain semicolons' }
  }

  return { valid: true }
}

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
    // Sanitize limit to ensure it's a positive integer
    const safeLimit = Math.max(1, Math.min(Math.floor(Number(limit) || 100), 10000))
    
    // Build policy evaluation expressions
    // Policy definitions come from pg_policy table (database-stored policies)
    // We validate them to ensure they don't contain dangerous patterns
    const policyEvalCases = relevantPolicies.map((policy) => {
      if (!policy.definition) return null
      // Validate policy expression (policies from DB should be safe, but defense in depth)
      const validation = validateRLSExpression(policy.definition)
      if (!validation.valid) {
        // Return a safe fallback that indicates validation failure
        return `
          jsonb_build_object(
            'policy_id', ${literal(policy.id)},
            'policy_name', ${literal(policy.name)},
            'passed', false,
            'error', ${literal(`Policy expression validation failed: ${validation.error}`)}
          )
        `
      }
      return `
        jsonb_build_object(
          'policy_id', ${literal(policy.id)},
          'policy_name', ${literal(policy.name)},
          'passed', CASE WHEN (${policy.definition}) THEN true ELSE false END
        )
      `
    }).filter(Boolean)

    const policyEvalArray = policyEvalCases.length > 0 
      ? `ARRAY[${policyEvalCases.join(', ')}]::jsonb[]`
      : `ARRAY[]::jsonb[]`

    // Execute in a read-only transaction that always rolls back
    return `
      BEGIN TRANSACTION READ ONLY;
      
      -- Set the simulated context
      SET LOCAL role = ${literal(context.role)};
      SET LOCAL "request.jwt.claims" = ${literal(jwtClaimsJson)};
      ${context.userId ? `SET LOCAL "request.jwt.claim.sub" = ${literal(context.userId)};` : ''}

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
        LIMIT ${safeLimit}
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
      
      ROLLBACK;
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
    // Validate policy check expressions (defense in depth)
    const checkPolicies = relevantPolicies.filter((p) => p.check)
    const checkEvals = checkPolicies.map((policy) => {
      const validation = validateRLSExpression(policy.check!)
      if (!validation.valid) {
        return `
          jsonb_build_object(
            'policy_id', ${literal(policy.id)},
            'policy_name', ${literal(policy.name)},
            'passed', false,
            'error', ${literal(`Policy check validation failed: ${validation.error}`)}
          )
        `
      }
      return `
        jsonb_build_object(
          'policy_id', ${literal(policy.id)},
          'policy_name', ${literal(policy.name)},
          'passed', CASE WHEN (${policy.check}) THEN true ELSE false END
        )
      `
    })

    const columns = Object.keys(testData)
    const values = Object.values(testData).map((v) => literal(v))

    // Escape testData for safe JSON embedding
    const safeTestDataJson = literal(JSON.stringify(testData))

    return `
      BEGIN;
      
      -- Set the simulated context
      SET LOCAL role = ${literal(context.role)};
      SET LOCAL "request.jwt.claims" = ${literal(jwtClaimsJson)};
      ${context.userId ? `SET LOCAL "request.jwt.claim.sub" = ${literal(context.userId)};` : ''}
      
      -- Try the insert in a savepoint
      SAVEPOINT test_insert;
      
      INSERT INTO ${tableRef} (${columns.map(ident).join(', ')})
      VALUES (${values.join(', ')});
      
      -- Rollback the insert but capture what happened
      ROLLBACK TO SAVEPOINT test_insert;
      
      -- Return policy evaluation results
      SELECT jsonb_build_object(
        'total_count', 1,
        'accessible_rows', jsonb_build_array(${safeTestDataJson}::jsonb),
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
   * Evaluate a single policy expression against test data.
   * The expression is validated to prevent SQL injection.
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
    // Validate the expression to prevent SQL injection
    const validation = validateRLSExpression(expression)
    if (!validation.valid) {
      return { 
        data: { result: false, error: validation.error }, 
        error: null 
      }
    }

    const tableRef = `${ident(schema)}.${ident(table)}`
    const jwtClaimsJson = context.jwtClaims ? JSON.stringify(context.jwtClaims) : '{}'

    // If testRow is provided, create a CTE with that row
    const rowSource = testRow
      ? `(SELECT ${Object.entries(testRow)
          .map(([k, v]) => `${literal(v)} as ${ident(k)}`)
          .join(', ')}) t`
      : `(SELECT * FROM ${tableRef} LIMIT 1) t`

    // Execute in a read-only transaction that always rolls back
    const sql = `
      BEGIN TRANSACTION READ ONLY;
      
      SET LOCAL role = ${literal(context.role)};
      SET LOCAL "request.jwt.claims" = ${literal(jwtClaimsJson)};
      ${context.userId ? `SET LOCAL "request.jwt.claim.sub" = ${literal(context.userId)};` : ''}

      SELECT 
        CASE WHEN (${expression}) THEN true ELSE false END as result
      FROM ${rowSource};
      
      ROLLBACK;
    `

    const { data, error } = await this.query(sql)
    if (error) {
      return { data: { result: false, error: error.message }, error: null }
    }
    return { data: { result: data[0]?.result ?? false }, error: null }
  }
}
