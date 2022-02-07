import { parse } from 'pg-connection-string'
import { FastifyRequest } from 'fastify'

export const extractRequestForLogging = (request: FastifyRequest) => {
  let pg: string = 'unknown'
  try {
    if (request.headers.pg) {
      pg = parse(request.headers.pg as string).host || pg
    }
  } catch (e: any) {
    console.warn('failed to parse PG connstring for ' + request.url)
  }

  const additional = request.headers['x-supabase-info']?.toString() || ''

  return {
    method: request.method,
    url: request.url,
    pg,
    opt: additional,
  }
}

export function translateErrorToResponseCode(
  error: { message: string },
  defaultResponseCode = 400
): number {
  if (error.message === 'Connection terminated due to connection timeout') {
    return 504
  }
  return defaultResponseCode
}
