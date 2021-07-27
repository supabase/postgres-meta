# `postgres-meta`

A RESTful API for managing your Postgres. Fetch tables, add roles, and run queries (and more).

## Documentation

https://supabase.github.io/postgres-meta/

## Progress

Schema:

- [X] `POST /query` (Execute SQL query)
- [X] `/columns`
  - [X] GET (List)
  - [X] POST (`alter table add column`)
  - [X] PATCH (`alter table alter/rename column`)
  - [X] DELETE (`alter table drop column`)
- [X] `/extensions`
  - [X] GET (List)
  - [X] POST (`create extension`)
  - [X] PATCH (`alter extension`)
  - [X] DELETE (`drop extension`)
- [X] `/functions`
  - [X] GET (List)
  - [X] POST (`create function`)
  - [X] PATCH (`alter function`)
  - [X] DELETE (`drop function`)
- [X] `/publications`
  - [X] GET (List)
  - [X] POST (`create publication`)
  - [X] PATCH (`alter publication`)
  - [X] DELETE (`drop publication`)
- [X] `/roles`
  - [X] GET (List)
  - [X] POST (`create role`)
  - [X] PATCH (`alter role`)
  - [X] DELETE (`drop role`)
- [X] `/schemas`
  - [X] GET (List)
  - [X] POST (`create schema`)
  - [X] PATCH (`alter schema`)
  - [X] DELETE (`drop schema`)
- [X] `/tables`
  - [X] GET (List)
  - [X] POST (`create table`)
  - [X] PATCH (`alter table`)
  - [X] DELETE (`drop table`)
- [X] `/triggers`
  - [X] GET (List)
  - [X] POST (`create trigger`)
  - [X] PATCH (`alter trigger`)
  - [X] DELETE (`drop trigger`)
- [ ] `/types`
  - [X] GET (List)
  - [ ] POST (`create type`)
  - [ ] PATCH (`alter type`)
  - [ ] DELETE (`drop type`)

Helpers:

- [ ] `/config`
  - [ ] GET `/version`: Postgres version 
- [ ] `/generators`
  - [ ] GET `/openapi`: Generate Open API 
  - [ ] GET `/typescript`: Generate Typescript types

## Quickstart

Set the following ENV VARS:

```bash
PG_META_PORT=8080
PG_META_DB_HOST="postgres"
PG_META_DB_NAME="postgres"
PG_META_DB_USER="postgres"
PG_META_DB_PORT=5432
PG_META_DB_PASSWORD="postgres"
```

Then run any of the binaries in the releases.

## FAQs

**Why?**

This serves as a light-weight connection pooler. It also normalises the Postgres system catalog into a more readable format. While it it a lot of reinventing right now, this server will eventually provide helpers (such as type generators). The server is multi-tenant, so it can support multiple Postgres databases from a single server.

**What security does this use?**

None. Please don't use this as a standalone server. This should be used behind a proxy in a trusted environment, on your local machine, or using this internally with no access to the outside world. 

## Developers

1. Start the database using `docker-compose up`
2. Run `npm run dev`
3. Run `npm test` while you work

## Licence

Apache 2.0

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
