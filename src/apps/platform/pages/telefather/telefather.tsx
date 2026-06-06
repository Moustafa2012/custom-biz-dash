import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Settings, CheckCircle, AlertTriangle } from "lucide-react"
import { t } from "@/lib/translations"
import { toast } from "sonner"
import { useTelegramConfig } from "@/lib/notifications/hooks"
import { useNotify } from "@/lib/notifications/hooks"
import { useNotifications } from "@/lib/notifications/hooks"

export default function TelefatherPage() {
  const [cfg, setCfg] = useTelegramConfig()
  const notify = useNotify()
  const { events } = useNotifications()
  const recent = events.filter((e) => e.channel === "telegram").slice(0, 8)
  const sent = recent.filter((e) => e.status === "sent").length
  const failed = events.filter((e) => e.channel === "telegram" && e.status === "failed").length

  const [chatId, setChatId] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const configured = !!cfg.botToken && !!cfg.defaultChatId
  const ready = cfg.enabled && configured

  const handleSave = () => {
    setCfg(cfg)
    toast.success(t("تم حفظ الإعدادات", "Settings saved"))
  }

  const handleTest = async () => {
    setBusy(true)
    try {
      const created = await notify({
        app: "platform",
        title: "Telegram test",
        body: message || "This is a test notification from Telefather.",
        severity: "info",
        channels: ["telegram"],
        recipientChatId: chatId.trim() || cfg.defaultChatId,
      })
      const ev = created[0]
      if (ev.status === "sent") toast.success(t("تم الإرسال", "Test sent"))
      else toast.error(ev.error ?? t("فشل", "Failed"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppLayout title={t("تيليفاذر", "Telefather")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t("تكامل تيليجرام", "Telegram Integration")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("بوت موحد للإشعارات وOTP عبر كل التطبيقات", "Unified bot for notifications and OTP across all apps")}
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
                    <CardTitle>{t("إعدادات البوت", "Bot Settings")}</CardTitle>
                    <CardDescription>
                      {t("توكن من BotFather + معرف الدردشة الافتراضي", "BotFather token + default chat ID")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-token">{t("توكن البوت", "Bot Token")}</Label>
                  <Input
                    id="bot-token"
                    type="password"
                    value={cfg.botToken}
                    onChange={(e) => setCfg({ ...cfg, botToken: e.target.value })}
                    placeholder="123456789:AA..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chat-id">{t("معرف الدردشة الافتراضي", "Default Chat ID")}</Label>
                  <Input
                    id="chat-id"
                    value={cfg.defaultChatId}
                    onChange={(e) => setCfg({ ...cfg, defaultChatId: e.target.value })}
                    placeholder="-1001234567890"
                  />
                </div>
                <Button onClick={handleSave} className="rounded-xl">
                  {t("حفظ الإعدادات", "Save Settings")}
                </Button>
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
                <CardTitle>{t("إرسال تجريبي", "Send Test Message")}</CardTitle>
                <CardDescription>{t("سيتم تسجيله في سجل التدقيق", "Logged in audit center")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("معرف دردشة محدد (اختياري)", "Override Chat ID (optional)")}</Label>
                <Input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder={cfg.defaultChatId || "-1001234567890"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("الرسالة", "Message")}</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("اكتب الرسالة...", "Write your message...")}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleTest} disabled={busy} className="rounded-xl">
              <MessageCircle className="h-4 w-4 me-2" /> {t("إرسال", "Send")}
            </Button>
          </CardContent>
        </Card>

        {recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("آخر الرسائل", "Recent Telegram events")}</CardTitle>
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
