import { Router } from 'express'
import type { BoardService } from './boards.service.js'
import { createBoardController } from './boards.controller.js'
import { validate } from '../../shared/middleware/validate.js'
import {
  boardIdParamSchema,
  createBoardSchema,
  updateBoardSchema
} from './boards.schema.js'

export function createBoardRouter(service: BoardService) {
  const router = Router()
  const controller = createBoardController(service)

  router
    .route('/')
    .post(validate(createBoardSchema), controller.create)
    .get(controller.list)

  router
    .route('/:id')
    .get(validate(boardIdParamSchema, 'params'), controller.getOne)
    .patch(
      validate(boardIdParamSchema, 'params'),
      validate(updateBoardSchema),
      controller.update
    )
    .delete(validate(boardIdParamSchema, 'params'), controller.remove)

  return router
}
