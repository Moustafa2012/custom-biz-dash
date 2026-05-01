import { UserDto } from '@shared/validation';

export type Role = "super_admin" | "admin" | "accountant" | "salesman" | "store_keeper";

export type TwoFactorMethod = "otp" | "email" | "app";

export interface User extends Omit<UserDto, 'role' | 'twoFactorMethod'> {
  role: Role;
  twoFactorMethod?: TwoFactorMethod;
}

export interface TwoFactorState {
  isRequired: boolean;
  method: TwoFactorMethod;
  tempToken?: string;
}

export const ROLE_LABELS: Record<Role, { en: string; ar: string }> = {
  super_admin: { en: "Super Admin", ar: "مدير عام" },
  admin: { en: "Admin", ar: "مدير" },
  accountant: { en: "Accountant", ar: "محاسب" },
  salesman: { en: "Salesman", ar: "مندوب مبيعات" },
  store_keeper: { en: "Store Keeper", ar: "أمين مخزن" },
};
