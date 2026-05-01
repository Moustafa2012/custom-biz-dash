import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home, ShoppingCart, Users, FileText, RotateCcw, BarChart3,
  BookOpen, Landmark, Receipt, CreditCard, Wallet, PiggyBank,
  Package, Warehouse, ArrowRightLeft, ClipboardList, Wrench, Factory,
  MapPin,
  Settings, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageId } from "./types";
import { useAppConfig, type ErpAppId } from "./app-config";

interface NavSubItem {
  titleEn: string;
  titleAr: string;
  pageId?: PageId;
}

interface NavItem {
  titleEn: string;
  titleAr: string;
  icon: React.ElementType;
  pageId?: PageId;
  badge?: string | number;
  children?: NavSubItem[];
}

interface NavGroup {
  labelEn: string;
  labelAr: string;
  items: NavItem[];
}

const salesNav: NavGroup[] = [
  {
    labelEn: "Sales", labelAr: "المبيعات",
    items: [
      { titleEn: "Dashboard", titleAr: "لوحة المعلومات", icon: Home, pageId: "dashboard" },
      { titleEn: "Orders", titleAr: "الطلبات", icon: ShoppingCart, pageId: "sales-orders" },
      { titleEn: "Customers", titleAr: "العملاء", icon: Users, pageId: "sales-customers" },
      { titleEn: "Quotations", titleAr: "عروض الأسعار", icon: FileText, pageId: "sales-quotations" },
      { titleEn: "Invoices", titleAr: "الفواتير", icon: Receipt, pageId: "sales-invoices" },
      { titleEn: "Returns", titleAr: "المرتجعات", icon: RotateCcw, pageId: "sales-returns" },
      { titleEn: "Reports", titleAr: "التقارير", icon: BarChart3, pageId: "sales-reports" },
    ],
  },
  {
    labelEn: "System", labelAr: "النظام",
    items: [
      { titleEn: "Users", titleAr: "المستخدمون", icon: Users, pageId: "users" },
      { titleEn: "Settings", titleAr: "الإعدادات", icon: Settings, pageId: "settings" },
    ],
  },
];

const financeNav: NavGroup[] = [
  {
    labelEn: "Finance", labelAr: "المالية",
    items: [
      { titleEn: "Dashboard", titleAr: "لوحة المعلومات", icon: Home, pageId: "dashboard" },
      { titleEn: "General Ledger", titleAr: "دفتر الأستاذ العام", icon: BookOpen, pageId: "finance-ledger" },
      { titleEn: "Chart of Accounts", titleAr: "دليل الحسابات", icon: Landmark, pageId: "finance-accounts" },
      { titleEn: "Journal Entries", titleAr: "القيود اليومية", icon: Receipt, pageId: "finance-journal" },
      { titleEn: "Accounts Payable", titleAr: "الذمم الدائنة", icon: CreditCard, pageId: "finance-payables" },
      { titleEn: "Accounts Receivable", titleAr: "الذمم المدينة", icon: Wallet, pageId: "finance-receivables" },
      { titleEn: "Budget", titleAr: "الميزانية", icon: PiggyBank, pageId: "finance-budget" },
      { titleEn: "Reports", titleAr: "التقارير", icon: BarChart3, pageId: "finance-reports" },
    ],
  },
  {
    labelEn: "System", labelAr: "النظام",
    items: [
      { titleEn: "Users", titleAr: "المستخدمون", icon: Users, pageId: "users" },
      { titleEn: "Settings", titleAr: "الإعدادات", icon: Settings, pageId: "settings" },
    ],
  },
];

const inventoryNav: NavGroup[] = [
  {
    labelEn: "Inventory", labelAr: "المخزون",
    items: [
      { titleEn: "Dashboard", titleAr: "لوحة المعلومات", icon: Home, pageId: "dashboard" },
      { titleEn: "Items", titleAr: "الأصناف", icon: Package, pageId: "inventory-items" },
      { titleEn: "Warehouses", titleAr: "المستودعات", icon: Warehouse, pageId: "inventory-warehouses" },
      { titleEn: "Transfers", titleAr: "التحويلات", icon: ArrowRightLeft, pageId: "inventory-transfers" },
      { titleEn: "Adjustments", titleAr: "التسويات", icon: ClipboardList, pageId: "inventory-adjustments" },
    ],
  },
  {
    labelEn: "Manufacturing", labelAr: "التصنيع",
    items: [
      { titleEn: "Bill of Materials", titleAr: "قائمة المواد", icon: Wrench, pageId: "inventory-bom" },
      { titleEn: "Production Orders", titleAr: "أوامر الإنتاج", icon: Factory, pageId: "inventory-production" },
      { titleEn: "Reports", titleAr: "التقارير", icon: BarChart3, pageId: "inventory-reports" },
    ],
  },
  {
    labelEn: "System", labelAr: "النظام",
    items: [
      { titleEn: "Users", titleAr: "المستخدمون", icon: Users, pageId: "users" },
      { titleEn: "Settings", titleAr: "الإعدادات", icon: Settings, pageId: "settings" },
    ],
  },
];

