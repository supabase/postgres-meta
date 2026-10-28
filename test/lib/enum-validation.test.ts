import { expect, test, describe } from 'vitest'
import PostgresMetaPolicies from '../../src/lib/PostgresMetaPolicies.js'
import PostgresMetaTriggers from '../../src/lib/PostgresMetaTriggers.js'

// These classes build SQL strings and hand them to the query function.
// A capturing query function lets us assert on the generated SQL without a
// database: fields that are interpolated raw must never let a second
// statement into the generated SQL.
const capturingQuery = () => {
  const sqls: string[] = []
  const query = async (sql: string) => {
    sqls.push(sql)
    return { data: [], error: null }
  }
  return { sqls, query: query as any }
}

describe('trigger enum validation', () => {
  test('rejects an activation that tries to append a second statement', async () => {
    const { sqls, query } = capturingQuery()
    const res = await new PostgresMetaTriggers(query).create({
      name: 'trg',
      schema: 'public',
      table: 'users',
      function_schema: 'public',
      function_name: 'fn',
      activation: 'BEFORE INSERT ON users; DROP TABLE users; --',
      events: ['INSERT'],
    } as any)
    expect(res.error).not.toBeNull()
    expect(sqls).toHaveLength(0)
  })

  test('rejects an event that tries to append a second statement', async () => {
    const { sqls, query } = capturingQuery()
    const res = await new PostgresMetaTriggers(query).create({
      name: 'trg',
      schema: 'public',
      table: 'users',
      function_schema: 'public',
      function_name: 'fn',
      activation: 'BEFORE',
      events: ['INSERT ON users; DROP TABLE users; --'],
    } as any)
    expect(res.error).not.toBeNull()
    expect(sqls).toHaveLength(0)
  })

  test('rejects an orientation that is not ROW or STATEMENT', async () => {
    const { sqls, query } = capturingQuery()
    const res = await new PostgresMetaTriggers(query).create({
      name: 'trg',
      schema: 'public',
      table: 'users',
      function_schema: 'public',
      function_name: 'fn',
      activation: 'BEFORE',
      events: ['INSERT'],
      orientation: 'ROW; DROP TABLE users; --',
    } as any)
    expect(res.error).not.toBeNull()
    expect(sqls).toHaveLength(0)
  })

  test('still builds SQL for valid values, including UPDATE OF', async () => {
    const { sqls, query } = capturingQuery()
    await new PostgresMetaTriggers(query).create({
      name: 'trg',
      schema: 'public',
      table: 'users',
      function_schema: 'public',
      function_name: 'fn',
      activation: 'BEFORE',
      events: ['UPDATE OF name, email'],
      orientation: 'ROW',
      function_args: [],
    } as any)
    expect(sqls[0]).toContain('CREATE TRIGGER trg BEFORE UPDATE OF name, email ON public.users FOR EACH ROW')
  })
})

describe('policy enum validation', () => {
  test('rejects an action that tries to append a second statement', async () => {
    const { sqls, query } = capturingQuery()
    const res = await new PostgresMetaPolicies(query).create({
      name: 'pol',
      table: 'users',
      schema: 'public',
      action: 'PERMISSIVE FOR ALL TO public; DROP TABLE users; --',
      command: 'ALL',
      roles: ['public'],
    } as any)
    expect(res.error).not.toBeNull()
    expect(sqls).toHaveLength(0)
  })

  test('rejects a command that is not a policy command', async () => {
    const { sqls, query } = capturingQuery()
    const res = await new PostgresMetaPolicies(query).create({
      name: 'pol',
      table: 'users',
      schema: 'public',
      action: 'PERMISSIVE',
      command: 'ALL; DROP TABLE users; --',
      roles: ['public'],
    } as any)
    expect(res.error).not.toBeNull()
    expect(sqls).toHaveLength(0)
  })

  test('still builds SQL for valid values', async () => {
    const { sqls, query } = capturingQuery()
    await new PostgresMetaPolicies(query).create({
      name: 'pol',
      table: 'users',
      schema: 'public',
      action: 'PERMISSIVE',
      command: 'SELECT',
      roles: ['public'],
    } as any)
    expect(sqls[0]).toContain('CREATE POLICY pol ON public.users')
    expect(sqls[0]).toContain('AS PERMISSIVE')
    expect(sqls[0]).toContain('FOR SELECT')
  })
})
