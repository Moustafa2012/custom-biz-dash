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
import { useAppConfig } from "./app-config";

type PageLabels = Record<PageId, { en: string; ar: string }>;

const PAGE_LABELS: PageLabels = {
  dashboard: { en: "Dashboard", ar: "لوحة المعلومات" },
  profile: { en: "Profile", ar: "الملف الشخصي" },
  settings: { en: "Settings", ar: "الإعدادات" },
  users: { en: "Users", ar: "المستخدمون" },
  "sales-orders": { en: "Orders", ar: "الطلبات" },
  "sales-customers": { en: "Customers", ar: "العملاء" },
  "sales-quotations": { en: "Quotations", ar: "عروض الأسعار" },
  "sales-invoices": { en: "Invoices", ar: "الفواتير" },
  "sales-returns": { en: "Returns", ar: "المرتجعات" },
  "sales-reports": { en: "Reports", ar: "التقارير" },
  "finance-ledger": { en: "General Ledger", ar: "دفتر الأستاذ العام" },
  "finance-accounts": { en: "Chart of Accounts", ar: "دليل الحسابات" },
  "finance-journal": { en: "Journal Entries", ar: "القيود اليومية" },
  "finance-payables": { en: "Accounts Payable", ar: "الذمم الدائنة" },
  "finance-receivables": { en: "Accounts Receivable", ar: "الذمم المدينة" },
  "finance-reports": { en: "Reports", ar: "التقارير" },
  "finance-budget": { en: "Budget", ar: "الميزانية" },
  "inventory-items": { en: "Items", ar: "الأصناف" },
  "inventory-warehouses": { en: "Warehouses", ar: "المستودعات" },
  "inventory-transfers": { en: "Transfers", ar: "التحويلات" },
  "inventory-adjustments": { en: "Adjustments", ar: "التسويات" },
  "inventory-bom": { en: "Bill of Materials", ar: "قائمة المواد" },
  "inventory-production": { en: "Production Orders", ar: "أوامر الإنتاج" },
  "inventory-reports": { en: "Reports", ar: "التقارير" },
  "banking-accounts": { en: "Account Setup", ar: "إعداد الحسابات" },
  "banking-beneficiaries": { en: "Beneficiaries", ar: "المستفيدون" },
  "banking-document": { en: "Document Generator", ar: "منشئ المستندات" },
  "banking-transactions": { en: "Transactions", ar: "المعاملات" },
  "banking-transfers": { en: "Transfers", ar: "التحويلات" },
  "banking-reports": { en: "Reports", ar: "التقارير" },
  "warehouse-inventory": { en: "Inventory", ar: "المخزون" },
  "warehouse-locations": { en: "Locations", ar: "المواقع" },
  "warehouse-movements": { en: "Movements", ar: "الحركات" },
  "warehouse-reports": { en: "Reports", ar: "التقارير" },
};

interface AppHeaderProps {
  currentPage?: PageId;
}

export function AppHeader({ currentPage = "dashboard" }: AppHeaderProps) {
  const { language } = useAppConfig();
  const label = PAGE_LABELS[currentPage];
  const pageTitle = label ? (language === "ar" ? label.ar : label.en) : currentPage;

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
            <BreadcrumbPage className="text-xs font-semibold">{pageTitle}</BreadcrumbPage>
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
