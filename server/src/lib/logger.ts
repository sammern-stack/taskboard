import pino from 'pino'
import { loggerOptions } from '../config/logger.config.js'

export const logger = pino(loggerOptions)
