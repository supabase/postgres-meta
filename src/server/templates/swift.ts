import prettier from 'prettier'
import type {
  PostgresColumn,
  PostgresFunction,
  PostgresMaterializedView,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'
import { PostgresForeignTable } from '../../lib/types.js'

type Operation = 'Select' | 'Insert' | 'Update'
export type AccessControl = 'internal' | 'public' | 'private' | 'package'

type SwiftGeneratorOptions = {
  accessControl: AccessControl
}

type SwiftEnumCase = {
  formattedName: string
  rawValue: string
}

type SwiftEnum = {
  formattedEnumName: string
  protocolConformances: string[]
  cases: SwiftEnumCase[]
}

type SwiftAttribute = {
  formattedAttributeName: string
  formattedType: string
  rawName: string
  isIdentity: boolean
}

type SwiftStruct = {
  formattedStructName: string
  protocolConformances: string[]
  attributes: SwiftAttribute[]
  codingKeysEnum: SwiftEnum | undefined
}

function formatForSwiftSchemaName(schema: string): string {
  return `${formatForSwiftTypeName(schema)}Schema`
}

function pgEnumToSwiftEnum(pgEnum: PostgresType): SwiftEnum {
  return {
    formattedEnumName: formatForSwiftTypeName(pgEnum.name),
    protocolConformances: ['String', 'Codable', 'Hashable', 'Sendable'],
    cases: pgEnum.enums.map((case_) => {
      return { formattedName: formatForSwiftPropertyName(case_), rawValue: case_ }
    }),
  }
}

function pgTypeToSwiftStruct(
  table: PostgresTable | PostgresForeignTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  operation: Operation,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): SwiftStruct {
  const columnEntries: SwiftAttribute[] =
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
        rawName: column.name,
        formattedAttributeName: formatForSwiftPropertyName(column.name),
        formattedType: pgTypeToSwiftType(column.format, nullable, { types, views, tables }),
        isIdentity: column.is_identity,
      }
    }) ?? []

  return {
    formattedStructName: `${formatForSwiftTypeName(table.name)}${operation}`,
    attributes: columnEntries,
    protocolConformances: ['Codable', 'Hashable', 'Sendable'],
    codingKeysEnum: generateCodingKeysEnumFromAttributes(columnEntries),
  }
}

function generateCodingKeysEnumFromAttributes(attributes: SwiftAttribute[]): SwiftEnum | undefined {
  return attributes.length > 0
    ? {
        formattedEnumName: 'CodingKeys',
        protocolConformances: ['String', 'CodingKey'],
        cases: attributes.map((attribute) => {
          return {
            formattedName: attribute.formattedAttributeName,
            rawValue: attribute.rawName,
          }
        }),
      }
    : undefined
}

function pgCompositeTypeToSwiftStruct(
  type: PostgresType,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): SwiftStruct {
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

  const attributeEntries: SwiftAttribute[] = typeWithRetrievedAttributes.attributes.map(
    (attribute) => {
      return {
        formattedAttributeName: formatForSwiftTypeName(attribute.name),
        formattedType: pgTypeToSwiftType(attribute.type!.format, false, { types, views, tables }),
        rawName: attribute.name,
        isIdentity: false,
      }
    }
  )

  return {
    formattedStructName: formatForSwiftTypeName(type.name),
    attributes: attributeEntries,
    protocolConformances: ['Codable', 'Hashable', 'Sendable'],
    codingKeysEnum: generateCodingKeysEnumFromAttributes(attributeEntries),
  }
}

function generateProtocolConformances(protocols: string[]): string {
  return protocols.length === 0 ? '' : `: ${protocols.join(', ')}`
}

function generateEnum(
  enum_: SwiftEnum,
  { accessControl, level }: SwiftGeneratorOptions & { level: number }
): string[] {
  return [
    `${ident(level)}${accessControl} enum ${enum_.formattedEnumName}${generateProtocolConformances(enum_.protocolConformances)} {`,
    ...enum_.cases.map(
      (case_) => `${ident(level + 1)}case ${case_.formattedName} = "${case_.rawValue}"`
    ),
    `${ident(level)}}`,
  ]
}

function generateStruct(
  struct: SwiftStruct,
  { accessControl, level }: SwiftGeneratorOptions & { level: number }
): string[] {
  const identity = struct.attributes.find((column) => column.isIdentity)

  let protocolConformances = struct.protocolConformances
  if (identity) {
    protocolConformances.push('Identifiable')
  }

  let output = [
    `${ident(level)}${accessControl} struct ${struct.formattedStructName}${generateProtocolConformances(struct.protocolConformances)} {`,
  ]

  if (identity && identity.formattedAttributeName !== 'id') {
    output.push(
      `${ident(level + 1)}${accessControl} var id: ${identity.formattedType} { ${identity.formattedAttributeName} }`
    )
  }

  output.push(
    ...struct.attributes.map(
      (attribute) =>
        `${ident(level + 1)}${accessControl} let ${attribute.formattedAttributeName}: ${attribute.formattedType}`
    )
  )

  if (struct.codingKeysEnum) {
    output.push(...generateEnum(struct.codingKeysEnum, { accessControl, level: level + 1 }))
  }

  output.push(`${ident(level)}}`)

  return output
}

