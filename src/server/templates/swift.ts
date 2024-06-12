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
${options.accessControl} enum ${toUpperCamelCase(enum_.name)}: String, Codable, Hashable, Sendable {
${enum_.enums.map((case_) => `${ident(1)}case ${toLowerCamelCase(case_)} = "${case_}"`).join('\n')}
}
`.trim()
}

function generateTableStructsForOperations(
  schema: PostgresSchema,
  schemas: PostgresSchema[],
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  tables: PostgresTable[],
  views: PostgresView[],
  columns: PostgresColumn[] | undefined,
  types: PostgresType[],
  operations: Operation[],
  options: SwiftGeneratorOptions
): string[] {
  return operations.map((operation) =>
    generateTableStruct(schema, schemas, table, tables, views, columns, types, operation, options)
  )
}

function generateTableStruct(
  schema: PostgresSchema,
  schemas: PostgresSchema[],
  table: PostgresTable | PostgresView | PostgresMaterializedView,
  tables: PostgresTable[],
  views: PostgresView[],
  columns: PostgresColumn[] | undefined,
  types: PostgresType[],
  operation: Operation,
  options: SwiftGeneratorOptions
): string {
  const columnEntries: {
    raw_name: string
    formatted_name: string
    type: string
    nullable: boolean
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
        formatted_name: toLowerCamelCase(column.name),
        type: pgTypeToSwiftType(column.format, { types, schemas, tables, views }),
        nullable,
      }
    }) ?? []

  const identity = columns?.find((column) => column.is_identity)
  const structName = `${toUpperCamelCase(table.name)}${operation}`

  let output = `
extension ${toUpperCamelCase(schema.name)}Schema {
${ident(1)}${options.accessControl} struct ${structName}: Codable, Hashable, Sendable {
${columnEntries.map(({ formatted_name, type, nullable }) => `${ident(2)}${options.accessControl} let ${formatted_name}: ${type}${nullable ? '?' : ''}`).join('\n')}

${ident(2)}${options.accessControl} enum CodingKeys: String, CodingKey {
${columnEntries.map(({ raw_name, formatted_name }) => `${ident(3)}case ${formatted_name} = "${raw_name}"`).join('\n')}
${ident(2)}}
}
`

  if (operation === 'Select' && identity) {
    const identityEntry = columnEntries.find((entry) => entry.raw_name === identity.name)
    if (identityEntry) {
      output += `extension ${toUpperCamelCase(schema.name)}Schema.${structName}: Identifiable {
${identityEntry.formatted_name !== 'id' ? `${ident(2)}${options.accessControl} var id: ${identityEntry.type} { ${identityEntry.formatted_name} }` : ''}
}
  `
    }
  }

  return output.trim()
}

export const apply = async ({
  schemas,
  tables,
  views,
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
${enums.map((enum_) => generateEnum(enum_, { accessControl })).join('\n')}

// MARK: - Schemas
${schemas.map((schema) => `${accessControl} enum ${toUpperCamelCase(schema.name)}Schema {}`).join('\n')}

// MARK: - Tables
${tables
  .flatMap((table) =>
    generateTableStructsForOperations(
      schemas.find((schema) => schema.name === table.schema)!,
      schemas,
      table,
      tables,
      views,
      columnsByTableId[table.id],
      types,
      ['Select', 'Insert', 'Update'],
      { accessControl }
    )
  )
  .join('\n')}
`.trim()

  return output
}

// TODO: Make this more robust. Currently doesn't handle range types - returns them as unknown.
const pgTypeToSwiftType = (
  pgType: string,
  {
    types,
    schemas,
    tables,
    views,
  }: {
    types: PostgresType[]
    schemas: PostgresSchema[]
    tables: PostgresTable[]
    views: PostgresView[]
  }
): string => {
  if (pgType === 'bool') {
    return 'Bool'
  } else if (pgType === 'int2') {
    return 'Int16'
  } else if (pgType === 'int4') {
    return 'Int32'
  } else if (pgType === 'int8') {
    return 'Int64'
  } else if (pgType === 'float4') {
    return 'Float'
  } else if (pgType === 'float8') {
    return 'Double'
  } else if (pgType === 'uuid') {
    return 'UUID'
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
    return 'String'
  } else if (['json', 'jsonb'].includes(pgType)) {
    return 'AnyJSON'
  } else if (pgType === 'void') {
    return 'Void'
  } else if (pgType === 'record') {
    return 'JSONObject'
  } else if (pgType.startsWith('_')) {
    return `[${pgTypeToSwiftType(pgType.substring(1), { types, schemas, tables, views })}]`
  } else {
    const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)

    if (enumType) {
      return `${toUpperCamelCase(enumType.name)}`
    }

    const compositeType = types.find((type) => type.name === pgType && type.attributes.length > 0)
    if (compositeType) {
      return `${toUpperCamelCase(compositeType.name)}`
    }

    const tableRowType = tables.find((table) => table.name === pgType)
    if (tableRowType) {
      return `${toUpperCamelCase(tableRowType.name)}`
    }

    const viewRowType = views.find((view) => view.name === pgType)
    if (viewRowType) {
      return `${toUpperCamelCase(viewRowType.name)}`
    }

    return 'unknown'
  }
}

function ident(level: number, options: { width: number } = { width: 2 }): string {
  return ' '.repeat(level * options.width)
}

function toLowerCamelCase(input: string): string {
  // Split the input string by spaces and non-alphanumeric characters
  const words = input.split(/[\s\-_]+/)

  // Map over the words array to transform each word
  const camelCaseWords = words.map((word, index) => {
    // Lowercase the entire word
    const lowerCasedWord = word.toLowerCase()

    // Capitalize the first letter if it's not the first word
    if (index !== 0) {
      return lowerCasedWord.charAt(0).toUpperCase() + lowerCasedWord.slice(1)
    }

    // Return the word as-is if it's the first word
    return lowerCasedWord
  })

  // Join the words back together
  return camelCaseWords.join('')
}

function toUpperCamelCase(input: string): string {
  // Split the input string by spaces and non-alphanumeric characters
  const words = input.split(/[\s\-_]+/)

  // Map over the words array to transform each word
  const camelCaseWords = words.map((word) => {
    // Lowercase the entire word
    const lowerCasedWord = word.toLowerCase()

    // Capitalize the first letter of each word
    return lowerCasedWord.charAt(0).toUpperCase() + lowerCasedWord.slice(1)
  })

  // Join the words back together
  return camelCaseWords.join('')
}
