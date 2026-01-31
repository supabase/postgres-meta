import type { SQLQueryPropsWithSchemaFilter } from './common.js'

/**
 * Query to build a complete dependency graph of database objects.
 * Returns nodes (objects) and edges (dependencies) for visualization.
 */
export const DEPENDENCY_GRAPH_NODES_SQL = (
  props: SQLQueryPropsWithSchemaFilter & {
    typeFilter?: string // e.g., "IN ('table', 'view', 'function')"
  }
) => /* SQL */ `
WITH all_objects AS (
  -- Tables
  SELECT
    c.oid::bigint AS id,
    c.relname AS name,
    n.nspname AS schema,
    'table' AS type,
    obj_description(c.oid, 'pg_class') AS comment
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'r'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Partitioned tables
  SELECT
    c.oid::bigint AS id,
    c.relname AS name,
    n.nspname AS schema,
    'table' AS type,
    obj_description(c.oid, 'pg_class') AS comment
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'p'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Views
  SELECT
    c.oid::bigint AS id,
    c.relname AS name,
    n.nspname AS schema,
    'view' AS type,
    obj_description(c.oid, 'pg_class') AS comment
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'v'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Materialized views
  SELECT
    c.oid::bigint AS id,
    c.relname AS name,
    n.nspname AS schema,
    'materialized_view' AS type,
    obj_description(c.oid, 'pg_class') AS comment
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'm'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Functions (excluding internal/system)
  SELECT
    p.oid::bigint AS id,
    p.proname AS name,
    n.nspname AS schema,
    'function' AS type,
    obj_description(p.oid, 'pg_proc') AS comment
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND p.prokind IN ('f', 'p') -- functions and procedures
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Triggers
  SELECT
    t.oid::bigint AS id,
    t.tgname AS name,
    n.nspname AS schema,
    'trigger' AS type,
    NULL AS comment
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE NOT t.tgisinternal
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Policies
  SELECT
    pol.oid::bigint AS id,
    pol.polname AS name,
    n.nspname AS schema,
    'policy' AS type,
    NULL AS comment
  FROM pg_policy pol
  JOIN pg_class c ON c.oid = pol.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Indexes
  SELECT
    i.indexrelid::bigint AS id,
    ic.relname AS name,
    n.nspname AS schema,
    'index' AS type,
    obj_description(i.indexrelid, 'pg_class') AS comment
  FROM pg_index i
  JOIN pg_class ic ON ic.oid = i.indexrelid
  JOIN pg_class tc ON tc.oid = i.indrelid
  JOIN pg_namespace n ON n.oid = tc.relnamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Sequences
  SELECT
    c.oid::bigint AS id,
    c.relname AS name,
    n.nspname AS schema,
    'sequence' AS type,
    obj_description(c.oid, 'pg_class') AS comment
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'S'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Custom types (composites, enums, domains)
  SELECT
    t.oid::bigint AS id,
    t.typname AS name,
    n.nspname AS schema,
    'type' AS type,
    obj_description(t.oid, 'pg_type') AS comment
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE t.typtype IN ('c', 'e', 'd') -- composite, enum, domain
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}
)
SELECT * FROM all_objects
${props.typeFilter ? `WHERE type ${props.typeFilter}` : ''}
ORDER BY schema, type, name
`

