import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { checkAnyPermission, checkAllPermissions } from "@/lib/permissions";

interface CanProps {
  /** Single permission OR list (any-match by default). */
  permission?: string | string[];
  /** Require ALL listed permissions instead of any. */
  all?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Conditional render based on the current user's permissions.
 * Per ERP.md §3 (RBAC) — pure UI gate; route guarding stays in ProtectedRoute.
 */
export function Can({ permission, all = false, fallback = null, children }: CanProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <>{fallback}</>;

  if (!permission) return <>{children}</>;
  const required = Array.isArray(permission) ? permission : [permission];
  const ok = all
    ? checkAllPermissions(currentUser.permissions, required)
    : checkAnyPermission(currentUser.permissions, required);

  return <>{ok ? children : fallback}</>;
}
