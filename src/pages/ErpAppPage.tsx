import { useState, useEffect } from "react";
import type { PageId } from "@/components/erp/types";
import { AppConfigProvider, useAppConfig, erpApps, type ErpAppId } from "@/components/erp/app-config";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erp/app-sidebar";
import { AppHeader } from "@/components/erp/app-header";
import { AppContent } from "@/components/erp/app-content";
import { SettingsPage } from "@/components/erp/settings-page";
import {
  InventoryDashboard, InventoryItems, InventoryWarehouses,
  InventoryTransfers, InventoryAdjustments, InventoryBOM,
  InventoryProduction, InventoryReports,
} from "@/components/erp/inventory";

function PageContent({ pageId, appId }: { pageId: PageId; appId: ErpAppId }) {
  if (pageId === "settings") {
    return <SettingsPage appId={appId} />;
  }

  // Inventory & Mfg pages
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

  const displayName = pageId === "dashboard"
    ? "Dashboard"
    : pageId.replace(/-/g, " ").replace(/^(sales|finance|inventory)\s/, "");

  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2 capitalize">
          {displayName}
        </h2>
        <p className="text-sm text-muted-foreground">This page is ready for implementation.</p>
      </div>
    </div>
  );
}

function InnerErpApp({ appId, defaultPage }: { appId: ErpAppId; defaultPage: PageId }) {
  const { setCurrentApp } = useAppConfig();
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage);

  useEffect(() => {
    const app = erpApps.find(a => a.id === appId);
    if (app) setCurrentApp(app);
  }, [appId, setCurrentApp]);

  return (
    <>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader currentPage={currentPage} />
        <AppContent>
          <PageContent pageId={currentPage} appId={appId} />
        </AppContent>
      </SidebarInset>
    </>
  );
}

interface ErpAppPageProps {
  appId: ErpAppId;
  defaultPage: PageId;
}

export default function ErpAppPage({ appId, defaultPage }: ErpAppPageProps) {
  return (
    <AppConfigProvider>
      <SidebarProvider>
        <InnerErpApp appId={appId} defaultPage={defaultPage} />
      </SidebarProvider>
    </AppConfigProvider>
  );
}
