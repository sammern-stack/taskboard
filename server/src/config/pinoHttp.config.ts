import { logger } from '../lib/logger.js'
import type { Options } from 'pino-http'

export const pinoHttpOptions: Options = {
  logger,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        path: req.url?.split('?')[0]
      }
    },
    res(res) {
      return {
        statusCode: res.statusCode
      }
    },
    err(err) {
      return {
        type: err.type
      }
    }
  },
  redact: []
}
