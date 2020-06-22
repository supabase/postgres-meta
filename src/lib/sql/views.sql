SELECT
  table_schema,
  table_name,
  check_option,
  is_updatable,
  is_insertable_into,
  is_trigger_updatable,
  is_trigger_deletable,
  is_trigger_insertable_into
FROM
  information_schema.views
WHERE
  table_schema = ?
  AND table_schema NOT IN ('information_schema', 'pg_catalog')
