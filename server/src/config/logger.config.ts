import type { LoggerOptions } from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

export const loggerOptions: LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',

  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })
}
