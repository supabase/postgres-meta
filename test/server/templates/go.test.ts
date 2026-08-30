import { describe, expect, test } from 'vitest'

import { apply } from '../../../src/server/templates/go'
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

const userStatusEnum: PostgresType = {
  id: 100,
  name: 'user_status',
  schema: 'public',
  format: 'user_status',
  enums: ['ACTIVE', 'INACTIVE'],
  attributes: [],
  comment: null,
  type_relation_id: null,
}

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

const buildMetadata = (columns: PostgresColumn[]): GeneratorMetadata => ({
  schemas: [baseSchema],
  tables: [baseTable],
  foreignTables: [],
  views: [],
  materializedViews: [],
  columns,
  relationships: [],
  functions: [],
  types: [userStatusEnum],
})

describe('go typegen pgTypeToGoType array fallback', () => {
  test('non-nullable array of enum resolves to []string, not []interface{}', () => {
    const result = apply(
      buildMetadata([baseColumn({ name: 'tags', format: '_user_status', is_nullable: false })])
    )

    expect(result).toMatch(/Tags\s+\[]string\b/)
    expect(result).not.toMatch(/Tags\s+\[]interface\{\}/)
  })

  test('nullable array of enum resolves to []*string, not []interface{}', () => {
    const result = apply(
      buildMetadata([baseColumn({ name: 'tags', format: '_user_status', is_nullable: true })])
    )

    expect(result).toMatch(/Tags\s+\[]\*string\b/)
    expect(result).not.toMatch(/Tags\s+\[]interface\{\}/)
  })

  test('plain text array still resolves to []string', () => {
    const result = apply(
      buildMetadata([baseColumn({ name: 'tags', format: '_text', is_nullable: false })])
    )

    expect(result).toMatch(/Tags\s+\[]string\b/)
  })
})

describe('go typegen struct tag escaping', () => {
  test('uses an interpreted struct tag when a column name contains a backtick', () => {
    const result = apply(
      buildMetadata([baseColumn({ name: `back${String.fromCharCode(96)}tick`, format: 'text' })])
    )

    expect(result).toContain('BackTick string "json:\\"back`tick\\""')
  })

  test('preserves raw struct tags for ordinary column names', () => {
    const result = apply(buildMetadata([baseColumn({ name: 'display_name', format: 'text' })]))

    expect(result).toContain('DisplayName string `json:"display_name"`')
  })

  test('escapes composite type attribute tags', () => {
    const textType = {
      id: 101,
      name: 'text',
      schema: 'pg_catalog',
      format: 'text',
      enums: [],
      attributes: [],
    } as PostgresType
    const compositeType = {
      id: 102,
      name: 'details',
      schema: 'public',
      format: 'details',
      enums: [],
      attributes: [{ name: `back${String.fromCharCode(96)}tick`, type_id: textType.id }],
    } as PostgresType
    const result = apply({ ...buildMetadata([]), types: [textType, compositeType] })

    expect(result).toContain('BackTick string "json:\\"back`tick\\""')
  })
})
