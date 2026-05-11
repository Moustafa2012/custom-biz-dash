import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconBook } from "@tabler/icons-react"

export default function JournalEntriesPage() {
  return (
    <AppLayout title={t("القيود اليومية", "Journal Entries")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
            <IconBook className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("القيود اليومية", "Journal Entries")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة القيود المحاسبية اليومية", "Manage daily accounting entries")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            {t("صفحة القيود اليومية قيد التطوير", "Journal entries page under development")}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}