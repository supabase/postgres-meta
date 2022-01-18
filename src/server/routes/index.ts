import * as CryptoJS from 'crypto-js'
import { FastifyInstance } from 'fastify'
import { PG_CONNECTION, CRYPTO_KEY } from '../constants'

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

  fastify.register(require('./columns'), { prefix: '/columns' })
  fastify.register(require('./config'), { prefix: '/config' })
  fastify.register(require('./extensions'), { prefix: '/extensions' })
  fastify.register(require('./functions'), { prefix: '/functions' })
  fastify.register(require('./policies'), { prefix: '/policies' })
  fastify.register(require('./publications'), { prefix: '/publications' })
  fastify.register(require('./query'), { prefix: '/query' })
  fastify.register(require('./schemas'), { prefix: '/schemas' })
  fastify.register(require('./roles'), { prefix: '/roles' })
  fastify.register(require('./tables'), { prefix: '/tables' })
  fastify.register(require('./triggers'), { prefix: '/triggers' })
  fastify.register(require('./types'), { prefix: '/types' })
  fastify.register(require('./views'), { prefix: '/views' })
}
