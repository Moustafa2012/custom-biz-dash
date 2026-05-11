import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconSettings, IconUser, IconShield, IconBell, IconPalette, IconGlobe } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <AppLayout title={t("الإعدادات", "Settings")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
            <IconSettings className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("الإعدادات", "Settings")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة إعدادات النظام والحساب", "Manage system and account settings")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <IconUser className="h-5 w-5 text-blue-500" />
                </div>
                {t("الملف الشخصي", "Profile")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("إدارة معلومات الملف الشخصي", "Manage profile information")}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <IconShield className="h-5 w-5 text-green-500" />
                </div>
                {t("الأمان والخصوصية", "Security & Privacy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("إعدادات الأمان والخصوصية", "Security and privacy settings")}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <IconBell className="h-5 w-5 text-purple-500" />
                </div>
                {t("الإشعارات", "Notifications")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("إدارة تفضيلات الإشعارات", "Manage notification preferences")}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <IconPalette className="h-5 w-5 text-orange-500" />
                </div>
                {t("المظهر", "Appearance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("تخصيص مظهر التطبيق", "Customize app appearance")}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <IconGlobe className="h-5 w-5 text-cyan-500" />
                </div>
                {t("اللغة والمنطقة", "Language & Region")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("إعدادات اللغة والمنطقة", "Language and region settings")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
