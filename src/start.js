const Server = require('./server').default
const { PG_API_PORT } = require('./lib/constants')
Server.start(PG_API_PORT)
