import type { SQLQueryPropsWithSchemaFilterAndIdsFilter } from './index.js'

export const VIEWS_SQL = (props: SQLQueryPropsWithSchemaFilterAndIdsFilter) => /* SQL */ `
SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  -- See definition of information_schema.views
  (pg_relation_is_updatable(c.oid, false) & 20) = 20 AS is_updatable,
  obj_description(c.oid) AS comment
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
  ${props.schemaFilter ? `n.nspname ${props.schemaFilter} AND` : ''}
  ${props.idsFilter ? `c.oid ${props.idsFilter} AND` : ''}
  c.relkind = 'v'
${props.limit ? `limit ${props.limit}` : ''}
${props.offset ? `offset ${props.offset}` : ''}
`
