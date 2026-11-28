import { describe, it, expect, beforeEach, vi } from 'vitest'
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
    it('valid body returns 201 and the created body and Date as ISO', async () => {
      const res = await request(app).post(BASE_URL).send({ name: 'Homework' })

      expect(res.status).toBe(201)
      expect(res.body.data).toMatchObject({ name: 'Homework' })

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
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
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

    it('after POST the board will be to the next GET', async () => {
      const board = await request(app).post(BASE_URL).send({ name: 'Homework' })
      const boards = await request(app).get(BASE_URL)
      expect(boards.body.data).toEqual([board.body.data])
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
      const spy = vi.spyOn(service, 'getBoard')
      const res = await request(app).get(`${BASE_URL}/an-invalid-id`)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe(`PATCH ${BASE_URL}/:id`, () => {
    it('after updating only name res contains new name, old description', async () => {
      const board = await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })

      const res = await request(app)
        .patch(`${BASE_URL}/${board.body.data.id}`)
        .send({ name: 'Project' })

      expect(res.status).toBe(200)
      expect(res.body.data.name).toBe('Project')
      expect(res.body.data.description).toBe(board.body.data.description)
    })

    it('after calling PATCH next GET shows updated board', async () => {
      const board = await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })

      const res = await request(app)
        .patch(`${BASE_URL}/${board.body.data.id}`)
        .send({ name: 'Project' })

      const boards = await request(app).get(BASE_URL)

      expect(boards.status).toBe(200)
      expect(boards.body.data).toEqual([res.body.data])
    })

    describe('returns 400 when', () => {
      it('sends empty body: {}', async () => {
        const board = await request(app).post(BASE_URL).send({
          name: 'Homework',
          description: 'Complete them before the semester ends'
        })

        const res = await request(app)
          .patch(`${BASE_URL}/${board.body.data.id}`)
          .send({})

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
      })

      it('sends empty name value', async () => {
        const board = await request(app).post(BASE_URL).send({
          name: 'Homework',
          description: 'Complete them before the semester ends'
        })

        const res = await request(app)
          .patch(`${BASE_URL}/${board.body.data.id}`)
          .send({ name: '' })

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
      })

      it('sends unknown field', async () => {
        const board = await request(app).post(BASE_URL).send({
          name: 'Homework',
          description: 'Complete them before the semester ends'
        })

        const res = await request(app)
          .patch(`${BASE_URL}/${board.body.data.id}`)
          .send({ name: '', unknownField: '' })

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
      })

      it("malformed id that doesn't exists, even with valid body", async () => {
        await request(app).post(BASE_URL).send({
          name: 'Homework',
          description: 'Complete them before the semester ends'
        })

        const res = await request(app)
          .patch(`${BASE_URL}/unknown-id`)
          .send({ name: 'Project' })

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
      })
    })

    it("well-formed id that doesn't exist return 404 not found", async () => {
      const randomValidId = randomBytes(12).toString('hex')
      await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })

      const res = await request(app)
        .patch(`${BASE_URL}/${randomValidId}`)
        .send({ name: 'Project' })

      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND_ERROR')
    })
  })

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it('existing boards sends back 204 with empty body', async () => {
      const board = await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })
      const res = await request(app).delete(`${BASE_URL}/${board.body.data.id}`)

      expect(res.status).toBe(204)
      expect(res.text).toBe('')
    })

    it('after delete GET /:d return 404 and GET / no longer list it', async () => {
      const board = await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })
      const boardId = board.body.data.id

      const deleted = await request(app).delete(`${BASE_URL}/${boardId}`)
      expect(deleted.status).toBe(204)

      const getBoard = await request(app).get(`${BASE_URL}/${boardId}`)
      expect(getBoard.status).toBe(404)

      const boards = await request(app).get(BASE_URL)
      expect(boards.body.data).toEqual([])
    })

    it('malformed id returns 400', async () => {
      await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })
      const deleted = await request(app).delete(`${BASE_URL}/unknown-id`)

      expect(deleted.status).toBe(400)
    })

    it('deleting twice first returns 204 then 400', async () => {
      const board = await request(app).post(BASE_URL).send({
        name: 'Homework',
        description: 'Complete them before the semester ends'
      })
      const boardId = board.body.data.id

      const first = await request(app).delete(`${BASE_URL}/${boardId}`)
      expect(first.status).toBe(204)

      const second = await request(app).delete(`${BASE_URL}/${boardId}`)
      expect(second.status).toBe(404)
    })
  })
})
