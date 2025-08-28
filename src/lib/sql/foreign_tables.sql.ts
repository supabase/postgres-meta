export const FOREIGN_TABLES_SQL = (schemaFilter?: string) => /* SQL */ `
SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  obj_description(c.oid) AS comment
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
  ${schemaFilter ? `n.nspname ${schemaFilter} AND` : ''}
  c.relkind = 'f'
`
