import { Router } from 'express'
import type { BoardService } from './boards.service.js'
import { createBoardController } from './boards.controller.js'
import { validate } from '../../shared/middleware/validate.js'
import { boardIdParamSchema, createBoardSchema } from './boards.schema.js'

export function createBoardRouter(service: BoardService) {
  const router = Router()
  const controller = createBoardController(service)

  router
    .route('/boards')
    .post(validate(createBoardSchema), controller.create)
    .get(controller.list)

  router
    .route('/boards/:id')
    .get(validate(boardIdParamSchema, 'params'), controller.getOne)

  return router
}
