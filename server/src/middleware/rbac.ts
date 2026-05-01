import { Request, Response, NextFunction } from 'express';
type Role = 'super_admin' | 'admin' | 'accountant' | 'salesman' | 'store_keeper';
import { ROLE_PERMISSIONS, checkPermission } from '../utils/permissions';
import { AppError } from './errorHandler';
import { JWTPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authorize = (requiredPermission: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }

      const userRole = req.user.role as Role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      if (!checkPermission(userPermissions, requiredPermission)) {
        throw new AppError(403, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
