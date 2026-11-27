import { z } from 'zod'

const MONGODB_ID = /^[0-9a-fA-F]{24}$/

export const createBoardSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  description: z.string().max(500).optional()
})

export const updateBoardSchema = createBoardSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Provide at least one field to update'
  })

export const boardIdParamSchema = z.strictObject({
  id: z.string().regex(MONGODB_ID, 'Invalid Mongodb id')
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
