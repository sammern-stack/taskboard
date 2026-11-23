import { AppError } from '../errors/AppError.js'
import { env } from '../../config/env.js'
import type { NextFunction, Request, Response } from 'express'

type ErrorBody = {
  message?: string
  code?: string
  details?: unknown
  stack?: string
}

const getErrorStatus = (error: unknown): number => {
  if (typeof error !== 'object' || error === null) return 500

  for (const key of ['status', 'statusCode'] as const) {
    if (key in error) {
      const status = (error as Record<string, unknown>)[key]

      const isNumber = typeof status === 'number'
      const isValidStatus = isNumber && Number.isInteger(status)
      const isCorrectErrStatus = isNumber && status >= 400 && status <= 599

      if (isValidStatus && isCorrectErrStatus) return status
    }
  }

  return 500
}

const isInvalidJsonError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  )
}

const canExposeMessage = (
  status: number,
  error: unknown
): string | undefined => {
  if (
    status >= 400 &&
    status < 500 &&
    typeof error === 'object' &&
    error !== null &&
    'expose' in error &&
    error.expose === true &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next(error)

  const isProd = env.NODE_ENV === 'production'
  const statusCode = getErrorStatus(error)
  let err: ErrorBody

  if (error instanceof AppError) {
    err = {
      message: error.message,
      code: error.code,
      details: error.details,
      ...(!isProd && { stack: error.stack })
    }
  } else if (isInvalidJsonError(error)) {
    err = {
      code: 'INVALID_JSON',
      message: 'The request body contains invalid JSON'
    }
  } else {
    err = {
      message: canExposeMessage(statusCode, error) ?? 'Unknown Error',
      code: statusCode < 500 ? 'REQUEST_ERROR' : 'INTERNAL_SERVER_ERROR',
      ...(!isProd && error instanceof Error && { stack: error.stack })
    }

    console.error(error)
  }

  res.status(statusCode).json({ error: err })
}
