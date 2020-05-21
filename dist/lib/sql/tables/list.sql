-- Table 27.14 https://www.postgresql.org/docs/current/monitoring-stats.html

select
  (table_schema || '.' || table_name) as identifier,
  table_catalog,
  table_schema,
  table_name,
  table_type,
  self_referencing_column_name,
  reference_generation,
  user_defined_type_catalog,
  user_defined_type_schema,
  user_defined_type_name,
  is_insertable_into,
  is_typed,
  commit_action,
  pg_total_relation_size(table_schema || '.' || table_name)::bigint as bytes,
  pg_size_pretty(pg_total_relation_size(table_schema || '.' || table_name)) as size,
  seq_scan::bigint,
  seq_tup_read::bigint,
  idx_scan::bigint,
  idx_tup_fetch::bigint,
  n_tup_ins::bigint,
  n_tup_upd::bigint,
  n_tup_del::bigint,
  n_tup_hot_upd::bigint,
  n_live_tup::bigint,
  n_dead_tup::bigint,
  n_mod_since_analyze::bigint,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze,
  vacuum_count::bigint,
  autovacuum_count::bigint,
  analyze_count::bigint,
  autoanalyze_count::bigint
from
  information_schema.tables inner join 
  pg_stat_user_tables on pg_stat_user_tables.schemaname = tables.table_schema and pg_stat_user_tables.relname = tables.table_name
where
  table_type = 'BASE TABLE' AND table_schema not IN ('pg_catalog', 'information_schema', 'pg_toast')
order by table_name, table_schema;