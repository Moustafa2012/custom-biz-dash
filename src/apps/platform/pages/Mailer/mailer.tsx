import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Settings, CheckCircle, AlertTriangle } from "lucide-react"
import { t } from "@/lib/translations"
import { toast } from "sonner"
import { useMailerConfig, useNotify, useNotifications } from "@/lib/notifications/hooks"

export default function MailerPage() {
  const [cfg, setCfg] = useMailerConfig()
  const notify = useNotify()
  const { events } = useNotifications()
  const recent = events.filter((e) => e.channel === "email").slice(0, 8)
  const sent = events.filter((e) => e.channel === "email" && e.status === "sent").length
  const failed = events.filter((e) => e.channel === "email" && e.status === "failed").length

  const [testTo, setTestTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [busy, setBusy] = useState(false)

  const configured = !!cfg.host && !!cfg.fromEmail
  const ready = cfg.enabled && configured

  const handleSave = () => {
    setCfg(cfg)
    toast.success(t("تم حفظ الإعدادات", "Settings saved"))
  }

  const handleTest = async () => {
    if (!testTo.trim()) {
      toast.error(t("أدخل البريد المستلم", "Enter a recipient email"))
      return
    }
    setBusy(true)
    try {
      const created = await notify({
        app: "platform",
        title: subject || "Mailer test",
        body: body || "This is a test email from the platform mailer.",
        severity: "info",
        channels: ["email"],
        recipientEmail: testTo.trim(),
      })
      const ev = created[0]
      if (ev.status === "sent") toast.success(t("تم الإرسال", "Test sent"))
      else toast.error(ev.error ?? t("فشل", "Failed"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppLayout title={t("المراسل", "Mailer")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t("نظام البريد", "Email System")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("SMTP موحد لكل التطبيقات", "Unified SMTP for every app")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ready ? (
              <Badge className="bg-green-500/15 text-green-500 border-green-500/30">
                <CheckCircle className="h-3 w-3 me-1" /> {t("متصل", "Connected")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-600 border-yellow-500/40">
                <AlertTriangle className="h-3 w-3 me-1" /> {t("غير جاهز", "Not ready")}
              </Badge>
            )}
            <Switch checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{t("إعدادات SMTP", "SMTP Settings")}</CardTitle>
                    <CardDescription>
                      {t("تكوين خادم البريد", "Outgoing mail server configuration")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("المضيف", "Host")}</Label>
                    <Input value={cfg.host} onChange={(e) => setCfg({ ...cfg, host: e.target.value })} placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("المنفذ", "Port")}</Label>
                    <Select value={cfg.port} onValueChange={(v) => setCfg({ ...cfg, port: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="587">587 (TLS)</SelectItem>
                        <SelectItem value="465">465 (SSL)</SelectItem>
                        <SelectItem value="25">25 (None)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("اسم المستخدم", "Username")}</Label>
                    <Input value={cfg.username} onChange={(e) => setCfg({ ...cfg, username: e.target.value })} placeholder="apikey or user" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("اسم المرسل", "From Name")}</Label>
                    <Input value={cfg.fromName} onChange={(e) => setCfg({ ...cfg, fromName: e.target.value })} placeholder="Acme Notifications" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("بريد المرسل", "From Email")}</Label>
                  <Input type="email" value={cfg.fromEmail} onChange={(e) => setCfg({ ...cfg, fromEmail: e.target.value })} placeholder="noreply@yourdomain.com" />
                </div>
                <Button onClick={handleSave} className="rounded-xl">{t("حفظ الإعدادات", "Save Settings")}</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("الحالة", "Status")}</CardTitle>
              <CardDescription>{t("معلومات حية", "Live info")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label={t("الاتصال", "Connection")} value={<Badge variant={ready ? "default" : "secondary"}>{ready ? t("نشط", "Active") : t("غير نشط", "Inactive")}</Badge>} />
              <Row label={t("الرسائل المرسلة", "Sent")} value={sent} />
              <Row label={t("الفاشلة", "Failed")} value={failed} />
              <Row label={t("التهيئة", "Config")} value={configured ? t("مكتمل", "Complete") : t("ناقص", "Missing")} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("إرسال تجريبي", "Send Test Email")}</CardTitle>
                <CardDescription>{t("سيُسجل في سجل التدقيق", "Logged in audit center")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("إلى", "Recipient")}</Label>
                <Input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{t("الموضوع", "Subject")}</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("اختياري", "Optional")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("الرسالة", "Body")}</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[100px]" />
            </div>
            <Button onClick={handleTest} disabled={busy} className="rounded-xl">
              <Mail className="h-4 w-4 me-2" /> {t("إرسال", "Send")}
            </Button>
          </CardContent>
        </Card>

        {recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("آخر الرسائل", "Recent email events")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border/40">
                {recent.map((e) => (
                  <li key={e.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{e.recipient ?? "—"} · {e.body}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px]">{e.status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
