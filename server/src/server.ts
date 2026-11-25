import app from './app.js'
import { env } from './config/env.js'
import { logger } from './lib/logger.js'

const startServer = () => {
  const server = app.listen(env.PORT, () =>
    logger.info({ port: env.PORT }, 'Server is listening')
  )

  let isShuttingDown = false

  const shutdown = (signal: string) => {
    if (isShuttingDown) return
    isShuttingDown = true

    logger.info({ signal }, 'Shutting down')

    const timeout = setTimeout(() => {
      logger.fatal('Shutting timed out; forcing exit')
      process.exit(1)
    }, 10_000)

    server.close((error) => {
      clearTimeout(timeout)

      if (error) {
        logger.error({ err: error }, 'Error while closing server')
        process.exit(1)
      }

      logger.info('Server closed')
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ err: reason }, 'Unhandled promise rejection')
    process.exit(1)
  })

  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Uncaught exception')
    process.exit(1)
  })
}

startServer()
