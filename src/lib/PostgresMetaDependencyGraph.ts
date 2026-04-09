import { filterByList } from './helpers.js'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants.js'
import type { PostgresMetaResult, DependencyGraphNode, DependencyGraphEdge } from './types.js'
import {
  DEPENDENCY_GRAPH_NODES_SQL,
  DEPENDENCY_GRAPH_EDGES_SQL,
} from './sql/dependency_graph.sql.js'

/**
 * Options for querying the dependency graph
 */
export interface DependencyGraphOptions {
  /** Include system schemas (pg_catalog, information_schema, etc.) */
  includeSystemSchemas?: boolean
  /** Only include objects from these schemas */
  includedSchemas?: string[]
  /** Exclude objects from these schemas */
  excludedSchemas?: string[]
  /** Only include these object types (table, view, function, etc.) */
  includedTypes?: string[]
}

/**
 * Result containing nodes (database objects) and edges (dependencies)
 */
export interface DependencyGraphResult {
  nodes: DependencyGraphNode[]
  edges: DependencyGraphEdge[]
}

/**
 * Queries PostgreSQL system catalogs to build a dependency graph of database objects.
 * Supports tables, views, functions, triggers, policies, indexes, sequences, and custom types.
 */
export default class PostgresMetaDependencyGraph {
  query: (sql: string) => Promise<PostgresMetaResult<unknown>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<unknown>>) {
    this.query = query
  }

  async get({
    includeSystemSchemas = false,
    includedSchemas,
    excludedSchemas,
    includedTypes,
  }: DependencyGraphOptions = {}): Promise<PostgresMetaResult<DependencyGraphResult>> {
    const schemaFilter = filterByList(
      includedSchemas,
      excludedSchemas,
      !includeSystemSchemas ? DEFAULT_SYSTEM_SCHEMAS : undefined
    )

    // Build type filter if specified
    let typeFilter: string | undefined
    if (includedTypes && includedTypes.length > 0) {
      const typeList = includedTypes.map((t) => `'${t}'`).join(', ')
      typeFilter = `IN (${typeList})`
    }

    // Fetch nodes
    const nodesSql = DEPENDENCY_GRAPH_NODES_SQL({ schemaFilter, typeFilter })
    const nodesResult = (await this.query(nodesSql)) as PostgresMetaResult<DependencyGraphNode[]>
    if (nodesResult.error) {
      return { data: null, error: nodesResult.error }
    }

    // Fetch edges
    const edgesSql = DEPENDENCY_GRAPH_EDGES_SQL({ schemaFilter })
    const edgesResult = (await this.query(edgesSql)) as PostgresMetaResult<
      { id: string; source_id: number; target_id: number; type: string; label: string }[]
    >
    if (edgesResult.error) {
      return { data: null, error: edgesResult.error }
    }

    // Create a set of valid node IDs for filtering edges
    const nodeIds = new Set(nodesResult.data.map((n) => n.id))

    // Transform edges to use node IDs and filter out edges with missing nodes
    const edges: DependencyGraphEdge[] = edgesResult.data
      .filter((e) => nodeIds.has(e.source_id) && nodeIds.has(e.target_id))
      .map((e) => ({
        id: e.id,
        source: e.source_id,
        target: e.target_id,
        type: e.type as DependencyGraphEdge['type'],
        label: e.label,
      }))

    return {
      data: {
        nodes: nodesResult.data,
        edges,
      },
      error: null,
    }
  }
}
