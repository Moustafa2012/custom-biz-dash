import { useState, useEffect } from "react";
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
import { Construction } from "lucide-react";

function PlaceholderPage({ pageId }: { pageId: PageId }) {
  const { t } = useAppConfig();
  const displayName = pageId.replace(/-/g, " ").replace(/^(sales|finance|inventory)\s/, "");
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
          <PageContent pageId={currentPage} appId={appId} />
        </AppContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
