import express = require('express')

import { logger } from './lib/logger'
const api = require('./api')
const project = require('../package.json')

const app = express()
app.use(express.json())
app.use(api)

app.get('/', (_req, res) =>
  res.status(200).json({
    status: 200,
    name: project.name,
    version: project.version,
    documentation: 'https://supabase.github.io/pg-api/',
  })
)
app.get('/health', (_req, res) => res.status(200).json({ date: new Date() }))

let Server = {
  start(port: number) {
    this.server = app.listen(port, () => {
      logger.info(`App started on port ${port}`)
    })
    return app
  },
  stop() {
    this.server.close()
  },
}

export default Server
