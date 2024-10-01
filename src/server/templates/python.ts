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
from pydantic import BaseModel, Json
from typing import Any
import datetime

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
 * formatForPyTypeName('pokedex') // Pokedex
 * formatForPyTypeName('pokemon_center') // PokemonCenter
 * formatForPyTypeName('victory-road') // VictoryRoad
 * formatForPyTypeName('pokemon league') // PokemonLeague
 * ```
 */
function formatForPyTypeName(name: string): string {
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
        formatForPyTypeName(column.name),
        pgTypeToPythonType(column.format, nullable, types),
        column.name,
      ]
    }) ?? []

  // Pad the formatted name and type to align the struct fields, then join
  // create the final string representation of the struct fields.
  const formattedColumnEntries = columnEntries.map(([formattedName, type, name]) => {
    return `  ${formattedName}: ${type} = Field(alias="${name}")`
  })

  return `
class ${formatForPyTypeName(schema.name)}${formatForPyTypeName(table.name)}${operation}(BaseModel):
${formattedColumnEntries.join('\n')}
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
      formatForPyTypeName(attribute.name),
      pgTypeToPythonType(attribute.type!.format, false),
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
type ${formatForPyTypeName(schema.name)}${formatForPyTypeName(type.name)} struct {
${formattedAttributeEntries.join('\n')}
}
`.trim()
}

const PY_TYPE_MAP = {
  // Bool
  bool: 'bool',

  // Numbers
  int2: 'int',
  int4: 'int',
  int8: 'int',
  float4: 'float',
  float8: 'float',
  numeric: 'float',

  // Strings
  bytea: 'bytes',
  bpchar: 'str',
  varchar: 'str',
  date: 'datetime.date',
  text: 'str',
  citext: 'str',
  time: 'datetime.time',
  timetz: 'datetime.timezone',
  timestamp: 'datetime.datetime',
  timestamptz: 'datetime.timezone',
  uuid: 'uuid.UUID',
  vector: 'list[Any]',

  // JSON
  json: 'Json[Any]',
  jsonb: 'Json[Any]',

  // Range types (can be adjusted to more complex types if needed)
  int4range: 'str',
  int4multirange: 'str',
  int8range: 'str',
  int8multirange: 'str',
  numrange: 'str',
  nummultirange: 'str',
  tsrange: 'str',
  tsmultirange: 'str',
  tstzrange: 'str',
  tstzmultirange: 'str',
  daterange: 'str',
  datemultirange: 'str',

  // Miscellaneous types
  void: 'None',
  record: 'dict[str, Any]',
} as const

type PythonType = (typeof PY_TYPE_MAP)[keyof typeof PY_TYPE_MAP]

function pgTypeToPythonType(pgType: string, nullable: boolean, types: PostgresType[] = []): string {
  let pythonType: PythonType | undefined = undefined

  if (pgType in PY_TYPE_MAP) {
    pythonType = PY_TYPE_MAP[pgType as keyof typeof PY_TYPE_MAP]
  }

  // Enums
  const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
  if (enumType) {
    pythonType = 'str' // Enums typically map to strings in Python
  }

  if (pythonType) {
    // If the type is nullable, append "| None" to the type
    return nullable ? `${pythonType} | None` : pythonType
  }

  // Composite types
  const compositeType = types.find((type) => type.name === pgType && type.attributes.length > 0)
  if (compositeType) {
    // In Python, we can map composite types to dictionaries
    return nullable ? 'dict[str, Any] | None' : 'dict[str, Any]'
  }

  // Arrays
  if (pgType.startsWith('_')) {
    const innerType = pgTypeToPythonType(pgType.slice(1), nullable, types)
    return `list[${innerType}]`
  }

  // Fallback
  return nullable ? 'Any | None' : 'Any'
}
