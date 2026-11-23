import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { validate } from './validate.js'
import express from 'express'
import { z } from 'zod'
import { errorHandler } from './errorHandler.js'

const testUserSchema = z.object({
  name: z.string(),
  age: z.number().positive()
})

describe('Validate zod schemas', () => {
  const testApp = express()

  testApp.use(express.json())

  testApp.post('/api/test-user', validate(testUserSchema), (_req, res) => {
    res.status(200).json({ ...res.locals.validated.body })
  })

  testApp.use(errorHandler)

  it('valid objects return 200', async () => {
    const res = await request(testApp).post('/api/test-user').send({
      name: 'Paul',
      age: 30,
      extra: 'not in the schema'
    })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ name: 'Paul', age: 30 })
    expect(res.body).not.toHaveProperty('extra')
  })

  it('invalid body returns 400 with proper error details', async () => {
    const res = await request(testApp).post('/api/test-user').send({
      name: 'Paul',
      age: 'thirty',
      extra: 'not in the schema'
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: expect.any(String),
      details: expect.any(Object)
    })
  })
})
