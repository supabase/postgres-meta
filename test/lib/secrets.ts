import { jest } from '@jest/globals'

// Ref: https://jestjs.io/docs/ecmascript-modules
jest.unstable_mockModule('fs/promises', () => ({
  readFile: jest.fn(),
}))
const { readFile } = await import('fs/promises')
const { getSecret } = await import('../../src/lib/secrets')

describe('getSecret', () => {
  const value = 'dummy'

  beforeEach(() => {
    // Clears env var
    jest.resetModules()
  })

  afterEach(() => {
    delete process.env.SECRET
    delete process.env.SECRET_FILE
  })

  it('loads from env', async () => {
    process.env.SECRET = value
    const res = await getSecret('SECRET')
    expect(res).toBe(value)
  })

  it('loads from file', async () => {
    process.env.SECRET_FILE = '/run/secrets/db_password'
    jest.mocked(readFile).mockResolvedValueOnce(value)
    const res = await getSecret('SECRET')
    expect(res).toBe(value)
  })

  it('defaults to empty string', async () => {
    expect(await getSecret('')).toBe('')
    expect(await getSecret('SECRET')).toBe('')
  })

  it('default on file not found', async () => {
    process.env.SECRET_FILE = '/run/secrets/db_password'
    const e: NodeJS.ErrnoException = new Error('no such file or directory')
    e.code = 'ENOENT'
    jest.mocked(readFile).mockRejectedValueOnce(e)
    const res = await getSecret('SECRET')
    expect(res).toBe('')
  })

  it('throws on permission denied', async () => {
    process.env.SECRET_FILE = '/run/secrets/db_password'
    const e: NodeJS.ErrnoException = new Error('permission denied')
    e.code = 'EACCES'
    jest.mocked(readFile).mockRejectedValueOnce(e)
    expect(getSecret('SECRET')).rejects.toThrow()
  })
})
