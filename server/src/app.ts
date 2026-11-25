import express from 'express'
import { pinoHttp } from 'pino-http'
import { errorHandler } from './shared/middleware/errorHandler.js'
import { NotFoundError } from './shared/errors/customErrors.js'
import { pinoHttpOptions } from './config/pinoHttp.config.js'
import type { Request, Response, NextFunction } from 'express'

const app = express()

app.use(pinoHttp(pinoHttpOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  req.log.info('Health check requested')
  res.send({ status: 'ok' })
})

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.route) next(new NotFoundError("the route provided wasn't found"))
})
app.use(errorHandler)

export default app
