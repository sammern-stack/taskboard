import { describe, it, expect, expectTypeOf } from 'vitest'
import { parseEnv } from '../schemas/envSchema.js'
import type { ParsedEnv } from '../schemas/envSchema.js'

describe('ensure env variables are valid', () => {
  it('valid input should return typed object', () => {
    const input = {
      NODE_ENV: 'test',
      PORT: '4000',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/taskboard_test',
      JWT_SECRET: 'test-secret-at-least-32-characters-long'
    }

    expect(parseEnv(input)).toEqual({ ...input, PORT: 4000 })
    expectTypeOf(parseEnv(input)).toEqualTypeOf<ParsedEnv>()
  })

  it('missing env variable should throw', () => {
    const input = {
      NODE_ENV: 'test',
      PORT: '4000',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/taskboard_test'
    }

    expect(() => parseEnv(input)).toThrow()
  })

  it('missing PORT uses the default value', () => {
    const input = {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/taskboard_test',
      JWT_SECRET: 'test-secret-at-least-32-characters-long'
    }

    expect(parseEnv(input)).toEqual({ ...input, PORT: 4000 })
  })

  it('empty PORT value uses the default', () => {
    const input = {
      NODE_ENV: 'test',
      PORT: '',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/taskboard_test',
      JWT_SECRET: 'test-secret-at-least-32-characters-long'
    }

    expect(parseEnv(input)).toEqual({ ...input, PORT: 4000 })
  })

  it('invalid PORT value should throw', () => {
    const input = {
      NODE_ENV: 'test',
      PORT: '70000',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/taskboard_test',
      JWT_SECRET: 'test-secret-at-least-32-characters-long'
    }

    expect(() => parseEnv(input)).toThrow()
  })

  it('invalid MONGODB_URI should throw', () => {
    const input = {
      NODE_ENV: 'test',
      PORT: '4000',
      MONGODB_URI: 'mongo://127.0.0.1:27017/taskboard_test',
      JWT_SECRET: 'test-secret-at-least-32-characters-long'
    }

    expect(() => parseEnv(input)).toThrow()
  })
})
