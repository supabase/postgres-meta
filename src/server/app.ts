import fastify from 'fastify'
import { PG_META_PORT } from './constants'
import routes from './routes'
import pkg from '../../package.json'

const app = fastify({ logger: true, disableRequestLogging: true })

app.setErrorHandler((error, request, reply) => {
  app.log.error(JSON.stringify({ error, req: request.body }))
  reply.code(500).send({ error: error.message })
})

app.setNotFoundHandler((request, reply) => {
  app.log.error(JSON.stringify({ error: 'Not found', req: request.body }))
  reply.code(404).send({ error: 'Not found' })
})

app.register(require('fastify-cors'))
app.register(routes)

app.get('/', async (_request, _reply) => {
  return {
    status: 200,
    name: pkg.name,
    version: pkg.version,
    documentation: 'https://github.com/supabase/postgres-meta',
  }
})

app.get('/health', async (_request, _reply) => {
  return { date: new Date() }
})

app.listen(PG_META_PORT, () => {
  app.log.info(`App started on port ${PG_META_PORT}`)
})
