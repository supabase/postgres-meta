import { describe, expect, test } from 'vitest'

import { apply } from '../../../src/server/templates/python'
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

const buildMetadata = (overrides: Partial<GeneratorMetadata> = {}): GeneratorMetadata => ({
  schemas: [baseSchema],
  tables: [baseTable],
  foreignTables: [],
  views: [],
  materializedViews: [],
  columns: [],
  relationships: [],
  functions: [],
  types: [],
  ...overrides,
})

describe('python typegen identifier escaping', () => {
  test('enum labels are escaped and cannot break out of the Literal string', () => {
    const result = apply(buildMetadata({ types: [enumType(['a";b'])] }))

    // The label is emitted as an escaped Python string literal.
    expect(result).toContain('Literal["a\\";b"]')
    // The raw, unescaped form would let the value break out of the string.
    expect(result).not.toContain('Literal["a";b"]')
  })

  test('column names are escaped in Field(alias=...)', () => {
    const result = apply(buildMetadata({ columns: [baseColumn({ name: 'c";x' })] }))

    expect(result).toContain('Field(alias="c\\";x")')
    expect(result).not.toContain('Field(alias="c";x")')
  })

  test('ordinary enum labels are unchanged', () => {
    const result = apply(buildMetadata({ types: [enumType(['ACTIVE', 'INACTIVE'])] }))

    expect(result).toContain('Literal["ACTIVE", "INACTIVE"]')
  })
})
