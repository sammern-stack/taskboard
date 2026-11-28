import { Router } from 'express'
import { createFakeBoardRepository } from '../modules/boards/boards.repository.fake.js'
import { createBoardService } from '../modules/boards/boards.service.js'
import { createBoardRouter } from '../modules/boards/boards.routes.js'

const router = Router()

// TEMP: in-memory fake until i connect a real mongodb database
const repository = createFakeBoardRepository()
const service = createBoardService(repository)
const boardRouter = createBoardRouter(service)

router.use('/boards', boardRouter)

export default router
