import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarHeaderWrapper } from "./sidebar-header";
import { SidebarFooterWrapper } from "./sidebar-footer";
import { MainNav } from "./main-nav";
import { useAppConfig } from "./app-config";
import type { PageId } from "./types";

interface AppSidebarProps {
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { sidebarVariant, collapsible, language } = useAppConfig();

  return (
    <Sidebar
      variant={sidebarVariant}
      collapsible={collapsible}
      side={language === "ar" ? "right" : "left"}
    >
      <SidebarHeaderWrapper />
      <SidebarContent className="px-2 py-1 overflow-x-hidden">
        <MainNav currentPage={currentPage} onNavigate={onNavigate} />
      </SidebarContent>
      <SidebarFooterWrapper onNavigate={onNavigate} />
    </Sidebar>
  );
}
