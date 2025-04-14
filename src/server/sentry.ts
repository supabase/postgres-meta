import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

const sentryEnvironment = process.env.ENVIRONMENT ?? 'local'
const dsn = process.env.SENTRY_DSN ?? ''

const captureOptions: Sentry.NodeOptions =
  sentryEnvironment === 'prod'
    ? {
        // Tracing
        tracesSampleRate: 0.0001,
        // Set sampling rate for profiling - this is evaluated only once per SDK.init call
        profilesSampleRate: 0.0001,
      }
    : {
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
      }

const sensitiveKeys = ['pg', 'x-connection-encrypted']

function redactSensitiveData(data: any) {
  if (data && typeof data === 'object') {
    for (const key of sensitiveKeys) {
      if (key in data) {
        data[key] = '[REDACTED]'
      }
    }
  }
}

export default Sentry.init({
  enabled: Boolean(dsn),
  dsn: dsn,
  environment: sentryEnvironment,
  integrations: [nodeProfilingIntegration()],
  beforeSendTransaction(transaction) {
    if (transaction.contexts?.trace?.data) {
      redactSensitiveData(transaction.contexts.trace.data)
    }
    return transaction
  },
  beforeSendSpan(span) {
    if (span.data) {
      redactSensitiveData(span.data)
    }
    return span
  },
  ...captureOptions,
})
