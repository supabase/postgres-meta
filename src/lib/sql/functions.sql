SELECT
  p.oid :: int8 AS id,
  n.nspname AS schema,
  p.proname AS name,
  l.lanname AS language,
  CASE
    WHEN l.lanname = 'internal' THEN ''
    ELSE p.prosrc
  END AS definition,
  CASE
    WHEN l.lanname = 'internal' THEN p.prosrc
    ELSE pg_get_functiondef(p.oid)
  END AS complete_statement,
  pg_get_function_arguments(p.oid) AS argument_types,
  t.typname AS return_type,
  CASE
    WHEN p.provolatile = 'i' THEN 'IMMUTABLE'
    WHEN p.provolatile = 's' THEN 'STABLE'
    WHEN p.provolatile = 'v' THEN 'VOLATILE'
  END AS behavior,
  p.prosecdef AS security_definer,
  JSON_OBJECT_AGG(p_config.param, p_config.value)
    FILTER (WHERE p_config.param IS NOT NULL) AS config_params
FROM
  pg_proc p
  LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
  LEFT JOIN pg_language l ON p.prolang = l.oid
  LEFT JOIN pg_type t ON t.oid = p.prorettype
  LEFT JOIN (
    SELECT
	    oid as id,
	    (string_to_array(unnest(proconfig), '='))[1] AS param,
   	  (string_to_array(unnest(proconfig), '='))[2] AS value
	  FROM
	    pg_proc
	) p_config ON p_config.id = p.oid
GROUP BY
  p.oid,
  n.nspname,
  p.proname,
  l.lanname,
  p.prosrc,
  t.typname,
  p.provolatile,
  p.prosecdef
