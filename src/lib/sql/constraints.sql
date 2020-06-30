SELECT
  c.oid AS id,
  COALESCE(table_schema, referenced_schema) AS table_schema,
  COALESCE(table_name, referenced_table) AS table_name,
  COALESCE(column_name, referenced_column) AS column_name,
  constraint_schema,
  constraint_name,
  constraint_type,
  check_clause,
  referenced_schema,
  referenced_table,
  referenced_column
FROM
  information_schema.table_constraints
  -- This doesn't guarantee uniqueness, but works for now
  JOIN pg_constraint c ON c.connamespace = table_schema::text::regnamespace
  AND c.conrelid = table_name::text::regclass
  AND c.conname = constraint_name
  NATURAL FULL JOIN information_schema.key_column_usage
  NATURAL FULL JOIN information_schema.check_constraints
  INNER JOIN (
    SELECT
      table_schema AS referenced_schema,
      table_name AS referenced_table,
      column_name AS referenced_column,
      constraint_name
    FROM
      information_schema.constraint_column_usage
  ) AS referenced_columns USING (constraint_name)
ORDER BY
  table_schema,
  table_name,
  ordinal_position
