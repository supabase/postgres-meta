import { expect, test, describe } from 'vitest'
import { changeRoleConfig2Object } from '../src/lib/PostgresMetaRoles.js'

describe('changeRoleConfig2Object', () => {
  test('keeps everything after the first equals sign', () => {
    expect(changeRoleConfig2Object(['application_name=api=worker'])).toStrictEqual({
      application_name: 'api=worker',
    })
  })

  test('parses ordinary values unchanged', () => {
    expect(changeRoleConfig2Object(['search_path=public'])).toStrictEqual({
      search_path: 'public',
    })
  })

  test('handles both kinds of entry together', () => {
    expect(
      changeRoleConfig2Object(['application_name=api=worker', 'search_path=public'])
    ).toStrictEqual({ application_name: 'api=worker', search_path: 'public' })
  })

  test('an entry without an equals sign has no value', () => {
    expect(changeRoleConfig2Object(['lone_key'])).toStrictEqual({ lone_key: undefined })
  })

  test('returns null when there is no config', () => {
    expect(changeRoleConfig2Object(null as unknown as string[])).toBeNull()
  })
})
