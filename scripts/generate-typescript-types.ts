#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { parseArgs } from 'node:util'
import { build } from '../src/server/app.js'

function parseCsv(value?: string): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseBoolean(value?: boolean | string): boolean | undefined {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === undefined) {
    return undefined
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  throw new Error(`Expected a boolean value, received "${value}"`)
}

async function writeToStdout(output: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    process.stdout.write(output, (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

const { values } = parseArgs({
  options: {
    'db-url': { type: 'string' },
    'included-schemas': { type: 'string' },
    'detect-one-to-one-relationships': { type: 'boolean' },
    'postgrest-version': { type: 'string' },
    output: { type: 'string' },
  },
  strict: true,
  allowPositionals: false,
})

const connectionString = values['db-url'] ?? process.env.PG_META_DB_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  console.error('Missing database URL. Pass --db-url or set PG_META_DB_URL/DATABASE_URL.')
  process.exit(1)
}

const includedSchemas = parseCsv(
  values['included-schemas'] ?? process.env.PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS
)
const detectOneToOneRelationships =
  parseBoolean(
    values['detect-one-to-one-relationships'] ??
      process.env.PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS
  ) ?? false
const postgrestVersion = values['postgrest-version'] ?? process.env.PG_META_POSTGREST_VERSION
const outputPath = values.output ?? process.env.PG_META_GENERATE_TYPES_OUTPUT

const app = build()

try {
  const response = await app.inject({
    method: 'GET',
    url: '/generators/typescript',
    headers: {
      pg: connectionString,
      'x-pg-application-name': 'postgres-meta generate-typescript-types',
    },
    query: {
      ...(includedSchemas.length > 0 ? { included_schemas: includedSchemas.join(',') } : {}),
      ...(detectOneToOneRelationships ? { detect_one_to_one_relationships: 'true' } : {}),
      ...(postgrestVersion ? { postgrest_version: postgrestVersion } : {}),
    },
  })

  if (response.statusCode !== 200) {
    throw new Error(`Type generation failed with status ${response.statusCode}: ${response.body}`)
  }

  if (outputPath) {
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, response.body, 'utf8')
  } else {
    await writeToStdout(response.body)
  }
} catch (error) {
  console.error('Failed to generate TypeScript types:', error)
  process.exit(1)
} finally {
  await app.close()
}
