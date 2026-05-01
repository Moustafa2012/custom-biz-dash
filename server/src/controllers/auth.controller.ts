import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      successResponse(res, 'User registered successfully', user, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      successResponse(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required');
      }
      const user = await this.authService.getProfile(req.user.userId);
      successResponse(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  verifyTwoFactor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.verifyTwoFactor(req.body);
      successResponse(res, '2FA verification successful', result);
    } catch (error) {
      next(error);
    }
  };

  resendTwoFactorCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resendTwoFactorCode(req.body);
      successResponse(res, 'Code resent successfully', result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.logout();
      successResponse(res, 'Logout successful', { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };
}
