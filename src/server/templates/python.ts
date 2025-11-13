import type {
  PostgresColumn,
  PostgresMaterializedView,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'

interface Serializable {
  serialize(): string
}

class PythonContext {
  types: { [k: string]: PostgresType };
  user_enums: { [k: string]: PythonEnum };
  columns: Record<number, PostgresColumn[]>;
  schemas: { [k: string]: PostgresSchema };

  constructor(types: PostgresType[], columns: PostgresColumn[], schemas: PostgresSchema[]) {
    this.schemas = Object.fromEntries(schemas.map((schema) => [schema.name, schema]));
    this.types = Object.fromEntries(types.map((type) => [type.name, type]));
    this.columns = columns
      .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      .reduce(
        (acc, curr) => {
          acc[curr.table_id] ??= []
          acc[curr.table_id].push(curr)
          return acc
        },
        {} as Record<number, PostgresColumn[]>
      );
    this.user_enums = Object.fromEntries(types
      .filter((type) => type.enums.length > 0)
      .map((type) => [type.name, new PythonEnum(type)]));
  }

  resolveTypeName(name: string) : string {
    if (name in this.user_enums) {
      return this.user_enums[name].name;
    }
    if (name in PY_TYPE_MAP) {
      return PY_TYPE_MAP[name]
    }
    if (name in this.types) {
      const type = this.types[name];
      const schema = type!.schema;
      return `${formatForPyClassName(schema)}${formatForPyClassName(type.name)}`;
    }
    console.log(`Unknown recognized row type ${name}`);
    return 'Any';
  }

  parsePgType(pg_type: string) : PythonType {
    if (pg_type.startsWith('_')) {
      const inner_str = pg_type.slice(1);
      const inner = this.parsePgType(inner_str);
      return new PythonListType(inner);
    } else {
      const type_name = this.resolveTypeName(pg_type);
      return new PythonSimpleType(type_name);
    }
  }

  typeToClass(type: PostgresType) : PythonClass {
    const types = Object.values(this.types);
    const attributes = type.attributes.map((attribute) => {
      const type = types.find((type) => type.id === attribute.type_id)
      return {
        ...attribute,
        type,
      }
    });
    const attributeEntries: PythonClassAttribute[] = attributes
      .map((attribute) => {
        const type = this.parsePgType(attribute.type!.name);
        return new PythonClassAttribute(attribute.name, type, false, false, false, false);
      });
    const schema = this.schemas[type.schema];
    return new PythonClass(type.name, schema, attributeEntries);
  }

  columnsToClassAttrs(table_id: number) : PythonClassAttribute[] {
    const attrs = this.columns[table_id] ?? [];
    return attrs.map((col) => {
      const type = this.parsePgType(col.format);
      return new PythonClassAttribute(col.name, type,
        col.is_nullable,
        col.is_updatable,
        col.is_generated || !!col.default_value,
        col.is_identity);
    });
  }

  tableToClass(table: PostgresTable) : PythonClass {
    const attributes = this.columnsToClassAttrs(table.id);
    return new PythonClass(table.name, this.schemas[table.schema], attributes)
  }
  

  viewToClass(view: PostgresView) : PythonClass {
    const attributes = this.columnsToClassAttrs(view.id);
    return new PythonClass(view.name, this.schemas[view.schema], attributes)
  }

  matViewToClass(matview: PostgresMaterializedView) : PythonClass {
    const attributes = this.columnsToClassAttrs(matview.id);
    return new PythonClass(matview.name, this.schemas[matview.schema], attributes)
  }
}


class PythonEnum implements Serializable {
  name: string;
  variants: string[];
  constructor(type: PostgresType) {
    this.name = `${formatForPyClassName(type.schema)}${formatForPyClassName(type.name)}`;
    this.variants = type.enums.map(formatForPyAttributeName);
  }
  serialize(): string {
    const variants = this.variants.map((item) => `"${item}"`).join(', ');
    return `${this.name}: TypeAlias = Literal[${variants}]`;
  }
}

type PythonType = PythonListType | PythonSimpleType;

class PythonSimpleType implements Serializable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  serialize() : string {
    return this.name;
  }
}

class PythonListType implements Serializable {
  inner: PythonType;
  constructor(inner: PythonType) {
    this.inner = inner;
  }
  serialize() : string {
    return `List[${this.inner.serialize()}]`;
  }  
}

