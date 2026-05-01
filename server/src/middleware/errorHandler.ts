import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Check for ZodError by class name or instanceof
  if (err instanceof ZodError || err.name === 'ZodError') {
    const errors = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.error('Validation error', { errors });
    errorResponse(res, 'Validation failed', 400, JSON.stringify(errors));
    return;
  }

  if (err instanceof AppError) {
    logger.error(err.message, { statusCode: err.statusCode });
    errorResponse(res, err.message, err.statusCode);
    return;
  }

  logger.error('Unexpected error', { error: err.message, stack: err.stack });
  errorResponse(res, 'Internal server error', 500, process.env.NODE_ENV === 'development' ? err.message : undefined);
};
