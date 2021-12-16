import { parse } from 'pg-connection-string'
import { FastifyRequest } from 'fastify'

export const extractRequestForLogging = (request: FastifyRequest) => ({
  method: request.method,
  url: request.url,
  pg: parse(request.headers.pg as string).host,
})
