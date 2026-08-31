import { describe, expect, test } from 'vitest'
import { changeRoleConfig2Object } from '../src/lib/PostgresMetaRoles.js'

describe('changeRoleConfig2Object', () => {
  test('preserves equals signs within role config values', () => {
    expect(changeRoleConfig2Object(['application_name=api=worker', 'search_path=public'])).toEqual({
      application_name: 'api=worker',
      search_path: 'public',
    })
  })

  test('preserves existing parsing for entries without a separator', () => {
    expect(changeRoleConfig2Object(['search_path'])).toEqual({ search_path: undefined })
  })
})
