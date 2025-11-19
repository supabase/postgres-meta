import fs from 'fs'
import os from 'os'
import pgcs from 'pg-connection-string'
import { FastifyRequest } from 'fastify'
import { DEFAULT_POOL_CONFIG } from './constants.js'
import { PoolConfig } from '../lib/types.js'

export const extractRequestForLogging = (request: FastifyRequest) => {
  let pg: string = 'unknown'
  try {
    if (request.headers.pg) {
      pg = pgcs.parse(request.headers.pg as string).host || pg
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

export function createConnectionConfig(request: FastifyRequest): PoolConfig {
  const connectionString = request.headers.pg as string
  const config = { ...DEFAULT_POOL_CONFIG, connectionString }

  // Override application_name if custom one provided in header
  if (request.headers['x-pg-application-name']) {
    config.application_name = request.headers['x-pg-application-name'] as string
  }

  return config
}

export function translateErrorToResponseCode(
  error: { message: string },
  defaultResponseCode = 400
): number {
  if (error.message === 'Connection terminated due to connection timeout') {
    return 504
  } else if (error.message === 'sorry, too many clients already') {
    return 503
  } else if (error.message === 'Query read timeout') {
    return 408
  }
  return defaultResponseCode
}

export function isRunningInWSL() {
  // Check for the presence of a specific file that only exists in WSL
  if (fs.existsSync('/proc/sys/fs/binfmt_misc/WSLInterop')) {
    return true
  }

  // Check for environment variables (less reliable as a user could set these manually)
  if (process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP) {
    return true
  }
  
  // Check the OS release info (kernel name often contains 'microsoft')
  const osRelease = os.release();
  if (osRelease.includes('microsoft') || osRelease.includes('Microsoft')) {
    return true
  }

  return false
}
