"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { t } from "@/lib/translations"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [activeItem, setActiveItem] = useState(items[0]?.title)
  const navigate = useNavigate()

  return (
    <SidebarGroup className="pt-4">
      <SidebarGroupLabel className="
        text-[10px] font-semibold uppercase tracking-[0.12em]
        text-muted-foreground/50
        px-3 mb-1
      ">
        {t("التنقل", "Navigation")}
      </SidebarGroupLabel>

      <SidebarGroupContent className="flex flex-col gap-1.5">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1.5 mb-1">
            <TooltipProvider>
              <SidebarMenuButton
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
                <IconCirclePlusFilled className="size-4" />
                <span>{t("إنشاء سريع", "Quick Create")}</span>
              </SidebarMenuButton>
            </TooltipProvider>

            <Button
              size="icon"
              className="
                size-8 shrink-0
                rounded-md
                border border-border/40
                bg-accent/40
                text-muted-foreground
                transition-all duration-200
                hover:bg-accent hover:border-border/70 hover:text-foreground
                hover:scale-105
                active:scale-95
                group-data-[collapsible=icon]:opacity-0
              "
              variant="outline"
            >
              <IconMail className="size-3.5" />
              <span className="sr-only">{t("البريد الوارد", "Inbox")}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="gap-0.5">
          {items.map((item, index) => {
            const isActive = activeItem === item.title
            return (
              <SidebarMenuItem
                key={item.title}
                style={{ animationDelay: `${index * 40}ms` }}
                className="animate-in fade-in slide-in-from-start-2 duration-300"
              >
                <TooltipProvider>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => {
                      setActiveItem(item.title)
                      navigate(item.url)
                    }}
                    isActive={isActive}
                    className={`
                      group relative rounded-md
                      text-[13px] font-medium
                      transition-all duration-200
                      hover:translate-x-0.5 rtl:hover:translate-x-[-0.5]
                      ${isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/12"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground font-bold" 
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute inset-y-0 start-0 h-8 w-0.75 rounded-md bg-primary" />
                    )}
                    {item.icon && (
                      <item.icon className={`
                        size-4 shrink-0 transition-all duration-200
                        ${isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}
                      `} />
                    )}
                    <span className={`transition-colors duration-200 ${isActive ? "font-semibold" : ""}`}>
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </TooltipProvider>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}