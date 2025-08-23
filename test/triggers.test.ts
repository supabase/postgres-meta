import { expect, test, describe } from 'vitest'
import { build } from '../src/server/app.js'
import { TEST_CONNECTION_STRING } from './lib/utils.js'

describe('server/routes/triggers', () => {
  test('should list triggers', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/triggers',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })

  test('should list triggers with query parameters', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/triggers?include_system_schemas=true&limit=5&offset=0',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })
})
