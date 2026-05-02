import prisma from '../db/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput, TwoFactorVerifyInput, ResendTwoFactorInput } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { mapUserToDto } from '../utils/validation';
import { authenticator } from 'otplib';
import bcrypt from 'bcrypt';

export class AuthService {
  async register(data: RegisterInput) {
    const { email, password, name, phone, country, city, address, dateOfBirth, gender } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // SECURITY: hardcoded role on public signup. Privileged roles assigned only via authenticated admin POST /users.
        role: 'salesman',
        phone,
        country,
        city,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        permissions: JSON.stringify([]),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        country: true,
        city: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        twoFactorEnabled: true,
        permissions: true,
        backupCodes: true,
      },
    });

    logger.success('User registered successfully', { userId: user.id, email: user.email });

    return mapUserToDto(user);
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    if (user.deletedAt) {
      throw new AppError(401, 'Account has been deleted');
    }

    if (!user.isActive) {
      throw new AppError(401, 'Account is disabled');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && user.twoFactorMethod) {
      // Generate temporary token for 2FA verification
      const tempToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        is2FATemp: true,
      });

      logger.info('2FA required', { userId: user.id, email: user.email, method: user.twoFactorMethod });

      return {
        requires2FA: true,
        tempToken,
        twoFactorMethod: user.twoFactorMethod,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          twoFactorMethod: user.twoFactorMethod,
        },
      };
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.success('User logged in successfully', { userId: user.id, email: user.email });

    return {
      token,
      user: mapUserToDto(user),
    };
  }

  async verifyTwoFactor(data: TwoFactorVerifyInput) {
    const { token, code, isBackupCode = false } = data;

    // Verify the temporary token and get user info
    const decoded = await this.verifyTempToken(token);
    if (!decoded) {
      throw new AppError(401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.isActive) {
      throw new AppError(401, 'Account is disabled');
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new AppError(400, '2FA not configured for this user');
    }

    let isValid = false;

    if (isBackupCode) {
      // Backup codes are stored as a JSON array of bcrypt hashes
      const storedHashes: string[] = user.backupCodes ? JSON.parse(user.backupCodes) : [];
      let matchedIndex = -1;
      for (let i = 0; i < storedHashes.length; i++) {
        if (await bcrypt.compare(code, storedHashes[i])) {
          matchedIndex = i;
          break;
        }
      }
      if (matchedIndex >= 0) {
        isValid = true;
        // Invalidate the used backup code (one-time use)
        storedHashes.splice(matchedIndex, 1);
        await prisma.user.update({
          where: { id: user.id },
          data: { backupCodes: JSON.stringify(storedHashes) },
        });
      }
    } else {
      // TOTP verification (RFC 6238) — accepts ±1 step window for clock skew
      authenticator.options = { window: 1 };
      isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    }

    if (!isValid) {
      throw new AppError(401, 'Invalid verification code');
    }

    // Generate final auth token
    const authToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.success('2FA verification successful', { userId: user.id, email: user.email });

    return {
      token: authToken,
      user: mapUserToDto(user),
    };
  }

  async resendTwoFactorCode(data: ResendTwoFactorInput) {
    const { token } = data;

    // Verify the temporary token
    const decoded = await this.verifyTempToken(token);
    if (!decoded) {
      throw new AppError(401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // In a real implementation, this would send a new code via email/SMS
    // For demo purposes, we'll just return a success message
    logger.info('2FA code resent', { userId: user.id, email: user.email });

    return {
      message: 'Verification code resent successfully',
    };
  }

  private async verifyTempToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      // For demo purposes, we'll use a simple JWT verification
      // In production, this would use a proper temporary token system
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      return null;
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        country: true,
        city: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        twoFactorEnabled: true,
        permissions: true,
        backupCodes: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return mapUserToDto(user);
  }

  async logout(): Promise<void> {
    // In a real implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Log the logout event
    // 3. Clear any refresh tokens
    // For demo purposes, we'll just log the action
    logger.info('User logged out', { timestamp: new Date().toISOString() });
  }
}
