// Deliberately plain JavaScript, not TypeScript.
//
// piscina loads this file in a fresh worker thread that does not inherit the
// parent's module transform pipeline -- so under ts-node, and especially under
// vitest (which transforms TypeScript in memory, leaving no .js on disk), a
// .ts worker entry cannot be resolved. Keeping it as real JavaScript means dev,
// tests and the built output all load the exact same file. It is copied to
// dist/ by the build script alongside the .sql files.

import { findLanguage } from '@supabase/typegen'
import { host } from './typegen-host.js'

/**
 * @param {{
 *   language: string,
 *   metadata: import('@supabase/typegen').GeneratorMetadata,
 *   options: import('@supabase/typegen').OptionValues,
 * }} task
 * @returns {Promise<string>}
 */
export default async function generate({ language, metadata, options }) {
  const entry = findLanguage(language)
  if (!entry) {
    throw new Error(`Unknown language: ${language}`)
  }
  return entry.generate(metadata, options, host)
}
