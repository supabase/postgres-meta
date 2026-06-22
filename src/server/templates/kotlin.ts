import type {
  PostgresColumn,
  PostgresMaterializedView,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'
import { PostgresForeignTable } from '../../lib/types.js'

type Operation = 'Select' | 'Insert' | 'Update'

/**
 * Kotlin visibility modifier applied to every generated declaration.
 *
 * `public` is Kotlin's default, so it is emitted implicitly (no modifier) to
 * keep the output idiomatic and lint-clean; `internal` is emitted explicitly.
 */
export type Visibility = 'public' | 'internal'

type KotlinGeneratorOptions = {
  visibility: Visibility
}

type KotlinEnumEntry = {
  formattedName: string
  serialName: string
}

type KotlinEnum = {
  formattedName: string
  entries: KotlinEnumEntry[]
}

type KotlinProperty = {
  formattedName: string
  formattedType: string
  serialName: string
  nullable: boolean
}

type KotlinDataClass = {
  formattedName: string
  properties: KotlinProperty[]
}

// Tracks which serialization symbols are referenced so the import block only
// includes what the generated file actually uses.
type ImportUsage = {
  serialName: boolean
  jsonElement: boolean
  jsonObject: boolean
}

function formatForKotlinSchemaName(schema: string): string {
  return `${formatForKotlinTypeName(schema)}Schema`
}

function pgEnumToKotlinEnum(pgEnum: PostgresType): KotlinEnum {
  return {
    formattedName: formatForKotlinTypeName(pgEnum.name),
    entries: pgEnum.enums.map((value) => ({
      formattedName: formatForKotlinEnumEntry(value),
      serialName: value,
    })),
  }
}

function pgTableToKotlinDataClass(
  table: PostgresTable | PostgresForeignTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  operation: Operation,
  context: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] },
  usage: ImportUsage
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

      return {
        formattedName: formatForKotlinPropertyName(column.name),
        formattedType: pgTypeToKotlinType(column.format, context, usage),
        serialName: column.name,
        nullable,
      }
    }) ?? []

  return {
    formattedName: `${formatForKotlinTypeName(table.name)}${operation}`,
    properties,
  }
}

function pgCompositeTypeToKotlinDataClass(
  type: PostgresType,
  context: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] },
  usage: ImportUsage
): KotlinDataClass {
  const properties: KotlinProperty[] = type.attributes.map((attribute) => {
    const attributeType = context.types.find((t) => t.id === attribute.type_id)
    return {
      formattedName: formatForKotlinPropertyName(attribute.name),
      formattedType: attributeType
        ? pgTypeToKotlinType(attributeType.format, context, usage)
        : 'JsonElement',
      serialName: attribute.name,
      nullable: false,
    }
  })

  if (!properties.length) {
    usage.jsonElement = true
  }

  return {
    formattedName: formatForKotlinTypeName(type.name),
    properties,
  }
}

function generateEnum(
  enum_: KotlinEnum,
  { visibility, level }: KotlinGeneratorOptions & { level: number },
  usage: ImportUsage
): string[] {
  const modifier = visibilityModifier(visibility)
  return [
    `${ident(level)}@Serializable`,
    `${ident(level)}${modifier}enum class ${enum_.formattedName} {`,
    ...enum_.entries.map((entry) => {
      const annotation =
        entry.serialName !== entry.formattedName
          ? `@SerialName("${escapeForKotlinString(entry.serialName)}") `
          : ''
      if (annotation) usage.serialName = true
      return `${ident(level + 1)}${annotation}${entry.formattedName},`
    }),
    `${ident(level)}}`,
  ]
}

