import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

const invalidRequestIds = [
  ['65 characters', 'a'.repeat(65)],
  ['contains a space', 'request id'],
  ['contains <', 'request<id'],
  ['contains /', 'request/id'],
  ['empty string', '']
] as const

const validRequestIds = [
  ['single character', 'b'],
  ['maximum characters', 'a'.repeat(64)],
  ['all allowed characters', 'Abc_123-xyz']
] as const

describe('request ids validations', () => {
  it('request without req header get a x-request-id res header', async () => {
    const res = await request(app).get('/api/health')
    expect(res.header['x-request-id']).toEqual(expect.any(String))
  })

  it('two requests get two different ids', async () => {
    const first = await request(app).get('/api/health')
    const second = await request(app).get('/api/health')
    expect(first.header['x-request-id']).not.toBe(second.header['x-request-id'])
  })

  it('a request with a provided header id, receives same header in response', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('x-request-id', 'abc-123')
    expect(res.header['x-request-id']).toBe('abc-123')
  })

  it.each(invalidRequestIds)(
    'replaces an invalid request ID: %s',
    async (_description, suppliedId) => {
      const res = await request(app)
        .get('/api/health')
        .set('x-request-id', suppliedId)

      const responseId = res.headers['x-request-id']

      expect(responseId).not.toBe(suppliedId)
      expect(responseId).toMatch(/^[A-Za-z0-9_-]{1,64}$/)
    }
  )

  it.each(validRequestIds)(
    'all valid cases for request ids: %s',
    async (_description, suppliedId) => {
      const res = await request(app)
        .get('/api/health')
        .set('x-request-id', suppliedId)

      const responseId = res.headers['x-request-id']
      expect(responseId).toBe(suppliedId)
    }
  )
})
