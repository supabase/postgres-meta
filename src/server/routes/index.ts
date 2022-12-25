import CryptoJS from 'crypto-js'
import { FastifyInstance } from 'fastify'
import ColumnRoute from './columns.js'
import ConfigRoute from './config.js'
import ExtensionsRoute from './extensions.js'
import ForeignTablesRoute from './foreign-tables.js'
import FunctionsRoute from './functions.js'
import PoliciesRoute from './policies.js'
import PublicationsRoute from './publications.js'
import QueryRoute from './query.js'
import SchemasRoute from './schemas.js'
import RolesRoute from './roles.js'
import TablesRoute from './tables.js'
import TriggersRoute from './triggers.js'
import TypesRoute from './types.js'
import ViewsRoute from './views.js'
import TypeGenRoute from './generators/typescript.js'
import { PG_CONNECTION, CRYPTO_KEY } from '../constants.js'

export default async (fastify: FastifyInstance) => {
  // Adds a "pg" object to the request if it doesn't exist
  fastify.addHook('onRequest', (request, _reply, done) => {
    // Node converts headers to lowercase
    const encryptedHeader = request.headers['x-connection-encrypted']?.toString()
    if (encryptedHeader) {
      try {
        request.headers.pg = CryptoJS.AES.decrypt(encryptedHeader, CRYPTO_KEY).toString(
          CryptoJS.enc.Utf8
        )
      } catch (e: any) {
        request.log.warn({
          message: 'failed to parse encrypted connstring',
          error: e.toString(),
        })
        throw new Error('failed to process upstream connection details')
      }
    } else {
      request.headers.pg = PG_CONNECTION
    }
    done()
  })

  fastify.register(ColumnRoute, { prefix: '/columns' })
  fastify.register(ConfigRoute, { prefix: '/config' })
  fastify.register(ExtensionsRoute, { prefix: '/extensions' })
  fastify.register(ForeignTablesRoute, { prefix: '/foreign-tables' })
  fastify.register(FunctionsRoute, { prefix: '/functions' })
  fastify.register(PoliciesRoute, { prefix: '/policies' })
  fastify.register(PublicationsRoute, { prefix: '/publications' })
  fastify.register(QueryRoute, { prefix: '/query' })
  fastify.register(SchemasRoute, { prefix: '/schemas' })
  fastify.register(RolesRoute, { prefix: '/roles' })
  fastify.register(TablesRoute, { prefix: '/tables' })
  fastify.register(TriggersRoute, { prefix: '/triggers' })
  fastify.register(TypesRoute, { prefix: '/types' })
  fastify.register(ViewsRoute, { prefix: '/views' })
  fastify.register(TypeGenRoute, { prefix: '/generators/typescript' })
}
