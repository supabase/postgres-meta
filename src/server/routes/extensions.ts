import { Router } from 'express'
import logger from '../logger'
import { PostgresMeta } from '../../lib'

const router = Router()

router.get('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.extensions.list()
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.get('/:name', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.extensions.retrieve({ name: req.params.name })
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(404).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.post('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.extensions.create(req.body)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.patch('/:name', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.extensions.update(req.params.name, req.body)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    let statusCode = 400
    if (error.message.startsWith('Cannot find')) statusCode = 404
    return res.status(statusCode).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.delete('/:name', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''
  const cascade = req.query?.cascade === 'true'

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.extensions.remove(req.params.name, { cascade })
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    let statusCode = 400
    if (error.message.startsWith('Cannot find')) statusCode = 404
    return res.status(statusCode).json({ error: error.message })
  }

  return res.status(200).json(data)
})

export = router
