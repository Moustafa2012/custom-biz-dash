"use client"

import { useState } from "react"
import { Bell, Mail, MessageCircle, Trash2, CheckCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"
import { useNotifications } from "@/lib/notifications/hooks"
import { t } from "@/lib/translations"
import type { AppId, NotificationEvent } from "@/lib/notifications"

function relTime(ts: number) {
  const diff = Date.now() - ts
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function severityClasses(sev: NotificationEvent["severity"]) {
  switch (sev) {
    case "success": return "bg-green-500/15 text-green-500"
    case "warning": return "bg-yellow-500/15 text-yellow-600"
    case "error": return "bg-red-500/15 text-red-500"
    default: return "bg-primary/15 text-primary"
  }
}

export function NotificationBell() {
  const { activeApp } = useApp()
  const appId = activeApp.id as AppId
  const { inbox, unread, markRead, markAllRead, clear } = useNotifications(appId)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("الإشعارات", "Notifications")}
          className={cn(
            "relative h-8 w-8 rounded-[calc(var(--radius)*0.8)]",
            "text-muted-foreground/60",
            "transition-all duration-150",
            "hover:bg-muted hover:text-foreground",
            "active:scale-95"
          )}
        >
          <Bell className="h-3.5 w-3.5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">{t("الإشعارات", "Notifications")}</h4>
            {unread > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {unread} {t("جديد", "new")}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={t("تعليم الكل كمقروء", "Mark all read")}
              disabled={unread === 0}
              onClick={markAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              title={t("مسح", "Clear")}
              disabled={inbox.length === 0}
              onClick={clear}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[420px]">
          {inbox.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                {t("لا توجد إشعارات", "No notifications yet")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("ستظهر الإشعارات الجديدة هنا", "New notifications will appear here")}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {inbox.slice(0, 30).map((ev) => (
                <li
                  key={ev.id}
                  className={cn(
                    "group relative flex gap-3 px-4 py-3 cursor-pointer transition-colors",
                    "hover:bg-muted/40",
                    !ev.read && "bg-primary/[0.03]"
                  )}
                  onClick={() => markRead(ev.id)}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    severityClasses(ev.severity)
                  )}>
                    {ev.severity === "error" ? <AlertCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold leading-tight truncate">
                        {ev.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                        {relTime(ev.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {ev.body}
                    </p>
                  </div>
                  {!ev.read && (
                    <span className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <Separator />
        <div className="flex items-center justify-between px-4 py-2 bg-muted/20 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {t("البريد", "Email")}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {t("تيليجرام", "Telegram")}</span>
          </span>
          <a
            href="/platform/notifications"
            className="font-medium text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            {t("سجل الكل", "View all")}
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}
