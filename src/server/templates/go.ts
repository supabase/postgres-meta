import prettier from 'prettier'
import type {
  PostgresColumn,
  PostgresFunction,
  PostgresMaterializedView,
  PostgresRelationship,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'

export const apply = ({
  schemas,
  tables,
  views,
  materializedViews,
  columns,
  relationships,
  functions,
  types,
  arrayTypes,
}: GeneratorMetadata): string => {
  const columnsByTableId = columns
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .reduce((acc, curr) => {
      acc[curr.table_id] ??= []
      acc[curr.table_id].push(curr)
      return acc
    }, {} as Record<string, PostgresColumn[]>)

  let output = `
package database

${tables.map((table) => generateTableStruct(schemas.find((schema) => schema.name === table.schema)!, table, columnsByTableId[table.id], types)).join('\n\n')}
`

  return output
}

/**
 * Converts a Postgres name to PascalCase.
 *
 * @example
 * ```ts
 * formatForGoTypeName('pokedex') // Pokedex
 * formatForGoTypeName('pokemon_center') // PokemonCenter
 * formatForGoTypeName('victory-road') // VictoryRoad
 * formatForGoTypeName('pokemon league') // PokemonLeague
 * ```
 */
function formatForGoTypeName(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]/)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join('')
}

function generateTableStruct(schema: PostgresSchema, table: PostgresTable, columns: PostgresColumn[], types: PostgresType[]): string {
  // Storing columns as a tuple of [formattedName, type, name] rather than creating the string
  // representation of the line allows us to pre-format the entries. Go formats
  // struct fields to be aligned, e.g.:
  // ```go
  // type Pokemon struct {
  //   id   int    `json:"id"`
  //   name string `json:"name"`
  // }
  const columnEntries: [string, string, string][] = columns.map((column) => [
    formatForGoTypeName(column.name),
    pgTypeToGoType(column.format, types),
    column.name,
  ])

  const [maxFormattedNameLength, maxTypeLength] = columnEntries.reduce(([maxFormattedName, maxType], [formattedName, type]) => {
    return [Math.max(maxFormattedName, formattedName.length), Math.max(maxType, type.length)]
  }, [0, 0])

  // Pad the formatted name and type to align the struct fields, then join
  // create the final string representation of the struct fields.
  const formattedColumnEntries = columnEntries.map(([formattedName, type, name]) => {
    return `  ${formattedName.padEnd(maxFormattedNameLength)} ${type.padEnd(maxTypeLength)} \`json:"${name}"\``
  })


  return `
type ${formatForGoTypeName(schema.name)}${formatForGoTypeName(table.name)} struct {
${formattedColumnEntries.join('\n')}
}
`.trim()
}

// Note: the type map uses `interface{}`, not `any`, to remain compatible with
// older versions of Go.
const GO_TYPE_MAP: Record<string, string> = {
  // Bool
  bool: 'bool',

  // Numbers
  int2: 'int16',
  int4: 'int32',
  int8: 'int64',
  float4: 'float32',
  float8: 'float64',
  numeric: 'float64',

  // Strings
  bytea: '[]byte',
  bpchar: 'string',
  varchar: 'string',
  date: 'string',
  text: 'string',
  citext: 'string',
  time: 'string',
  timetz: 'string',
  timestamp: 'string',
  timestamptz: 'string',
  uuid: 'string',
  vector: 'string',

  // JSON
  json: 'interface{}',
  jsonb: 'interface{}',

  // Misc
  void: 'interface{}',
  record: 'map[string]interface{}',
}

function pgTypeToGoType(pgType: string, types: PostgresType[] = []): string {
  let goType = GO_TYPE_MAP[pgType]
  if (goType) {
    return goType
  }

  // Arrays
  if (pgType.startsWith('_')) {
    const innerType = pgTypeToGoType(pgType.slice(1))
    return `[]${innerType}`
  }

  // Enums
  const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
  if (enumType) {
    return 'string'
  }

  // Composite types
  const compositeType = types.find((type) => type.name === pgType && type.attributes.length > 0)
  if (compositeType) {
    // TODO: generate composite types
    // return formatForGoTypeName(pgType)
    return 'map[string]interface{}'
  }

  // Fallback
  return 'interface{}'
}
