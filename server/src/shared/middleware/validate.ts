import { flattenError, treeifyError } from 'zod'
import { ValidationError } from '../errors/customErrors.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

export const validate =
  (schema: ZodType, pos: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const input =
      pos === 'body' ? req.body : pos === 'params' ? req.params : req.query

    const result = schema.safeParse(input)

    if (!result.success) {
      return next(
        new ValidationError('Invalid request data', {
          tree: treeifyError(result.error),
          simple: flattenError(result.error)
        })
      )
    }

    const validated = res.locals.validated ?? {}
    validated[pos] = result.data
    res.locals.validated = validated

    next()
  }
