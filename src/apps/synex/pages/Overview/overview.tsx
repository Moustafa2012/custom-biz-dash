import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconDashboard } from "@tabler/icons-react"

export default function OverviewPage() {
  return (
    <AppLayout title={t("نظرة عامة", "Overview")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
            <IconDashboard className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("نظرة عامة", "Overview")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("نظرة شاملة على النظام المالي", "Comprehensive view of the financial system")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            {t("صفحة النظرة العامة قيد التطوير", "Overview page under development")}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}