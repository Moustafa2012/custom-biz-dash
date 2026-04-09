import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, TwoFactorState, Role } from "@/types/auth";
import { ROLE_PERMISSIONS, checkPermission } from "@/lib/permissions";

const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "Ahmed Al-Rashid",
    email: "admin@erp.com",
    password: "admin123",
    role: "super_admin",
    avatar: "https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=3b82f6&color=fff",
    phone: "+966 50 123 4567",
    country: "Saudi Arabia",
    city: "Riyadh",
    address: "King Fahd Road, Building 42",
    dateOfBirth: "1985-03-15",
    gender: "male",
    isActive: true,
    createdAt: "2023-01-01",
    lastLogin: "2025-04-08",
    twoFactorEnabled: true,
    twoFactorMethod: "otp",
    twoFactorSecret: "JBSWY3DPEHPK3PXP",
    backupCodes: ["A1B2C3", "D4E5F6", "G7H8I9", "J0K1L2"],
    permissions: ROLE_PERMISSIONS.super_admin,
  },
  {
    id: "u2",
    name: "Sara Hassan",
    email: "sara@erp.com",
    password: "sara123",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Sara+Hassan&background=7c3aed&color=fff",
    phone: "+966 55 987 6543",
    country: "Saudi Arabia",
    city: "Jeddah",
    address: "Tahlia Street, Suite 15",
    dateOfBirth: "1990-07-22",
    gender: "female",
    isActive: true,
    createdAt: "2023-03-10",
    lastLogin: "2025-04-07",
    twoFactorEnabled: false,
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: "u3",
    name: "Khalid Nasser",
    email: "khalid@erp.com",
    password: "khalid123",
    role: "accountant",
    avatar: "https://ui-avatars.com/api/?name=Khalid+Nasser&background=10b981&color=fff",
    phone: "+966 54 456 7890",
    country: "Saudi Arabia",
    city: "Dammam",
    address: "Prince Mohammed Bin Fahd Road",
    dateOfBirth: "1988-11-05",
    gender: "male",
    isActive: true,
    createdAt: "2023-06-20",
    lastLogin: "2025-04-06",
    twoFactorEnabled: true,
    twoFactorMethod: "email",
    backupCodes: ["X1Y2Z3", "M4N5O6"],
    permissions: ROLE_PERMISSIONS.accountant,
  },
  {
    id: "u4",
    name: "Fatima Al-Zahrani",
    email: "fatima@erp.com",
    password: "fatima123",
    role: "salesman",
    avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Zahrani&background=f59e0b&color=fff",
    phone: "+966 56 321 0987",
    country: "Saudi Arabia",
    city: "Mecca",
    address: "Al Aziziyah District",
    dateOfBirth: "1993-02-14",
    gender: "female",
    isActive: true,
    createdAt: "2024-01-15",
    lastLogin: "2025-04-05",
    twoFactorEnabled: false,
    permissions: ROLE_PERMISSIONS.salesman,
  },
  {
    id: "u5",
    name: "Omar Youssef",
    email: "omar@erp.com",
    password: "omar123",
    role: "store_keeper",
    avatar: "https://ui-avatars.com/api/?name=Omar+Youssef&background=f43f5e&color=fff",
    phone: "+966 58 654 3210",
    country: "Saudi Arabia",
    city: "Medina",
    address: "Al Khalidiyah, Block 7",
    dateOfBirth: "1995-09-30",
    gender: "male",
    isActive: false,
    createdAt: "2024-06-01",
    twoFactorEnabled: false,
    permissions: ROLE_PERMISSIONS.store_keeper,
  },
];

interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  twoFactorState: TwoFactorState | null;

  login: (email: string, password: string) => { success: boolean; requires2FA?: boolean; error?: string };
  verify2FA: (code: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  can: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: DEMO_USERS,
      isAuthenticated: false,
      twoFactorState: null,

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password);
        if (!user) return { success: false, error: "invalid_credentials" };
        if (!user.isActive) return { success: false, error: "account_disabled" };

        if (user.twoFactorEnabled && user.twoFactorMethod) {
          set({
            twoFactorState: {
              isRequired: true,
              method: user.twoFactorMethod,
              tempToken: user.id,
            },
          });
          return { success: true, requires2FA: true };
        }

        const updated = get().users.map((u) =>
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString().slice(0, 10) } : u
        );
        set({ currentUser: { ...user, lastLogin: new Date().toISOString().slice(0, 10) }, isAuthenticated: true, users: updated, twoFactorState: null });
        return { success: true };
      },

      verify2FA: (code) => {
        const state = get().twoFactorState;
        if (!state?.tempToken) return false;

        const user = get().users.find((u) => u.id === state.tempToken);
        if (!user) return false;

        const isValid = code === "123456" || (user.backupCodes?.includes(code) ?? false);
        if (!isValid) return false;

        const updated = get().users.map((u) =>
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString().slice(0, 10) } : u
        );
        set({ currentUser: { ...user, lastLogin: new Date().toISOString().slice(0, 10) }, isAuthenticated: true, users: updated, twoFactorState: null });
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, twoFactorState: null });
      },

      updateProfile: (data) => {
        const current = get().currentUser;
        if (!current) return;
        const updatedUser = { ...current, ...data };
        const updatedUsers = get().users.map((u) => (u.id === current.id ? updatedUser : u));
        set({ currentUser: updatedUser, users: updatedUsers });
      },

      can: (permission) => {
        const user = get().currentUser;
        if (!user) return false;
        return checkPermission(user.permissions, permission);
      },

      hasRole: (role) => {
        const user = get().currentUser;
        if (!user) return false;
        return user.role === role;
      },
    }),
    { name: "auth-storage" }
  )
);
