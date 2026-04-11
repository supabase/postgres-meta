import type { SQLQueryPropsWithSchemaFilterAndIdsFilter } from './common.js'

export const VIEWS_SQL = (
  props: SQLQueryPropsWithSchemaFilterAndIdsFilter & {
    viewIdentifierFilter?: string
  }
) => /* SQL */ `
SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  -- See definition of information_schema.views
  (pg_relation_is_updatable(c.oid, false) & 20) = 20 AS is_updatable,
  -- A view supports INSERT if it is auto-updatable OR has an INSTEAD OF INSERT trigger
  (
    (pg_relation_is_updatable(c.oid, false) & 8) = 8
    OR EXISTS (
      SELECT 1 FROM pg_trigger t
      WHERE t.tgrelid = c.oid
        AND t.tgtype & 64 > 0
        AND t.tgtype & 4 > 0
        AND NOT t.tgisinternal
    )
  ) AS is_insert_enabled,
  -- A view supports UPDATE if it is auto-updatable OR has an INSTEAD OF UPDATE trigger
  (
    (pg_relation_is_updatable(c.oid, false) & 4) = 4
    OR EXISTS (
      SELECT 1 FROM pg_trigger t
      WHERE t.tgrelid = c.oid
        AND t.tgtype & 64 > 0
        AND t.tgtype & 16 > 0
        AND NOT t.tgisinternal
    )
  ) AS is_update_enabled,
  -- A view supports INSERT if it is auto-updatable OR has an INSTEAD OF INSERT trigger
  (
    (pg_relation_is_updatable(c.oid, false) & 8) = 8
    OR EXISTS (
      SELECT 1 FROM pg_trigger t
      WHERE t.tgrelid = c.oid
        AND t.tgtype & (1 << 2) > 0  -- INSTEAD OF
        AND t.tgtype & (1 << 3) > 0  -- INSERT event
        AND NOT t.tgisinternal
    )
  ) AS is_insert_enabled,
  -- A view supports UPDATE if it is auto-updatable OR has an INSTEAD OF UPDATE trigger
  (
    (pg_relation_is_updatable(c.oid, false) & 4) = 4
    OR EXISTS (
      SELECT 1 FROM pg_trigger t
      WHERE t.tgrelid = c.oid
        AND t.tgtype & (1 << 2) > 0  -- INSTEAD OF
        AND t.tgtype & (1 << 4) > 0  -- UPDATE event
        AND NOT t.tgisinternal
    )
  ) AS is_update_enabled,
  obj_description(c.oid) AS comment
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
  ${props.schemaFilter ? `n.nspname ${props.schemaFilter} AND` : ''}
  ${props.idsFilter ? `c.oid ${props.idsFilter} AND` : ''}
  ${props.viewIdentifierFilter ? `(n.nspname || '.' || c.relname) ${props.viewIdentifierFilter} AND` : ''}
  c.relkind = 'v'
${props.limit ? `limit ${props.limit}` : ''}
${props.offset ? `offset ${props.offset}` : ''}
`
