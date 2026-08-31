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
  rls_enabled: false,
  rls_forced: false,
  replica_identity: 'DEFAULT',
  bytes: 0,
  size: '0 bytes',
  live_rows_estimate: 0,
  dead_rows_estimate: 0,
  comment: null,
  primary_keys: [],
  relationships: [],
} as unknown as Omit<PostgresTable, 'columns'>

const baseColumn = (overrides: Partial<PostgresColumn>): PostgresColumn =>
  ({
    table_id: 1,
    schema: 'public',
    table: 'tickets',
    id: '1.1',
    ordinal_position: 1,
    name: 'col',
    default_value: null,
    data_type: 'text',
    format: 'text',
    is_identity: false,
    identity_generation: null,
    is_generated: false,
    is_nullable: false,
    is_updatable: true,
    is_unique: false,
    enums: [],
    check: null,
    comment: null,
    ...overrides,
  }) as PostgresColumn

const enumType = (enums: string[]): PostgresType => ({
  id: 100,
  name: 'user_status',
  schema: 'public',
  format: 'user_status',
  enums,
  attributes: [],
  comment: null,
  type_relation_id: null,
})

const buildMetadata = (columns: PostgresColumn[], types: PostgresType[]): GeneratorMetadata => ({
  schemas: [baseSchema],
  tables: [baseTable],
  foreignTables: [],
  views: [],
  materializedViews: [],
  columns,
  relationships: [],
  functions: [],
  types,
})

const generate = (columns: PostgresColumn[], types: PostgresType[] = []) =>
  apply({ ...buildMetadata(columns, types), accessControl: 'public' })

describe('swift typegen string literals', () => {
  test('a double quote in an enum label is escaped', async () => {
    const result = await generate([baseColumn({ name: 'status' })], [enumType(['bad"label'])])

    expect(result).toContain('"bad\\"label"')
    expect(result).not.toContain('"bad"label"')
  })

  test('a double quote in a column name is escaped in CodingKeys', async () => {
    const result = await generate([baseColumn({ name: 'bad"name' })])

    expect(result).toContain('"bad\\"name"')
  })

  test('a backslash in a column name is escaped', async () => {
    const result = await generate([baseColumn({ name: 'back\\slash' })])

    expect(result).toContain('"back\\\\slash"')
  })

  test('ordinary names are unchanged', async () => {
    const result = await generate([baseColumn({ name: 'title' })])

    expect(result).toContain('"title"')
  })
})
