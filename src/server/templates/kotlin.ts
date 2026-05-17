import type {
  PostgresColumn,
  PostgresMaterializedView,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'
import { PostgresForeignTable } from '../../lib/types.js'

type Operation = 'Select' | 'Insert' | 'Update'

type KotlinProperty = {
  formattedName: string
  formattedType: string
  rawName: string
  needsSerialName: boolean
}

type KotlinDataClass = {
  formattedClassName: string
  properties: KotlinProperty[]
}

type KotlinEnum = {
  formattedEnumName: string
  cases: { formattedName: string; rawValue: string }[]
}

function pgEnumToKotlinEnum(pgEnum: PostgresType): KotlinEnum {
  return {
    formattedEnumName: formatForKotlinTypeName(pgEnum.name),
    cases: pgEnum.enums.map((value) => ({
      formattedName: formatForKotlinEnumCase(value),
      rawValue: value,
    })),
  }
}

function pgTypeToKotlinDataClass(
  table: PostgresTable | PostgresForeignTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  operation: Operation,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): KotlinDataClass {
  const properties: KotlinProperty[] =
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

      const formattedName = formatForKotlinPropertyName(column.name)

      return {
        rawName: column.name,
        formattedName,
        formattedType: pgTypeToKotlinType(column.format, nullable, { types, views, tables }),
        needsSerialName: formattedName !== column.name,
      }
    }) ?? []

  return {
    formattedClassName: `${formatForKotlinTypeName(table.name)}${operation}`,
    properties,
  }
}

function pgCompositeTypeToKotlinDataClass(
  type: PostgresType,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): KotlinDataClass {
  const typeWithRetrievedAttributes = {
    ...type,
    attributes: type.attributes.map((attribute) => {
      const resolvedType = types.find((t) => t.id === attribute.type_id)
      return { ...attribute, type: resolvedType }
    }),
  }

  const properties: KotlinProperty[] = typeWithRetrievedAttributes.attributes.map((attribute) => {
    const formattedName = formatForKotlinPropertyName(attribute.name)
    return {
      rawName: attribute.name,
      formattedName,
      formattedType: pgTypeToKotlinType(attribute.type!.format, false, { types, views, tables }),
      needsSerialName: formattedName !== attribute.name,
    }
  })

  return {
    formattedClassName: formatForKotlinTypeName(type.name),
    properties,
  }
}

function generateKotlinEnum(enum_: KotlinEnum, level: number): string[] {
  const output: string[] = []
  output.push(`${indent(level)}@Serializable`)
  output.push(`${indent(level)}enum class ${enum_.formattedEnumName} {`)
  enum_.cases.forEach((case_, index) => {
    const comma = index < enum_.cases.length - 1 ? ',' : ''
    output.push(
      `${indent(level + 1)}@SerialName("${case_.rawValue}") ${case_.formattedName}${comma}`
    )
  })
  output.push(`${indent(level)}}`)
  return output
}

function generateKotlinDataClass(dataClass: KotlinDataClass, level: number): string[] {
  const output: string[] = []

  if (dataClass.properties.length === 0) {
    output.push(`${indent(level)}@Serializable`)
    output.push(`${indent(level)}class ${dataClass.formattedClassName}`)
    return output
  }

  output.push(`${indent(level)}@Serializable`)
  output.push(`${indent(level)}data class ${dataClass.formattedClassName}(`)
  dataClass.properties.forEach((prop, index) => {
    const comma = index < dataClass.properties.length - 1 ? ',' : ''
    if (prop.needsSerialName) {
      output.push(`${indent(level + 1)}@SerialName("${prop.rawName}")`)
    }
    const defaultValue = prop.formattedType.endsWith('?') ? ' = null' : ''
    output.push(
      `${indent(level + 1)}val ${prop.formattedName}: ${prop.formattedType}${defaultValue}${comma}`
    )
  })
  output.push(`${indent(level)})`)
  return output
}

export const apply = ({
  schemas,
  tables,
  foreignTables,
  views,
  materializedViews,
  columns,
  types,
}: GeneratorMetadata): string => {
  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )

  columns
    .filter((c) => c.table_id in columnsByTableId)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((c) => columnsByTableId[c.table_id].push(c))

  const output: string[] = [
    'import kotlinx.serialization.SerialName',
    'import kotlinx.serialization.Serializable',
    '',
  ]

  schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((schema) => {
      const schemaTables = [...tables, ...foreignTables]
        .filter((table) => table.schema === schema.name)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))

      const schemaViews = [...views, ...materializedViews]
        .filter((view) => view.schema === schema.name)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))

      const schemaEnums = types
        .filter((type) => type.schema === schema.name && type.enums.length > 0)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))

      const schemaCompositeTypes = types
        .filter((type) => type.schema === schema.name && type.attributes.length > 0)
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))

      // Enums
      schemaEnums.forEach((enum_) => {
        output.push(...generateKotlinEnum(pgEnumToKotlinEnum(enum_), 0))
        output.push('')
      })

      // Tables: Select, Insert, Update
      schemaTables.forEach((table) => {
        ;(['Select', 'Insert', 'Update'] as Operation[]).forEach((operation) => {
          const dataClass = pgTypeToKotlinDataClass(table, columnsByTableId[table.id], operation, {
            types,
            views,
            tables,
          })
          output.push(...generateKotlinDataClass(dataClass, 0))
          output.push('')
        })
      })

      // Views: Select only
      schemaViews.forEach((view) => {
        const dataClass = pgTypeToKotlinDataClass(view, columnsByTableId[view.id], 'Select', {
          types,
          views,
          tables,
        })
        output.push(...generateKotlinDataClass(dataClass, 0))
        output.push('')
      })

      // Composite types
      schemaCompositeTypes.forEach((type) => {
        const dataClass = pgCompositeTypeToKotlinDataClass(type, { types, views, tables })
        output.push(...generateKotlinDataClass(dataClass, 0))
        output.push('')
      })
    })

  // Remove trailing empty line
  while (output.length > 0 && output[output.length - 1] === '') {
    output.pop()
  }

  return output.join('\n')
}

