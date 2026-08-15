import { expect, test } from 'vitest'

import type { GeneratorMetadata } from '../../../src/lib/generators'
import { apply } from '../../../src/server/templates/python'

const emptyMetadata: GeneratorMetadata = {
  schemas: [],
  tables: [],
  foreignTables: [],
  views: [],
  materializedViews: [],
  columns: [],
  relationships: [],
  functions: [],
  types: [],
}

test('imports compatibility typing helpers from typing_extensions', () => {
  const result = apply(emptyMetadata)
  const typingImport = result.match(/from typing import \(([\s\S]*?)\)/)?.[1]

  expect(typingImport).not.toContain('NotRequired')
  expect(typingImport).not.toContain('TypeAlias')
  expect(result).toContain('from typing_extensions import NotRequired, TypeAlias')
})
