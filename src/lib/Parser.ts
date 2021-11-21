import { ParserOptions, ParsedAst, FormatterOptions } from './types'
import { Parser } from 'node-sql-parser/build/postgresql'
import prettier from 'prettier/standalone'
import SqlFormatter from 'prettier-plugin-sql'

const DEFAULT_PARSER_OPTIONS = {
  database: 'PostgreSQL',
  type: 'table',
}

const DEFAULT_FORMATTER_OPTIONS = {
  plugins: [SqlFormatter],
  formatter: 'sql-formatter',
  language: 'postgresql',
  database: 'postgresql',
  uppercase: false, // I thought this would "lowercase" everything, but it doesn't. There is not option to convert everything to lowercase.
  parser: 'sql',
}

/**
 * Parses a SQL string into an AST.
 */
export function Parse(sql: string, options: ParserOptions = {}): ParseReturnValues {
  try {
    const parser = new Parser()
    const ast = parser.parse(sql, {
      ...DEFAULT_PARSER_OPTIONS,
      ...options,
    })

    return { data: ast, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
interface ParseReturnValues {
  data: ParsedAst | null
  error: null | Error
}

/**
 * Formats a SQL string into a prettier-formatted SQL string.
 */
export function Format(sql: string, options: FormatterOptions = {}): FormatReturnValues {
  try {
    const formatted = prettier.format(sql, {
      ...DEFAULT_FORMATTER_OPTIONS,
      ...options,
    })

    return { data: formatted, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
interface FormatReturnValues {
  data: string | null
  error: null | Error
}
