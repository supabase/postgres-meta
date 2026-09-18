import { spawn, type ChildProcess } from 'node:child_process'
import { createInterface } from 'node:readline'
import { afterEach, describe, expect, test } from 'vitest'

type Listener = { readonly port: number }
type RunningServer = {
  readonly listeners: Promise<readonly [Listener, Listener]>
}

const children: ChildProcess[] = []

const listenerFromLine = (line: string): Listener | undefined => {
  try {
    const record: unknown = JSON.parse(line)
    if (
      typeof record !== 'object' ||
      record === null ||
      !('msg' in record) ||
      typeof record.msg !== 'string' ||
      !record.msg.startsWith('Server listening at ')
    )
      return undefined
    const address = new URL(record.msg.slice('Server listening at '.length))
    return { port: Number(address.port) }
  } catch {
    return undefined
  }
}

const startServer = (): RunningServer => {
  const output: string[] = []
  const errors: string[] = []
  const child = spawn(process.execPath, ['--loader', 'ts-node/esm', 'src/server/server.ts'], {
    env: {
      ...process.env,
      PG_META_HOST: '127.0.0.1',
      PG_META_PORT: '0',
      PG_META_ADMIN_PORT: '0',
      PG_META_DB_URL: 'postgresql://127.0.0.1:1/postgres',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.push(child)
  if (child.stdout === null || child.stderr === null) throw new Error('server output unavailable')
  const stdout = createInterface({ input: child.stdout })
  const stderr = createInterface({ input: child.stderr })
  const listeners = new Promise<readonly [Listener, Listener]>((resolve, reject) => {
    const found: Listener[] = []
    const timeout = setTimeout(() => {
      reject(new Error(`postgres-meta did not listen: ${output.join('')} ${errors.join('')}`))
    }, 10_000)
    const onLine = (line: string) => {
      output.push(`${line}\n`)
      const listener = listenerFromLine(line)
      if (listener === undefined) return
      found.push(listener)
      if (found.length === 2) {
        clearTimeout(timeout)
        const first = found[0]
        const second = found[1]
        if (first !== undefined && second !== undefined) resolve([first, second])
      }
    }
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('exit', (code, signal) => {
      clearTimeout(timeout)
      if (found.length < 2)
        reject(
          new Error(
            `postgres-meta exited (${code ?? signal}): ${output.join('')} ${errors.join('')}`
          )
        )
    })
    stdout.on('line', onLine)
    stderr.on('line', (line) => errors.push(`${line}\n`))
  })
  return { listeners }
}

const stopServer = (child: ChildProcess): Promise<void> => {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve()
  return new Promise((resolve) => {
    child.once('exit', () => resolve())
    child.kill('SIGTERM')
  })
}

afterEach(async () => {
  await Promise.all(children.splice(0).map(stopServer))
})

describe('server listener ports', () => {
  test('runs two servers with independent ephemeral admin metrics listeners', async () => {
    const first = startServer()
    const second = startServer()
    const [[firstMain, firstAdmin], [secondMain, secondAdmin]] = await Promise.all([
      first.listeners,
      second.listeners,
    ])

    const ports = [firstMain.port, firstAdmin.port, secondMain.port, secondAdmin.port]
    expect(new Set(ports).size).toBe(4)
    expect(await (await fetch(`http://127.0.0.1:${firstMain.port}/health`)).json()).toHaveProperty(
      'date'
    )
    expect(await (await fetch(`http://127.0.0.1:${secondMain.port}/health`)).json()).toHaveProperty(
      'date'
    )
    expect((await fetch(`http://127.0.0.1:${firstAdmin.port}/metrics`)).status).toBe(200)
    expect((await fetch(`http://127.0.0.1:${secondAdmin.port}/metrics`)).status).toBe(200)
  }, 20_000)
})