function generateDataClass(
  dataClass: KotlinDataClass,
  { visibility, level }: KotlinGeneratorOptions & { level: number },
  usage: ImportUsage
): string[] {
  const modifier = visibilityModifier(visibility)

  // Kotlin forbids a `data class` with an empty primary constructor, so a
  // column-less table/view is emitted as a plain serializable class.
  if (dataClass.properties.length === 0) {
    return [
      `${ident(level)}@Serializable`,
      `${ident(level)}${modifier}class ${dataClass.formattedName}`,
    ]
  }

  return [
    `${ident(level)}@Serializable`,
    `${ident(level)}${modifier}data class ${dataClass.formattedName}(`,
    ...dataClass.properties.map((property) => {
      const annotation =
        property.serialName !== property.formattedName
          ? `@SerialName("${escapeForKotlinString(property.serialName)}") `
          : ''
      if (annotation) usage.serialName = true
      // Nullable properties default to null so Insert/Update payloads can omit them.
      const type = `${property.formattedType}${property.nullable ? '?' : ''}`
      const defaultValue = property.nullable ? ' = null' : ''
      return `${ident(level + 1)}${annotation}${modifier}val ${property.formattedName}: ${type}${defaultValue},`
    }),
    `${ident(level)})`,
  ]
}

export const apply = ({
  schemas,
  tables,
  foreignTables,
  views,
  materializedViews,
  columns,
  types,
  visibility,
}: GeneratorMetadata & KotlinGeneratorOptions): string => {
  const usage: ImportUsage = { serialName: false, jsonElement: false, jsonObject: false }
  const context = { types, views, tables }

  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )
  columns
    .filter((c) => c.table_id in columnsByTableId)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((c) => columnsByTableId[c.table_id].push(c))

  const body = schemas
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .flatMap((schema) => {
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

      return [
        `${visibilityModifier(visibility)}object ${formatForKotlinSchemaName(schema.name)} {`,
        ...schemaEnums.flatMap((enum_) =>
          generateEnum(pgEnumToKotlinEnum(enum_), { visibility, level: 1 }, usage)
        ),
        ...schemaTables.flatMap((table) =>
          (['Select', 'Insert', 'Update'] as Operation[]).flatMap((operation) =>
            generateDataClass(
              pgTableToKotlinDataClass(
                table,
                columnsByTableId[table.id],
                operation,
                context,
                usage
              ),
              { visibility, level: 1 },
              usage
            )
          )
        ),
        ...schemaViews.flatMap((view) =>
          generateDataClass(
            pgTableToKotlinDataClass(view, columnsByTableId[view.id], 'Select', context, usage),
            { visibility, level: 1 },
            usage
          )
        ),
        ...schemaCompositeTypes.flatMap((type) =>
          generateDataClass(
            pgCompositeTypeToKotlinDataClass(type, context, usage),
            {
              visibility,
              level: 1,
            },
            usage
          )
        ),
        '}',
      ]
    })

  const imports = ['import kotlinx.serialization.Serializable']
  if (usage.serialName) imports.push('import kotlinx.serialization.SerialName')
  if (usage.jsonElement) imports.push('import kotlinx.serialization.json.JsonElement')
  if (usage.jsonObject) imports.push('import kotlinx.serialization.json.JsonObject')
  imports.sort()

  return [...imports, '', ...body].join('\n')
}

const KOTLIN_TYPE_MAP: Record<string, string> = {
  // Bool
  bool: 'Boolean',

  // Numbers
  int2: 'Short',
  int4: 'Int',
  int8: 'Long',
  float4: 'Float',
  float8: 'Double',
  // Kotlin has no dependency-free arbitrary-precision decimal usable across all
  // KMP targets, so numeric/decimal map to Double (matches the Go template).
  numeric: 'Double',
  decimal: 'Double',

  // Strings
  bytea: 'String',
  bpchar: 'String',
  varchar: 'String',
  date: 'String',
  text: 'String',
  citext: 'String',
  time: 'String',
  timetz: 'String',
  timestamp: 'String',
  timestamptz: 'String',
  interval: 'String',
  uuid: 'String',
  vector: 'String',

  // Ranges
  int4range: 'String',
  int4multirange: 'String',
  int8range: 'String',
  int8multirange: 'String',
  numrange: 'String',
  nummultirange: 'String',
  tsrange: 'String',
  tsmultirange: 'String',
  tstzrange: 'String',
  tstzmultirange: 'String',
  daterange: 'String',
  datemultirange: 'String',

  // Misc
  void: 'Unit',
}

