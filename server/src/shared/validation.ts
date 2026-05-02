import { z } from 'zod';

/**
 * Shared validation schemas for request/response bodies.
 * These are used by both front-end (for form validation and client-side checks)
 * and back-end (for request validation).
 */

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // SECURITY: `role` intentionally NOT accepted on public registration to prevent privilege escalation.
  // Privileged accounts must be created via authenticated admin flow (POST /users).
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['super_admin', 'admin', 'accountant', 'salesman', 'store_keeper']),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  avatar: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['super_admin', 'admin', 'accountant', 'salesman', 'store_keeper']).optional(),
  phone: z.string().min(7, 'Phone number must be at least 7 characters').optional(),
  country: z.string().min(2, 'Country is required').optional(),
  city: z.string().min(2, 'City is required').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export const twoFactorVerifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
  code: z.string().min(6, 'Verification code must be 6 characters').max(6),
  isBackupCode: z.boolean().optional(),
});

export const resendTwoFactorSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'accountant', 'salesman', 'store_keeper']).optional(),
});

// Types inferred from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;
export type ResendTwoFactorInput = z.infer<typeof resendTwoFactorSchema>;

/**
 * Shared DTOs (Data Transfer Objects) for responses.
 * These define the structure of data sent from the server to the client.
 */

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
  country: string;
  city: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: string;
  permissions: string[];
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface TwoFactorRequiredDto {
  requires2FA: true;
  tempToken: string;
  twoFactorMethod: string;
  user: Pick<UserDto, 'id' | 'name' | 'email' | 'role' | 'twoFactorEnabled' | 'twoFactorMethod'>;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
