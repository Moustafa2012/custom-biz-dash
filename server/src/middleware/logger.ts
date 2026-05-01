import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;
    
    if (statusCode >= 400) {
      logger.error(message, { ip, method, url: originalUrl, statusCode, duration });
    } else {
      logger.info(message, { ip, method, url: originalUrl, statusCode, duration });
    }
  });

  next();
};
