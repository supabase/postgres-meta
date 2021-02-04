# `postgres-meta`

A RESTful API for managing your Postgres. Fetch tables, add roles, and run queries (and more).

## Usage

Full documentation: https://supabase.github.io/postgres-meta/

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

**What security does this use?**

None. Please don't use this as a standalone server. We are assuming you are using this behind a proxy which brings its own security, on your local machine, or using this internally with no access to the outside world. This is designed to be used as a part of a larger system.

## Developers

1. Start the database using `docker-compose up`
2. Run `npm run dev`
3. Run `npm test` while you work

## Licence

Apache 2.0

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
