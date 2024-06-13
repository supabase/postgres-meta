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

type Operation = 'Select' | 'Insert' | 'Update'
export type AccessControl = 'internal' | 'public' | 'private' | 'package'

type SwiftGeneratorOptions = {
  accessControl: AccessControl
}

function generateEnum(enum_: PostgresType, options: SwiftGeneratorOptions): string {
  return `
${options.accessControl} enum ${formatForSwiftTypeName(enum_.name)}: String, Codable, Hashable, Sendable {
${enum_.enums.map((case_) => `${ident(1)}case ${formatForSwiftPropertyName(case_)} = "${case_}"`).join('\n')}
}
`.trim()
}

function generateTableStructsForOperations(
  schema: PostgresSchema,
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  operations: Operation[],
  options: SwiftGeneratorOptions,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): string[] {
  return operations.map((operation) =>
    generateTableStruct(schema, table, columns, operation, options, { types, views, tables })
  )
}

function generateTableStruct(
  schema: PostgresSchema,
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  columns: PostgresColumn[] | undefined,
  operation: Operation,
  options: SwiftGeneratorOptions,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): string {
  const columnEntries: {
    raw_name: string
    formatted_name: string
    type: string
  }[] =
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
        raw_name: column.name,
        formatted_name: formatForSwiftPropertyName(column.name),
        type: pgTypeToSwiftType(column.format, nullable, { types, views, tables }),
      }
    }) ?? []

  const identity = columns?.find((column) => column.is_identity)
  const structName = `${formatForSwiftTypeName(table.name)}${operation}`

  let output = `
extension ${formatForSwiftTypeName(schema.name)}Schema {
${ident(1)}${options.accessControl} struct ${structName}: Codable, Hashable, Sendable {
${columnEntries.map(({ formatted_name, type }) => `${ident(2)}${options.accessControl} let ${formatted_name}: ${type}`).join('\n')}

${ident(2)}${options.accessControl} enum CodingKeys: String, CodingKey {
${columnEntries.map(({ raw_name, formatted_name }) => `${ident(3)}case ${formatted_name} = "${raw_name}"`).join('\n')}
${ident(2)}}
}
`

  if (operation === 'Select' && identity) {
    const identityEntry = columnEntries.find((entry) => entry.raw_name === identity.name)
    if (identityEntry) {
      output += `extension ${formatForSwiftTypeName(schema.name)}Schema.${structName}: Identifiable {
${identityEntry.formatted_name !== 'id' ? `${ident(2)}${options.accessControl} var id: ${identityEntry.type} { ${identityEntry.formatted_name} }` : ''}
}
  `
    }
  }

  return output.trim()
}

function gnerateCompositeTypeStruct(
  schema: PostgresSchema,
  type: PostgresType,
  options: SwiftGeneratorOptions,
  {
    types,
    views,
    tables,
  }: { types: PostgresType[]; views: PostgresView[]; tables: PostgresTable[] }
): string {
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

  const attributeEntries: {
    formatted_name: string
    type: string
    raw_name: string
  }[] = typeWithRetrievedAttributes.attributes.map((attribute) => {
    return {
      formatted_name: formatForSwiftTypeName(attribute.name),
      type: pgTypeToSwiftType(attribute.type!.format, false, { types, views, tables }),
      raw_name: attribute.name,
    }
  })

  let output = `extension ${formatForSwiftTypeName(schema.name)}Schema {
${ident(1)}${options.accessControl} struct ${formatForSwiftTypeName(type.name)}: Codable, Hashable, Sendable {
${attributeEntries
  .map((entry) => `${ident(2)}${options.accessControl} let ${entry.formatted_name}: ${entry.type}`)
  .join('\n')}

${ident(2)}${options.accessControl} enum CodingKeys: String, CodingKey {
${attributeEntries
  .map((entry) => `${ident(3)}case ${entry.formatted_name} = "${entry.raw_name}"`)
  .join('\n')}
${ident(2)}}
${ident(1)}}
}
}`

  return output.trim()
}

export const apply = async ({
  schemas,
  tables,
  views,
  materializedViews,
  columns,
  types,
  accessControl,
}: GeneratorMetadata & SwiftGeneratorOptions): Promise<string> => {
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
  const enums = types
    .filter((type) => type.enums.length > 0)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))

  let output = `
import Foundation
import Supabase

// MARK: - Enums
${enums.map((enum_) => generateEnum(enum_, { accessControl })).join('\n\n')}

// MARK: - Schemas
${schemas.map((schema) => `${accessControl} enum ${formatForSwiftTypeName(schema.name)}Schema {}`).join('\n\n')}

// MARK: - Tables
${tables
  .flatMap((table) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === table.schema)!,
      table,
      columnsByTableId[table.id],
      ['Select', 'Insert', 'Update'],
      { accessControl },
      { types, views, tables }
    )
  )
  .join('\n\n')}

// MARK: - Views
${views
  .flatMap((view) => {
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === view.schema)!,
      view,
      columnsByTableId[view.id],
      ['Select'],
      { accessControl },
      { types, views, tables }
    )
  })
  .join('\n\n')}

// MARK: - Materialized Views
${materializedViews
  .flatMap((materializedView) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === materializedView.schema)!,
      materializedView,
      columnsByTableId[materializedView.id],
      ['Select'],
      { accessControl },
      { types, views, tables }
    )
  )
  .join('\n\n')}

// MARK: - Composite Types
${compositeTypes
  .map((compositeType) =>
    gnerateCompositeTypeStruct(
      schemas.find((schema) => schema.name === compositeType.schema)!,
      compositeType,
      { accessControl },
      { types, views, tables }
    )
  )
  .join('\n\n')}
`.trim()

  return output
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
    const allTypes: { name: string; schema: string }[] = [...types, ...views, ...tables]
    const type = allTypes.find((type) => type.name === pgType)

    if (type) {
      swiftType = `${formatForSwiftTypeName(type.schema)}Schema.${formatForSwiftTypeName(type.name)}`
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
 * ```
 */
function formatForSwiftTypeName(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]/)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join('')
}

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
  return name
    .split(/[^a-zA-Z0-9]/)
    .map((word, index) => {
      const lowerWord = word.toLowerCase()
      return index !== 0 ? lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1) : lowerWord
    })
    .join('')
}
