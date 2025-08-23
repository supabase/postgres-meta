import { expect, test, describe } from 'vitest'
import { extractRequestForLogging, translateErrorToResponseCode } from '../src/server/utils.js'
import { FastifyRequest } from 'fastify'

describe('server utils', () => {
  describe('extractRequestForLogging', () => {
    test('should handle valid pg connection string', () => {
      const mockRequest = {
        method: 'POST',
        url: '/test',
        headers: {
          pg: 'postgresql://user:pass@localhost:5432/db',
          'x-supabase-info': 'test-info',
        },
      } as FastifyRequest

      const result = extractRequestForLogging(mockRequest)

      expect(result).toEqual({
        method: 'POST',
        url: '/test',
        pg: 'localhost',
        opt: 'test-info',
      })
    })

    test('should handle missing x-supabase-info header', () => {
      const mockRequest = {
        method: 'DELETE',
        url: '/test',
        headers: {
          pg: 'postgresql://user:pass@localhost:5432/db',
        },
      } as FastifyRequest

      const result = extractRequestForLogging(mockRequest)

      expect(result).toEqual({
        method: 'DELETE',
        url: '/test',
        pg: 'localhost',
        opt: '',
      })
    })
  })

  describe('translateErrorToResponseCode', () => {
    test('should return 504 for connection timeout', () => {
      const error = { message: 'Connection terminated due to connection timeout' }
      const result = translateErrorToResponseCode(error)
      expect(result).toBe(504)
    })

    test('should return 503 for too many clients', () => {
      const error = { message: 'sorry, too many clients already' }
      const result = translateErrorToResponseCode(error)
      expect(result).toBe(503)
    })
  })
})
