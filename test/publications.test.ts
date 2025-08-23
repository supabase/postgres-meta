import { expect, test, describe } from 'vitest'
import { build } from '../src/server/app.js'
import { TEST_CONNECTION_STRING } from './lib/utils.js'

describe('server/routes/publications', () => {
  test('should list publications', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/publications',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })

  test('should list publications with query parameters', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/publications?limit=5&offset=0',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })
})
