var fs = require('fs')

module.exports = {
  columns: {
    list: fs.readFileSync(__dirname + '/columns/list.sql').toString(),
  },
  config: {
    list: fs.readFileSync(__dirname + '/config/list.sql').toString(),
    version: fs.readFileSync(__dirname + '/config/version.sql').toString(),
  },
  constraints: {
    list: fs.readFileSync(__dirname + '/constraints/list.sql').toString(),
  },
  joins: {
    list: fs.readFileSync(__dirname + '/joins/list.sql').toString(),
  },
  plugins: {
    list: fs.readFileSync(__dirname + '/plugins/list.sql').toString(),
  },
  policies: {
    list: fs.readFileSync(__dirname + '/policies/list.sql').toString(),
  },
  stats: {
    tableSize: fs.readFileSync(__dirname + '/stats/table_size.sql').toString(),
  },
  sequences: {
    list: fs.readFileSync(__dirname + '/sequences/list.sql').toString(),
  },
  types: {
    list: fs.readFileSync(__dirname + '/types/list.sql').toString(),
  },
  tables: {
    list: fs.readFileSync(__dirname + '/tables/list.sql').toString(),
    grants: fs.readFileSync(__dirname + '/tables/grants.sql').toString(),
  },
  users: {
    list: fs.readFileSync(__dirname + '/users/list.sql').toString(),
  },
  views: {
    list: fs.readFileSync(__dirname + '/views/list.sql').toString(),
  },
}
