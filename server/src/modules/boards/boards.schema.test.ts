import { describe, it, expect } from 'vitest'
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdParamSchema
} from './boards.schema.js'

const invalidStringValues = [
  ['empty string', ''],
  ['string only spaces', '  '],
  ['over 100 chars', 'a'.repeat(101)]
]

describe('validate using createBoardSchema', () => {
  it('a valid name passes', () => {
    const input = { name: 'Homework' }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(input)
  })

  it('around whitespaces should be trimmed', () => {
    const input = { name: '  Paul  ' }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual({ name: 'Paul' })
  })

  it.each(invalidStringValues)(
    'empty value or just spaces should fail %s',
    (_description, current) => {
      const result = createBoardSchema.safeParse({ name: current })
      expect(result.success).toBeFalsy()
    }
  )

  it('name up to 100 characters should pass', () => {
    const input = { name: 'a'.repeat(100) }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(input)
  })

  it('name over 100 characters should fail', () => {
    const input = { name: 'a'.repeat(101) }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeFalsy()
  })

  it('missing name property should fail', () => {
    const input = { description: 'optional-board-description-content' }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeFalsy()
  })

  it('description if present and over 500 characters should fail', () => {
    const input = { name: 'Paul', description: 'a'.repeat(501) }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeFalsy()
  })

  it('description if present and under 500 characters should pass', () => {
    const input = { name: 'Paul', description: 'a'.repeat(500) }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(input)
  })

  it('if unknown field is present it should be rejected', () => {
    const input = {
      name: 'Paul',
      description: 'a'.repeat(500),
      unknown: 'what-is-this'
    }
    const result = createBoardSchema.safeParse(input)
    expect(result.success).toBeFalsy()
  })
})

describe('validate using updateBoardSchema', () => {
  it('if name is only present should pass', () => {
    const updates = { name: 'Peter' }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(updates)
  })

  it('if description is only present should pass', () => {
    const updates = { description: 'a'.repeat(500) }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(updates)
  })

  it('if empty object was provided should fail', () => {
    const updates = {}
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeFalsy()
  })

  it('a valid name passes', () => {
    const updates = { name: 'Homework' }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(updates)
  })

  it('around whitespaces should be trimmed', () => {
    const updates = { name: '  Paul  ' }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual({ name: 'Paul' })
  })

  it.each(invalidStringValues)(
    'empty value or just spaces should fail %s',
    (_description, current) => {
      const result = updateBoardSchema.safeParse({ name: current })
      expect(result.success).toBeFalsy()
    }
  )

  it('name up to 100 characters should pass', () => {
    const updates = { name: 'a'.repeat(100) }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(updates)
  })

  it('description if present and over 500 characters should fail', () => {
    const updates = { name: 'Paul', description: 'a'.repeat(501) }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeFalsy()
  })

  it('description if present and under 500 characters should pass', () => {
    const updates = { name: 'Paul', description: 'a'.repeat(500) }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(updates)
  })

  it('if unknown field is present it should be rejected', () => {
    const updates = {
      name: 'Paul',
      description: 'a'.repeat(500),
      unknown: 'what-is-this'
    }
    const result = updateBoardSchema.safeParse(updates)
    expect(result.success).toBeFalsy()
  })
})

describe('validate using boardIdParamSchema', () => {
  it('a valid mongodb ObjectId should pass', () => {
    const input = { id: '507f1f77bcf86cd799439011' }
    const result = boardIdParamSchema.safeParse(input)
    expect(result.success).toBeTruthy()
    expect(result.data).toEqual(input)
  })

  it('an invalid mongodb ObjectId should fail', () => {
    const input = { id: 'an-invalid-mongodb-id' }
    const result = boardIdParamSchema.safeParse(input)
    expect(result.success).toBeFalsy()
  })
})
