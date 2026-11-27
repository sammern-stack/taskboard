import { NotFoundError } from '../../shared/errors/customErrors.js'
import type { CreateBoardInput } from './boards.schema.js'
import type { BoardRepository } from './boards.types.js'

export function createBoardService(repository: BoardRepository) {
  return {
    createBoard: (input: CreateBoardInput) => repository.create(input),
    listBoards: () => repository.findAll(),
    getBoard: async (boardId: string) => {
      const board = await repository.findById(boardId)
      if (!board) throw new NotFoundError('board not found', { boardId })
      return board
    }
  }
}

export type BoardService = ReturnType<typeof createBoardService>
