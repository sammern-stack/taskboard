import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('request ids validations', () => {
  it('request without req header get a x-request-header res header', async () => {
    const res = await request(app).get('/api/health')
    expect(res.header['x-request-id']).toEqual(expect.any(String))
  })

  it('two requests get two different ids', async () => {
    app.get('/route-1', (_req, res) => {
      res.status(200).json({ msg: 'route 1 requested' })
    })

    app.get('/route-2', (_req, res) => {
      res.status(200).json({ msg: 'route 2 requested' })
    })

    const firstRouteRes = await request(app).get('/route-1')
    const secondRouteRes = await request(app).get('/route-2')
    expect(firstRouteRes.header['x-request-id']).toSatisfy(
      (val) => val !== secondRouteRes.header['x-request-id']
    )
  })

  it('a request with a provided header id, receives same header in response', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('x-request-id', 'abc-123')
    expect(res.header['x-request-id']).toBe('abc-123')
  })

  it('if unsafe req id was provided, return a fresh id', async () => {
    const unsafeId =
      'a-very-very-very-very-long-unsafe-request-header-id-more-than-100-characters-or-is-containing-spaces'

    const res = await request(app)
      .get('/api/health')
      .set('x-request-id', unsafeId)

    expect(res.header['x-request-id']).toSatisfy((val) => val !== unsafeId)
  })
})
