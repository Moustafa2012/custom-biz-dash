"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { t } from "@/lib/translations"
import { useLanguage } from "@/components/language-provider"
import { useApp } from "@/contexts/app-context"

export function AppSwitcher() {
  const { isMobile } = useSidebar()
  const { direction } = useLanguage()
  const { activeApp, apps, setActiveApp } = useApp()

  // Wire ⌘1 / ⌘2 / ⌘3 (and Ctrl-equivalent) to switch apps.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      const idx = Number(e.key) - 1
      if (Number.isNaN(idx) || idx < 0 || idx >= apps.length) return
      // Don't hijack while typing in inputs
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      e.preventDefault()
      setActiveApp(apps[idx].id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [apps, setActiveApp])

  if (!activeApp) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              aria-label={t("تبديل التطبيق", "Switch application")}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeApp.logo className="size-4" />
              </div>
              <div
                className={`grid flex-1 text-sm leading-tight ${
                  direction === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <span className="truncate font-medium">{activeApp.name}</span>
                <span className="truncate text-xs text-muted-foreground">{activeApp.description}</span>
              </div>
              <ChevronsUpDown className={direction === "rtl" ? "mr-auto" : "ml-auto"} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : direction === "rtl" ? "left" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("التطبيقات", "Applications")}
            </DropdownMenuLabel>
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                aria-current={app.id === activeApp.id ? "true" : undefined}
                className="gap-2 p-2 data-[current=true]:bg-accent/50"
                data-current={app.id === activeApp.id ? "true" : undefined}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <app.logo className="size-3.5 shrink-0" />
                </div>
                <span className="flex-1 truncate">{app.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
