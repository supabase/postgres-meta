import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, test } from 'vitest'
import { app } from './utils'

const run = promisify(execFile)

// PG_META_GENERATE_TYPES makes server.ts generate once and exit instead of
// listening, so it has to run as its own process. The default connection
// settings already point at the test database.
const generateOnce = (language: string) =>
  run('node', ['--loader', 'ts-node/esm', 'src/server/server.ts'], {
    env: { ...process.env, PG_META_GENERATE_TYPES: language },
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
  await expect(generateOnce('dart')).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining('Unsupported language for GENERATE_TYPES: dart'),
  })
}, 120_000)
