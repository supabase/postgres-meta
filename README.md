## PG-API

A RESTful API for managing your Postgres. Fetch tables, add roles, and run queries (and more).

## Usage

Full documentation: https://supabase.github.io/pg-api/

## Quickstart

Set the following ENV VARS:

```bash
PG_API_PORT=8080
PG_API_DB_HOST="postgres"
PG_API_DB_NAME="postgres"
PG_API_DB_USER="postgres"
PG_API_DB_PORT=5432
PG_API_DB_PASSWORD="postgres"
PG_API_DB_SSL=false
```

Then run any of the bin files in the `bin` directory

```
./bin/start-linux
./bin/start-macos
./bin/start-windows.exe
```

## FAQs

**What security does this use?**

None. Please don't use this as a standalone server. We are assuming you are using this behind a proxy which brings it's own security, on your local machine, or using this internally with no access to the outside world. This is designed to be used as a part of a larger system.  

## Developers

1. Start the database using `docker-compose up`
2. Run `npm run dev`
3. Run `npm test` while you work

**Deploy**

Deploys are automated on tag:

```sh
git tag <version> # use package.json version
git push origin --tags
```

## Licence

Apache 2.0
