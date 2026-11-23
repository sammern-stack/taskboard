import { z } from 'zod'
import { parseEnv } from '../schemas/envSchema.js'

const loadEnv = () => {
  try {
    return parseEnv(process.env)
  } catch (error) {
    if (!(error instanceof z.ZodError)) throw error

    console.error(`Invalid env variables: ${z.prettifyError(error)}`)
    process.exit(1)
  }
}

export const env = loadEnv()
