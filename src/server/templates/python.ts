import type {
  PostgresColumn,
  PostgresMaterializedView,
  PostgresSchema,
  PostgresTable,
  PostgresType,
  PostgresView,
} from '../../lib/index.js'
import type { GeneratorMetadata } from '../../lib/generators.js'
import { console } from 'inspector/promises';

type Operation = 'Select' | 'Insert' | 'Update'

interface Serializable {
  serialize(): string
}

class PythonContext {
  types: { [k: string]: PostgresType };
  user_enums: { [k: string]: PythonEnum };
  columns: Record<string, PostgresColumn[]>;
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
        {} as Record<string, PostgresColumn[]>
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
      return `${formatForPyClassName(schema)}${formatForPyClassName(name)}`;
    }
     throw new TypeError(`Unknown row type: ${name}`);
  }

  parsePgType(pg_type: string) : PythonType {
    if (pg_type.endsWith('[]')) {
      const inner_str = pg_type.slice(0, -2);
      const inner = this.parsePgType(inner_str);
      return new PythonListType(inner);
    } else {
      const type_name = this.resolveTypeName(pg_type);
      return new PythonSimpleType(type_name);
    }
  }

  tableToClass(table: PostgresTable) : PythonClass {
    const attributes: PythonClassAttribute[] = (this.columns[table.id] ?? [])
      .map((col) => {
        const type = new PythonConcreteType(this, col.format, col.is_nullable);
        return new PythonClassAttribute(col.name, type);
      });
    return new PythonClass(table.name, this.schemas[table.schema], attributes)
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
        const type = new PythonConcreteType(this, attribute.type!.format, false);
        return new PythonClassAttribute(attribute.name, type);
      });
    const schema = this.schemas[type.schema];
    return new PythonClass(type.name, schema, attributeEntries);
  }
}


class PythonEnum implements Serializable {
  name: string;
  variants: string[];
  constructor(type: PostgresType) {
    this.name = formatForPyClassName(type.name);
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

class PythonConcreteType implements Serializable {
  py_type: PythonType;
  pg_name: string;
  nullable: boolean;
  default_value: string | null;
  constructor(ctx: PythonContext, pg_name: string, nullable: boolean) {
    const py_type = ctx.parsePgType(pg_name);
    
    this.py_type = py_type;
    this.pg_name = pg_name;
    this.nullable = nullable;
    this.default_value = null;
  }

  serialize() : string {
    return this.nullable
      ? `Optional[${this.py_type.serialize()}]`
      : this.py_type.serialize();
  }
}

class PythonClassAttribute implements Serializable {
  name: string;
  pg_name: string;
  py_type: PythonConcreteType;
  constructor(name: string, py_type: PythonConcreteType) {
    this.name = formatForPyAttributeName(name);
    this.pg_name = name;
    this.py_type = py_type;
  }
  serialize(): string {
    return `    ${this.name}: Annotated[${this.py_type.serialize()}, Field(alias="${this.pg_name}")]`
  }
}

class PythonClass implements Serializable {
  name: string;
  schema: PostgresSchema;
  class_attributes: PythonClassAttribute[];
  

  constructor(name: string, schema: PostgresSchema, class_attributes: PythonClassAttribute[]) {
    this.schema = schema;
    this.class_attributes = class_attributes;
    this.name = `${formatForPyClassName(schema.name)}${formatForPyClassName(name)}`;
  }
  serialize(): string {
    const attributes = this.class_attributes.length > 0
      ? this.class_attributes.map((attr) => attr.serialize()).join('\n')
      : "    pass";
    return `class ${this.name}(BaseModel):\n${attributes}`.trim();
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
    .map((table) => ctx.tableToClass(table));
  console.log('composite_types');
  const composite_types = types.filter((type) => type.attributes.length > 0).map((type) => ctx.typeToClass(type));

  let output = `
import datetime
from typing import Annotated, Any, List, Literal, Optional, TypeAlias

from pydantic import BaseModel, Field, Json

${concatLines(Object.values(ctx.user_enums))}

${concatLines(py_tables)}

${concatLines(composite_types)}

`.trim()

// ${views
//   .filter((view) => schemas.some((schema) => schema.name === view.schema))
//   .flatMap((view) =>
//     generateTableStructsForOperations(
//       schemas.find((schema) => schema.name === view.schema)!,
//       view,
//       columnsByTableId[view.id],
//       types,
//       ['Select']
//     )
//   )
//   .join('\n\n')}

// ${materializedViews
//   .filter((materializedView) => schemas.some((schema) => schema.name === materializedView.schema))
//   .flatMap((materializedView) =>
//     generateTableStructsForOperations(
//       schemas.find((schema) => schema.name === materializedView.schema)!,
//       materializedView,
//       columnsByTableId[materializedView.id],
//       types,
//       ['Select']
//     )
//   )
//   .join('\n\n')}

// ${compositeTypes
//   .filter((compositeType) => schemas.some((schema) => schema.name === compositeType.schema))
//   .map((compositeType) =>
//     generateCompositeTypeStruct(
//       schemas.find((schema) => schema.name === compositeType.schema)!,
//       compositeType,
//       types
//     )
//   )
//   .join('\n\n')}
// `.trim()

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
  console.log(name)
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
