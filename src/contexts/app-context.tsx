"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IconDashboard, IconChartBar, IconFolder } from "@tabler/icons-react"
import { t } from "@/lib/translations"

export type AppId = "platform" | "site-manager" | "synex"

export interface App {
  id: AppId
  name: string
  logo: React.ElementType
  description: string
  /** Base URL prefix used to detect and switch to this app */
  path: string
  /** Default landing page when switching into this app */
  defaultRoute: string
}

export const APPS: App[] = [
  {
    id: "platform",
    name: t("منصة", "Platform"),
    logo: IconDashboard,
    description: t("المنصة الرئيسية للنظام", "Main system platform"),
    path: "/platform",
    defaultRoute: "/platform/overview",
  },
  {
    id: "site-manager",
    name: t("مدير الموقع", "Site Manager"),
    logo: IconFolder,
    description: t("إدارة المحتوى والموقع", "Content and site management"),
    path: "/site-manager",
    defaultRoute: "/site-manager/overview",
  },
  {
    id: "synex",
    name: t("سينكس بنك", "Synex-Bank"),
    logo: IconChartBar,
    description: t("نظام البنك المالي", "Financial banking system"),
    path: "/synex",
    defaultRoute: "/synex/overview",
  },
]

const APP_STORAGE_KEY = "active_app_id"

function detectAppFromPath(pathname: string): App | undefined {
  return APPS.find((a) => pathname === a.path || pathname.startsWith(a.path + "/"))
}

type AppContextType = {
  activeApp: App
  setActiveApp: (appId: AppId) => void
  apps: App[]
}

const AppContext = React.createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Derive active app from URL when possible; fall back to last-used or first.
  const activeApp = React.useMemo<App>(() => {
    const fromUrl = detectAppFromPath(location.pathname)
    if (fromUrl) return fromUrl
    const stored = typeof window !== "undefined" ? localStorage.getItem(APP_STORAGE_KEY) : null
    return APPS.find((a) => a.id === stored) ?? APPS[0]
  }, [location.pathname])

  // Persist whichever app the user is currently viewing.
  React.useEffect(() => {
    try {
      localStorage.setItem(APP_STORAGE_KEY, activeApp.id)
    } catch {
      /* storage may be unavailable */
    }
  }, [activeApp.id])

  const setActiveApp = React.useCallback(
    (appId: AppId) => {
      const app = APPS.find((a) => a.id === appId)
      if (!app || app.id === activeApp.id) return
      navigate(app.defaultRoute)
    },
    [activeApp.id, navigate]
  )

  const value = React.useMemo(
    () => ({ activeApp, setActiveApp, apps: APPS }),
    [activeApp, setActiveApp]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
