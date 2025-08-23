import { expect, test, describe } from 'vitest'
import { build } from '../src/server/app.js'
import { TEST_CONNECTION_STRING } from './lib/utils.js'

describe('server/routes/schemas', () => {
  test('should list schemas', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/schemas',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })

  test('should list schemas with query parameters', async () => {
    const app = build()
    const response = await app.inject({
      method: 'GET',
      url: '/schemas?include_system_schemas=true&limit=5&offset=0',
      headers: {
        pg: TEST_CONNECTION_STRING,
      },
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(response.body))).toBe(true)
    await app.close()
  })
})
