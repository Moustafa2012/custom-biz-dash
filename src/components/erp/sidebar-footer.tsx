import { SidebarFooter } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import type { PageId } from "./types";

interface SidebarFooterWrapperProps {
  onNavigate?: (page: PageId) => void;
}

export function SidebarFooterWrapper({ onNavigate }: SidebarFooterWrapperProps) {
  return (
    <SidebarFooter className="px-2 py-2 border-t border-border/30">
      <UserNav onNavigate={onNavigate} />
    </SidebarFooter>
  );
}
