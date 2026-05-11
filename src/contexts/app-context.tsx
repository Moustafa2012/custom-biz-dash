"use client"

import * as React from "react"
import { IconDashboard, IconChartBar, IconFolder } from "@tabler/icons-react"
import { t } from "@/lib/translations"

export type AppId = "platform" | "site-manager" | "synex"

export interface App {
  id: AppId
  name: string
  logo: React.ElementType
  description: string
  path: string
}

export const APPS: App[] = [
  {
    id: "platform",
    name: t("منصة", "Platform"),
    logo: IconDashboard,
    description: t("المنصة الرئيسية للنظام", "Main system platform"),
    path: "/platform",
  },
  {
    id: "site-manager",
    name: t("مدير الموقع", "Site Manager"),
    logo: IconFolder,
    description: t("إدارة المحتوى والموقع", "Content and site management"),
    path: "/site-manager",
  },
  {
    id: "synex",
    name: t("سينكس بنك", "Synex-Bank"),
    logo: IconChartBar,
    description: t("نظام البنك المالي", "Financial banking system"),
    path: "/synex",
  },
]

type AppContextType = {
  activeApp: App
  setActiveApp: (appId: AppId) => void
  apps: App[]
}

const AppContext = React.createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeApp, setActiveAppState] = React.useState<App>(APPS[0])

  const setActiveApp = React.useCallback((appId: AppId) => {
    const app = APPS.find(a => a.id === appId)
    if (app) {
      setActiveAppState(app)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      activeApp,
      setActiveApp,
      apps: APPS,
    }),
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
