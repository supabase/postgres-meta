import express from 'express'
import { PG_API_PORT } from './constants'
import routes from './routes'
import pkg from '../../package.json'
import logger from './logger'

const app = express()
app.use(express.json())
app.use(routes)
app.get('/', (_req, res) =>
  res.status(200).json({
    status: 200,
    name: pkg.name,
    version: pkg.version,
    documentation: 'https://supabase.github.io/pg-api/',
  })
)
app.get('/health', (_req, res) => res.status(200).json({ date: new Date() }))
app.listen(PG_API_PORT, () => {
  logger.info(`App started on port ${PG_API_PORT}`)
})
