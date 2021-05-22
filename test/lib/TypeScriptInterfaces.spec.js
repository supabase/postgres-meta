var assert = require('assert')
var sinon = require('sinon')

import TypeScriptInterfaces from '../../bin/src/lib/TypeScriptInterfaces'
import { PostgresMeta } from '../../bin/src/lib'


describe('.dump()', () => {
  it('handles nullable columns', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'name',
        format: 'text',
        is_nullable: true
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptInterfaces({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { name?: string };
}
`

    assert.equal(await example.dump(), expected)
  })

  it('returns a string of TypeScript types', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'id',
        format: 'int8'
      },
      {
        table: 'todos',
        name: 'done',
        format: 'bool'
      },
      {
        table: 'todos',
        name: 'done_at',
        is_nullable: true,
        format: 'date',
      },
      {
        table: 'memes',
        name: 'example',
        format: 'some-invalid-format',
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptInterfaces({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { id: number; done: boolean; done_at?: Date };
  memes: { example: any };
}
`

    assert.equal(await example.dump(), expected)
  })
})
