import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import type { Express } from 'express'
import { randomBytes } from 'node:crypto'
import { errorHandler } from '../../shared/middleware/errorHandler.js'
import { createFakeBoardRepository } from './boards.repository.fake.js'
import { createBoardService, type BoardService } from './boards.service.js'
import { createBoardRouter } from './boards.routes.js'

describe('board routes', () => {
  let app: Express
  let service: BoardService
  const BASE_URL = '/api/v1/boards'

  beforeEach(() => {
    app = express()
    app.use(express.json())
    service = createBoardService(createFakeBoardRepository())
    const routes = createBoardRouter(service)
    app.use('/api/v1', routes)
    app.use(errorHandler)
  })

  describe(`POST ${BASE_URL}`, () => {
    it('valid body returns 201 and the created body', async () => {
      const res = await request(app).post(BASE_URL).send({ name: 'Homework' })

      expect(res.status).toBe(201)
      expect(res.body.data).toMatchObject({ name: 'Homework' })

      const { createdAt } = res.body.data
      expect(typeof createdAt).toBe('string')
      expect(new Date(createdAt).toISOString()).toBe(createdAt)
    })

    it('valid body returns 201 and createdAt as IOS string', async () => {
      const res = await request(app).post(BASE_URL).send({ name: 'Homework' })

      const { createdAt } = res.body.data
      expect(typeof createdAt).toBe('string')
      expect(new Date(createdAt).toISOString()).toBe(createdAt)
    })

    describe('returns a 400 error', () => {
      it('for empty name value', async () => {
        const res = await request(app).post(BASE_URL).send({ name: '' })

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
        expect(res.body.error).toHaveProperty('details')
      })

      it('for unknown field', async () => {
        const res = await request(app)
          .post(BASE_URL)
          .send({ name: 'Homework', user: 'Paul' })

        expect(res.status).toBe(400)
      })

      it('a malformed json was provided', async () => {
        const res = await request(app)
          .post(BASE_URL)
          .set('Content-Type', 'application/json')
          .send("{ name: 'Paul' ")

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('INVALID_JSON')
      })
    })
  })

  describe(`GET ${BASE_URL}`, () => {
    it('if boards are present shows with creation order', async () => {
      const board1 = await service.createBoard({ name: 'Homework' })
      const board2 = await service.createBoard({ name: 'FindAJob' })
      const board3 = await service.createBoard({ name: 'Groceries' })

      const res = await request(app).get(BASE_URL)
      expect(res.body.data).toEqual(
        [board1, board2, board3].map((board) => ({
          ...board,
          createdAt: board.createdAt.toISOString(),
          updatedAt: board.updatedAt.toISOString()
        }))
      )
    })

    it('if no boards exists returns an empty array', async () => {
      const res = await request(app).get(BASE_URL)
      expect(res.body.data).toEqual([])
    })
  })

  describe(`GET ${BASE_URL}/:id`, () => {
    it('an existing board returns 200 and the board at the response body', async () => {
      const board = await service.createBoard({ name: 'Homework' })
      const res = await request(app).get(`${BASE_URL}/${board.id}`)
      expect(res.status).toBe(200)
      expect(res.body.data).toEqual({
        ...board,
        updatedAt: board.updatedAt.toISOString(),
        createdAt: board.createdAt.toISOString()
      })
    })

    it('when valid id provided but no board found returns 404', async () => {
      const unknownId = randomBytes(12).toString('hex')
      const res = await request(app).get(`${BASE_URL}/${unknownId}`)
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND_ERROR')
    })

    it('when malformed id was provided return 400 validation error', async () => {
      const res = await request(app).get(`${BASE_URL}/an-invalid-id`)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })
})
