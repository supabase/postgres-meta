

-- Tables for testing

CREATE TYPE public.user_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TABLE public.users (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text,
  status user_status DEFAULT 'ACTIVE'
);
INSERT INTO 
    public.users (name) 
VALUES 
    ('Joe Bloggs'),
    ('Jane Doe');

CREATE TABLE public.todos (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  details text,
  "user-id" bigint REFERENCES users NOT NULL
);

INSERT INTO 
    public.todos (details, "user-id")
VALUES 
    ('Star the repo', 1),
    ('Watch the releases', 2);


CREATE FUNCTION add(integer, integer) RETURNS integer
    AS 'select $1 + $2;'
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT;

create table public.users_audit (
    id BIGINT generated by DEFAULT as identity,
    created_at timestamptz DEFAULT now(),
    user_id bigint,
    previous_value jsonb
);

create function public.audit_action()
returns trigger as $$
begin
    insert into public.users_audit (user_id, previous_value)
    values (old.id, row_to_json(old));

    return new;
end;
$$ language plpgsql;

CREATE VIEW todos_view AS SELECT * FROM public.todos;

create function public.blurb(public.todos) returns text as
$$
select substring($1.details, 1, 3);
$$ language sql stable;

create extension postgres_fdw;
create server foreign_server foreign data wrapper postgres_fdw options (host 'localhost', port '5432', dbname 'postgres');
create user mapping for postgres server foreign_server options (user 'postgres', password 'postgres');
create foreign table foreign_table (
  id int8,
  name text,
  status user_status
) server foreign_server options (schema_name 'public', table_name 'users');

create or replace function public.get_user_by_id(integer) returns public.users as $$
select * from public.users where id = $1;
$$ language sql stable;

create or replace function public.get_users() returns setof public.users as $$
select * from public.users;
$$ language sql stable;

create or replace function public.get_users_typed() returns table (id int, name text) as $$
select id, name from public.users;
$$ language sql stable;