// Maps PostgreSQL types to Kotlin types
const pgTypeToKotlinType = (
  pgType: string,
  nullable: boolean,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): string => {
  let kotlinType: string

  if (pgType === 'bool') {
    kotlinType = 'Boolean'
  } else if (pgType === 'int2') {
    kotlinType = 'Short'
  } else if (pgType === 'int4') {
    kotlinType = 'Int'
  } else if (pgType === 'int8') {
    kotlinType = 'Long'
  } else if (pgType === 'float4') {
    kotlinType = 'Float'
  } else if (pgType === 'float8') {
    kotlinType = 'Double'
  } else if (['numeric', 'decimal'].includes(pgType)) {
    kotlinType = 'Double'
  } else if (pgType === 'uuid') {
    kotlinType = 'String'
  } else if (
    [
      'bytea',
      'bpchar',
      'varchar',
      'date',
      'text',
      'citext',
      'time',
      'timetz',
      'timestamp',
      'timestamptz',
      'vector',
    ].includes(pgType)
  ) {
    kotlinType = 'String'
  } else if (['json', 'jsonb'].includes(pgType)) {
    kotlinType = 'kotlinx.serialization.json.JsonElement'
  } else if (pgType === 'void') {
    kotlinType = 'Unit'
  } else if (pgType === 'record') {
    kotlinType = 'kotlinx.serialization.json.JsonObject'
  } else if (pgType.startsWith('_')) {
    kotlinType = `List<${pgTypeToKotlinType(pgType.substring(1), false, { types, views, tables })}>`
  } else {
    const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
    const compositeType = [...types, ...views, ...tables].find((type) => type.name === pgType)

    if (enumType) {
      kotlinType = formatForKotlinTypeName(enumType.name)
    } else if (compositeType) {
      kotlinType = `${formatForKotlinTypeName(compositeType.name)}Select`
    } else {
      kotlinType = 'kotlinx.serialization.json.JsonElement'
    }
  }

  return `${kotlinType}${nullable ? '?' : ''}`
}

function indent(level: number): string {
  return '    '.repeat(level)
}

/**
 * Converts a Postgres name to PascalCase for Kotlin type names.
 *
 * @example
 * formatForKotlinTypeName('pokedex') // Pokedex
 * formatForKotlinTypeName('pokemon_center') // PokemonCenter
 * formatForKotlinTypeName('victory-road') // VictoryRoad
 */
function formatForKotlinTypeName(name: string): string {
  let prefix = ''
  if (name.startsWith('_')) {
    prefix = '_'
    name = name.slice(1)
  }

  return (
    prefix +
    name
      .split(/[^a-zA-Z0-9]+/)
      .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
      .join('')
  )
}

const KOTLIN_KEYWORDS = [
  'as',
  'break',
  'class',
  'continue',
  'do',
  'else',
  'false',
  'for',
  'fun',
  'if',
  'in',
  'interface',
  'is',
  'null',
  'object',
  'package',
  'return',
  'super',
  'this',
  'throw',
  'true',
  'try',
  'typealias',
  'typeof',
  'val',
  'var',
  'when',
  'while',
]

/**
 * Converts a Postgres name to camelCase for Kotlin property names.
 *
 * @example
 * formatForKotlinPropertyName('pokedex') // pokedex
 * formatForKotlinPropertyName('pokemon_center') // pokemonCenter
 * formatForKotlinPropertyName('event_type') // eventType
 */
function formatForKotlinPropertyName(name: string): string {
  const propertyName = name
    .split(/[^a-zA-Z0-9]/)
    .map((word, index) => {
      const lowerWord = word.toLowerCase()
      return index !== 0 ? lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1) : lowerWord
    })
    .join('')

  return KOTLIN_KEYWORDS.includes(propertyName) ? `\`${propertyName}\`` : propertyName
}

/**
 * Converts a Postgres enum value to UPPER_SNAKE_CASE for Kotlin enum cases.
 *
 * @example
 * formatForKotlinEnumCase('new') // NEW
 * formatForKotlinEnumCase('in_progress') // IN_PROGRESS
 * formatForKotlinEnumCase('ACTIVE') // ACTIVE
 */
function formatForKotlinEnumCase(name: string): string {
  // If already UPPER_SNAKE_CASE, keep as-is
  if (/^[A-Z][A-Z0-9_]*$/.test(name)) {
    return name
  }

  return name
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase()
}
