import type { GeneratorMetadata } from '../../lib/generators.js'

// Bump when the shape of the emitted document changes in a way consumers
// must detect (field removals, renames, or semantic changes). Additive
// changes are backwards compatible and do not require a bump.
export const JSON_SCHEMA_VERSION = 1

export const apply = ({
  schemas,
  tables,
  foreignTables,
  views,
  materializedViews,
  columns,
  relationships,
  functions,
  types,
}: GeneratorMetadata): string => {
  return JSON.stringify(
    {
      version: JSON_SCHEMA_VERSION,
      schemas,
      tables,
      foreignTables,
      views,
      materializedViews,
      columns,
      relationships,
      functions,
      types,
    },
    null,
    2
  )
}
