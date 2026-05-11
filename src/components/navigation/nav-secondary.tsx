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
class AuditLogger {
  private static sessionId: string = this.generateSessionId()
  
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
      sessionId: this.sessionId
    }
    
    // Console logging for development
    console.group(`🔍 Audit Log - ${app.toUpperCase()}`)
    console.log("Timestamp:", log.timestamp)
    console.log("User ID:", log.userId || "anonymous")
    console.log("Action:", log.action)
    console.log("App:", log.app)
    console.log("URL:", log.url)
    console.log("Session ID:", log.sessionId)
    console.log("User Agent:", log.userAgent)
    console.groupEnd()
    
    // Store in localStorage for persistence
    this.storeLog(log)
    
    // Send to external logging service (if available)
    this.sendToLogService(log)
  }
  
  private static getCurrentUserId(): string | undefined {
    // Try to get user ID from various sources
    return (
      (window as any).currentUser?.id ||
      localStorage.getItem('userId') ||
      sessionStorage.getItem('userId') ||
      undefined
    )
  }
  
  private static storeLog(log: AuditLog): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]')
      existingLogs.push(log)
      
      // Keep only last 1000 logs to prevent storage overflow
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000)
      }
      
      localStorage.setItem('auditLogs', JSON.stringify(existingLogs))
    } catch (error) {
      console.error('Failed to store audit log:', error)
    }
  }
  
  private static sendToLogService(log: AuditLog): void {
    // In a real application, this would send to your logging service
    // For now, we'll just log it to console in development
    if (typeof window !== 'undefined' && (window as any).__ENV__ === 'production') {
      // Example: Send to your logging endpoint
      fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      }).catch(error => {
        console.error('Failed to send audit log to service:', error)
      })
    }
  }
  
  static getAuditLogs(): AuditLog[] {
    try {
      return JSON.parse(localStorage.getItem('auditLogs') || '[]')
    } catch {
      return []
    }
  }
  
  static clearAuditLogs(): void {
    localStorage.removeItem('auditLogs')
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