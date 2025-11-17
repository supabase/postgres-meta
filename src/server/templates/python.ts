import type {
  PostgresColumn,
  PostgresMaterializedView,
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
  types,
}: GeneratorMetadata): string => {
  const ctx = new PythonContext(types, columns, schemas)
  const py_tables = tables
    .filter((table) => schemas.some((schema) => schema.name === table.schema))
    .flatMap((table) => {
      const py_class_and_methods = ctx.tableToClass(table)
      return py_class_and_methods
    })
  const composite_types = types
    .filter((type) => type.attributes.length > 0 && schemas.some((schema) => type.schema == schema.name))
    .map((type) => ctx.typeToClass(type))
  const py_views = views
    .filter((view) => schemas.some((schema) => schema.name === view.schema))
    .map((view) => ctx.viewToClass(view))
  const py_matviews = materializedViews
    .filter((matview) => schemas.some((schema) => schema.name === matview.schema))
    .map((matview) => ctx.matViewToClass(matview))

  let output = `
from __future__ import annotations

import datetime
from typing import (
    Annotated,
    Any,
    List,
    Literal,
    NotRequired,
    Optional,
    TypeAlias,
    TypedDict,
)

from pydantic import BaseModel, Field, Json

${concatLines(Object.values(ctx.user_enums))}

${concatLines(py_tables)}

${concatLines(py_views)}

${concatLines(py_matviews)}

${concatLines(composite_types)}

`.trim()

  return output
}

interface Serializable {
  serialize(): string
}

class PythonContext {
  types: { [k: string]: PostgresType }
  user_enums: { [k: string]: PythonEnum }
  columns: Record<number, PostgresColumn[]>
  schemas: { [k: string]: PostgresSchema }

  constructor(types: PostgresType[], columns: PostgresColumn[], schemas: PostgresSchema[]) {
    this.schemas = Object.fromEntries(schemas.map((schema) => [schema.name, schema]))
    this.types = Object.fromEntries(types.map((type) => [type.name, type]))
    this.columns = columns
      .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      .reduce(
        (acc, curr) => {
          acc[curr.table_id] ??= []
          acc[curr.table_id].push(curr)
          return acc
        },
        {} as Record<number, PostgresColumn[]>
      )
    this.user_enums = Object.fromEntries(
      types.filter((type) => type.enums.length > 0).map((type) => [type.name, new PythonEnum(type)])
    )
  }

  resolveTypeName(name: string): string {
    if (name in this.user_enums) {
      return this.user_enums[name].name
    }
    if (name in PY_TYPE_MAP) {
      return PY_TYPE_MAP[name]
    }
    if (name in this.types) {
      const type = this.types[name]
      const schema = type!.schema
      return `${formatForPyClassName(schema)}${formatForPyClassName(type.name)}`
    }
    return 'Any'
  }

  parsePgType(pg_type: string): PythonType {
    if (pg_type.startsWith('_')) {
      const inner_str = pg_type.slice(1)
      const inner = this.parsePgType(inner_str)
      return new PythonListType(inner)
    } else {
      const type_name = this.resolveTypeName(pg_type)
      return new PythonSimpleType(type_name)
    }
  }

  typeToClass(type: PostgresType): PythonBaseModel {
    const types = Object.values(this.types)
    const attributes = type.attributes.map((attribute) => {
      const type = types.find((type) => type.id === attribute.type_id)
      return {
        ...attribute,
        type,
      }
    })
    const attributeEntries: PythonBaseModelAttr[] = attributes.map((attribute) => {
      const type = this.parsePgType(attribute.type!.name)
      return new PythonBaseModelAttr(attribute.name, type, false)
    })

    const schema = this.schemas[type.schema]
    return new PythonBaseModel(type.name, schema, attributeEntries)
  }

  columnsToClassAttrs(table_id: number): PythonBaseModelAttr[] {
    const attrs = this.columns[table_id] ?? []
    return attrs.map((col) => {
      const type = this.parsePgType(col.format)
      return new PythonBaseModelAttr(col.name, type, col.is_nullable)
    })
  }

  columnsToDictAttrs(table_id: number, not_required: boolean): PythonTypedDictAttr[] {
    const attrs = this.columns[table_id] ?? []
    return attrs.map((col) => {
      const type = this.parsePgType(col.format)
      return new PythonTypedDictAttr(
        col.name,
        type,
        col.is_nullable,
        not_required || col.is_nullable || col.is_identity || col.default_value !== null
      )
    })
  }

  tableToClass(table: PostgresTable): [PythonBaseModel, PythonTypedDict, PythonTypedDict] {
    const schema = this.schemas[table.schema]
    const select = new PythonBaseModel(table.name, schema, this.columnsToClassAttrs(table.id))
    const insert = new PythonTypedDict(
      table.name,
      'Insert',
      schema,
      this.columnsToDictAttrs(table.id, false)
    )
    const update = new PythonTypedDict(
      table.name,
      'Update',
      schema,
      this.columnsToDictAttrs(table.id, true)
    )
    return [select, insert, update]
  }

