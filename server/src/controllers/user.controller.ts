import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string | undefined,
        role: req.query.role as 'super_admin' | 'admin' | 'accountant' | 'salesman' | 'store_keeper' | undefined,
      };
      const result = await this.userService.getAllUsers(query, req.user.role as any);
      successResponse(res, 'Users retrieved successfully', result.users, 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const user = await this.userService.getUserById(req.params.id, req.user.role as any);
      successResponse(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const user = await this.userService.createUser(req.body, req.user.role as any);
      successResponse(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const user = await this.userService.updateUser(req.params.id, req.body, req.user.role as any);
      successResponse(res, 'User updated successfully', user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const result = await this.userService.deleteUser(req.params.id, req.user.role as any);
      successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  };
}
