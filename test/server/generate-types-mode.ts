import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, test } from 'vitest'
import { app } from './utils'

const run = promisify(execFile)

// PG_META_GENERATE_TYPES makes server.ts generate once and exit instead of
// listening, so it has to run as its own process. The default connection
// settings already point at the test database. Settings the route does not
// read are cleared so a developer's shell cannot make the outputs differ.
const generateOnce = (language: string, env: NodeJS.ProcessEnv = {}) =>
  run('node', ['--loader', 'ts-node/esm', 'src/server/server.ts'], {
    env: {
      ...process.env,
      PG_META_POSTGREST_VERSION: undefined,
      PG_META_EXPORT_DOCS: undefined,
      PG_META_GENERATE_TYPES_DEFAULT_SCHEMA: undefined,
      PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS: undefined,
      PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS: undefined,
      PG_META_GENERATE_TYPES_SWIFT_ACCESS_CONTROL: undefined,
      ...env,
      PG_META_GENERATE_TYPES: language,
    },
    maxBuffer: 64 * 1024 * 1024,
  })

test('generate-types mode: typescript matches the route and ends in one newline', async () => {
  const { stdout } = await generateOnce('typescript')
  const { body } = await app.inject({ method: 'GET', path: '/generators/typescript' })
  expect(stdout).toBe(body)
  expect(stdout.endsWith('\n')).toBe(true)
  expect(stdout.endsWith('\n\n')).toBe(false)
}, 120_000)

test('generate-types mode: an out-of-process language fails before connecting', async () => {
  // An unreachable database, so the test fails if the check runs after the
  // connection.
  await expect(
    generateOnce('dart', { PG_META_DB_URL: undefined, PG_META_DB_PORT: '1' })
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining('Unsupported language for GENERATE_TYPES: dart'),
  })
}, 120_000)
