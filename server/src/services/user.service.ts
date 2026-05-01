import prisma from '../db/client';
import { hashPassword } from '../utils/password';
import { CreateUserInput, UpdateUserInput, PaginationQuery } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
type Role = 'super_admin' | 'admin' | 'accountant' | 'salesman' | 'store_keeper';
import { canAccess } from '../utils/permissions';
import { logger } from '../utils/logger';
import { mapUserToDto } from '../utils/validation';

export class UserService {
  async getAllUsers(query: PaginationQuery, _currentUserRole: Role) {
    const { page = 1, limit = 10, search, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const usersWithParsedArrays = users.map((user: any) => mapUserToDto(user));

    return {
      users: usersWithParsedArrays,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string, _currentUserRole: Role) {
    const user = await prisma.user.findUnique({
      where: { id },
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
        deletedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.deletedAt) {
      throw new AppError(404, 'User not found');
    }

    return mapUserToDto(user);
  }

  async createUser(data: CreateUserInput, currentUserRole: Role) {
    const { email, password, name, role, phone, country, city, address, dateOfBirth, gender, avatar } = data;

    if (!canAccess(currentUserRole, role)) {
      throw new AppError(403, 'Cannot create user with higher or equal role');
    }

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
        role,
        phone,
        country,
        city,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        avatar,
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

    logger.success('User created successfully', { userId: user.id, email: user.email });

    return mapUserToDto(user);
  }

  async updateUser(id: string, data: UpdateUserInput, currentUserRole: Role) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.deletedAt) {
      throw new AppError(404, 'User not found');
    }

    if (data.role && !canAccess(currentUserRole, data.role)) {
      throw new AppError(403, 'Cannot assign higher or equal role');
    }

    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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

    logger.success('User updated successfully', { userId: updatedUser.id });

    return mapUserToDto(updatedUser);
  }

  async deleteUser(id: string, currentUserRole: Role) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.deletedAt) {
      throw new AppError(404, 'User not found');
    }

    if (!canAccess(currentUserRole, user.role)) {
      throw new AppError(403, 'Cannot delete user with higher or equal role');
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    logger.success('User deleted successfully', { userId: id });

    return { message: 'User deleted successfully' };
  }
}
