import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, TwoFactorState, Role } from "@/types/auth";
import { ROLE_PERMISSIONS, checkPermission } from "@/lib/permissions";
import { apiService, ApiError, LoginResponse, TwoFactorLoginResponse } from "@/lib/api";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  twoFactorState: TwoFactorState | null;
  intendedRoute: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  can: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
  setIntendedRoute: (route: string | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      twoFactorState: null,
      intendedRoute: null,
      isLoading: true,

      setIntendedRoute: (route) => set({ intendedRoute: route }),

      initializeAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // SECURITY: explicitly clear auth state when no token is present so a
          // tampered persisted `currentUser` cannot grant client-side access.
          set({ currentUser: null, isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await apiService.getProfile();
          if (response.success && response.data) {
            const user: User = {
              ...response.data,
              role: response.data.role as Role,
              twoFactorMethod: response.data.twoFactorMethod as 'otp' | 'email' | 'app' | undefined,
            };
            set({
              currentUser: user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            localStorage.removeItem('auth_token');
            set({ currentUser: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          set({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await apiService.login({ email, password });
          
          if (response.success && response.data) {
            // Check if 2FA is required
            if ('requires2FA' in response.data && response.data.requires2FA) {
              const twoFactorData = response.data as unknown as TwoFactorLoginResponse;
              set({
                twoFactorState: {
                  isRequired: true,
                  method: twoFactorData.twoFactorMethod as 'otp' | 'email' | 'app',
                  tempToken: twoFactorData.tempToken,
                },
                isLoading: false,
              });
              return { success: true, requires2FA: true };
            }

            // Login successful without 2FA
            const loginData = response.data as LoginResponse;
            const token = loginData.token;
            const user: User = {
              ...loginData.user,
              role: loginData.user.role as Role,
              twoFactorMethod: loginData.user.twoFactorMethod as 'otp' | 'email' | 'app' | undefined,
            };
            
            localStorage.setItem('auth_token', token);
            set({
              currentUser: user,
              isAuthenticated: true,
              twoFactorState: null,
              isLoading: false,
            });
            return { success: true };
          }
          
          return { success: false, error: 'Login failed' };
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof ApiError) {
            // Map API errors to expected format
            if (error.status === 401) {
              return { success: false, error: 'invalid_credentials' };
            }
            if (error.message.includes('disabled')) {
              return { success: false, error: 'account_disabled' };
            }
            return { success: false, error: error.message };
          }
          return { success: false, error: 'Network error occurred' };
        }
      },

      verify2FA: async (code) => {
        try {
          set({ isLoading: true });
          const state = get().twoFactorState;
          if (!state?.tempToken) {
            set({ isLoading: false });
            return false;
          }

          const response = await apiService.verifyTwoFactor({
            token: state.tempToken,
            code: code.trim(),
            isBackupCode: code.length === 6 && /[A-Z]/.test(code),
          });

          if (response.success && response.data) {
            const token = response.data.token;
            const user: User = {
              ...response.data.user,
              role: response.data.user.role as Role,
              twoFactorMethod: response.data.user.twoFactorMethod as 'otp' | 'email' | 'app' | undefined,
            };
            
            localStorage.setItem('auth_token', token);
            set({
              currentUser: user,
              isAuthenticated: true,
              twoFactorState: null,
              isLoading: false,
            });
            return true;
          }
          
          set({ isLoading: false });
          return false;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await apiService.logout();
        } catch (error) {
          // Even if logout request fails, we should clear local state
          console.warn('Logout request failed:', error);
        } finally {
          localStorage.removeItem('auth_token');
          set({ 
            currentUser: null, 
            isAuthenticated: false, 
            twoFactorState: null, 
            intendedRoute: null,
            isLoading: false
          });
        }
      },

      updateProfile: (data) => {
        const current = get().currentUser;
        if (!current) return;
        const updatedUser = { ...current, ...data };
        set({ currentUser: updatedUser });
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
    {
      name: "auth-storage",
      // SECURITY: never persist `isAuthenticated` or `currentUser` — they would let an
      // attacker grant themselves UI access by editing localStorage. Auth state must
      // always be re-derived from a validated server round-trip via initializeAuth().
      partialize: (state) => ({
        intendedRoute: state.intendedRoute,
      }),
    }
  )
);
