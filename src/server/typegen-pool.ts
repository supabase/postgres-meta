import { Piscina } from 'piscina'
import {
  generateTypescript,
  type GeneratorMetadata,
  type GenerateTypescriptOptions,
} from '@supabase/postgrest-typegen'
import {
  FORMAT_IDLE_TIMEOUT_MS,
  FORMAT_IN_WORKER,
  FORMAT_MAX_QUEUE,
  FORMAT_POOL_SIZE,
  FORMAT_TIMEOUT_MS,
} from './constants.js'

// `format` is excluded because a function cannot cross the worker boundary:
// piscina transfers the task via structured clone, which throws on callbacks.
// If a custom `format` hook is ever needed here it must be constructed inside
// typegen-worker.js instead.
type WorkerSafeOptions = Omit<GenerateTypescriptOptions, 'format'>

type TypescriptTask = {
  metadata: GeneratorMetadata
  options: WorkerSafeOptions
}

/**
 * Raised when the generation backlog is full. Callers should surface this as a
 * 503 rather than a 500: the server is shedding load, not broken.
 */
export class TypegenQueueFullError extends Error {
  constructor() {
    super('Type generation is busy, try again shortly')
    this.name = 'TypegenQueueFullError'
  }
}

export class TypegenTimeoutError extends Error {
  constructor() {
    super(`Generating types timed out after ${FORMAT_TIMEOUT_MS}ms`)
    this.name = 'TypegenTimeoutError'
  }
}

let pool: Piscina | null = null
let inFlight = 0

const getPool = (): Piscina => {
  if (!pool) {
    pool = new Piscina({
      // typegen-worker is real JavaScript rather than TypeScript: the worker is
      // a fresh thread with no module transform pipeline, so it must be a file
      // that exists on disk as-is under dev, tests and dist alike.
      filename: new URL('./typegen-worker.js', import.meta.url).href,
      minThreads: 0,
      maxThreads: FORMAT_POOL_SIZE,
      idleTimeout: FORMAT_IDLE_TIMEOUT_MS,
    })
  }
  return pool
}

/** Number of generation calls currently running or waiting for a worker. */
export const inFlightCount = (): number => inFlight

/**
 * Whether a worker pool has been created, i.e. generation actually ran off the
 * main thread rather than inline. The pool is created lazily on first use.
 */
export const isTypegenPoolActive = (): boolean => pool !== null

/**
 * Generates TypeScript types, on a worker thread when enabled.
 *
 * The whole of `generateTypescript` is handed to the worker rather than a
 * worker-backed `format` hook: formatting is the bulk of the cost (~90% under
 * prettier on a 400-table schema; oxfmt, the default since 0.2.0, is much
 * faster but still synchronous), and the string building ahead of it is
 * CPU-bound too. Metadata crosses the thread boundary as a structured clone,
 * which is plain JSON here and does not measurably change wall-clock time.
 *
 * Falls back to generating inline when workers are disabled (type-generation
 * CLI mode, or PG_META_FORMAT_IN_WORKER=false), where blocking is harmless.
 */
export const generateTypescriptTypes = async (
  metadata: GeneratorMetadata,
  options: WorkerSafeOptions
): Promise<string> => {
  if (!FORMAT_IN_WORKER) {
    return generateTypescript(metadata, options)
  }

  // Admission control is done here rather than with piscina's own maxQueue,
  // because passing a `signal` to pool.run() bypasses maxQueue entirely:
  // with maxThreads 1 and maxQueue 2, ten concurrent tasks are rejected 7/10
  // without a signal, but all ten are accepted and queued with one. We need the
  // signal for per-task timeouts, so the bound is enforced here instead. The
  // limit is also exact this way, whereas piscina's is `maxQueue +
  // pendingCapacity()` and varies with how many workers happen to be spawning.
  //
  // Past the limit we shed load immediately, rather than letting callers queue
  // up behind a slow generation and time out one by one.
  if (inFlight >= FORMAT_MAX_QUEUE) {
    throw new TypegenQueueFullError()
  }

  const task: TypescriptTask = { metadata, options }
  inFlight++
  try {
    return await getPool().run(task, { signal: AbortSignal.timeout(FORMAT_TIMEOUT_MS) })
  } catch (error: any) {
    if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      throw new TypegenTimeoutError()
    }
    throw error
  } finally {
    inFlight--
  }
}

export const destroyTypegenPool = async (): Promise<void> => {
  if (pool) {
    const previous = pool
    pool = null
    await previous.destroy()
  }
}
