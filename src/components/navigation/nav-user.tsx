import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogIn } from "lucide-react"
import { t } from "@/lib/translations"
import { useNavigate, useLocation } from "react-router-dom"
import { UserContextMenu } from "./user-context-menu"

export function NavUser() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        aria-hidden
        className="h-9 rounded-xl bg-muted/40 animate-pulse"
      />
    )
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="
          h-9 gap-2 rounded-xl
          text-sm font-medium text-muted-foreground
          border border-border/30 bg-accent/20
          transition-all duration-300
          hover:bg-accent/60 hover:text-foreground hover:border-border/60
          hover:shadow-sm active:scale-[0.98]
        "
        onClick={() => navigate("/login", { state: { from: location.pathname } })}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">{t("تسجيل الدخول", "Sign in")}</span>
      </Button>
    )
  }

  return (
    <UserContextMenu
      user={{
        name: user?.name ?? "User",
        email: user?.email ?? "",
        avatar: user?.avatar ?? "",
      }}
    />
  )
}
