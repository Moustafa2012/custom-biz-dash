import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, TwoFactorState, Role } from "@/types/auth";
import { ROLE_PERMISSIONS, checkPermission } from "@/lib/permissions";

// Demo credentials - NOT persisted, only in memory
const DEMO_CREDENTIALS: Record<string, string> = {
  "admin@erp.com": "admin123",
  "sara@erp.com": "sara123",
  "khalid@erp.com": "khalid123",
  "fatima@erp.com": "fatima123",
  "omar@erp.com": "omar123",
};

// Demo 2FA codes - NOT persisted, only in memory
const DEMO_2FA_CODES: Record<string, { otp: string; backupCodes: string[] }> = {
  "admin@erp.com": { otp: "123456", backupCodes: ["A1B2C3", "D4E5F6", "G7H8I9", "J0K1L2"] },
  "khalid@erp.com": { otp: "654321", backupCodes: ["X1Y2Z3", "M4N5O6"] },
};

// Demo users without sensitive data - can be safely persisted
const DEMO_USERS: Omit<User, 'password' | 'twoFactorSecret' | 'backupCodes'>[] = [
  {
    id: "u1",
    name: "Ahmed Al-Rashid",
    email: "admin@erp.com",
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
    permissions: ROLE_PERMISSIONS.super_admin,
  },
  {
    id: "u2",
    name: "Sara Hassan",
    email: "sara@erp.com",
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
    permissions: ROLE_PERMISSIONS.accountant,
  },
  {
    id: "u4",
    name: "Fatima Al-Zahrani",
    email: "fatima@erp.com",
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

interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

interface AuthState {
  currentUser: User | null;
  users: Omit<User, 'password' | 'twoFactorSecret' | 'backupCodes'>[];
  isAuthenticated: boolean;
  twoFactorState: TwoFactorState | null;
  intendedRoute: string | null;
  loginAttempts: Map<string, LoginAttempt>;

  login: (email: string, password: string) => { success: boolean; requires2FA?: boolean; error?: string };
  verify2FA: (code: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  can: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
  setIntendedRoute: (route: string | null) => void;
  clearLoginAttempts: (email: string) => void;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: DEMO_USERS,
      isAuthenticated: false,
      twoFactorState: null,
      intendedRoute: null,
      loginAttempts: new Map<string, LoginAttempt>(),

      setIntendedRoute: (route) => set({ intendedRoute: route }),

      login: (email, password) => {
        // Check if account is locked
        const attempts = get().loginAttempts.get(email);
        if (attempts?.lockedUntil && attempts.lockedUntil > Date.now()) {
          const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
          return { 
            success: false, 
            error: `account_locked_${remainingMinutes}` 
          };
        }

        // Validate credentials using in-memory demo data
        const correctPassword = DEMO_CREDENTIALS[email];
        if (!correctPassword || password !== correctPassword) {
          // Record failed attempt
          const currentAttempts = attempts?.attempts || 0;
          const newAttempts = currentAttempts + 1;
          const lockedUntil = newAttempts >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION : null;
          
          const newAttempt: LoginAttempt = {
            email,
            attempts: newAttempts,
            lastAttempt: Date.now(),
            lockedUntil,
          };

          set((state) => {
            const newLoginAttempts = new Map(state.loginAttempts);
            newLoginAttempts.set(email, newAttempt);
            return { loginAttempts: newLoginAttempts };
          });

          return { 
            success: false, 
            error: lockedUntil ? "account_locked" : "invalid_credentials" 
          };
        }

        // Credentials are valid - check if user exists and is active
        const user = get().users.find((u) => u.email === email);
        if (!user) return { success: false, error: "invalid_credentials" };
        if (!user.isActive) return { success: false, error: "account_disabled" };

        // Clear login attempts on successful authentication
        get().clearLoginAttempts(email);

        // Check if 2FA is required
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

        // Complete login without 2FA
        const updated = get().users.map((u) =>
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString().slice(0, 10) } : u
        );
        set({
          currentUser: { ...user, lastLogin: new Date().toISOString().slice(0, 10) } as User,
          isAuthenticated: true,
          users: updated,
          twoFactorState: null,
        });
        return { success: true };
      },

      verify2FA: (code) => {
        const state = get().twoFactorState;
        if (!state?.tempToken) return false;

        const user = get().users.find((u) => u.id === state.tempToken);
        if (!user) return false;

        // Get 2FA codes from in-memory demo data
        const twoFACodes = DEMO_2FA_CODES[user.email];
        if (!twoFACodes) return false;

        // Validate against OTP or backup codes
        const isValid = code === twoFACodes.otp || twoFACodes.backupCodes.includes(code);
        if (!isValid) return false;

        // If backup code was used, remove it (in a real app, this would be done server-side)
        if (twoFACodes.backupCodes.includes(code) && twoFACodes.backupCodes.length > 0) {
          twoFACodes.backupCodes.splice(twoFACodes.backupCodes.indexOf(code), 1);
        }

        const updated = get().users.map((u) =>
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString().slice(0, 10) } : u
        );
        set({
          currentUser: { ...user, lastLogin: new Date().toISOString().slice(0, 10) } as User,
          isAuthenticated: true,
          users: updated,
          twoFactorState: null,
        });
        return true;
      },

      logout: () => {
        set({ 
          currentUser: null, 
          isAuthenticated: false, 
          twoFactorState: null, 
          intendedRoute: null 
        });
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

      clearLoginAttempts: (email) => {
        set((state) => {
          const newLoginAttempts = new Map(state.loginAttempts);
          newLoginAttempts.delete(email);
          return { loginAttempts: newLoginAttempts };
        });
      },
    }),
    { 
      name: "auth-storage",
      // Don't persist login attempts - they should reset on page refresh
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        isAuthenticated: state.isAuthenticated,
        twoFactorState: state.twoFactorState,
        intendedRoute: state.intendedRoute,
      }),
    }
  )
);
