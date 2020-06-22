import * as fs from 'fs'
import * as path from 'path'

export = {
  columns: fs.readFileSync(path.join(__dirname, '/columns.sql')).toString(),
  config: fs.readFileSync(path.join(__dirname, '/config.sql')).toString(),
  constraints: fs.readFileSync(path.join(__dirname, '/constraints.sql')).toString(),
  extensions: fs.readFileSync(path.join(__dirname, '/extensions.sql')).toString(),
  grants: fs.readFileSync(path.join(__dirname, '/grants.sql')).toString(),
  joins: fs.readFileSync(path.join(__dirname, '/joins.sql')).toString(),
  pk_list: fs.readFileSync(path.join(__dirname, '/pk_list.sql')).toString(),
  policies: fs.readFileSync(path.join(__dirname, '/policies.sql')).toString(),
  relationships: fs.readFileSync(path.join(__dirname, '/relationships.sql')).toString(),
  roles: fs.readFileSync(path.join(__dirname, '/roles.sql')).toString(),
  schemas: fs.readFileSync(path.join(__dirname, '/schemas.sql')).toString(),
  sequences: fs.readFileSync(path.join(__dirname, '/sequences.sql')).toString(),
  tableSize: fs.readFileSync(path.join(__dirname, '/table_size.sql')).toString(),
  tables: fs.readFileSync(path.join(__dirname, '/tables.sql')).toString(),
  types: fs.readFileSync(path.join(__dirname, '/types.sql')).toString(),
  version: fs.readFileSync(path.join(__dirname, '/version.sql')).toString(),
  views: fs.readFileSync(path.join(__dirname, '/views.sql')).toString(),
}
