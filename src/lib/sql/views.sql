SELECT
  c.oid AS id,
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
  JOIN pg_class c ON quote_ident(table_schema)::regnamespace = c.relnamespace
  AND table_name = c.relname
