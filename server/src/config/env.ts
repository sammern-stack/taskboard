import { z } from 'zod'
import { parseEnv } from '../schemas/envSchema.js'

const loadEnv = () => {
  try {
    return parseEnv(process.env)
  } catch (error) {
    if (!(error instanceof z.ZodError)) throw error

    //! Don't use logger here, logger config is invalid by this point
    console.error(`Invalid env variables`)
    console.error(`Error:\n${z.prettifyError(error)}`)
    process.exit(1)
  }
}

export const env = loadEnv()
