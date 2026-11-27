import { NotFoundError } from '../../shared/errors/customErrors.js'
import type { CreateBoardInput, UpdateBoardInput } from './boards.schema.js'
import type { BoardRepository } from './boards.types.js'

const boardNotFound = (boardId: string) => {
  return new NotFoundError('Board not found', { boardId })
}

export function createBoardService(repository: BoardRepository) {
  return {
    createBoard: (input: CreateBoardInput) => repository.create(input),
    listBoards: () => repository.findAll(),
    getBoard: async (boardId: string) => {
      const board = await repository.findById(boardId)
      if (!board) throw boardNotFound(boardId)
      return board
    },
    updateBoard: async (boardId: string, updates: UpdateBoardInput) => {
      const updated = await repository.update(boardId, updates)
      if (!updated) throw boardNotFound(boardId)
      return updated
    },
    deleteBoard: async (boardId: string) => {
      const deleted = await repository.delete(boardId)
      if (!deleted) throw boardNotFound(boardId)
    }
  }
}

export type BoardService = ReturnType<typeof createBoardService>
