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
