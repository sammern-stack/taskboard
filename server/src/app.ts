import express from 'express'
import { errorHandler } from './shared/middleware/errorHandler.js'
import { NotFoundError } from './shared/errors/customErrors.js'
import type { Request, Response, NextFunction } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.send({ status: 'ok' })
})

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.route) next(new NotFoundError("the route provided wasn't found"))
})
app.use(errorHandler)

export default app