export const DEPENDENCY_GRAPH_EDGES_SQL = (
  props: SQLQueryPropsWithSchemaFilter
) => /* SQL */ `
WITH edges AS (
  -- Foreign key relationships
  SELECT
    con.conrelid::text || '_' || con.confrelid::text || '_fk_' || con.conname AS id,
    con.conrelid::bigint AS source_id,
    con.confrelid::bigint AS target_id,
    'fk' AS type,
    con.conname AS label
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE con.contype = 'f'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Trigger -> Table relationships
  SELECT
    t.oid::text || '_' || t.tgrelid::text || '_trigger' AS id,
    t.oid::bigint AS source_id,
    t.tgrelid::bigint AS target_id,
    'trigger_table' AS type,
    'ON ' || c.relname AS label
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE NOT t.tgisinternal
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Trigger -> Function relationships
  SELECT
    t.oid::text || '_' || t.tgfoid::text || '_trigger_func' AS id,
    t.oid::bigint AS source_id,
    t.tgfoid::bigint AS target_id,
    'trigger_function' AS type,
    'CALLS' AS label
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_proc p ON p.oid = t.tgfoid
  JOIN pg_namespace pn ON pn.oid = p.pronamespace
  WHERE NOT t.tgisinternal
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND pn.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Policy -> Table relationships
  SELECT
    pol.oid::text || '_' || pol.polrelid::text || '_policy' AS id,
    pol.oid::bigint AS source_id,
    pol.polrelid::bigint AS target_id,
    'policy' AS type,
    'ON ' || c.relname AS label
  FROM pg_policy pol
  JOIN pg_class c ON c.oid = pol.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Index -> Table relationships
  SELECT
    i.indexrelid::text || '_' || i.indrelid::text || '_index' AS id,
    i.indexrelid::bigint AS source_id,
    i.indrelid::bigint AS target_id,
    'index' AS type,
    'ON ' || tc.relname AS label
  FROM pg_index i
  JOIN pg_class ic ON ic.oid = i.indexrelid
  JOIN pg_class tc ON tc.oid = i.indrelid
  JOIN pg_namespace n ON n.oid = tc.relnamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- View dependencies (view -> table/view it depends on)
  SELECT DISTINCT
    d.objid::text || '_' || d.refobjid::text || '_view_dep' AS id,
    d.objid::bigint AS source_id,
    d.refobjid::bigint AS target_id,
    'view_dependency' AS type,
    'DEPENDS ON' AS label
  FROM pg_depend d
  JOIN pg_class c ON c.oid = d.objid
  JOIN pg_class rc ON rc.oid = d.refobjid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_namespace rn ON rn.oid = rc.relnamespace
  WHERE d.deptype IN ('n', 'a')
    AND c.relkind IN ('v', 'm') -- view or materialized view
    AND rc.relkind IN ('r', 'v', 'm', 'p') -- table, view, matview, partitioned
    AND c.oid != rc.oid -- exclude self-references
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND rn.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Function dependencies on tables (function uses table)
  SELECT DISTINCT
    d.objid::text || '_' || d.refobjid::text || '_func_table' AS id,
    d.objid::bigint AS source_id,
    d.refobjid::bigint AS target_id,
    'function_table' AS type,
    'USES' AS label
  FROM pg_depend d
  JOIN pg_proc p ON p.oid = d.objid
  JOIN pg_class rc ON rc.oid = d.refobjid
  JOIN pg_namespace n ON n.oid = p.pronamespace
  JOIN pg_namespace rn ON rn.oid = rc.relnamespace
  WHERE d.deptype IN ('n', 'a')
    AND rc.relkind IN ('r', 'v', 'm', 'p')
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND rn.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}

  UNION ALL

  -- Sequence ownership (sequence -> table)
  SELECT
    seq.oid::text || '_' || d.refobjid::text || '_seq_owned' AS id,
    seq.oid::bigint AS source_id,
    d.refobjid::bigint AS target_id,
    'sequence_owned' AS type,
    'OWNED BY' AS label
  FROM pg_class seq
  JOIN pg_depend d ON d.objid = seq.oid
  JOIN pg_class tc ON tc.oid = d.refobjid
  JOIN pg_namespace n ON n.oid = seq.relnamespace
  WHERE seq.relkind = 'S'
    AND d.deptype = 'a'
    AND tc.relkind IN ('r', 'p')
    AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ${props.schemaFilter ? `AND n.nspname ${props.schemaFilter}` : ''}
)
SELECT * FROM edges
`
