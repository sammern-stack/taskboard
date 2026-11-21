class AppError extends Error {
  public statusCode: number
  public code: string
  public details: unknown | undefined

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'APP_ERROR',
    details?: unknown
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
