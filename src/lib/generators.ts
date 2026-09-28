import {
  introspect,
  resolveOptions,
  type GeneratorMetadata,
  type OptionValue,
  type Queryable,
  type ResolvedOptions,
  type TypegenLanguage,
} from '@supabase/typegen'
import PostgresMeta from './PostgresMeta.js'
import { PostgresMetaResult } from './types.js'

export type { GeneratorMetadata }

/**
 * Adapter over `introspect()` preserving the `{ data, error }` contract of the
 * rest of the library. The package takes a structural `Queryable` whose
 * `query()` resolves to `{ rows }` and throws on failure, so `pgMeta.query`
 * is wrapped into that shape and the first query error becomes the result
 * error. The pool is ended on every path.
 */
export async function getGeneratorMetadata(
  pgMeta: PostgresMeta,
  filters: { includedSchemas?: string[]; excludedSchemas?: string[] } = {
    includedSchemas: [],
    excludedSchemas: [],
  }
): Promise<PostgresMetaResult<GeneratorMetadata>> {
  const queryable: Queryable = {
    query: async (sql: string) => {
      const { data, error } = await pgMeta.query(sql)
      if (error) {
        throw error
      }
      return { rows: data ?? [] }
    },
  }

  try {
    const data = await introspect(queryable, {
      includedSchemas: filters.includedSchemas,
      excludedSchemas: filters.excludedSchemas,
    })
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error as PostgresMetaResult<GeneratorMetadata>['error'] & { message: string },
    }
  } finally {
    await pgMeta.end()
  }
}

/**
 * Keeps the entries of `candidates` that `language` declares as options and
 * that have a value, then validates them and applies the language's defaults.
 * Callers list every setting they can supply once; each language receives
 * only its own, since `generate` rejects unknown names. Throws an
 * `InvalidOptionError` for a bad value, so callers can reject it before
 * touching the database.
 */
export function declaredOptions(
  language: TypegenLanguage,
  candidates: Readonly<Record<string, OptionValue | undefined>>
): ResolvedOptions {
  const values: Record<string, OptionValue> = {}
  for (const option of language.options) {
    const value = candidates[option.name]
    if (value !== undefined) {
      values[option.name] = value
    }
  }
  return resolveOptions(language.name, language.options, values)
}
