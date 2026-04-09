export type Role = "super_admin" | "admin" | "accountant" | "salesman" | "store_keeper";

export type TwoFactorMethod = "otp" | "email" | "app";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  dateOfBirth: string;
  gender?: "male" | "female";
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  twoFactorSecret?: string;
  backupCodes?: string[];
  permissions: string[];
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
