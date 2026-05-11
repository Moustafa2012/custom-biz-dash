import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconUsers } from "@tabler/icons-react"

export default function BeneficiariesPage() {
  return (
    <AppLayout title={t("المستفيدون", "Beneficiaries")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <IconUsers className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("المستفيدون", "Beneficiaries")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة المستفيدين والجهات المستفيدة", "Manage beneficiaries and recipient entities")}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            {t("صفحة المستفيدين قيد التطوير", "Beneficiaries page under development")}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}