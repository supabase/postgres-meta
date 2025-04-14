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

export default Sentry.init({
  enabled: Boolean(dsn),
  dsn: dsn,
  environment: sentryEnvironment,
  integrations: [nodeProfilingIntegration()],
  beforeSend: (event) => {
    if (event.request?.headers?.['Pg']) {
      event.request.headers['Pg'] = String(event.request.headers['Pg'].length)
    }
    if (event.request?.headers && event.request.headers['X-connection-encrypted']) {
      event.request.headers['X-connection-encrypted'] = String(
        event.request.headers['X-connection-encrypted'].length
      )
    }
    return event
  },
  ...captureOptions,
})
