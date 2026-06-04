"use client"

import * as React from "react"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import { useApp } from "@/contexts/app-context"




import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { t } from "@/lib/translations"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface NavItem {
  title: string
  url: string
  icon?: Icon
  /** Optional exact-match override; defaults to startsWith for nested routes */
  exact?: boolean
}

function useIsActive() {
  const { pathname } = useLocation()
  return React.useCallback(
    (item: NavItem) => {
      if (item.exact) return pathname === item.url
      return pathname === item.url || pathname.startsWith(item.url + "/")
    },
    [pathname]
  )
}

export function NavMain({ items }: { items: NavItem[] }) {
  const isActive = useIsActive()
  const { activeApp } = useApp()
  const navigate = useNavigate()

  const isSynex = activeApp.id === "synex"


  return (
    <SidebarGroup className="pt-4">
      <SidebarGroupLabel
        className="
            text-[10px] font-semibold uppercase tracking-[0.12em]
            text-muted-foreground/50
            px-3 mb-1
          "
      >
        {t("التنقل", "Navigation")}
      </SidebarGroupLabel>

      <SidebarGroupContent className="flex flex-col gap-1.5">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1.5 mb-1">
            <SidebarMenuButton
              asChild={isSynex}
              onClick={() => {
                if (isSynex) navigate("/synex/transfers/new")
              }}
              tooltip={t("إنشاء سريع", "Quick Create")}
              className="
                  min-w-8 rounded-md
                  bg-primary text-primary-foreground
                  font-medium text-[13px]
                  transition-all duration-200
                  hover:bg-primary/90 hover:shadow-[0_4px_16px_hsl(var(--primary)/0.35)]
                  hover:translate-y-[-1px]
                  active:translate-y-0 active:scale-[0.98]
                  active:bg-primary/80
                "
            >
              {isSynex ? (
                <Link to="/synex/transfers/new">
                  <IconCirclePlusFilled className="size-4" />
                  <span>{t("إنشاء سريع", "Quick Create")}</span>
                </Link>
              ) : (
                <>
                  <IconCirclePlusFilled className="size-4" />
                  <span>{t("إنشاء سريع", "Quick Create")}</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="gap-0.5">
          {items.map((item, index) => {
            const active = isActive(item)
            return (
              <SidebarMenuItem
                key={item.url}
                style={{ animationDelay: `${index * 30}ms` }}
                className="animate-in fade-in slide-in-from-bottom-1 duration-300"
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-md text-[13px] font-medium",
                    "transition-all duration-200",
                    "hover:translate-x-0.5 rtl:hover:-translate-x-0.5",
                    active
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <Link to={item.url}>
                    {active && (
                      <span className="absolute inset-y-0 start-0 my-auto h-6 w-0.5 rounded-full bg-primary" />
                    )}
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors duration-200",
                          active
                            ? "text-primary"
                            : "text-muted-foreground/70 group-hover:text-foreground"
                        )}
                      />
                    )}
                    <span className={cn("transition-colors duration-200", active && "font-semibold")}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