class PythonClassAttribute implements Serializable {
  name: string;
  pg_name: string;
  py_type: PythonType;
  nullable: boolean;
  mutable: boolean;
  has_default: boolean;
  is_identity: boolean;

    
  constructor(name: string, py_type: PythonType, nullable: boolean, mutable: boolean, has_default: boolean, is_identity: boolean) {
    this.name = formatForPyAttributeName(name);
    this.pg_name = name;
    this.py_type = py_type;
    this.nullable = nullable;
    this.mutable = mutable;
    this.has_default = has_default;
    this.is_identity = is_identity;
  }
  
  serialize(): string {
    const py_type = this.nullable
      ? `Optional[${this.py_type.serialize()}]`
      : this.py_type.serialize();
    return `    ${this.name}: Annotated[${py_type}, Field(alias="${this.pg_name}")]`
  }

}

class PythonClass implements Serializable {
  name: string;
  table_name: string;
  parent_class: string;
  schema: PostgresSchema;
  class_attributes: PythonClassAttribute[];
  
  constructor(name: string, schema: PostgresSchema, class_attributes: PythonClassAttribute[], parent_class: string="BaseModel") {
    this.schema = schema;
    this.class_attributes = class_attributes;
    this.table_name = name;
    this.name = `${formatForPyClassName(schema.name)}${formatForPyClassName(name)}`;
    this.parent_class = parent_class;
  }
  serialize(): string {
    const attributes = this.class_attributes.length > 0
      ? this.class_attributes.map((attr) => attr.serialize()).join('\n')
      : "    pass";
    return `class ${this.name}(${this.parent_class}):\n${attributes}`;
  }

  update() : PythonClass {
    // Converts all attributes to nullable
    const attrs = this.class_attributes
      .filter((attr) => attr.mutable || attr.is_identity)
      .map((attr) => new PythonClassAttribute(attr.name, attr.py_type, true, attr.mutable, attr.has_default, attr.is_identity))
    return new PythonClass(`${this.table_name}_update`, this.schema, attrs, "TypedDict")
  }

  insert() : PythonClass {
    // Converts all attributes that have a default to nullable.
    const attrs = this.class_attributes
      .map((attr) => new PythonClassAttribute(attr.name, attr.py_type, attr.has_default || attr.nullable, attr.mutable, attr.has_default, attr.is_identity));
    return new PythonClass(`${this.table_name}_insert`, this.schema, attrs, "TypedDict")
  }
  
}

function concatLines(items: Serializable[]): string {
  return items.map((item) => item.serialize()).join('\n\n');
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

export const apply = ({
  schemas,
  tables,
  views,
  materializedViews,
  columns,
  types,
}: GeneratorMetadata): string => {
  const ctx = new PythonContext(types, columns, schemas);
  const py_tables = tables
    .filter((table) => schemas.some((schema) => schema.name === table.schema))
    .flatMap((table) => {
      const py_class = ctx.tableToClass(table);
      return [py_class, py_class.insert(), py_class.update()];
    });

  const composite_types = types
    .filter((type) => type.attributes.length > 0)
    .map((type) => ctx.typeToClass(type));

  const py_views = views.map((view) => ctx.viewToClass(view));
  const py_matviews = materializedViews.map((matview) => ctx.matViewToClass(matview));

  let output = `
from __future__ import annotations

import datetime
from typing import Annotated, Any, List, Literal, Optional, TypeAlias, TypedDict

from pydantic import BaseModel, Field, Json

${concatLines(Object.values(ctx.user_enums))}

${concatLines(py_tables)}

${concatLines(py_views)}

${concatLines(py_matviews)}

${concatLines(composite_types)}

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
    .map(word => word.toLowerCase()) // Convert each word to lowercase
    .join('_'); // Join with underscores
}

function pgTypeToPythonType(pgType: string, nullable: boolean, types: PostgresType[] = []): string {
  let pythonType: string | undefined = undefined

  if (pgType in PY_TYPE_MAP) {
    pythonType = PY_TYPE_MAP[pgType as keyof typeof PY_TYPE_MAP]
  }

  // Enums
  const enumType = types.find((type) => type.name === pgType && type.enums.length > 0)
  if (enumType) {
    pythonType = formatForPyClassName(String(pgType))
  }

  if (pythonType) {
    // If the type is nullable, append "| None" to the type
    return nullable ? `${pythonType} | None` : pythonType
  }

  // Fallback
  return nullable ? String(pgType)+' | None' : String(pgType)
}
