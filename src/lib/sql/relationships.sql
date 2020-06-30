SELECT
  tc.table_schema AS source_schema,
  tc.table_name AS source_table_name,
  kcu.column_name AS source_column_name,
  ccu.table_schema AS target_table_schema,
  ccu.table_name AS target_table_name,
  ccu.column_name AS target_column_name,
  tc.constraint_name
FROM
  information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu USING (constraint_schema, constraint_name)
  JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
WHERE
  tc.constraint_type = 'FOREIGN KEY'