export const apply = async ({
  schemas,
  tables,
  foreignTables,
  views,
  materializedViews,
  columns,
  types,
  accessControl,
}: GeneratorMetadata & SwiftGeneratorOptions): Promise<string> => {
  const columnsByTableId = Object.fromEntries<PostgresColumn[]>(
    [...tables, ...foreignTables, ...views, ...materializedViews].map((t) => [t.id, []])
  )

  columns
    .filter((c) => c.table_id in columnsByTableId)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .forEach((c) => columnsByTableId[c.table_id].push(c))

  let output = [
    'import Foundation',
    'import Supabase',
    '',
    ...schemas
      .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      .flatMap((schema) => {
        const schemaTables = [...tables, ...foreignTables]
          .filter((table) => table.schema === schema.name)
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))

        const schemaViews = [...views, ...materializedViews]
          .filter((table) => table.schema === schema.name)
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))

        const schemaEnums = types
          .filter((type) => type.schema === schema.name && type.enums.length > 0)
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))

        const schemaCompositeTypes = types
          .filter((type) => type.schema === schema.name && type.attributes.length > 0)
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))

        return [
          `${accessControl} enum ${formatForSwiftSchemaName(schema.name)} {`,
          ...schemaEnums.flatMap((enum_) =>
            generateEnum(pgEnumToSwiftEnum(enum_), { accessControl, level: 1 })
          ),
          ...schemaTables.flatMap((table) =>
            (['Select', 'Insert', 'Update'] as Operation[])
              .map((operation) =>
                pgTypeToSwiftStruct(table, columnsByTableId[table.id], operation, {
                  types,
                  views,
                  tables,
                })
              )
              .flatMap((struct) => generateStruct(struct, { accessControl, level: 1 }))
          ),
          ...schemaViews.flatMap((view) =>
            generateStruct(
              pgTypeToSwiftStruct(view, columnsByTableId[view.id], 'Select', {
                types,
                views,
                tables,
              }),
              { accessControl, level: 1 }
            )
          ),
          ...schemaCompositeTypes.flatMap((type) =>
            generateStruct(pgCompositeTypeToSwiftStruct(type, { types, views, tables }), {
              accessControl,
              level: 1,
            })
          ),
          '}',
        ]
      }),
  ]

  return output.join('\n')
}

// TODO: Make this more robust. Currently doesn't handle range types - returns them as string.
const pgTypeToSwiftType = (
  pgType: string,
  nullable: boolean,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): string => {
  let swiftType: string

  if (pgType === 'bool') {
    swiftType = 'Bool'
  } else if (pgType === 'int2') {
    swiftType = 'Int16'
  } else if (pgType === 'int4') {
    swiftType = 'Int32'
  } else if (pgType === 'int8') {
    swiftType = 'Int64'
  } else if (pgType === 'float4') {
    swiftType = 'Float'
  } else if (pgType === 'float8') {
    swiftType = 'Double'
  } else if (pgType === 'uuid') {
    swiftType = 'UUID'
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
    swiftType = 'String'
  } else if (['json', 'jsonb'].includes(pgType)) {
    swiftType = 'AnyJSON'
  } else if (pgType === 'void') {
    swiftType = 'Void'
  } else if (pgType === 'record') {
    swiftType = 'JSONObject'
  } else if (pgType.startsWith('_')) {
    swiftType = `[${pgTypeToSwiftType(pgType.substring(1), false, { types, views, tables })}]`
  } else {
    const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)

    const compositeTypes = [...types, ...views, ...tables].find((type) => type.name === pgType)

    if (enumType) {
      swiftType = `${formatForSwiftTypeName(enumType.name)}`
    } else if (compositeTypes) {
      // Append a `Select` to the composite type, as that is how is named in the generated struct.
      swiftType = `${formatForSwiftTypeName(compositeTypes.name)}Select`
    } else {
      swiftType = 'AnyJSON'
    }
  }

  return `${swiftType}${nullable ? '?' : ''}`
}

function ident(level: number, options: { width: number } = { width: 2 }): string {
  return ' '.repeat(level * options.width)
}

/**
 * Converts a Postgres name to PascalCase.
 *
 * @example
 * ```ts
 * formatForSwiftTypeName('pokedex') // Pokedex
 * formatForSwiftTypeName('pokemon_center') // PokemonCenter
 * formatForSwiftTypeName('victory-road') // VictoryRoad
 * formatForSwiftTypeName('pokemon league') // PokemonLeague
 * formatForSwiftTypeName('_key_id_context') // _KeyIdContext
 * ```
 */
function formatForSwiftTypeName(name: string): string {
  // Preserve the initial underscore if it exists
  let prefix = ''
  if (name.startsWith('_')) {
    prefix = '_'
    name = name.slice(1) // Remove the initial underscore for processing
  }

  return (
    prefix +
    name
      .split(/[^a-zA-Z0-9]+/)
      .map((word) => {
        if (word) {
          return `${word[0].toUpperCase()}${word.slice(1)}`
        } else {
          return ''
        }
      })
      .join('')
  )
}

const SWIFT_KEYWORDS = ['in', 'default']

/**
 * Converts a Postgres name to pascalCase.
 *
 * @example
 * ```ts
 * formatForSwiftTypeName('pokedex') // pokedex
 * formatForSwiftTypeName('pokemon_center') // pokemonCenter
 * formatForSwiftTypeName('victory-road') // victoryRoad
 * formatForSwiftTypeName('pokemon league') // pokemonLeague
 * ```
 */
function formatForSwiftPropertyName(name: string): string {
  const propertyName = name
    .split(/[^a-zA-Z0-9]/)
    .map((word, index) => {
      const lowerWord = word.toLowerCase()
      return index !== 0 ? lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1) : lowerWord
    })
    .join('')

  return SWIFT_KEYWORDS.includes(propertyName) ? `\`${propertyName}\`` : propertyName
}
