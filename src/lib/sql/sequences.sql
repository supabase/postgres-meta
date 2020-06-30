-- Adapted from the source for information_schema.sequences
SELECT
  c.oid AS id,
  nc.nspname::information_schema.sql_identifier AS sequence_schema,
  c.relname::information_schema.sql_identifier AS sequence_name,
  s.seqstart::information_schema.character_data AS start_value,
  s.seqmin::information_schema.character_data AS minimum_value,
  s.seqmax::information_schema.character_data AS maximum_value,
  s.seqincrement::information_schema.character_data AS increment
FROM pg_namespace nc,
  pg_class c,
  pg_sequence s
WHERE c.relnamespace = nc.oid AND c.relkind = 'S'::"char" AND NOT (EXISTS (
  SELECT 1
  FROM pg_depend
  WHERE pg_depend.classid = 'pg_class'::regclass::oid
  AND pg_depend.objid = c.oid
  AND pg_depend.deptype = 'i'::"char"))
  AND NOT pg_is_other_temp_schema(nc.oid)
  AND c.oid = s.seqrelid
  AND (pg_has_role(c.relowner, 'USAGE'::text)
  OR has_sequence_privilege(c.oid, 'SELECT, UPDATE, USAGE'::text)
)
