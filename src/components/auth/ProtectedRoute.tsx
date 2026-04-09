import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const twoFactorState = useAuthStore((s) => s.twoFactorState);
  const can = useAuthStore((s) => s.can);

  if (!isAuthenticated) {
    if (twoFactorState?.isRequired) {
      return <Navigate to="/2fa" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-bold text-destructive">Access Denied</h2>
          <p className="text-sm text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
