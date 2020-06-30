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
  INNER JOIN pg_class c ON table_schema::text::regnamespace = c.relnamespace
  AND table_name::text = c.relname
