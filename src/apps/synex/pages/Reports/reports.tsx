import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconChartBar } from "@tabler/icons-react"

export default function ReportsPage() {
  return (
    <AppLayout title={t("التقارير", "Reports")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
            <IconChartBar className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("التقارير", "Reports")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("عرض وتحليل التقارير المالية", "View and analyze financial reports")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            {t("صفحة التقارير قيد التطوير", "Reports page under development")}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
