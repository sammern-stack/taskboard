import { flattenError, treeifyError } from 'zod'
import { ValidationError } from '../errors/customErrors.js'
import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type Pos = 'body' | 'query' | 'params'

export const validate =
  (schema: ZodType, pos: Pos = 'body') =>
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

export const getValidated = <T>(res: Response, pos: Pos): T => {
  // This type cast is safe only when the route passes the request through the validate middleware
  return res.locals.validated[pos] as T
}
