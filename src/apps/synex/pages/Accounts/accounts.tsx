import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconBuildingBank, IconPlus, IconEye, IconEdit, IconTrash } from "@tabler/icons-react"

export default function AccountsPage() {
  return (
    <AppLayout title={t("الحسابات البنكية", "Bank Accounts")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("الحسابات البنكية", "Bank Accounts")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة جميع الحسابات البنكية للشركة", "Manage all company bank accounts")}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <IconPlus className="h-4 w-4" />
            {t("إضافة حساب", "Add Account")}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <IconBuildingBank className="h-8 w-8" />
              <span className="text-sm font-medium">الراجحي</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">SAR 1,234,567.89</p>
              <p className="text-sm opacity-80 mt-1">SA1234567890123456789012</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEye className="h-4 w-4" />
                {t("عرض", "View")}
              </button>
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEdit className="h-4 w-4" />
                {t("تعديل", "Edit")}
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <IconBuildingBank className="h-8 w-8" />
              <span className="text-sm font-medium">الإنماء</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">SAR 987,654.32</p>
              <p className="text-sm opacity-80 mt-1">SA0987654321098765432109</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEye className="h-4 w-4" />
                {t("عرض", "View")}
              </button>
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEdit className="h-4 w-4" />
                {t("تعديل", "Edit")}
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <IconBuildingBank className="h-8 w-8" />
              <span className="text-sm font-medium">السعودي الفرنسي</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">SAR 456,789.12</p>
              <p className="text-sm opacity-80 mt-1">SA5678901234567890123456</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEye className="h-4 w-4" />
                {t("عرض", "View")}
              </button>
              <button className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30">
                <IconEdit className="h-4 w-4" />
                {t("تعديل", "Edit")}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">{t("جميع الحسابات", "All Accounts")}</h3>
          </div>
          <div className="divide-y">
            {[
              { bank: "الراجحي", account: "SA1234567890123456789012", balance: "SAR 1,234,567.89", status: "نشط" },
              { bank: "الإنماء", account: "SA0987654321098765432109", balance: "SAR 987,654.32", status: "نشط" },
              { bank: "السعودي الفرنسي", account: "SA5678901234567890123456", balance: "SAR 456,789.12", status: "نشط" },
            ].map((acc, i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconBuildingBank className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{acc.bank}</p>
                    <p className="text-sm text-muted-foreground">{acc.account}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">{acc.balance}</p>
                    <p className="text-sm text-green-600">{acc.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-input bg-background p-2 hover:bg-accent">
                      <IconEye className="h-4 w-4" />
                    </button>
                    <button className="rounded-md border border-input bg-background p-2 hover:bg-accent">
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button className="rounded-md border border-input bg-background p-2 hover:bg-destructive hover:text-destructive-foreground">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
