import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyMetrics from 'fastify-metrics'
import { register } from 'prom-client'

export const REQUEST_DURATION_METRIC = 'http_request_duration_seconds'
const REQUEST_SUMMARY_METRIC = 'http_request_summary_seconds'
export const UNMATCHED_ROUTE = '__unmatched__'

export type Outcome = 'ok' | 'user_error' | 'db_unavailable' | 'timeout' | 'server_error'

// Errors meaning the target database could not be reached or refused the session, as opposed
// to a failing statement. Route handlers map these to 400/500/503/504 inconsistently, so the
// status code alone cannot tell them apart from a pg-meta fault or a user SQL error.
const DB_UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EHOSTUNREACH',
  'ETIMEDOUT',
  '53300', // too_many_connections
  '57P01', // admin_shutdown
  '57P02', // crash_shutdown
  '57P03', // cannot_connect_now
])
// Metadata routes send only the raw message, not the SQLSTATE, so the message carries the signal.
const DB_UNAVAILABLE_MESSAGE =
  /^(Connection terminated|connect E[A-Z]+|getaddrinfo E[A-Z]+|sorry, too many clients|remaining connection slots|the database system is|terminating connection)/
// 57014 is also raised by pg_cancel_backend, which Studio uses to cancel a query on request.
const TIMEOUT_MESSAGE =
  /^(Query read timeout|canceling statement due to statement timeout|Generating types timed out)/
// Larger error bodies are a quoted query, not a connection failure, and parsing them would block
// the event loop for every such response.
const MAX_CLASSIFIED_BODY = 64 * 1024

const errorBodies = new WeakMap<FastifyRequest, string>()

export function classifyOutcome(statusCode: number, body: string | undefined): Outcome {
  if (statusCode < 400) return 'ok'
  let code: string | undefined
  let message = ''
  if (body && body.length <= MAX_CLASSIFIED_BODY) {
    try {
      const parsed = JSON.parse(body)
      code = typeof parsed.code === 'string' ? parsed.code : undefined
      // /query spreads the pg error, so `message` is the raw message and `error` is the formatted
      // one that may quote the user's SQL. Other routes only send `error`.
      message = String(parsed.message ?? parsed.error ?? '')
    } catch {
      // Non-JSON error body: classify on the status code alone.
    }
  }
  if (statusCode === 408 || TIMEOUT_MESSAGE.test(message)) {
    return 'timeout'
  }
  if (
    (code && (DB_UNAVAILABLE_CODES.has(code) || code.startsWith('08'))) ||
    DB_UNAVAILABLE_MESSAGE.test(message)
  ) {
    return 'db_unavailable'
  }
  return statusCode >= 500 ? 'server_error' : 'user_error'
}

export function registerRequestMetrics(app: FastifyInstance) {
  // The admin app serves /metrics from prom-client's global registry, so the histogram is
  // registered there too. Building a second app in the same process would otherwise throw.
  // fastify-metrics registers its summary even when disabled, so both names are cleared.
  register.removeSingleMetric(REQUEST_DURATION_METRIC)
  register.removeSingleMetric(REQUEST_SUMMARY_METRIC)

  // Only error responses are inspected, so successful requests pay no parsing cost.
  app.addHook('onSend', async (request, reply, payload) => {
    if (reply.statusCode >= 400 && typeof payload === 'string') {
      errorBodies.set(request, payload)
    }
    return payload
  })

  app.register(fastifyMetrics.default, {
    endpoint: null,
    defaultMetrics: { enabled: false },
    routeMetrics: {
      // The summary computes quantiles on every observation; the histogram is enough for SLOs.
      enabled: { histogram: true, summary: false },
      // The default whitelist is filled by an onRoute hook, which misses routes declared before
      // the plugin loads and the trailing-slash variants Fastify adds for prefixed routes.
      // Unmatched URLs get one fixed label, so the series count stays bounded.
      registeredRoutesOnly: false,
      overrides: {
        labels: {
          getRouteLabel: (request: FastifyRequest) =>
            request.routeOptions.url?.replace(/(.)\/$/, '$1') ?? UNMATCHED_ROUTE,
        },
        histogram: {
          name: REQUEST_DURATION_METRIC,
          // Upper buckets cover the 55s query timeout and 60s format timeout.
          buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60],
        },
      },
      customLabels: {
        outcome: (request: FastifyRequest, reply: FastifyReply) =>
          classifyOutcome(reply.statusCode, errorBodies.get(request)),
      },
    },
  })
}
