select
    p.oid :: int8 as id,
    n.nspname as schema,
    p.proname as name,
    l.lanname as language,
    case
        when l.lanname = 'internal' then p.prosrc
        else pg_get_functiondef(p.oid)
    end as definition,
    pg_get_function_arguments(p.oid) as argument_types,
    t.typname as return_type
from
    pg_proc p
    left join pg_namespace n on p.pronamespace = n.oid
    left join pg_language l on p.prolang = l.oid
    left join pg_type t on t.oid = p.prorettype
