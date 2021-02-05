SELECT
  c.oid :: int8 AS id,
  c.conname AS constraint_name,
  nsa.nspname AS source_schema,
  csa.relname AS source_table_name,
  sa.attname AS source_column_name,
  nta.nspname AS target_table_schema,
  cta.relname AS target_table_name,
  ta.attname AS target_column_name
FROM
  pg_constraint c
  JOIN (
    pg_attribute sa
    JOIN pg_class csa ON sa.attrelid = csa.oid
    JOIN pg_namespace nsa ON csa.relnamespace = nsa.oid
  ) ON sa.attrelid = c.conrelid
  AND sa.attnum = ANY (c.conkey)
  JOIN (
    pg_attribute ta
    JOIN pg_class cta ON ta.attrelid = cta.oid
    JOIN pg_namespace nta ON cta.relnamespace = nta.oid
  ) ON ta.attrelid = c.confrelid
  AND ta.attnum = ANY (c.confkey)
WHERE
  c.contype = 'f'
