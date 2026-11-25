import { z } from 'zod'
import { parseEnv } from '../schemas/envSchema.js'
import { logger } from '../lib/logger.js'

const loadEnv = () => {
  try {
    return parseEnv(process.env)
  } catch (error) {
    if (!(error instanceof z.ZodError)) throw error

    logger.error(
      { zodError: z.treeifyError(error) },
      `Invalid env variables: ${z.prettifyError(error)}`
    )
    process.exit(1)
  }
}

export const env = loadEnv()
