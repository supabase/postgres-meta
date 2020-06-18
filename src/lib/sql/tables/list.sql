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
    is_nullable::boolean,
    data_type,
    is_identity::boolean,
    identity_generation,
    is_updatable::boolean,
    udt_name as format,
    table_name,
    col_description(
      (table_schema || '."' || table_name || '"') :: regclass,
      ordinal_position
    ) as description,
    (table_schema || '.' || table_name) as table_id,
    array_to_json(array(
      select   enumlabel
      FROM     pg_catalog.pg_enum enums
      WHERE    udt_name = pg_catalog.Format_type(enums.enumtypid::regclass, NULL) 
      ORDER BY enums.enumsortorder
    )) AS enums
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
    is_grantable::boolean,
    with_hierarchy::boolean
  FROM
    information_schema.role_table_grants
),
pk_list as (
  SELECT
  pg_namespace.nspname as schema,
  pg_class.oid :: regclass as table_name,
  pg_attribute.attname as name,
  (
    pg_namespace.nspname || '.' || (pg_class.oid :: regclass)
  ) as table_id
FROM
  pg_index,
  pg_class,
  pg_attribute,
  pg_namespace
WHERE
  indrelid = pg_class.oid
  AND pg_class.relnamespace = pg_namespace.oid
  AND pg_attribute.attrelid = pg_class.oid
  AND pg_attribute.attnum = any(pg_index.indkey)
),
relationships as (
  select
    (tc.table_schema || '.' || (tc.table_name)) as source_table_id,
    tc.table_schema as source_schema,
    tc.table_name as source_table_name,
    kcu.column_name as source_column_name,
    (ccu.table_schema || '.' || (ccu.table_name)) as target_table_id,
    ccu.table_schema AS target_table_schema,
    ccu.table_name AS target_table_name,
    ccu.column_name AS target_column_name,
    tc.constraint_name
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu USING (constraint_schema, constraint_name)
    JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
  where
    tc.constraint_type = 'FOREIGN KEY'
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
  ) AS grants,
  COALESCE(
  (
    SELECT
      array_to_json(array_agg(row_to_json(primary_keys)))
    FROM
      (
        SELECT
          *
        FROM
          pk_list
        WHERE
          pk_list.table_id = tables.table_id
      ) primary_keys
    ),
    '[]'
  ) AS primary_keys,
  COALESCE(
  (
    SELECT
      array_to_json(array_agg(row_to_json(relationships)))
    FROM
      (
        SELECT
          *
        FROM
          relationships
        WHERE
          relationships.source_table_id = tables.table_id
          OR relationships.target_table_id = tables.table_id
      ) relationships
    ),
    '[]'
  ) AS relationships
FROM tables