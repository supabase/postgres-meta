import * as fs from 'fs'
import * as path from 'path'

export = {
  columns: fs.readFileSync(path.join(__dirname, '/columns.sql')).toString(),
  config: fs.readFileSync(path.join(__dirname, '/config.sql')).toString(),
  extensions: fs.readFileSync(path.join(__dirname, '/extensions.sql')).toString(),
  functions: fs.readFileSync(path.join(__dirname, '/functions.sql')).toString(),
  grants: fs.readFileSync(path.join(__dirname, '/grants.sql')).toString(),
  policies: fs.readFileSync(path.join(__dirname, '/policies.sql')).toString(),
  primary_keys: fs.readFileSync(path.join(__dirname, '/primary_keys.sql')).toString(),
  publications: fs.readFileSync(path.join(__dirname, '/publications.sql')).toString(),
  relationships: fs.readFileSync(path.join(__dirname, '/relationships.sql')).toString(),
  roles: fs.readFileSync(path.join(__dirname, '/roles.sql')).toString(),
  schemas: fs.readFileSync(path.join(__dirname, '/schemas.sql')).toString(),
  tables: fs.readFileSync(path.join(__dirname, '/tables.sql')).toString(),
  types: fs.readFileSync(path.join(__dirname, '/types.sql')).toString(),
  version: fs.readFileSync(path.join(__dirname, '/version.sql')).toString(),
}
