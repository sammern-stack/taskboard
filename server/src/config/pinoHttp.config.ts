import { randomUUID } from 'node:crypto'
import { logger } from '../lib/logger.js'
import type { Options, StdSerializedResults } from 'pino-http'
import { AppError } from '../shared/errors/AppError.js'

const validateReqId = (id: string) => /^[A-Za-z0-9_-]{1,64}$/.test(id)

export const pinoHttpOptions: Options = {
  logger,
  genReqId(req, res) {
    const reqId = req.headers['x-request-id']

    const returnedId =
      typeof reqId === 'string' && validateReqId(reqId) ? reqId : randomUUID()

    res.setHeader('x-request-id', returnedId)
    return returnedId
  },
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
    err: serializeHttpError
  },
  redact: []
}

export function serializeHttpError(err: StdSerializedResults['err']) {
  const appError = err.raw instanceof AppError ? err.raw : undefined

  return {
    type: err.type,
    message: err.message,
    stack: err.stack,
    ...(appError && {
      code: appError.code,
      ...(appError.details !== undefined && { details: appError.details })
    })
  }
}
