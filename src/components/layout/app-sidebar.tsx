"use client"

import {
  IconInnerShadowTop,
  IconHelp,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavSecondary } from "@/components/navigation/nav-secondary"
import { NavUser } from "@/components/navigation/nav-user"
import { AppSwitcher } from "@/components/layout/app-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/components/language-provider"
import { useApp } from "@/contexts/app-context"
import { t } from "@/lib/translations"
import { PlatformNavMain } from "@/apps/platform/nav-main"
import { SiteManagerNavMain } from "@/apps/site-manager/nav-main"
import { SynexNavMain } from "@/apps/synex/nav-main"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: t("الإعدادات", "Settings"),
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: t("الحصول على المساعدة", "Get Help"),
      url: "/help",
      icon: IconHelp,
    },
    {
      title: t("بحث", "Search"),
      url: "/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { language, direction } = useLanguage()
  const { activeApp } = useApp()
  const side = language === "ar" ? "right" : "left"

  const renderNavMain = () => {
    switch (activeApp.id) {
      case "platform":
        return <PlatformNavMain />
      case "site-manager":
        return <SiteManagerNavMain />
      case "synex":
        return <SynexNavMain />
      default:
        return null
    }
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      side={side}
      {...props}
      style={{ direction }}
      className="border-none"
    >
      <SidebarHeader className="bg-muted/20">
        <AppSwitcher />
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="/" className="flex items-center gap-2.5">
                <div className="
                  relative flex items-center justify-center
                  rounded-md
                  ring-1 ring-primary
                  transition-all duration-300
                ">
                  <IconInnerShadowTop className="size-4 text-primary" />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-background shadow-[0_0_6px_rgba(34,197,94,0.7)]" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  {t("ثريا البلاد", "Thouraya Albilad")}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-muted/20">
        {renderNavMain()}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="pb-4 bg-muted/20">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}