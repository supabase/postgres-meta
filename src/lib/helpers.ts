export const coalesceRowsToArray = (source: string, joinQuery: string) => {
  // Note that array_to_json(array_agg(row_to_json())) seems to perform better than json_agg
  return `
COALESCE(
  (
    SELECT
      array_to_json(array_agg(row_to_json(${source})))
    FROM
      ( ${joinQuery} ) ${source}
  ),
  '[]'
) AS ${source}`
}

/**
 * Transforms an array of SQL strings into a transaction
 */
export const toTransaction = (statements: string[]) => {
  let cleansed = statements.map((x) => {
    let sql = x.trim()
    if (sql.length > 0 && x.slice(-1) !== ';') sql += ';'
    return sql
  })
  const allStatements = cleansed.join('')
  return `BEGIN; ${allStatements} COMMIT;`
}
