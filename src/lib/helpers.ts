import { literal } from 'pg-format'
import { DatabaseError } from 'pg-protocol'
import { PostgresMetaErr, PostgresMetaOk } from './types.js'

export const wrapResult = <T>(result: T): PostgresMetaOk<T> => {
  return { data: result, error: null }
}

export const wrapError = (error: unknown, sql: string): PostgresMetaErr => {
  if (error instanceof DatabaseError) {
    // Roughly based on:
    // - https://github.com/postgres/postgres/blob/fc4089f3c65a5f1b413a3299ba02b66a8e5e37d0/src/interfaces/libpq/fe-protocol3.c#L1018
    // - https://github.com/brianc/node-postgres/blob/b1a8947738ce0af004cb926f79829bb2abc64aa6/packages/pg/lib/native/query.js#L33
    let formattedError = ''
    {
      if (error.severity) {
        formattedError += `${error.severity}:  `
      }
      if (error.code) {
        formattedError += `${error.code}: `
      }
      if (error.message) {
        formattedError += error.message
      }
      formattedError += '\n'
      if (error.position) {
        // error.position is 1-based
        const position = Number(error.position) - 1

        let line = ''
        let lineNumber = 0
        let lineOffset = 0

        const lines = sql.split('\n')
        let currentOffset = 0
        for (let i = 0; i < lines.length; i++) {
          if (currentOffset + lines[i].length > position) {
            line = lines[i]
            lineNumber = i + 1 // 1-based
            lineOffset = position - currentOffset
            break
          }
          currentOffset += lines[i].length + 1 // 1 extra offset for newline
        }
        formattedError += `LINE ${lineNumber}: ${line}
${' '.repeat(5 + lineNumber.toString().length + 2 + lineOffset)}^
`
      }
      if (error.detail) {
        formattedError += `DETAIL:  ${error.detail}
`
      }
      if (error.hint) {
        formattedError += `HINT:  ${error.hint}
`
      }
      if (error.internalQuery) {
        formattedError += `QUERY:  ${error.internalQuery}
`
      }
      if (error.where) {
        formattedError += `CONTEXT:  ${error.where}
`
      }
    }

    return {
      data: null,
      error: {
        ...error,
        // error.message is non-enumerable
        message: error.message,
        formattedError,
      },
    }
  }

  if (error instanceof Error) {
    return { data: null, error: { message: error.message } }
  }

  throw error
}

export const coalesceRowsToArray = (source: string, filter: string) => {
  return `
COALESCE(
  (
    SELECT
      array_agg(row_to_json(${source})) FILTER (WHERE ${filter})
    FROM
      ${source}
  ),
  '{}'
) AS ${source}`
}

export const filterByList = (include?: string[], exclude?: string[], defaultExclude?: string[]) => {
  if (defaultExclude) {
    exclude = defaultExclude.concat(exclude ?? [])
  }
  if (include?.length) {
    return `IN (${include.map(literal).join(',')})`
  } else if (exclude?.length) {
    return `NOT IN (${exclude.map(literal).join(',')})`
  }
  return ''
}
