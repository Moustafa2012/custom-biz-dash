import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconHelp, IconBook, IconMessageCircle, IconPhone, IconMail, IconFileText } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <AppLayout title={t("المساعدة", "Help")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <IconHelp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("مركز المساعدة", "Help Center")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("ابحث عن إجابات واحصل على المساعدة", "Find answers and get help")}
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="border border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHelp className="h-5 w-5" />
              {t("كيف يمكننا مساعدتك؟", "How can we help you?")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("ابحث عن موضوع...", "Search for a topic...")}
                className="w-full px-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button className="w-full">
                {t("بحث", "Search")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <IconBook className="h-5 w-5 text-blue-500" />
                </div>
                {t("دليل المستخدم", "User Guide")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("تعلم كيفية استخدام النظام", "Learn how to use the system")}
              </p>
              <Button variant="outline" size="sm">
                {t("عرض الدليل", "View Guide")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <IconMessageCircle className="h-5 w-5 text-green-500" />
                </div>
                {t("الدعم المباشر", "Live Support")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("تحدث مع فريق الدعم", "Talk to our support team")}
              </p>
              <Button variant="outline" size="sm">
                {t("بدء محادثة", "Start Chat")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <IconFileText className="h-5 w-5 text-purple-500" />
                </div>
                {t("الأسئلة الشائعة", "FAQ")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("إجابات على الأسئلة المتكررة", "Answers to common questions")}
              </p>
              <Button variant="outline" size="sm">
                {t("عرض الأسئلة", "View FAQ")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="border border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPhone className="h-5 w-5" />
              {t("تواصل معنا", "Contact Us")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <IconPhone className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">{t("الهاتف", "Phone")}</p>
                  <p className="text-sm text-muted-foreground">+966 50 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <IconMail className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="font-medium">{t("البريد الإلكتروني", "Email")}</p>
                  <p className="text-sm text-muted-foreground">support@thouraya.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
