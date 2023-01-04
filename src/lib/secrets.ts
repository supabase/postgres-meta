// Use dynamic import to support module mock
const fs = await import('fs/promises')

export const getSecret = async (key: string) => {
  if (!key) {
    return ''
  }

  const env = process.env[key]
  if (env) {
    return env
  }

  const file = process.env[key + '_FILE']
  if (!file) {
    return ''
  }

  return await fs.readFile(file, { encoding: 'utf8' }).catch((e) => {
    if (e.code == 'ENOENT') {
      return ''
    }
    throw e
  })
}
