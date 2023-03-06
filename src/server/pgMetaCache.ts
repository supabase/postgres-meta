import LruCache from 'lru-cache'
import PostgresMeta from '../lib/PostgresMeta.js'
import { DEFAULT_POOL_CONFIG } from './constants.js'

const cache = new LruCache<string, PostgresMeta>({
  max: 100,
  dispose: async (value) => {
    await value.end()
  },
})

/**
 * Retrieve a PostgresMeta handle from the cache. If it doesn't exist, create
 * the handle and insert it into the cache.
 */
const get = (connectionString: string): PostgresMeta => {
  let pgMeta: PostgresMeta | undefined = cache.get(connectionString)

  if (pgMeta === undefined) {
    pgMeta = new PostgresMeta({ ...DEFAULT_POOL_CONFIG, connectionString })
    cache.set(connectionString, pgMeta)
  }

  return pgMeta
}

export default {
  get,
}
