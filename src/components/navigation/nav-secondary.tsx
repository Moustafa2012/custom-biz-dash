"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { t } from "@/lib/translations"
import { useNavigate } from "react-router-dom"
import { IconEye } from "@tabler/icons-react"

// Audit logging interface
interface AuditLog {
  timestamp: string
  userId?: string
  action: string
  app: string
  url: string
  userAgent: string
  sessionId: string
}

// Audit logging utility
//
// SECURITY: Client-side localStorage is NOT a trustworthy audit trail — users,
// extensions, and other scripts can read, forge, or wipe it. We therefore keep
// only an ephemeral in-memory buffer for developer diagnostics and forward
// events to a server endpoint when one is configured. A real audit trail must
// be implemented server-side (append-only, access-controlled).
class AuditLogger {
  private static sessionId: string = this.generateSessionId()
  private static buffer: AuditLog[] = []
  private static readonly MAX_BUFFER = 200

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static logNavigation(app: string, url: string, action: string = "navigation"): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      action,
      app,
      url,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
    }

    if (import.meta.env.DEV) {
      console.debug(`[audit] ${app} ${action} ${url}`)
    }

    this.buffer.push(log)
    if (this.buffer.length > this.MAX_BUFFER) {
      this.buffer.splice(0, this.buffer.length - this.MAX_BUFFER)
    }

    this.sendToLogService(log)
  }

  private static getCurrentUserId(): string | undefined {
    // Best-effort, non-authoritative. Real identity must come from the server.
    return (window as any).currentUser?.id || undefined
  }

  private static sendToLogService(log: AuditLog): void {
    // Forward to a server-side append-only audit endpoint when available.
    // No-op in the current frontend-only build.
    if (typeof window === "undefined") return
    const endpoint = (import.meta.env.VITE_AUDIT_LOG_ENDPOINT as string | undefined) || ""
    if (!endpoint) return
    try {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* swallow — diagnostics only */
    }
  }

  static getAuditLogs(): AuditLog[] {
    return [...this.buffer]
  }

  static clearAuditLogs(): void {
    this.buffer = []
  }
}

// Export the AuditLogger for use in other components
export { AuditLogger }

// Utility function to extract app name from URL
function extractAppName(url: string): string {
  if (url.startsWith('/')) {
    const segments = url.split('/').filter(Boolean)
    return segments[0] || 'unknown'
  }
  return 'unknown'
}

// Audit Logs Navigation Item
function AuditLogsNavItem() {
  const navigate = useNavigate()

  const handleNavigation = () => {
    // Log navigation to audit logs page
    AuditLogger.logNavigation('platform', '/platform/audit-logs', 'navigate_to_audit_logs')
    navigate('/platform/audit-logs')
  }

  return (
    <SidebarMenuItem
      style={{ animationDelay: '300ms' }}
      className="animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      <SidebarMenuButton
        onClick={handleNavigation}
        className="
          group rounded-xl
          text-[13px] font-medium text-muted-foreground/60
          transition-all duration-200
          hover:bg-accent/50 hover:text-foreground
          hover:translate-x-0.5 rtl:hover:translate-x-[-0.5]
          active:scale-[0.98]
        "
      >
        <IconEye className="size-4 shrink-0 transition-colors duration-200 group-hover:text-foreground/80" />
        <span>{t("سجلات التدقيق", "Audit Logs")}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate()

  const handleNavigation = (url: string, title: string) => {
    const appName = extractAppName(url)
    
    // Log the navigation
    AuditLogger.logNavigation(appName, url, `navigate_to_${title.toLowerCase().replace(/\s+/g, '_')}`)
    
    // Perform navigation
    navigate(url)
  }

  return (
    <SidebarGroup {...props} className="pb-3">
      <SidebarGroupLabel className="
        text-[10px] font-semibold uppercase tracking-[0.12em]
        text-muted-foreground/40
        px-3 mb-1
      ">
        {t("عام", "General")}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item, index) => (
            <SidebarMenuItem
              key={item.title}
              style={{ animationDelay: `${index * 30}ms` }}
              className="animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <SidebarMenuButton
                onClick={() => handleNavigation(item.url, item.title)}
                className="
                  group rounded-xl
                  text-[13px] font-medium text-muted-foreground/60
                  transition-all duration-200
                  hover:bg-accent/50 hover:text-foreground
                  hover:translate-x-0.5 rtl:hover:translate-x-[-0.5]
                  active:scale-[0.98]
                "
              >
                <item.icon className="size-4 shrink-0 transition-colors duration-200 group-hover:text-foreground/80" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <AuditLogsNavItem />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}