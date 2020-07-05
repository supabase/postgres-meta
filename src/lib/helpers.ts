
export const coalesceRowsToArray = (source: string, joinQuery: string) => {
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
