import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconTransactionDollar } from "@tabler/icons-react"

export default function TransactionsPage() {
  return (
    <AppLayout title={t("المعاملات", "Transactions")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
            <IconTransactionDollar className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("المعاملات", "Transactions")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة المعاملات المالية", "Manage financial transactions")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            {t("صفحة المعاملات قيد التطوير", "Transactions page under development")}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
