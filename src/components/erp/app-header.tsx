import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppLogo } from "./app-logo";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { LayoutSettingsSheet } from "./layout-settings-sheet";
import type { PageId } from "./types";

const PAGE_LABELS: Record<PageId, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  settings: "Settings",
  "sales-orders": "Orders",
  "sales-customers": "Customers",
  "sales-quotations": "Quotations",
  "sales-invoices": "Invoices",
  "sales-returns": "Returns",
  "sales-reports": "Reports",
  "finance-ledger": "General Ledger",
  "finance-accounts": "Chart of Accounts",
  "finance-journal": "Journal Entries",
  "finance-payables": "Accounts Payable",
  "finance-receivables": "Accounts Receivable",
  "finance-reports": "Reports",
  "finance-budget": "Budget",
  "inventory-items": "Items",
  "inventory-warehouses": "Warehouses",
  "inventory-transfers": "Transfers",
  "inventory-adjustments": "Adjustments",
  "inventory-bom": "Bill of Materials",
  "inventory-production": "Production Orders",
  "inventory-reports": "Reports",
};

interface AppHeaderProps {
  currentPage?: PageId;
}

export function AppHeader({ currentPage = "dashboard" }: AppHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 rounded-lg border-b border-border/40 bg-background/95 backdrop-blur-md px-3 top-0 z-40">
      <SidebarTrigger className="-ml-0.5 h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors" />

      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbLink href="#" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <AppLogo />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block text-muted-foreground/30" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-semibold">{PAGE_LABELS[currentPage]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
        <LayoutSettingsSheet />
      </div>
    </header>
  );
}
