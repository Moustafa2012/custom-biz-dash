import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function MailerPage() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com")
  const [smtpPort, setSmtpPort] = useState("587")
  const [email, setEmail] = useState("noreply@company.com")
  const [testEmail, setTestEmail] = useState("")
  const [testMessage, setTestMessage] = useState("")

  return (
    <AppLayout title={t("المراسل", "Mailer")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("نظام البريد الإلكتروني", "Email System")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("تكوين وإدارة نظام البريد الإلكتروني للمنصة", "Configure and manage platform email system")}
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
          {/* SMTP Configuration */}
          <div className="lg:col-span-2">
            <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{t("إعدادات SMTP", "SMTP Settings")}</CardTitle>
                    <CardDescription>
                      {t("تكوين خادم البريد الصادر", "Configure outgoing mail server")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">{t("المضيف", "Host")}</Label>
                    <Input
                      id="smtp-host"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder={t("مثال: smtp.gmail.com", "e.g., smtp.gmail.com")}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">{t("المنفذ", "Port")}</Label>
                    <Select value={smtpPort} onValueChange={setSmtpPort}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="587">587 (TLS)</SelectItem>
                        <SelectItem value="465">465 (SSL)</SelectItem>
                        <SelectItem value="25">25 (None)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("البريد الإلكتروني", "Email Address")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("noreply@company.com", "noreply@company.com")}
                    className="bg-background/50"
                  />
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
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{t("الحالة", "Status")}</CardTitle>
                    <CardDescription>
                      {t("معلومات النظام الحالية", "Current system info")}
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
                    <span className="text-sm text-muted-foreground">{t("الرسائل المرسلة", "Emails Sent")}</span>
                    <span className="text-sm font-medium">3,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("معدل التسليم", "Delivery Rate")}</span>
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test Email */}
        <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("إرسال رسالة اختبارية", "Send Test Email")}</CardTitle>
                <CardDescription>
                  {t("اختبار نظام البريد بإرسال رسالة تجريبية", "Test email system by sending a trial message")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-email">{t("البريد المستلم", "Recipient Email")}</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder={t("test@example.com", "test@example.com")}
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-message">{t("الرسالة", "Message")}</Label>
              <Textarea
                id="test-message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder={t("اكتب رسالتك التجريبية هنا...", "Write your test message here...")}
                className="bg-background/50 min-h-[100px]"
              />
            </div>
            <Button className="rounded-xl">
              <Mail className="h-4 w-4 ml-2" />
              {t("إرسال الرسالة التجريبية", "Send Test Email")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}