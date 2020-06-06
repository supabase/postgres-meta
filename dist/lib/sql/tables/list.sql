WITH 
tables as (
	select
	  (table_schema || '.' || table_name) as table_id,
    table_catalog as catalog,
    table_schema as schema,
    table_name as name,
    is_insertable_into,
    is_typed,
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
	  information_schema.tables left join 
  	  pg_stat_user_tables on pg_stat_user_tables.schemaname = tables.table_schema and pg_stat_user_tables.relname = tables.table_name
	where
	  table_type = 'BASE TABLE'
),
columns AS (
  select
    table_schema as schema,
    column_name as name,
    column_default as default_value,
    is_nullable::boolean,
    is_nullable :: boolean,
    data_type,
    is_identity,
    identity_generation,
    is_updatable,
    udt_name as format,
    table_name,
    col_description(
      (table_schema || '."' || table_name || '"') :: regclass,
      ordinal_position
    ) as description,
    (table_schema || '.' || table_name) as table_id
  from
    information_schema.columns
),
grants as (
  SELECT
    (table_schema || '.' || table_name) as table_id,
    grantor,
    grantee,
    table_catalog as catalog,
    table_schema as schema,
    table_name,
    privilege_type,
    is_grantable,
    with_hierarchy
  FROM
    information_schema.role_table_grants
)
SELECT 
  *,
  COALESCE(
    (
      SELECT
          array_to_json(array_agg(row_to_json(columns)))
      FROM
        (
          SELECT
              *
          FROM
              columns
          WHERE
              columns.table_id = tables.table_id
        ) columns
    ),
    '[]'
  ) AS columns, 
  COALESCE(
    (
      SELECT
          array_to_json(array_agg(row_to_json(grants)))
      FROM
        (
          SELECT
              *
          FROM
              grants
          WHERE
              grants.table_id = tables.table_id
        ) grants
    ),
    '[]'
  ) AS grants 
FROM tables