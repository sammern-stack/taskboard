import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import app from './app.js'
import { errorHandler } from './shared/middleware/errorHandler.js'

describe('GET /api/health', () => {
  it('api status is ok with 200 code', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /api/v1/boards', () => {
  it('status of 200 and a empty array under res.body.data', async () => {
    const res = await request(app).get('/api/v1/boards')
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })
})

describe('GET /unknown-route', () => {
  it('return 404 with correct error shape', async () => {
    const res = await request(app).get('/api/unknown-route')
    expect(res.status).toBe(404)
    expect(res.body.error).toEqual({
      code: 'NOT_FOUND_ERROR',
      message: "the route provided wasn't found",
      stack: expect.any(String)
    })
  })

  it('A NotFoundError returns its own status, code and message', async () => {
    const res = await request(app).get('/api/unknown-route')
    expect(res.status).toBe(404)
    expect(res.body.error).toMatchObject({
      code: 'NOT_FOUND_ERROR',
      message: expect.any(String)
    })
  })
})

describe('Plain Error responses', () => {
  it('should return 500 and no internal message', async () => {
    const testApp = express()

    testApp.get('/error', () => {
      throw new Error('error')
    })
    testApp.use(errorHandler)

    const res = await request(testApp).get('/error')
    expect(res.status).toBe(500)
    expect(res.body.error).toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unknown Error'
    })
  })
})

describe('Malformed JSON when sent to a body-parsing route', () => {
  it('should return 400 with client friendly error code', async () => {
    const testApp = express()

    testApp.use(express.json())
    testApp.post('/invalid-json', (_req, res) => {
      res.status(200)
    })
    testApp.use(errorHandler)

    const res = await request(testApp)
      .post('/invalid-json')
      .set('Content-Type', 'application/json')
      .send('{"name": }')

    expect(res.status).toBe(400)
    expect(res.body.error).toMatchObject({
      code: 'INVALID_JSON',
      message: 'The request body contains invalid JSON'
    })
  })
})
