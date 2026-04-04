import { SidebarHeader } from "@/components/ui/sidebar";
import { AppSwitcher } from "./app-switcher";

export function SidebarHeaderWrapper() {
  return (
    <SidebarHeader className="px-2 py-3">
      <AppSwitcher />
    </SidebarHeader>
  );
}
