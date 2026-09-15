import { expect, test } from 'vitest'
import { pgMeta } from './utils'

test('query returns the notices Postgres emitted alongside the rows', async () => {
  const res = await pgMeta.query(`
    DROP TABLE IF EXISTS missing_table;
    DO $$ BEGIN RAISE NOTICE 'hello from plpgsql'; END $$;
    SELECT 1 AS one;
  `)
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
        {
          "one": 1,
        },
      ],
      "error": null,
      "notices": [
        {
          "code": "00000",
          "detail": undefined,
          "hint": undefined,
          "message": "table "missing_table" does not exist, skipping",
          "severity": "NOTICE",
          "where": undefined,
        },
        {
          "code": "00000",
          "detail": undefined,
          "hint": undefined,
          "message": "hello from plpgsql",
          "severity": "NOTICE",
          "where": "PL/pgSQL function inline_code_block line 1 at RAISE",
        },
      ],
    }
  `)
})

test('query returns an empty notices list when there are none', async () => {
  const res = await pgMeta.query('SELECT 1 AS one')
  expect(res).toMatchInlineSnapshot(`
    {
      "data": [
        {
          "one": 1,
        },
      ],
      "error": null,
      "notices": [],
    }
  `)
})