function pgTypeToKotlinType(
  pgType: string,
  context: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] },
  usage: ImportUsage
): string {
  if (pgType in KOTLIN_TYPE_MAP) {
    return KOTLIN_TYPE_MAP[pgType]
  }

  // JSON
  if (pgType === 'json' || pgType === 'jsonb') {
    usage.jsonElement = true
    return 'JsonElement'
  }
  if (pgType === 'record') {
    usage.jsonObject = true
    return 'JsonObject'
  }

  // Arrays are prefixed with an underscore in the Postgres catalog.
  if (pgType.startsWith('_')) {
    return `List<${pgTypeToKotlinType(pgType.slice(1), context, usage)}>`
  }

  // Enums
  const enumType = context.types.find((type) => type.name === pgType && type.enums.length > 0)
  if (enumType) {
    return formatForKotlinTypeName(enumType.name)
  }

  // Composite types (incl. table/view row types)
  const compositeType = [...context.types, ...context.views, ...context.tables].find(
    (type) => type.name === pgType
  )
  if (compositeType) {
    return formatForKotlinTypeName(compositeType.name)
  }

  // Fallback
  usage.jsonElement = true
  return 'JsonElement'
}

function visibilityModifier(visibility: Visibility): string {
  // `public` is the Kotlin default; emitting it is redundant and flagged by linters.
  return visibility === 'public' ? '' : `${visibility} `
}

function ident(level: number, options: { width: number } = { width: 2 }): string {
  return ' '.repeat(level * options.width)
}

function escapeForKotlinString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$')
}

/**
 * Converts a Postgres name to PascalCase.
 *
 * @example
 * ```ts
 * formatForKotlinTypeName('pokedex') // Pokedex
 * formatForKotlinTypeName('pokemon_center') // PokemonCenter
 * formatForKotlinTypeName('victory-road') // VictoryRoad
 * formatForKotlinTypeName('pokemon league') // PokemonLeague
 * formatForKotlinTypeName('_key_id_context') // KeyIdContext
 * ```
 */
function formatForKotlinTypeName(name: string): string {
  const formatted = name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join('')

  return /^[A-Za-z]/.test(formatted) ? formatted : `N${formatted}`
}

// Kotlin's hard keywords cannot be used as identifiers and must be backtick-escaped.
const KOTLIN_HARD_KEYWORDS = new Set([
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
])

/**
 * Converts a Postgres name to camelCase, backtick-escaping Kotlin keywords.
 *
 * @example
 * ```ts
 * formatForKotlinPropertyName('pokedex') // pokedex
 * formatForKotlinPropertyName('pokemon_center') // pokemonCenter
 * formatForKotlinPropertyName('victory-road') // victoryRoad
 * formatForKotlinPropertyName('class') // `class`
 * ```
 */
function formatForKotlinPropertyName(name: string): string {
  const words = name.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  const formatted = words
    .map((word, index) => {
      const lower = word.toLowerCase()
      return index === 0 ? lower : `${lower[0].toUpperCase()}${lower.slice(1)}`
    })
    .join('')

  return escapeKotlinIdentifier(formatted, name)
}

/**
 * Formats a Postgres enum value as a Kotlin enum entry. Values that are already
 * valid identifiers are preserved; otherwise the value is sanitized and the
 * original is retained via `@SerialName` by the caller.
 */
function formatForKotlinEnumEntry(value: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value) && !KOTLIN_HARD_KEYWORDS.has(value)) {
    return value
  }

  const sanitized = value.replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '')
  const safe = /^[A-Za-z_]/.test(sanitized) ? sanitized : `_${sanitized}`
  return escapeKotlinIdentifier(safe || '_', value)
}

function escapeKotlinIdentifier(identifier: string, original: string): string {
  if (!identifier) {
    return `\`${original}\``
  }
  return KOTLIN_HARD_KEYWORDS.has(identifier) ? `\`${identifier}\`` : identifier
}
