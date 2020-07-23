SELECT
  c.oid AS id,
  table_catalog AS catalog,
  table_schema AS schema,
  table_name AS name,
  is_insertable_into,
  relrowsecurity::bool as rls_enabled, 
  relforcerowsecurity as rls_forced,
  is_typed,
  pg_total_relation_size(format('%I.%I', table_schema, table_name))::bigint AS bytes,
  pg_size_pretty(
    pg_total_relation_size(format('%I.%I', table_schema, table_name))
  ) AS size,
  seq_scan :: bigint AS seq_scan_count,
  seq_tup_read :: bigint AS seq_row_read_count,
  idx_scan :: bigint AS idx_scan_count,
  idx_tup_fetch :: bigint AS idx_row_read_count,
  n_tup_ins :: bigint AS row_ins_count,
  n_tup_upd :: bigint AS row_upd_count,
  n_tup_del :: bigint AS row_del_count,
  n_tup_hot_upd :: bigint AS row_hot_upd_count,
  n_live_tup :: bigint AS live_row_count,
  n_dead_tup :: bigint AS dead_row_count,
  n_mod_since_analyze :: bigint AS rows_mod_since_analyze,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze,
  vacuum_count :: bigint,
  autovacuum_count :: bigint,
  analyze_count :: bigint,
  autoanalyze_count :: bigint,
  obj_description(c.oid) AS comment
FROM
  information_schema.tables
  JOIN pg_class c ON quote_ident(table_schema)::regnamespace = c.relnamespace
  AND c.relname = table_name
  LEFT JOIN pg_stat_user_tables ON pg_stat_user_tables.schemaname = tables.table_schema
  AND pg_stat_user_tables.relname = tables.table_name
WHERE
  table_type = 'BASE TABLE'
