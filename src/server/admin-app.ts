import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'

import _default = require('fastify-metrics')

export function build(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify(opts)
  app.register(_default, {
    endpoint: '/metrics',
    enableRouteMetrics: false,
    blacklist: ['nodejs_version_info', 'process_start_time_seconds'],
  })
  return app
}
