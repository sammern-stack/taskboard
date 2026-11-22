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
  } else {
    err = {
      message: 'Unknown Error',
      code: 'INTERNAL_SERVER_ERROR',
      ...(!isProd && { stack: (error as Error).stack })
    }
    console.error(error)
  }

  res.status(statusCode).json({ error: err })
}
