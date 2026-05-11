import type { ReactNode } from "react"
import { SidebarFooter as ShadcnSidebarFooter } from "@/components/ui/sidebar"

interface SidebarFooterProps {
  children: ReactNode
}

export function SidebarFooter({ children }: SidebarFooterProps) {
  return (
    <ShadcnSidebarFooter>
     {children}
    </ShadcnSidebarFooter>
  )
}