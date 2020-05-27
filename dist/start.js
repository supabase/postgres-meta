var Server = require('./server').default;
var PG_API_PORT = require('./lib/constants').PG_API_PORT;
Server.start(PG_API_PORT);
