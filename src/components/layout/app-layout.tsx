import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useLanguage } from "@/components/language-provider"

interface AppLayoutProps {
  children: ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { direction } = useLanguage()

  return (
    <SidebarProvider defaultOpen={true} style={{ direction }}>
      <div className="w-full h-screen overflow-hidden flex flex-row bg-muted/20">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-hidden flex flex-col">
          <AppHeader title={title} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div
              className={`
                p-6
                ${direction === "rtl" ? "text-right" : "text-left"}
                animate-in fade-in duration-500 ease-out
              `}
            >
              {children}
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}