const express = require('express')
const app = express()
const api = require('./api')

app.use(express.json())
app.use(api)

app.get('/', (req, res) => res.sendStatus(200))
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
