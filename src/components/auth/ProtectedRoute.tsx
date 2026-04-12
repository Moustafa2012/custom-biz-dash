import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { useAppConfig } from "@/components/erp/app-config";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const twoFactorState = useAuthStore((s) => s.twoFactorState);
  const can = useAuthStore((s) => s.can);
  const setIntendedRoute = useAuthStore((s) => s.setIntendedRoute);
  const location = useLocation();
  const { t } = useAppConfig();

  useEffect(() => {
    if (!isAuthenticated && !twoFactorState?.isRequired) {
      setIntendedRoute(location.pathname);
    }
  }, [isAuthenticated, twoFactorState, location.pathname, setIntendedRoute]);

  if (!isAuthenticated) {
    if (twoFactorState?.isRequired) {
      return <Navigate to="/2fa" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-2">
            <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold text-destructive">{t("تم رفض الوصول", "Access Denied")}</h2>
          <p className="text-sm text-muted-foreground">{t("ليس لديك صلاحية لعرض هذه الصفحة.", "You don't have permission to view this page.")}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
