"use client"

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

  if (!activeApp) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeApp.logo className="size-4" />
              </div>
              <div className={`grid flex-1 text-sm leading-tight ${direction === "rtl" ? "text-right" : "text-left"}`}>
                <span className="truncate font-medium">{activeApp.name}</span>
                <span className="truncate text-xs">{activeApp.description}</span>
              </div>
              <ChevronsUpDown className={direction === "rtl" ? "mr-auto" : "ml-auto"} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : (direction === "rtl" ? "left" : "right")}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("التطبيقات", "Applications")}
            </DropdownMenuLabel>
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <app.logo className="size-3.5 shrink-0" />
                </div>
                {app.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
