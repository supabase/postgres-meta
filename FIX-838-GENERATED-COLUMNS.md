# Fix #838: omit generated columns from TypeScript Insert/Update types

## Claim check

Issue [supabase/postgres-meta#838](https://github.com/supabase/postgres-meta/issues/838) was open, unassigned, and had no linked PR. Search hits for `838` were false positives (`fastify/fastify-swagger#838`, `docker/build-push-action#838` in dependency changelogs). Default branch is `master`.

## Cause

Column introspection already exposes `is_generated` (`a.attgenerated IN ('s')` in `src/lib/sql/columns.sql.ts`). TypeScript typegen only treated `identity_generation === 'ALWAYS'` as non-writable. Stored `GENERATED ALWAYS AS … STORED` columns still appeared on Insert/Update (usually as optional, because the generation expression is reported as `default_value`). Postgres rejects writes to those columns.

## Code path (before)

`src/server/templates/typescript.ts` — table Insert and Update builders:

```ts
if (column.identity_generation === 'ALWAYS') {
  return `${JSON.stringify(column.name)}?: never`
}
```

Go and Swift mark `is_generated` as nullable on Insert; they still emit the field. Python does not check `is_generated`. Generators are separate; this change is TypeScript-only.

## Change

Treat `column.is_generated` the same as identity-ALWAYS: emit `field?: never` on Insert and Update. The column stays on Row.

## Fixture and test

- `test/db/00-init.sql`: `public.people` with `height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED`
- `test/server/typegen.ts`: asserts `height_in` is on Row and is not a writable `number` on Insert/Update

## How to test

```bash
npm install
npm test
```

Or, with the test database already up:

```bash
npm run db:run
npm run test:run
```

Node 22 (see `.nvmrc`). `npm test` starts Postgres via `test/db/docker-compose.yml`.
