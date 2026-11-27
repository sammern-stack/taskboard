import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createBoardService, type BoardService } from './boards.service.js'
import { createFakeBoardRepository } from './boards.repository.fake.js'
import { randomBytes } from 'node:crypto'
import { NotFoundError } from '../../shared/errors/customErrors.js'
import type { Board } from './boards.types.js'

describe('board services', () => {
  let service: BoardService

  beforeEach(() => {
    vi.useFakeTimers()
    const repository = createFakeBoardRepository()
    service = createBoardService(repository)
  })

  afterEach(() => vi.useRealTimers())

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
    const result = service.getBoard(randomId)
    await expect(result).rejects.toBeInstanceOf(NotFoundError)
    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      details: { boardId: randomId }
    })
  })

  it('updateBoard update the name and keep description same', async () => {
    const board = await service.createBoard({
      name: 'Homework',
      description: 'Complete my homework'
    })

    const updatedBoard = await service.updateBoard(board.id, {
      name: 'Assignment'
    })

    expect(updatedBoard).toMatchObject({
      name: 'Assignment',
      description: 'Complete my homework'
    })
  })

  it('listBoards shows the updated boards after updateBoard', async () => {
    const board = await service.createBoard({
      name: 'Homework',
      description: 'Complete my homework'
    })

    await service.updateBoard(board.id, { name: 'Assignment' })

    const list = await service.listBoards()
    expect(list).toContainEqual({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      name: 'Assignment',
      description: 'Complete my homework',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('updateBoard throws NotFoundError if id is unknown', async () => {
    const randomId = randomBytes(12).toString('hex')

    await service.createBoard({
      name: 'Homework',
      description: 'Complete my homework'
    })

    const updatedBoard = service.updateBoard(randomId, {
      name: 'Assignment'
    })

    await expect(updatedBoard).rejects.toBeInstanceOf(NotFoundError)
    await expect(updatedBoard).rejects.toMatchObject({
      statusCode: 404,
      details: { boardId: randomId }
    })
  })

  it('updateBoard updates updatedAt and not createdAt', async () => {
    vi.setSystemTime(0)
    const board = await service.createBoard({
      name: 'Homework',
      description: 'Complete my homework'
    })

    vi.setSystemTime(1000)
    const updatedBoard = await service.updateBoard(board.id, {
      name: 'Assignment'
    })

    expect(updatedBoard).toMatchObject({
      name: 'Assignment',
      description: 'Complete my homework'
    })
    expect(updatedBoard.updatedAt.getTime()).toBeGreaterThan(
      board.createdAt.getTime()
    )
    expect(updatedBoard.createdAt).toEqual(board.createdAt)
    expect(updatedBoard.updatedAt).toEqual(new Date(1000))
  })

  it('after deleteBoard, getBoard with same id should throw', async () => {
    const board = await service.createBoard({ name: 'Homework' })
    await service.deleteBoard(board.id)
    const result = service.getBoard(board.id)
    await expect(result).rejects.toBeInstanceOf(NotFoundError)
    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      details: { boardId: board.id }
    })
  })

  it('after deleteBoard onces passes, trying twice fail', async () => {
    const board = await service.createBoard({ name: 'Homework' })
    await service.deleteBoard(board.id)
    const deleteAgain = service.deleteBoard(board.id)
    await expect(deleteAgain).rejects.toBeInstanceOf(NotFoundError)
    await expect(deleteAgain).rejects.toMatchObject({
      statusCode: 404,
      details: { boardId: board.id }
    })
  })

  it('after deleteBoard, other boards are untouched', async () => {
    const board1 = await service.createBoard({ name: 'Homework1' })
    await service.createBoard({ name: 'Homework2' })
    await service.deleteBoard(board1.id)
    const list = await service.listBoards()
    expect(list.map((item) => item.name)).toEqual(['Homework2'])
  })

  it('unknown id when deleteBoard should throw', async () => {
    const randomId = randomBytes(12).toString('hex')
    await service.createBoard({ name: 'Homework' })

    const result = service.deleteBoard(randomId)
    await expect(result).rejects.toBeInstanceOf(NotFoundError)
    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      details: { boardId: randomId }
    })
  })
})
