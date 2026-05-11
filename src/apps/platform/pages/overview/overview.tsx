import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react"

export default function OverviewPage() {
  return (
    <AppLayout title={t("نظرة عامة", "Overview")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("نظرة عامة على المنصة", "Platform Overview")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("نظرة شاملة على أداء المنصة وإحصائياتها", "Comprehensive view of platform performance and statistics")}
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
            {t("نشط", "Active")}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">{t("المستخدمون", "Users")}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-green-500">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-muted-foreground">{t("العمليات النشطة", "Active Operations")}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">{t("معدل النجاح", "Success Rate")}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">+24%</p>
                <p className="text-sm text-muted-foreground">{t("النمو الشهري", "Monthly Growth")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">{t("إجراءات سريعة", "Quick Actions")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-12 rounded-xl" variant="default">
              {t("إضافة مستخدم", "Add User")}
            </Button>
            <Button className="h-12 rounded-xl" variant="outline">
              {t("إعداد تيليجرام", "Setup Telegram")}
            </Button>
            <Button className="h-12 rounded-xl" variant="outline">
              {t("تكوين البريد", "Configure Email")}
            </Button>
            <Button className="h-12 rounded-xl" variant="outline">
              {t("عرض التقارير", "View Reports")}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}