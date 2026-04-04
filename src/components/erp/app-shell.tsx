import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { AppContent } from "./app-content";
import { AppConfigProvider } from "./app-config";
import type { PageId } from "./types";

interface AppShellProps {
  children: ReactNode;
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
}

export default function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  return (
    <AppConfigProvider>
      <SidebarProvider>
        <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <SidebarInset className="flex flex-col min-h-screen">
          <AppHeader currentPage={currentPage} />
          <AppContent>{children}</AppContent>
        </SidebarInset>
      </SidebarProvider>
    </AppConfigProvider>
  );
}
