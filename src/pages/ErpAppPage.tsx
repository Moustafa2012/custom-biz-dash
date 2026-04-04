import { useState } from "react";
import AppShell from "@/components/erp/app-shell";
import type { PageId } from "@/components/erp/types";

function PageContent({ pageId }: { pageId: PageId }) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2 capitalize">
          {pageId.replace(/-/g, " ").replace(/^(sales|finance|inventory)\s/, "")}
        </h2>
        <p className="text-sm text-muted-foreground">This page is ready for implementation.</p>
      </div>
    </div>
  );
}

interface ErpAppPageProps {
  defaultPage: PageId;
}

export default function ErpAppPage({ defaultPage }: ErpAppPageProps) {
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage);

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      <PageContent pageId={currentPage} />
    </AppShell>
  );
}
