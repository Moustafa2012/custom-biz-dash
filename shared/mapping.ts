/**
 * Mapping layer for consistent data transformation between the client and server.
 * Handles:
 * - Date string to Date object (and vice-versa)
 * - Number format normalization
 * - Enum normalization
 * - Timezone handling
 * - Nested structure mapping
 */

import { UserDto } from './validation';

/**
 * Normalizes dates to ISO strings for consistent JSON serialization.
 */
export const normalizeDate = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
};

/**
 * Normalizes numeric strings to actual numbers.
 */
export const normalizeNumber = (val: string | number | null | undefined): number | undefined => {
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'number') return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? undefined : parsed;
};

/**
 * Map internal database User model to UserDto for API responses.
 * Ensures consistent field names and types.
 */
export const mapUserToDto = (user: any): UserDto => {
  // Parse permissions if it's a JSON string
  let permissions: string[] = [];
  if (typeof user.permissions === 'string') {
    try {
      permissions = JSON.parse(user.permissions);
    } catch {
      permissions = [];
    }
  } else if (Array.isArray(user.permissions)) {
    permissions = user.permissions;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    avatar: user.avatar || undefined,
    country: user.country || '',
    city: user.city || '',
    address: user.address || '',
    dateOfBirth: normalizeDate(user.dateOfBirth),
    gender: user.gender || undefined,
    isActive: !!user.isActive,
    createdAt: normalizeDate(user.createdAt) || new Date().toISOString(),
    lastLogin: normalizeDate(user.lastLogin),
    twoFactorEnabled: !!user.twoFactorEnabled,
    twoFactorMethod: user.twoFactorMethod || undefined,
    permissions: permissions,
  };
};

/**
 * Generic mapping utility for versioned structures.
 */
export const mapDataWithVersioning = <T, U>(
  data: T,
  version: string,
  mappers: Record<string, (d: T) => U>
): U => {
  const mapper = mappers[version] || mappers['latest'];
  if (!mapper) {
    throw new Error(`No mapper found for version ${version}`);
  }
  return mapper(data);
};

/**
 * Error message formatter for validation failures.
 */
export const formatValidationError = (zodError: any): string => {
  return zodError.errors
    .map((err: any) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
};