const bankingNav: NavGroup[] = [
  {
    labelEn: "Banking", labelAr: "الأعمال البنكية",
    items: [
      { titleEn: "Dashboard", titleAr: "لوحة المعلومات", icon: Home, pageId: "dashboard" },
      { titleEn: "Accounts", titleAr: "الحسابات", icon: CreditCard, pageId: "banking-accounts" },
      { titleEn: "Transactions", titleAr: "المعاملات", icon: Receipt, pageId: "banking-transactions" },
      { titleEn: "Transfers", titleAr: "التحويلات", icon: ArrowRightLeft, pageId: "banking-transfers" },
      { titleEn: "Reports", titleAr: "التقارير", icon: BarChart3, pageId: "banking-reports" },
    ],
  },
  {
    labelEn: "System", labelAr: "النظام",
    items: [
      { titleEn: "Users", titleAr: "المستخدمون", icon: Users, pageId: "users" },
      { titleEn: "Settings", titleAr: "الإعدادات", icon: Settings, pageId: "settings" },
    ],
  },
];

const warehouseNav: NavGroup[] = [
  {
    labelEn: "Warehouse", labelAr: "المستودع",
    items: [
      { titleEn: "Dashboard", titleAr: "لوحة المعلومات", icon: Home, pageId: "dashboard" },
      { titleEn: "Inventory", titleAr: "المخزون", icon: Package, pageId: "warehouse-inventory" },
      { titleEn: "Locations", titleAr: "المواقع", icon: MapPin, pageId: "warehouse-locations" },
      { titleEn: "Movements", titleAr: "الحركات", icon: ArrowRightLeft, pageId: "warehouse-movements" },
      { titleEn: "Reports", titleAr: "التقارير", icon: BarChart3, pageId: "warehouse-reports" },
    ],
  },
  {
    labelEn: "System", labelAr: "النظام",
    items: [
      { titleEn: "Users", titleAr: "المستخدمون", icon: Users, pageId: "users" },
      { titleEn: "Settings", titleAr: "الإعدادات", icon: Settings, pageId: "settings" },
    ],
  },
];

const NAV_MAP: Record<ErpAppId, NavGroup[]> = {
  sales: salesNav,
  finance: financeNav,
  inventory: inventoryNav,
  banking: bankingNav,
  warehouse: warehouseNav,
};

function NavItemRow({ item, currentPage, onNavigate }: { item: NavItem; currentPage?: PageId; onNavigate?: (page: PageId) => void }) {
  const { state } = useSidebar();
  const { language } = useAppConfig();
  const collapsed = state === "collapsed";
  const isActive = item.pageId !== undefined && item.pageId === currentPage;
  const [open, setOpen] = useState(isActive && !!item.children);

  const title = language === "ar" ? item.titleAr : item.titleEn;

  const handleClick = () => {
    if (item.pageId && onNavigate) onNavigate(item.pageId);
  };

  if (item.children) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={title}
              isActive={isActive}
              onClick={handleClick}
              className={cn("group/btn transition-all duration-150", isActive && "font-medium")}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground")} />
              <span>{title}</span>
              <ChevronRight className={cn("ml-auto h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200", open && "rotate-90")} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((sub) => (
                <SidebarMenuSubItem key={sub.titleEn}>
                  <SidebarMenuSubButton asChild>
                    <button onClick={() => sub.pageId && onNavigate?.(sub.pageId)} className="flex items-center w-full">
                      <span>{language === "ar" ? sub.titleAr : sub.titleEn}</span>
                    </button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={title}
        isActive={isActive}
        onClick={handleClick}
        className={cn("group/btn transition-all duration-150 cursor-pointer", isActive && "font-medium")}
      >
        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground")} />
        <span>{title}</span>
      </SidebarMenuButton>
      {item.badge !== undefined && !collapsed && (
        <SidebarMenuBadge>
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-semibold text-primary">
            {item.badge}
          </span>
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

interface MainNavProps {
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
}

export function MainNav({ currentPage, onNavigate }: MainNavProps) {
  const { currentApp, language } = useAppConfig();
  const navGroups = NAV_MAP[currentApp.id] || salesNav;

  return (
    <>
      {navGroups.map((group) => (
        <SidebarGroup key={group.labelEn} className="px-2 py-1">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50 px-2 mb-1">
            {language === "ar" ? group.labelAr : group.labelEn}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItemRow key={item.titleEn} item={item} currentPage={currentPage} onNavigate={onNavigate} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
