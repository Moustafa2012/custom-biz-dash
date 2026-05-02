import { useState, useEffect, lazy, Suspense } from "react";
import type { PageId } from "@/components/erp/types";
import { useAppConfig, erpApps, type ErpAppId } from "@/components/erp/app-config";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erp/app-sidebar";
import { AppHeader } from "@/components/erp/app-header";
import { AppContent } from "@/components/erp/app-content";
import { SettingsPage } from "@/components/erp/settings-page";
import { ProfilePage } from "@/components/erp/profile-page";
import { UsersPage } from "@/components/erp/users-page";
import {
  InventoryDashboard, InventoryItems, InventoryWarehouses,
  InventoryTransfers, InventoryAdjustments, InventoryBOM,
  InventoryProduction, InventoryReports,
} from "@/components/erp/inventory";
import { Construction, Loader2 } from "lucide-react";

// Lazy-load Banking & Warehouse feature modules per ERP.md §2.3 (code-splitting).
const BankingDashboard     = lazy(() => import("@/features/banking/pages/BankingDashboard"));
const BankingAccounts      = lazy(() => import("@/features/banking/pages/BankingAccounts"));
const BankingBeneficiaries = lazy(() => import("@/features/banking/pages/BankingBeneficiaries"));
const BankingDocument      = lazy(() => import("@/features/banking/pages/BankingDocument"));
const BankingTransactions  = lazy(() => import("@/features/banking/pages/BankingTransactions"));
const BankingTransfers     = lazy(() => import("@/features/banking/pages/BankingTransfers"));
const BankingReports       = lazy(() => import("@/features/banking/pages/BankingReports"));

const WarehouseDashboard  = lazy(() => import("@/features/warehouse/pages/WarehouseDashboard"));
const WarehouseInventory  = lazy(() => import("@/features/warehouse/pages/WarehouseInventory"));
const WarehouseLocations  = lazy(() => import("@/features/warehouse/pages/WarehouseLocations"));
const WarehouseMovements  = lazy(() => import("@/features/warehouse/pages/WarehouseMovements"));
const WarehouseReports    = lazy(() => import("@/features/warehouse/pages/WarehouseReports"));

function PlaceholderPage({ pageId }: { pageId: PageId }) {
  const { t } = useAppConfig();
  const displayName = pageId.replace(/-/g, " ").replace(/^(sales|finance|inventory|banking|warehouse)\s/, "");
  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-2">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground capitalize">{displayName}</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t("هذه الصفحة جاهزة للتطوير.", "This page is ready for implementation.")}
        </p>
      </div>
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function PageContent({ pageId, appId }: { pageId: PageId; appId: ErpAppId }) {
  if (pageId === "settings") return <SettingsPage appId={appId} />;
  if (pageId === "profile") return <ProfilePage />;
  if (pageId === "users") return <UsersPage />;

  if (appId === "inventory") {
    switch (pageId) {
      case "dashboard": return <InventoryDashboard />;
      case "inventory-items": return <InventoryItems />;
      case "inventory-warehouses": return <InventoryWarehouses />;
      case "inventory-transfers": return <InventoryTransfers />;
      case "inventory-adjustments": return <InventoryAdjustments />;
      case "inventory-bom": return <InventoryBOM />;
      case "inventory-production": return <InventoryProduction />;
      case "inventory-reports": return <InventoryReports />;
    }
  }

  if (appId === "banking") {
    switch (pageId) {
      case "dashboard":              return <BankingDashboard />;
      case "banking-accounts":       return <BankingAccounts />;
      case "banking-beneficiaries":  return <BankingBeneficiaries />;
      case "banking-document":       return <BankingDocument />;
      case "banking-transactions":   return <BankingTransactions />;
      case "banking-transfers":      return <BankingTransfers />;
      case "banking-reports":        return <BankingReports />;
    }
  }

  if (appId === "warehouse") {
    switch (pageId) {
      case "dashboard":            return <WarehouseDashboard />;
      case "warehouse-inventory":  return <WarehouseInventory />;
      case "warehouse-locations":  return <WarehouseLocations />;
      case "warehouse-movements":  return <WarehouseMovements />;
      case "warehouse-reports":    return <WarehouseReports />;
    }
  }

  return <PlaceholderPage pageId={pageId} />;
}

interface ErpAppPageProps {
  appId: ErpAppId;
  defaultPage: PageId;
}

export default function ErpAppPage({ appId, defaultPage }: ErpAppPageProps) {
  const { setCurrentApp } = useAppConfig();
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage);

  useEffect(() => {
    const app = erpApps.find(a => a.id === appId);
    if (app) setCurrentApp(app);
  }, [appId, setCurrentApp]);

  useEffect(() => {
    setCurrentPage(defaultPage);
  }, [appId, defaultPage]);

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader currentPage={currentPage} />
        <AppContent>
          <Suspense fallback={<RouteFallback />}>
            <PageContent pageId={currentPage} appId={appId} />
          </Suspense>
        </AppContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