  viewToClass(view: PostgresView): PythonBaseModel {
    const attributes = this.columnsToClassAttrs(view.id)
    return new PythonBaseModel(view.name, this.schemas[view.schema], attributes)
  }

  matViewToClass(matview: PostgresMaterializedView): PythonBaseModel {
    const attributes = this.columnsToClassAttrs(matview.id)
    return new PythonBaseModel(matview.name, this.schemas[matview.schema], attributes)
  }
}

class PythonEnum implements Serializable {
  name: string
  variants: string[]
  constructor(type: PostgresType) {
    this.name = `${formatForPyClassName(type.schema)}${formatForPyClassName(type.name)}`
    this.variants = type.enums
  }
  serialize(): string {
    const variants = this.variants.map((item) => `"${item}"`).join(', ')
    return `${this.name}: TypeAlias = Literal[${variants}]`
  }
}

type PythonType = PythonListType | PythonSimpleType

class PythonSimpleType implements Serializable {
  name: string
  constructor(name: string) {
    this.name = name
  }
  serialize(): string {
    return this.name
  }
}

class PythonListType implements Serializable {
  inner: PythonType
  constructor(inner: PythonType) {
    this.inner = inner
  }
  serialize(): string {
    return `List[${this.inner.serialize()}]`
  }
}

class PythonBaseModelAttr implements Serializable {
  name: string
  pg_name: string
  py_type: PythonType
  nullable: boolean

  constructor(name: string, py_type: PythonType, nullable: boolean) {
    this.name = formatForPyAttributeName(name)
    this.pg_name = name
    this.py_type = py_type
    this.nullable = nullable
  }

  serialize(): string {
    const py_type = this.nullable
      ? `Optional[${this.py_type.serialize()}]`
      : this.py_type.serialize()
    return `    ${this.name}: ${py_type} = Field(alias="${this.pg_name}")`
  }
}

class PythonBaseModel implements Serializable {
  name: string
  table_name: string
  schema: PostgresSchema
  class_attributes: PythonBaseModelAttr[]

  constructor(name: string, schema: PostgresSchema, class_attributes: PythonBaseModelAttr[]) {
    this.schema = schema
    this.class_attributes = class_attributes
    this.table_name = name
    this.name = `${formatForPyClassName(schema.name)}${formatForPyClassName(name)}`
  }
  serialize(): string {
    const attributes =
      this.class_attributes.length > 0
        ? this.class_attributes.map((attr) => attr.serialize()).join('\n')
        : '    pass'
    return `class ${this.name}(BaseModel):\n${attributes}`
  }
}

class PythonTypedDictAttr implements Serializable {
  name: string
  pg_name: string
  py_type: PythonType
  nullable: boolean
  not_required: boolean

  constructor(name: string, py_type: PythonType, nullable: boolean, required: boolean) {
    this.name = formatForPyAttributeName(name)
    this.pg_name = name
    this.py_type = py_type
    this.nullable = nullable
    this.not_required = required
  }

  serialize(): string {
    const annotation = `Annotated[${this.py_type.serialize()}, Field(alias="${this.pg_name}")]`
    const rhs = this.not_required ? `NotRequired[${annotation}]` : annotation
    return `    ${this.name}: ${rhs}`
  }
}

class PythonTypedDict implements Serializable {
  name: string
  table_name: string
  parent_class: string
  schema: PostgresSchema
  dict_attributes: PythonTypedDictAttr[]
  operation: 'Insert' | 'Update'

  constructor(
    name: string,
    operation: 'Insert' | 'Update',
    schema: PostgresSchema,
    dict_attributes: PythonTypedDictAttr[],
    parent_class: string = 'BaseModel'
  ) {
    this.schema = schema
    this.dict_attributes = dict_attributes
    this.table_name = name
    this.name = `${formatForPyClassName(schema.name)}${formatForPyClassName(name)}`
    this.parent_class = parent_class
    this.operation = operation
  }
  serialize(): string {
    const attributes =
      this.dict_attributes.length > 0
        ? this.dict_attributes.map((attr) => attr.serialize()).join('\n')
        : '    pass'
    return `class ${this.name}${this.operation}(TypedDict):\n${attributes}`
  }
}

function concatLines(items: Serializable[]): string {
  return items.map((item) => item.serialize()).join('\n\n')
}

const PY_TYPE_MAP: Record<string, string> = {
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
  string: 'str',
  date: 'datetime.date',
  text: 'str',
  citext: 'str',
  time: 'datetime.time',
  timetz: 'datetime.time',
  timestamp: 'datetime.datetime',
  timestamptz: 'datetime.datetime',
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
function formatForPyClassName(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]/)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join('')
}

/**
 * Converts a Postgres name to snake_case.
 *
 * @example
 * ```ts
 * formatForPyTypeName('Pokedex') // pokedex
 * formatForPyTypeName('PokemonCenter') // pokemon_enter
 * formatForPyTypeName('victory-road') // victory_road
 * formatForPyTypeName('pokemon league') // pokemon_league
 * ```
 */
function formatForPyAttributeName(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]+/) // Split on non-alphanumeric characters (like spaces, dashes, etc.)
    .map((word) => word.toLowerCase()) // Convert each word to lowercase
    .join('_') // Join with underscores
}
