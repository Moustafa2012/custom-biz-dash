import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuGroup, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, LogOut, Settings, User, CreditCard, Moon, ShoppingCart, Landmark, Warehouse, Package, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppConfig } from "./app-config";
import { useAuthStore } from "@/stores/auth-store";
import type { PageId } from "./types";

interface UserMenuProps {
  onNavigate?: (page: PageId) => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
  const { toggleTheme, resolvedTheme, t } = useAppConfig();
  const currentUser = useAuthStore((s) => s.currentUser);
  const can = useAuthStore((s) => s.can);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnLandingPage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const appLinks = [
    { id: "sales",     label: t("المبيعات", "Sales"),                icon: ShoppingCart, permission: "sales.view",     path: "/sales" },
    { id: "finance",   label: t("المالية", "Finance"),                icon: Landmark,     permission: "finance.view",   path: "/finance" },
    { id: "inventory", label: t("المخزون والتصنيع", "Inventory & Mfg"), icon: Package,      permission: "inventory.view", path: "/inventory" },
    { id: "banking",   label: t("الأعمال البنكية", "Banking"),         icon: Banknote,     permission: "banking.view",   path: "/banking" },
    { id: "warehouse", label: t("المستودع", "Warehouse"),              icon: Warehouse,    permission: "warehouse.view", path: "/warehouse" },
  ];

  const accessibleApps = appLinks.filter(app => can(app.permission));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            "transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-primary"
          )}
          aria-label={t("قائمة المستخدم", "User menu")}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-60 rounded-2xl shadow-2xl p-1.5 border border-border/50" sideOffset={6}>
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-sm font-semibold">{currentUser?.name || t("مستخدم", "User")}</p>
          <p className="text-[11px] text-muted-foreground font-normal">{currentUser?.email || "user@example.com"}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Dashboard links — show when on landing page */}
        {isOnLandingPage && accessibleApps.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2.5 py-1.5 text-xs text-muted-foreground font-medium">
                {t("لوحات التحكم", "Dashboards")}
              </DropdownMenuLabel>
              {accessibleApps.map((app) => (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => navigate(app.path)}
                  className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer"
                >
                  <app.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{app.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onNavigate ? onNavigate("profile") : navigate("/sales")} className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("الملف الشخصي", "Profile")}</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("الفواتير", "Billing")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate ? onNavigate("settings") : navigate("/sales")} className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("الإعدادات", "Settings")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme} className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{t("التبديل إلى", "Switch to")} {resolvedTheme === "dark" ? t("فاتح", "light") : t("داكن", "dark")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="rounded-xl gap-2.5 px-2.5 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          <span className="text-sm">{t("تسجيل الخروج", "Log out")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}