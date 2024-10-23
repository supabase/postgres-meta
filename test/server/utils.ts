import { expect, test } from 'vitest'
import { build as buildApp } from '../../src/server/app'
import { generateTypeFromCheckConstraint } from '../../src/server/utils'

export const app = buildApp()

test('generate type string from json_matches check constraint', async () => {
  const checkConstraintStr = `
  jsonb_matches_schema('{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "popularity_score": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      },
      "address": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string"
          },
          "street": {
            "type": "string"
          }
        },
        "required": [
          "city",
          "street"
        ]
      }
    },
    "required": [
      "popoularity_score"
    ]
  }'::json, metadata)
  `

  await expect(generateTypeFromCheckConstraint(checkConstraintStr)).resolves.toMatchInlineSnapshot(`
      "{
        popularity_score?: number
        name?: string
        address?: {
          city: string
          street: string
          [k: string]: unknown
        }
        [k: string]: unknown
      }
      "
  `)
})

test('generate type string from pure json schema', async () => {
  const checkConstraintStr = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      popularity_score: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      address: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
        },
        required: ['city', 'street'],
      },
    },
    required: ['popoularity_score'],
  }

  await expect(generateTypeFromCheckConstraint(checkConstraintStr)).resolves.toMatchInlineSnapshot(`
      "{
        popularity_score?: number
        name?: string
        address?: {
          city: string
          street: string
          [k: string]: unknown
        }
        [k: string]: unknown
      }
      "
  `)
})
