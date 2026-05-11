import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Users, Shield, Building, Plus, Search } from "lucide-react"

export default function UsersPage() {
  return (
    <AppLayout title={t("إدارة المستخدمين", "User Management")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("إدارة المستخدمين", "User Management")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة جميع المستخدمين والصلاحيات في النظام", "Manage all users and permissions in the system")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">{t("إجمالي المستخدمين", "Total Users")}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-green-500">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">56</p>
                <p className="text-sm text-muted-foreground">{t("المسؤولين", "Admins")}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">{t("المجموعات", "Groups")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t("المستخدمون النشطون", "Active Users")}</h3>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Search className="h-4 w-4 ml-2" />
                {t("بحث", "Search")}
              </Button>
              <Button size="sm" className="rounded-xl">
                <Plus className="h-4 w-4 ml-2" />
                {t("إضافة مستخدم", "Add User")}
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {t("سيتم عرض قائمة المستخدمين هنا", "User list will be displayed here")}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
