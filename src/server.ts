const express = require('express')
const app = express()
const api = require('./api')
const project = require('../package.json')

app.use(express.json())
app.use(api)

app.get('/', (req, res) =>
  res.status(200).json({
    status: 200,
    name: project.name,
    version: project.version,
    documentation: 'https://supabase.github.io/pg-api/'
  })
)
app.get('/health', (req, res) => res.status(200).json({ date: new Date() }))

let Server = {
  start(port) {
    Server = app.listen(port, () => {
      console.log(`App started on port ${port}`)
    })
    return app
  },
  stop() {
    Server.close()
  },
}

export default Server
