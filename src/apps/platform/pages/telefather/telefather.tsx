import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Send, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function TelefatherPage() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [botToken, setBotToken] = useState("1234567890:ABCdefGHIjklMNOpqrsTUVwxyz")
  const [chatId, setChatId] = useState("-1001234567890")

  return (
    <AppLayout title={t("تيليفاذر", "Telefather")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("تكامل تيليجرام", "Telegram Integration")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("إدارة تكامل تيليجرام لإرسال الإشعارات والرسائل", "Manage Telegram integration for notifications and messages")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEnabled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                {t("متصل", "Connected")}
              </Badge>
            )}
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Card */}
          <div className="lg:col-span-2">
            <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{t("إعدادات البوت", "Bot Settings")}</CardTitle>
                    <CardDescription>
                      {t("تكوين بوت تيليجرام للإرسال", "Configure Telegram bot for sending")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bot-token">{t("توكن البوت", "Bot Token")}</Label>
                    <Input
                      id="bot-token"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder={t("أدخل توكن البوت", "Enter bot token")}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chat-id">{t("معرف الدردشة", "Chat ID")}</Label>
                    <Input
                      id="chat-id"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      placeholder={t("أدخل معرف الدردشة", "Enter chat ID")}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="rounded-xl">
                    <Send className="h-4 w-4 ml-2" />
                    {t("اختبار الاتصال", "Test Connection")}
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    {t("حفظ الإعدادات", "Save Settings")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Card */}
          <div>
            <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-500">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{t("الحالة", "Status")}</CardTitle>
                    <CardDescription>
                      {t("معلومات الاتصال الحالية", "Current connection info")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("الاتصال", "Connection")}</span>
                    <Badge variant={isEnabled ? "default" : "secondary"}>
                      {isEnabled ? t("نشط", "Active") : t("غير نشط", "Inactive")}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("الرسائل المرسلة", "Messages Sent")}</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("آخر إرسال", "Last Sent")}</span>
                    <span className="text-sm font-medium">2 {t("دقائق", "minutes")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Messages */}
        <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
          <CardHeader>
            <CardTitle>{t("الرسائل الأخيرة", "Recent Messages")}</CardTitle>
            <CardDescription>
              {t("سجل الرسائل المرسلة عبر تيليجرام", "History of messages sent via Telegram")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {t("سيتم عرض سجل الرسائل هنا", "Message history will be displayed here")}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}