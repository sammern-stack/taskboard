import type { CreateBoardInput, UpdateBoardInput } from './boards.schema.js'

export type Board = {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type BoardRepository = {
  create: (board: CreateBoardInput) => Promise<Board>
  findAll: () => Promise<Board[]>
  findById: (boardId: string) => Promise<Board | null>
  update: (boardId: string, updates: UpdateBoardInput) => Promise<Board | null>
  delete: (boardId: string) => Promise<boolean>
}
