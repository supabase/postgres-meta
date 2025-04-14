import Sentry from '@sentry/node'
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
        tracesSampleRate: 0.1,
        profilesSampleRate: 0.1,
      }

export default Sentry.init({
  enabled: Boolean(dsn),
  dsn: dsn,
  environment: sentryEnvironment,
  integrations: [nodeProfilingIntegration()],
  ...captureOptions,
})
