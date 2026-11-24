import app from './app.js'
import { env } from './config/env.js'
import { logger } from './lib/logger.js'

const startServer = () => {
  app.listen(env.PORT, () =>
    logger.info({ port: env.PORT }, 'Server is listening')
  )
}

startServer()
