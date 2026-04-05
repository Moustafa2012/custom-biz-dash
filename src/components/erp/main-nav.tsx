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
  Settings, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageId } from "./types";
import { useAppConfig, type ErpAppId } from "./app-config";

interface NavSubItem {
  title: string;
  pageId?: PageId;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  pageId?: PageId;
  badge?: string | number;
  children?: NavSubItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const telegramNav: NavGroup = {
  label: "Telegram Services",
  items: [
    { title: "Bot Management", icon: Bot, pageId: "telegram-bots" },
    { title: "2FA Authentication", icon: ShieldCheck, pageId: "telegram-2fa" },
    { title: "Notifications", icon: Bell, pageId: "telegram-notifications" },
    { title: "Broadcasts", icon: Radio, pageId: "telegram-broadcasts" },
    { title: "Automation", icon: Zap, pageId: "telegram-automation" },
    { title: "Users & CRM", icon: UsersRound, pageId: "telegram-users" },
    { title: "Analytics", icon: Activity, pageId: "telegram-analytics" },
  ],
};

const smtpNav: NavGroup = {
  label: "Email / SMTP",
  items: [
    { title: "Overview", icon: Mail, pageId: "smtp-overview" },
    { title: "Templates", icon: FileTemplate2, pageId: "smtp-templates" },
    { title: "Send Email", icon: Send, pageId: "smtp-send" },
    { title: "Logs", icon: ScrollText, pageId: "smtp-logs" },
    { title: "SMTP Settings", icon: Settings2, pageId: "smtp-settings" },
  ],
};

const salesNav: NavGroup[] = [
  {
    label: "Sales",
    items: [
      { title: "Dashboard", icon: Home, pageId: "dashboard" },
      { title: "Orders", icon: ShoppingCart, pageId: "sales-orders" },
      { title: "Customers", icon: Users, pageId: "sales-customers" },
      { title: "Quotations", icon: FileText, pageId: "sales-quotations" },
      { title: "Invoices", icon: Receipt, pageId: "sales-invoices" },
      { title: "Returns", icon: RotateCcw, pageId: "sales-returns" },
      { title: "Reports", icon: BarChart3, pageId: "sales-reports" },
    ],
  },
  telegramNav,
  smtpNav,
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, pageId: "settings" },
    ],
  },
];

const financeNav: NavGroup[] = [
  {
    label: "Finance",
    items: [
      { title: "Dashboard", icon: Home, pageId: "dashboard" },
      { title: "General Ledger", icon: BookOpen, pageId: "finance-ledger" },
      { title: "Chart of Accounts", icon: Landmark, pageId: "finance-accounts" },
      { title: "Journal Entries", icon: Receipt, pageId: "finance-journal" },
      { title: "Accounts Payable", icon: CreditCard, pageId: "finance-payables" },
      { title: "Accounts Receivable", icon: Wallet, pageId: "finance-receivables" },
      { title: "Budget", icon: PiggyBank, pageId: "finance-budget" },
      { title: "Reports", icon: BarChart3, pageId: "finance-reports" },
    ],
  },
  telegramNav,
  smtpNav,
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, pageId: "settings" },
    ],
  },
];

const inventoryNav: NavGroup[] = [
  {
    label: "Inventory",
    items: [
      { title: "Dashboard", icon: Home, pageId: "dashboard" },
      { title: "Items", icon: Package, pageId: "inventory-items" },
      { title: "Warehouses", icon: Warehouse, pageId: "inventory-warehouses" },
      { title: "Transfers", icon: ArrowRightLeft, pageId: "inventory-transfers" },
      { title: "Adjustments", icon: ClipboardList, pageId: "inventory-adjustments" },
    ],
  },
  {
    label: "Manufacturing",
    items: [
      { title: "Bill of Materials", icon: Wrench, pageId: "inventory-bom" },
      { title: "Production Orders", icon: Factory, pageId: "inventory-production" },
      { title: "Reports", icon: BarChart3, pageId: "inventory-reports" },
    ],
  },
  telegramNav,
  smtpNav,
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, pageId: "settings" },
    ],
  },
];

const NAV_MAP: Record<ErpAppId, NavGroup[]> = {
  sales: salesNav,
  finance: financeNav,
  inventory: inventoryNav,
};

function NavItemRow({ item, currentPage, onNavigate }: { item: NavItem; currentPage?: PageId; onNavigate?: (page: PageId) => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isActive = item.pageId !== undefined && item.pageId === currentPage;
  const [open, setOpen] = useState(isActive && !!item.children);

  const handleClick = () => {
    if (item.pageId && onNavigate) onNavigate(item.pageId);
  };

  if (item.children) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              onClick={handleClick}
              className={cn("group/btn transition-all duration-150", isActive && "font-medium")}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground")} />
              <span>{item.title}</span>
              <ChevronRight className={cn("ml-auto h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200", open && "rotate-90")} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((sub) => (
                <SidebarMenuSubItem key={sub.title}>
                  <SidebarMenuSubButton asChild>
                    <button onClick={() => sub.pageId && onNavigate?.(sub.pageId)} className="flex items-center w-full">
                      <span>{sub.title}</span>
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
        tooltip={item.title}
        isActive={isActive}
        onClick={handleClick}
        className={cn("group/btn transition-all duration-150 cursor-pointer", isActive && "font-medium")}
      >
        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground")} />
        <span>{item.title}</span>
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
  const { currentApp } = useAppConfig();
  const navGroups = NAV_MAP[currentApp.id] || salesNav;

  return (
    <>
      {navGroups.map((group) => (
        <SidebarGroup key={group.label} className="px-2 py-1">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50 px-2 mb-1">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItemRow key={item.title} item={item} currentPage={currentPage} onNavigate={onNavigate} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
