import AppError from './AppError.js';

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, 'UNAUTHORIZED_ERROR', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 403, 'FORBIDDEN_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}
