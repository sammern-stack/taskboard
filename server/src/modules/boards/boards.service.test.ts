import { describe, it, expect, beforeEach } from 'vitest'
import { createBoardService } from './boards.service.js'
import { createFakeBoardRepository } from './boards.repository.fake.js'
import { randomBytes } from 'node:crypto'
import { NotFoundError } from '../../shared/errors/customErrors.js'
import type { Board } from './boards.types.js'

describe('board services', () => {
  let repository: ReturnType<typeof createFakeBoardRepository>
  let service: ReturnType<typeof createBoardService>

  beforeEach(() => {
    repository = createFakeBoardRepository()
    service = createBoardService(repository)
  })

  it('createBoard return new board with given name', async () => {
    const input = { name: 'Homework' }
    const newBoard = await service.createBoard(input)

    expect(newBoard.id).toMatch(/^[0-9a-fA-F]{24}$/)
    expect(newBoard.name).toBe('Homework')
    expect(newBoard.createdAt).toEqual(newBoard.updatedAt)
    expect(newBoard.createdAt).toBeInstanceOf(Date)

    const list = await service.listBoards()
    expect(list).toContainEqual(newBoard)
  })

  it('listBoards returns empty array if no board was created', async () => {
    const list = await service.listBoards()
    expect(list).toEqual([])
  })

  it('listBoards returns boards in creation order', async () => {
    await service.createBoard({ name: 'Homework' })
    await service.createBoard({ name: 'Groceries' })
    await service.createBoard({ name: 'DailyRoutine' })

    const list = await service.listBoards()
    expect(list.map((item: Board) => item.name)).toEqual([
      'Homework',
      'Groceries',
      'DailyRoutine'
    ])
  })

  it('getBoard should return the board from a valid id', async () => {
    const newBoard = await service.createBoard({ name: 'Homework' })
    const findBoard = await service.getBoard(newBoard.id)
    expect(findBoard).toEqual(newBoard)
  })

  it('getBoard should throw from an invalid id', async () => {
    const randomId = randomBytes(12).toString('hex')
    await service.createBoard({ name: 'Homework' })
    await expect(service.getBoard(randomId)).rejects.toBeInstanceOf(
      NotFoundError
    )
  })
})
