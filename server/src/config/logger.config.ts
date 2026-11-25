import { env } from './env.js'
import type { LoggerOptions } from 'pino'

const isDev = env.NODE_ENV === 'development'
const developmentOptions: LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
}

export const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL,
  ...(isDev ? developmentOptions : {})
}
