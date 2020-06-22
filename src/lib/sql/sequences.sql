SELECT
  table_schema,
  table_name,
  column_name,
  sequence_name,
  start_value,
  minimum_value,
  increment
FROM
  information_schema.columns
  INNER JOIN information_schema.sequences ON (
    table_schema = sequence_schema
    AND pg_get_serial_sequence(
      table_schema || '."' || table_name || '"',
      column_name
    ) = sequence_schema || '.' || sequence_name
  )
WHERE
  sequence_schema = ?
ORDER BY
  table_schema,
  table_name,
  ordinal_position
