import { PostgresMeta } from "."

export default class TypeScriptTypes {
  pgMeta: PostgresMeta

  constructor({ pgMeta }: { pgMeta: PostgresMeta }) {
    this.pgMeta = pgMeta;
  }

  async dump(): Promise<any> {
    const { data, error } = await this.pgMeta.columns.list();
    // TODO: handle error

    if (data) {
      return data.reduce((prev, current) => {
        if (current.table in prev) {
          prev[current.table].push(current)
        } else {
          prev[current.table] = []
        }

        return prev
      }, {} as { [key: string]: Array<any> })
    }
  }
}
