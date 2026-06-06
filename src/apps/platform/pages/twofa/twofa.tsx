import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, KeyRound, Send, Mail, MessageCircle, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react"
import { t } from "@/lib/translations"
import { toast } from "sonner"
import {
  startChallenge,
  verifyCode,
  cancelChallenge,
  getActiveChallenge,
  type TwoFAChannel,
} from "@/lib/auth/twofa"
import { useMailerConfig, useTelegramConfig } from "@/lib/notifications/hooks"

export default function TwoFactorPage() {
  const [mailer] = useMailerConfig()
  const [tg] = useTelegramConfig()
  const [channel, setChannel] = useState<TwoFAChannel>("email")
  const [recipient, setRecipient] = useState("")
  const [code, setCode] = useState("")
  const [challenge, setChallenge] = useState(() => getActiveChallenge())
  const [busy, setBusy] = useState(false)

  const channelReady =
    channel === "email" ? mailer.enabled && !!mailer.host && !!mailer.fromEmail
                        : tg.enabled && !!tg.botToken

  const handleStart = async () => {
    if (!recipient.trim()) {
      toast.error(t("أدخل المستلم", "Enter a recipient"))
      return
    }
    if (!channelReady) {
      toast.error(t("القناة غير مهيأة", `${channel} channel is not configured`))
      return
    }
    setBusy(true)
    try {
      const c = await startChallenge({
        app: "platform",
        channel,
        recipient: recipient.trim(),
        purpose: "verify",
      })
      setChallenge(c)
      toast.success(t("تم إرسال الرمز", "Verification code sent"))
    } catch (e) {
      toast.error(t("فشل الإرسال", "Failed to send code"))
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = async () => {
    if (!code.trim()) return
    setBusy(true)
    try {
      const res = await verifyCode(code)
      if (res.ok) {
        toast.success(t("تم التحقق", "Verified"))
        setChallenge(null)
        setCode("")
      } else {
        const msg: Record<string, string> = {
          no_challenge: t("لا يوجد تحدي نشط", "No active challenge"),
          expired: t("انتهت صلاحية الرمز", "Code expired"),
          too_many_attempts: t("محاولات كثيرة", "Too many attempts"),
          mismatch: t("رمز خاطئ", "Incorrect code"),
        }
        toast.error(msg[res.reason])
        setChallenge(getActiveChallenge())
      }
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = () => {
    cancelChallenge()
    setChallenge(null)
    setCode("")
  }

  const remainingMs = challenge ? Math.max(0, challenge.expiresAt - Date.now()) : 0
  const remainingMin = Math.floor(remainingMs / 60000)
  const remainingSec = Math.floor((remainingMs % 60000) / 1000)

  return (
    <AppLayout title={t("المصادقة الثنائية", "Two-Factor Auth")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("المصادقة الثنائية", "Two-Factor Authentication")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("أرسل رموز OTP عبر البريد أو تيليجرام لأي تطبيق", "Send OTP codes via email or Telegram to any app")}
              </p>
            </div>
          </div>
        </div>

        {/* Channel readiness */}
        <div className="grid gap-4 md:grid-cols-2">
          <ReadyCard
            icon={<Mail className="h-5 w-5" />}
            title={t("قناة البريد", "Email channel")}
            ready={mailer.enabled && !!mailer.host && !!mailer.fromEmail}
            detail={mailer.enabled
              ? (mailer.host ? `${mailer.fromEmail || ""} via ${mailer.host}` : t("غير مهيأ", "Not configured"))
              : t("معطل", "Disabled")}
          />
          <ReadyCard
            icon={<MessageCircle className="h-5 w-5" />}
            title={t("قناة تيليجرام", "Telegram channel")}
            ready={tg.enabled && !!tg.botToken}
            detail={tg.enabled
              ? (tg.botToken ? t("جاهز", "Bot configured") : t("غير مهيأ", "Not configured"))
              : t("معطل", "Disabled")}
          />
        </div>

        {/* Challenge runner */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{t("اختبار رمز OTP", "Run an OTP challenge")}</CardTitle>
                <CardDescription>
                  {t("الرموز تنتهي خلال 5 دقائق، 5 محاولات كحد أقصى", "Codes expire after 5 minutes, max 5 attempts")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {!challenge ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t("القناة", "Channel")}</Label>
                  <Select value={channel} onValueChange={(v) => setChannel(v as TwoFAChannel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">{t("بريد إلكتروني", "Email")}</SelectItem>
                      <SelectItem value="telegram">{t("تيليجرام", "Telegram")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    {channel === "email" ? t("بريد المستلم", "Recipient email") : t("معرف الدردشة", "Chat ID")}
                  </Label>
                  <Input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={channel === "email" ? "user@example.com" : "-1001234567890"}
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={handleStart} disabled={busy || !channelReady}>
                    <Send className="h-4 w-4 me-1.5" /> {t("إرسال الرمز", "Send code")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">{challenge.channel}</Badge>
                    <span className="text-sm text-muted-foreground">{challenge.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {remainingMs > 0
                      ? t(`ينتهي خلال ${remainingMin}:${String(remainingSec).padStart(2, "0")}`, `Expires in ${remainingMin}:${String(remainingSec).padStart(2, "0")}`)
                      : t("منتهي", "Expired")}
                    <span>· {t(`المحاولات ${challenge.attempts}/5`, `Attempts ${challenge.attempts}/5`)}</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    inputMode="numeric"
                    autoFocus
                    className="font-mono text-lg tracking-[0.4em] text-center"
                  />
                  <Button onClick={handleVerify} disabled={busy || code.length !== 6}>
                    {t("تحقق", "Verify")}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={busy}>
                    {t("إلغاء", "Cancel")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

function ReadyCard({ icon, title, ready, detail }: { icon: React.ReactNode; title: string; ready: boolean; detail: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ready ? "bg-green-500/15 text-green-500" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
      {ready
        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
        : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
      <XCircle className="hidden" />
    </div>
  )
}
