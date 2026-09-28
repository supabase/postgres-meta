// Plain JavaScript for the same reason as format-worker.js: the worker thread
// imports this file directly and has no TypeScript transform.

import { format as formatWithOxfmt } from 'oxfmt'

/**
 * Formats generated TypeScript the way `supabase gen types` output has always
 * been formatted. Passing it explicitly makes oxfmt this package's own
 * dependency instead of the optional peer postgrest-typegen's default
 * formatter would otherwise load.
 *
 * @param {string} code
 * @param {string} fileName
 * @returns {Promise<string>}
 */
const formatTypescript = async (code, fileName) => {
  const { code: formatted, errors } = await formatWithOxfmt(fileName, code, {
    semi: false,
    printWidth: 80,
  })
  if (errors.length > 0) {
    throw new Error(
      `oxfmt failed to format generated TypeScript output: ${errors
        .map((error) => error.message)
        .join('; ')}`
    )
  }
  return formatted
}

/**
 * The registry `Host` of the hosted routes and the one-shot mode. It never
 * spawns a tool, so `spawn` is left out; the same object is built on the
 * worker thread, since a function cannot cross the thread boundary.
 *
 * @type {import('@supabase/typegen').Host}
 */
export const host = { cwd: process.cwd(), env: process.env, format: formatTypescript }
