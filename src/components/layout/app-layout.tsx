import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { direction } = useLanguage()

  return (
    <SidebarProvider defaultOpen>
      <div className="w-full h-svh overflow-hidden flex flex-row bg-muted/20" dir={direction}>
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <AppHeader title={title} />
          <main
            className={cn(
              "flex-1 min-h-0 overflow-y-auto overflow-x-hidden",
              "p-4 md:p-6",
              direction === "rtl" ? "text-right" : "text-left",
              "animate-in fade-in duration-300 ease-out"
            )}
            // Improves keyboard scroll for power users
            tabIndex={-1}
          >
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
