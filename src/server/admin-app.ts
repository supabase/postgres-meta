import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify'

import FastifyMetrics from 'fastify-metrics'

export function build(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = fastify(opts)
  // @ts-ignore fastify-metrics doesn't work with NodeNext resolution
  app.register(FastifyMetrics, {
    endpoint: '/metrics',
    routeMetrics: { enabled: false },
  })
  return app
}
