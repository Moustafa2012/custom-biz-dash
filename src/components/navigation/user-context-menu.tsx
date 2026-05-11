import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, Settings, Moon, Sun, Globe, User, Monitor } from "lucide-react"
import { t } from "@/lib/translations"
import { useNavigate } from "react-router-dom"

interface UserContextMenuProps {
  className?: string
  user?: {
    name: string
    email: string
    avatar: string
  }
}

const menuItemClass = `
  group flex cursor-pointer items-center gap-3
  rounded-xl px-3 py-2.5
  text-sm font-medium
  text-foreground/75
  transition-all duration-150
  hover:bg-accent/70 hover:text-foreground
  focus:bg-accent/70 focus:text-foreground
  active:scale-[0.98]
`

const iconWrapClass = `
  flex h-7 w-7 items-center justify-center shrink-0
  rounded-lg bg-muted/60
  text-muted-foreground
  transition-all duration-150
  group-hover:bg-accent group-hover:text-foreground/80
`

export function UserContextMenu({ className, user: propUser }: UserContextMenuProps) {
  const { theme, setTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()

  const currentUser = propUser || authUser
  const initials = currentUser?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U"

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`
            group h-9 rounded-xl
            border border-border/30
            bg-background/50 backdrop-blur-sm
            px-2 pr-3
            text-sm font-medium
            transition-all duration-200
            hover:border-border/60 hover:bg-accent/50
            hover:shadow-sm
            focus-visible:ring-1 focus-visible:ring-primary/30
            data-[state=open]:border-border/60 data-[state=open]:bg-accent/50
            active:scale-[0.98]
            ${className || ""}
          `}
        >
          <Avatar className="h-6 w-6 ring-1 ring-border/40 transition-all duration-200 group-hover:ring-primary/30">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-foreground/70 group-hover:text-foreground transition-colors duration-200 max-w-[90px] truncate text-[13px]">
            {currentUser?.name || "User"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          w-64 overflow-hidden
          rounded-2xl
          border border-border/30
          bg-background/90 backdrop-blur-2xl
          p-0
          shadow-[0_16px_48px_-8px_hsl(var(--foreground)/0.12),0_0_0_0.5px_hsl(var(--border)/0.3)]
          animate-in fade-in-0 zoom-in-95 duration-200
        "
        align="end"
        sideOffset={10}
        forceMount
      >
        {/* User profile header */}
        <div className="relative overflow-hidden px-4 pt-4 pb-3.5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-primary/15 shadow-md">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1.5 ring-background shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {currentUser?.name || "User"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground/70">
                {currentUser?.email || "user@example.com"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              {t("نشط", "Active")}
            </span>
          </div>
        </div>

        {/* Main actions */}
        <div className="p-1.5 space-y-0.5">
          <DropdownMenuItem onClick={toggleTheme} className={menuItemClass}>
            <span className={iconWrapClass}>
              {theme === "dark"
                ? <Sun className="h-3.5 w-3.5" />
                : <Moon className="h-3.5 w-3.5" />
              }
            </span>
            {theme === "dark" ? t("الوضع الفاتح", "Light Mode") : t("الوضع الداكن", "Dark Mode")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={toggleLanguage} className={menuItemClass}>
            <span className={iconWrapClass}>
              <Globe className="h-3.5 w-3.5" />
            </span>
            {language === "ar" ? "English" : "العربية"}
            <span className="ms-auto rounded-md bg-primary/8 px-1.5 py-0.5 text-[10px] font-bold text-primary tracking-wide">
              {language === "ar" ? "EN" : "AR"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/settings")} className={menuItemClass}>
            <span className={iconWrapClass}>
              <User className="h-3.5 w-3.5" />
            </span>
            {t("الملف الشخصي", "Profile")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/settings")} className={menuItemClass}>
            <span className={iconWrapClass}>
              <Settings className="h-3.5 w-3.5" />
            </span>
            {t("الإعدادات", "Settings")}
          </DropdownMenuItem>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mx-2" />

        {/* Footer actions */}
        <div className="p-1.5 space-y-0.5">
          <DropdownMenuItem
            onClick={() => navigate("/platform/users")}
            className={menuItemClass}
          >
            <span className={iconWrapClass}>
              <Monitor className="h-3.5 w-3.5" />
            </span>
            {t("التطبيقات", "Applications")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={logout}
            className={`
              ${menuItemClass}
              text-destructive/80 hover:text-destructive
              hover:bg-destructive/8 focus:bg-destructive/8
            `}
          >
            <span className="flex h-7 w-7 items-center justify-center shrink-0 rounded-lg bg-destructive/8 text-destructive transition-all duration-150 group-hover:bg-destructive/12">
              <LogOut className="h-3.5 w-3.5" />
            </span>
            {t("تسجيل الخروج", "Log out")}
          </DropdownMenuItem>
        </div>

        <div className="px-4 py-2 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground/30 text-center">
            © {new Date().getFullYear()} {t("ثريا البلاد", "Thouraya Albilad")}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}