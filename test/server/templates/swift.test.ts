import { describe, expect, test } from 'vitest'

import { apply } from '../../../src/server/templates/swift'
import type { GeneratorMetadata } from '../../../src/lib/generators'
import type {
  PostgresColumn,
  PostgresSchema,
  PostgresTable,
  PostgresType,
} from '../../../src/lib/types'

const baseSchema: PostgresSchema = {
  id: 1,
  name: 'public',
  owner: 'postgres',
}

const baseTable = {
  id: 1,
  schema: 'public',
  name: 'tickets',
} as unknown as Omit<PostgresTable, 'columns'>

const baseColumn = (name: string): PostgresColumn =>
  ({
    table_id: 1,
    name,
    format: 'text',
    is_identity: false,
    is_generated: false,
    is_nullable: false,
    default_value: null,
  }) as PostgresColumn

const enumType = (enums: string[]): PostgresType =>
  ({
    id: 100,
    name: 'status',
    schema: 'public',
    format: 'status',
    enums,
    attributes: [],
  }) as PostgresType

const buildMetadata = (overrides: Partial<GeneratorMetadata> = {}) => ({
  schemas: [baseSchema],
  tables: [baseTable],
  foreignTables: [],
  views: [],
  materializedViews: [],
  columns: [],
  relationships: [],
  functions: [],
  types: [],
  accessControl: 'internal' as const,
  ...overrides,
})

describe('swift typegen string literal escaping', () => {
  test('escapes enum raw values', async () => {
    const result = await apply(buildMetadata({ types: [enumType(['say"hi', 'use\\path'])] }))

    expect(result).toContain('case sayHi = "say\\"hi"')
    expect(result).toContain('case usePath = "use\\\\path"')
  })

  test('escapes coding key raw values', async () => {
    const result = await apply(buildMetadata({ columns: [baseColumn('say"hi')] }))

    expect(result).toContain('case sayHi = "say\\"hi"')
  })

  test('escapes newlines and string interpolation markers', async () => {
    const result = await apply(
      buildMetadata({ types: [enumType(['line\nbreak', 'value\\(call)'])] })
    )

    expect(result).toContain('case lineBreak = "line\\nbreak"')
    expect(result).toContain('case valueCall = "value\\\\(call)"')
  })
})
