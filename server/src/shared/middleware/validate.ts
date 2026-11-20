import { prettifyError, treeifyError } from 'zod'
import { ValidationError } from '../errors/customErrors.js'

import type { NextFunction, Request, Response } from 'express'
import type { ZodObject } from 'zod'

export const validate =
  (schema: ZodObject, pos: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const input =
      pos === 'body' ? req.body : pos === 'params' ? req.params : req.query

    const result = schema.safeParse(input)

    if (!result.success) {
      next(
        new ValidationError(
          prettifyError(result.error),
          treeifyError(result.error)
        )
      )
      return
    }

    const validated = res.locals.validated ?? {}
    validated[pos] = result.data
    res.locals.validated = validated

    next()
  }
