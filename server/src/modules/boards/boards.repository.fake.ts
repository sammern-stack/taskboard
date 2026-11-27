import { randomBytes } from 'node:crypto'
import type { Board, BoardRepository } from './boards.types.js'

export function createFakeBoardRepository(): BoardRepository {
  const boards = new Map<string, Board>()

  return {
    create: async (board) => {
      const now = new Date()
      const newBoard = {
        id: randomBytes(12).toString('hex'),
        name: board.name,
        ...(board.description !== undefined && {
          description: board.description
        }),
        createdAt: now,
        updatedAt: now
      }
      boards.set(newBoard.id, newBoard)
      return structuredClone(newBoard)
    },
    findAll: async () => structuredClone([...boards.values()]),
    findById: async (boardId) => structuredClone(boards.get(boardId)) ?? null,
    update: async (boardId, updates) => {
      const board = boards.get(boardId)
      if (board === undefined) return null

      const updatedBoard = {
        ...board,
        ...updates,
        updatedAt: new Date()
      }

      boards.set(boardId, updatedBoard)
      return structuredClone(updatedBoard)
    },
    delete: async (boardId) => boards.delete(boardId)
  }
}
