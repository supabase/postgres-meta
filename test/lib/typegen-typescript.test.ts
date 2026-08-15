import { expect, test, describe } from 'vitest'
import { pgTypeToTsType } from '../../src/server/templates/typescript.js'

const mockSchema = { id: 1, name: 'public' } as any
const mockContext = { types: [], schemas: [], tables: [], views: [] }

describe('pgTypeToTsType', () => {
  test('maps vector to number[]', () => {
    expect(pgTypeToTsType(mockSchema, 'vector', mockContext)).toBe('number[]')
  })

  test('maps _vector to (number[])[]', () => {
    expect(pgTypeToTsType(mockSchema, '_vector', mockContext)).toBe('(number[])[]')
  })

  test('maps text to string', () => {
    expect(pgTypeToTsType(mockSchema, 'text', mockContext)).toBe('string')
  })

  test('maps bool to boolean', () => {
    expect(pgTypeToTsType(mockSchema, 'bool', mockContext)).toBe('boolean')
  })

  test('maps int4 to number', () => {
    expect(pgTypeToTsType(mockSchema, 'int4', mockContext)).toBe('number')
  })
})