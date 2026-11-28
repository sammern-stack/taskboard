import type { Request, Response } from 'express'
import type { BoardService } from './boards.service.js'
import { getValidated } from '../../shared/middleware/validate.js'
import type {
  UpdateBoardInput,
  BoardIdParam,
  CreateBoardInput
} from './boards.schema.js'

export function createBoardController(service: BoardService) {
  return {
    create: async (_req: Request, res: Response) => {
      const body = getValidated<CreateBoardInput>(res, 'body')
      const newBoard = await service.createBoard(body)
      res.status(201).json({ data: newBoard })
    },
    list: async (_req: Request, res: Response) => {
      const boards = await service.listBoards()
      res.status(200).json({ data: boards })
    },
    getOne: async (_req: Request, res: Response) => {
      const params = getValidated<BoardIdParam>(res, 'params')
      const board = await service.getBoard(params.id)
      res.status(200).json({ data: board })
    },
    update: async (_req: Request, res: Response) => {
      const params = getValidated<BoardIdParam>(res, 'params')
      const body = getValidated<UpdateBoardInput>(res, 'body')
      const updated = await service.updateBoard(params.id, body)
      res.status(200).json({ data: updated })
    },
    remove: async (_req: Request, res: Response) => {
      const params = getValidated<BoardIdParam>(res, 'params')
      await service.deleteBoard(params.id)
      res.status(204).send()
    }
  }
}
