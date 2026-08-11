import prettier from 'prettier'
import { afterEach, expect, test, vi } from 'vitest'

// These tests exercise the worker-thread formatting path, which is opt-in via
// PG_META_FORMAT_IN_WORKER and therefore never hit by the rest of the suite.
//
// The env vars are read once when constants.ts is evaluated, so each test stubs
// the env and re-imports the module graph via vi.resetModules() to pick them up.
const loadFormatPool = async (env: Record<string, string>) => {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value)
  }
  return import('../../src/server/format-pool.js')
}

const SOURCE = `export type Foo={a:number;b:string};export const bar={x:1,y:[1,2,3]} as const`
const OPTIONS: prettier.Options = { parser: 'typescript', semi: false }

afterEach(() => {
  vi.unstubAllEnvs()
})

test('formats on a worker thread with identical output to formatting inline', async () => {
  const { format, destroyFormatPool, isFormatPoolActive } = await loadFormatPool({
    PG_META_FORMAT_IN_WORKER: 'true',
  })

  try {
    expect(isFormatPoolActive()).toBe(false)

    const viaWorker = await format(SOURCE, OPTIONS)

    // without this the test would still pass if formatting silently fell back
    // to running inline, which is the thing being changed
    expect(isFormatPoolActive()).toBe(true)
    expect(viaWorker).toBe(await prettier.format(SOURCE, OPTIONS))
  } finally {
    await destroyFormatPool()
  }
})

test('formats inline when the worker is not enabled', async () => {
  const { format, destroyFormatPool, isFormatPoolActive } = await loadFormatPool({
    PG_META_FORMAT_IN_WORKER: 'false',
  })

  try {
    expect(await format(SOURCE, OPTIONS)).toBe(await prettier.format(SOURCE, OPTIONS))
    // no pool was ever created, so formatting ran on the main thread
    expect(isFormatPoolActive()).toBe(false)
  } finally {
    await destroyFormatPool()
  }
})

test('never formats on a worker in type-generation mode', async () => {
  const { format, destroyFormatPool, isFormatPoolActive } = await loadFormatPool({
    PG_META_FORMAT_IN_WORKER: 'true',
    PG_META_GENERATE_TYPES: 'typescript',
  })

  try {
    // one-shot CLI generation has no event loop to protect, and a pool would
    // keep the process alive after it is done
    expect(await format(SOURCE, OPTIONS)).toBe(await prettier.format(SOURCE, OPTIONS))
    expect(isFormatPoolActive()).toBe(false)
  } finally {
    await destroyFormatPool()
  }
})

test('sheds load with FormatQueueFullError once the in-flight limit is reached', async () => {
  const { format, destroyFormatPool, FormatQueueFullError } = await loadFormatPool({
    PG_META_FORMAT_IN_WORKER: 'true',
    PG_META_FORMAT_POOL_SIZE: '1',
    PG_META_FORMAT_MAX_QUEUE: '2',
  })

  // big enough that formatting takes long enough for calls to overlap
  let big = ''
  for (let i = 0; i < 1000; i++) {
    big += `export type T${i} = { a: number; b: string; c: Array<{ x: number; y: string }> }\n`
  }

  try {
    const results = await Promise.allSettled(Array.from({ length: 6 }, () => format(big, OPTIONS)))

    const rejected = results.filter((r) => r.status === 'rejected')
    // 2 admitted, the rest shed immediately rather than queueing
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(2)
    expect(rejected).toHaveLength(4)
    for (const result of rejected) {
      expect((result as PromiseRejectedResult).reason).toBeInstanceOf(FormatQueueFullError)
    }
  } finally {
    await destroyFormatPool()
  }
})

test('counts a format call while it is in flight and releases it afterwards', async () => {
  const { format, destroyFormatPool, inFlightCount } = await loadFormatPool({
    PG_META_FORMAT_IN_WORKER: 'true',
    PG_META_FORMAT_MAX_QUEUE: '2',
  })

  try {
    expect(inFlightCount()).toBe(0)

    const pending = format(SOURCE, OPTIONS)
    // observed before awaiting: checking only afterwards would pass even if the
    // counter were never incremented at all
    expect(inFlightCount()).toBe(1)
    await pending

    // a leaked counter would make the pool refuse work forever after a burst
    expect(inFlightCount()).toBe(0)
    await expect(format(SOURCE, OPTIONS)).resolves.toBeTypeOf('string')
  } finally {
    await destroyFormatPool()
  }
})
