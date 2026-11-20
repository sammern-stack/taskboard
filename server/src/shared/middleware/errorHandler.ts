import type { NextFunction, Request, Response } from 'express'
import AppError from '../errors/AppError.js'
import { env } from '../../config/env.js'

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) next(error)

  const isAppError = error instanceof AppError
  const statusCode = isAppError ? error.statusCode : 500

  res.status(statusCode).json({
    error: {
      message: isAppError ? error.message : 'Unknown Error',
      ...(isAppError && {
        code: error.code,
        details: error.details,
        ...(env.NODE_ENV === 'development' && { stack: error.stack })
      })
    }
  })
}
