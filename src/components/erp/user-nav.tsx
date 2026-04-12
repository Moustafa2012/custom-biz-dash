import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMenu } from "./user-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import type { PageId } from "./types";
import { useAppConfig } from "./app-config";
import { useAuthStore } from "@/stores/auth-store";
import * as React from "react";

const STATUS_COLORS = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  busy: "bg-rose-500",
  offline: "bg-muted-foreground/50",
};

interface UserNavProps {
  status?: keyof typeof STATUS_COLORS;
  onNavigate?: (page: PageId) => void;
}

export function UserNav({ status = "online", onNavigate }: UserNavProps) {
  // Try to use sidebar context, but don't throw error if not available
  let isCollapsed = false;
  try {
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch (error) {
    // Not in a SidebarProvider context, use default values
    isCollapsed = false;
  }
  
  // Try to use app config context, but don't throw error if not available
  let t: (ar: string, en: string) => string;
  try {
    const config = useAppConfig();
    t = config.t;
  } catch (error) {
    // Not in an AppConfigProvider context, use default translation function
    t = (ar: string, en: string) => en; // Default to English
  }
  
  const currentUser = useAuthStore((s) => s.currentUser);

  const displayName = currentUser?.name || t("مستخدم", "User");
  const initials = currentUser?.name?.split(" ").map(n => n[0]).join("") || "U";

  const getStatusText = () => {
    switch (status) {
      case "online": return t("نشط", "Active");
      case "away": return t("بعيد", "Away");
      case "busy": return t("مشغول", "Busy");
      case "offline": return t("غير متصل", "Offline");
      default: return status;
    }
  };

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center justify-center w-full py-2 cursor-pointer"
            onClick={() => onNavigate?.("profile")}
          >
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                <AvatarImage src={currentUser?.avatar} alt={displayName} />
                <AvatarFallback className="text-xs font-semibold bg-primary/20 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span
                className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background", STATUS_COLORS[status])}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col">
          <span className="font-semibold">{displayName}</span>
          <span className="text-xs text-muted-foreground">{getStatusText()}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-2 py-2.5 w-full",
        "rounded-xl transition-colors duration-150 hover:bg-muted/40 group cursor-pointer",
      )}
      onClick={() => onNavigate?.("profile")}
    >
      <div className="relative shrink-0">
        <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
          <AvatarImage src={currentUser?.avatar} alt={displayName} />
          <AvatarFallback className="text-xs font-semibold bg-primary/20 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <span
          className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background", STATUS_COLORS[status])}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate leading-tight">{displayName}</p>
        <p className="text-[10px] text-muted-foreground truncate leading-tight capitalize">
          ● {getStatusText()}
        </p>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" onClick={(e) => e.stopPropagation()}>
        <UserMenu onNavigate={onNavigate} />
      </div>
    </div>
  );
}
