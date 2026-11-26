import CryptoJS from 'crypto-js'
import { expect, test } from 'vitest'
import { register } from 'prom-client'
import { app } from './utils'
import { CRYPTO_KEY } from '../../src/server/constants'
import { classifyOutcome, REQUEST_DURATION_METRIC, UNMATCHED_ROUTE } from '../../src/server/metrics'

const count = async (labels: string) => {
  const text = await register.getSingleMetricAsString(REQUEST_DURATION_METRIC)
  const line = text
    .split('\n')
    .find((l) => l.startsWith(`${REQUEST_DURATION_METRIC}_count{${labels}}`))
  return line ? Number(line.split(' ').pop()) : 0
}

test('request metrics label each response with a bounded outcome', async () => {
  await app.ready()
  const ok = 'method="POST",route="/query",status_code="200",outcome="ok"'
  const userError = 'method="POST",route="/query",status_code="400",outcome="user_error"'
  const unreachable = 'method="POST",route="/query",status_code="400",outcome="db_unavailable"'
  const before = {
    ok: await count(ok),
    userError: await count(userError),
    unreachable: await count(unreachable),
  }

  const root = 'method="GET",route="/",status_code="200",outcome="ok"'
  const rootBefore = await count(root)

  await app.inject({ method: 'GET', path: '/' })
  await app.inject({ method: 'POST', path: '/query', payload: { query: 'select 1' } })
  await app.inject({ method: 'POST', path: '/query/', payload: { query: 'select from nope' } })
  await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        'postgresql://postgres:postgres@127.0.0.1:1/postgres',
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1' },
  })
  await app.inject({ method: 'GET', path: '/health' })
  await app.inject({ method: 'GET', path: '/not-a-route' })

  expect(await count(root)).toBe(rootBefore + 1)
  expect(await count(ok)).toBe(before.ok + 1)
  expect(await count(userError)).toBe(before.userError + 1)
  expect(await count(unreachable)).toBe(before.unreachable + 1)

  const text = await register.getSingleMetricAsString(REQUEST_DURATION_METRIC)
  expect(text).not.toContain('route="/health"')
  expect(text).not.toContain('not-a-route')
  expect(text).toContain(`route="${UNMATCHED_ROUTE}",status_code="404",outcome="user_error"`)
  const outcomes = new Set([...text.matchAll(/outcome="([^"]+)"/g)].map((m) => m[1]))
  for (const outcome of outcomes) {
    expect(['ok', 'user_error', 'db_unavailable', 'timeout', 'server_error']).toContain(outcome)
  }
})

test('classifyOutcome does not read user SQL quoted in the formatted error', () => {
  const body = JSON.stringify({
    error: "ERROR:  42601: syntax error\nLINE 1: select 'sorry, too many clients'",
    message: 'syntax error at or near "select"',
    code: '42601',
  })
  expect(classifyOutcome(400, body)).toBe('user_error')
  const canceled = (message: string) => JSON.stringify({ error: message, message, code: '57014' })
  expect(classifyOutcome(400, canceled('canceling statement due to statement timeout'))).toBe(
    'timeout'
  )
  expect(classifyOutcome(400, canceled('canceling statement due to user request'))).toBe(
    'user_error'
  )
  expect(
    classifyOutcome(500, JSON.stringify({ error: 'Generating types timed out after 60000ms' }))
  ).toBe('timeout')
  expect(
    classifyOutcome(
      500,
      JSON.stringify({ error: 'terminating connection due to administrator command' })
    )
  ).toBe('db_unavailable')
  // translateErrorToResponseCode turns these into the 504 and 503 that mgmt-api reports to Studio.
  for (const [status, message] of [
    [504, 'Connection terminated due to connection timeout'],
    [503, 'sorry, too many clients already'],
  ] as const) {
    expect(classifyOutcome(status, JSON.stringify({ error: message, message }))).toBe(
      'db_unavailable'
    )
  }
  expect(classifyOutcome(500, JSON.stringify({ error: 'boom' }))).toBe('server_error')
})

test('malformed request body is recorded as user_error', async () => {
  await app.ready()
  const labels = 'method="POST",route="/query",status_code="400",outcome="user_error"'
  const before = await count(labels)
  await app.inject({
    method: 'POST',
    path: '/query',
    headers: { 'content-type': 'application/json' },
    payload: '{"query": ',
  })
  expect(await count(labels)).toBe(before + 1)
})
