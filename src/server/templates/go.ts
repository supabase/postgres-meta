import type {
  PostgresColumn,
  PostgresMaterializedView,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'

type Operation = 'Select' | 'Insert' | 'Update'

export const apply = ({
  schemas,
  tables,
  views,
  materializedViews,
  columns,
  types,
}: GeneratorMetadata): string => {
  const columnsByTableId = columns
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .reduce(
      (acc, curr) => {
        acc[curr.table_id] ??= []
        acc[curr.table_id].push(curr)
        return acc
      },
      {} as Record<string, PostgresColumn[]>
    )

  const compositeTypes = types.filter((type) => type.attributes.length > 0)

  let output = `
package database

import "database/sql"

${tables
  .filter((table) => schemas.some((schema) => schema.name === table.schema))
  .flatMap((table) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === table.schema)!,
      table,
      columnsByTableId[table.id],
      types,
      ['Select', 'Insert', 'Update']
    )
  )
  .join('\n\n')}

${views
  .filter((view) => schemas.some((schema) => schema.name === view.schema))
  .flatMap((view) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === view.schema)!,
      view,
      columnsByTableId[view.id],
      types,
      ['Select']
    )
  )
  .join('\n\n')}

${materializedViews
  .filter((materializedView) => schemas.some((schema) => schema.name === materializedView.schema))
  .flatMap((materializedView) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === materializedView.schema)!,
      materializedView,
      columnsByTableId[materializedView.id],
      types,
      ['Select']
    )
  )
  .join('\n\n')}

${compositeTypes
  .filter((compositeType) => schemas.some((schema) => schema.name === compositeType.schema))
  .map((compositeType) =>
    generateCompositeTypeStruct(
      schemas.find((schema) => schema.name === compositeType.schema)!,
      compositeType,
      types
    )
  )
  .join('\n\n')}
`.trim()

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

function generateTableStruct(
  schema: PostgresSchema,
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  types: PostgresType[],
  operation: Operation
): string {
  // Storing columns as a tuple of [formattedName, type, name] rather than creating the string
  // representation of the line allows us to pre-format the entries. Go formats
  // struct fields to be aligned, e.g.:
  // ```go
  // type Pokemon struct {
  //   id   int    `json:"id"`
  //   name string `json:"name"`
  // }
  const columnEntries: [string, string, string][] =
    columns?.map((column) => {
      let nullable: boolean
      if (operation === 'Insert') {
        nullable =
          column.is_nullable || column.is_identity || column.is_generated || !!column.default_value
      } else if (operation === 'Update') {
        nullable = true
      } else {
        nullable = column.is_nullable
      }
      return [
        formatForGoTypeName(column.name),
        pgTypeToGoType(column.format, nullable, types),
        column.name,
      ]
    }) ?? []

  const [maxFormattedNameLength, maxTypeLength] = columnEntries.reduce(
    ([maxFormattedName, maxType], [formattedName, type]) => {
      return [Math.max(maxFormattedName, formattedName.length), Math.max(maxType, type.length)]
    },
    [0, 0]
  )

  // Pad the formatted name and type to align the struct fields, then join
  // create the final string representation of the struct fields.
  const formattedColumnEntries = columnEntries.map(([formattedName, type, name]) => {
    return `  ${formattedName.padEnd(maxFormattedNameLength)} ${type.padEnd(
      maxTypeLength
    )} \`json:"${name}"\``
  })

  return `
type ${formatForGoTypeName(schema.name)}${formatForGoTypeName(table.name)}${operation} struct {
${formattedColumnEntries.join('\n')}
}
`.trim()
}

function generateTableStructsForOperations(
  schema: PostgresSchema,
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  types: PostgresType[],
  operations: Operation[]
): string[] {
  return operations.map((operation) =>
    generateTableStruct(schema, table, columns, types, operation)
  )
}

function generateCompositeTypeStruct(
  schema: PostgresSchema,
  type: PostgresType,
  types: PostgresType[]
): string {
  // Use the type_id of the attributes to find the types of the attributes
  const typeWithRetrievedAttributes = {
    ...type,
    attributes: type.attributes.map((attribute) => {
      const type = types.find((type) => type.id === attribute.type_id)
      return {
        ...attribute,
        type,
      }
    }),
  }
  const attributeEntries: [string, string, string][] = typeWithRetrievedAttributes.attributes.map(
    (attribute) => [
      formatForGoTypeName(attribute.name),
      pgTypeToGoType(attribute.type!.format, false),
      attribute.name,
    ]
  )

  const [maxFormattedNameLength, maxTypeLength] = attributeEntries.reduce(
    ([maxFormattedName, maxType], [formattedName, type]) => {
      return [Math.max(maxFormattedName, formattedName.length), Math.max(maxType, type.length)]
    },
    [0, 0]
  )

  // Pad the formatted name and type to align the struct fields, then join
  // create the final string representation of the struct fields.
  const formattedAttributeEntries = attributeEntries.map(([formattedName, type, name]) => {
    return `  ${formattedName.padEnd(maxFormattedNameLength)} ${type.padEnd(
      maxTypeLength
    )} \`json:"${name}"\``
  })

  return `
type ${formatForGoTypeName(schema.name)}${formatForGoTypeName(type.name)} struct {
${formattedAttributeEntries.join('\n')}
}
`.trim()
}

// Note: the type map uses `interface{ } `, not `any`, to remain compatible with
// older versions of Go.
const GO_TYPE_MAP = {
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

  // Range
  int4range: 'string',
  int4multirange: 'string',
  int8range: 'string',
  int8multirange: 'string',
  numrange: 'string',
  nummultirange: 'string',
  tsrange: 'string',
  tsmultirange: 'string',
  tstzrange: 'string',
  tstzmultirange: 'string',
  daterange: 'string',
  datemultirange: 'string',

  // Misc
  void: 'interface{}',
  record: 'map[string]interface{}',
} as const

type GoType = (typeof GO_TYPE_MAP)[keyof typeof GO_TYPE_MAP]

const GO_NULLABLE_TYPE_MAP: Record<GoType, string> = {
  string: 'sql.NullString',
  bool: 'sql.NullBool',
  int16: 'sql.NullInt32',
  int32: 'sql.NullInt32',
  int64: 'sql.NullInt64',
  float32: 'sql.NullFloat64',
  float64: 'sql.NullFloat64',
  '[]byte': '[]byte',
  'interface{}': 'interface{}',
  'map[string]interface{}': 'map[string]interface{}',
}

function pgTypeToGoType(pgType: string, nullable: boolean, types: PostgresType[] = []): string {
  let goType: GoType | undefined = undefined
  if (pgType in GO_TYPE_MAP) {
    goType = GO_TYPE_MAP[pgType as keyof typeof GO_TYPE_MAP]
  }

  // Enums
  const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
  if (enumType) {
    goType = 'string'
  }

  if (goType) {
    if (nullable) {
      return GO_NULLABLE_TYPE_MAP[goType]
    }
    return goType
  }

  // Composite types
  const compositeType = types.find((type) => type.name === pgType && type.attributes.length > 0)
  if (compositeType) {
    // TODO: generate composite types
    // return formatForGoTypeName(pgType)
    return 'map[string]interface{}'
  }

  // Arrays
  if (pgType.startsWith('_')) {
    const innerType = pgTypeToGoType(pgType.slice(1), nullable)
    return `[]${innerType} `
  }

  // Fallback
  return 'interface{}'
}
