import { AppLayout } from "@/components/layout/app-layout"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageCircle, ShieldCheck, History, Inbox, AlertTriangle, CheckCircle2 } from "lucide-react"
import { t } from "@/lib/translations"
import { useMailerConfig, useTelegramConfig, useNotifications, useNotificationStats } from "@/lib/notifications/hooks"

export default function PlatformOverviewPage() {
  const stats = useNotificationStats()
  const [mailer] = useMailerConfig()
  const [tg] = useTelegramConfig()
  const { events } = useNotifications()
  const recent = events.slice(0, 6)

  const mailerReady = mailer.enabled && !!mailer.host && !!mailer.fromEmail
  const tgReady = tg.enabled && !!tg.botToken && !!tg.defaultChatId

  const cards = [
    { icon: Inbox, label: t("إجمالي الإشعارات", "Total events"), value: stats.total, cls: "bg-primary/15 text-primary" },
    { icon: Bell, label: t("غير مقروءة", "Unread inbox"), value: stats.unread, cls: "bg-blue-500/15 text-blue-500" },
    { icon: CheckCircle2, label: t("آخر 24س", "Last 24h"), value: stats.last24h, cls: "bg-green-500/15 text-green-500" },
    { icon: AlertTriangle, label: t("فشل", "Failed"), value: stats.failed, cls: "bg-red-500/15 text-red-500" },
  ]

  return (
    <AppLayout title={t("نظرة عامة", "Overview")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("لوحة تحكم المنصة", "Platform Control Plane")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("إشعارات، بريد، تيليجرام، و2FA لكل التطبيقات", "Notifications, email, Telegram & 2FA across every app")}
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-500/15 text-green-600">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse me-2" />
            {t("نشط", "Operational")}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.cls}`}>
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold tabular-nums">{c.value}</p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service health */}
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            to="/platform/mailer"
            icon={<Mail className="h-5 w-5" />}
            title={t("المراسل", "Mailer")}
            ready={mailerReady}
            stat={`${stats.byChannel.email} ${t("رسائل", "messages")}`}
          />
          <ServiceCard
            to="/platform/telefather"
            icon={<MessageCircle className="h-5 w-5" />}
            title={t("تيليفاذر", "Telefather")}
            ready={tgReady}
            stat={`${stats.byChannel.telegram} ${t("رسائل", "messages")}`}
          />
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">{t("إجراءات سريعة", "Quick Actions")}</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-11 rounded-xl justify-start">
              <Link to="/platform/notifications"><History className="h-4 w-4 me-2" /> {t("سجل التدقيق", "Audit log")}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl justify-start">
              <Link to="/platform/twofa"><ShieldCheck className="h-4 w-4 me-2" /> {t("اختبار 2FA", "Test 2FA")}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl justify-start">
              <Link to="/platform/mailer"><Mail className="h-4 w-4 me-2" /> {t("إعداد البريد", "Configure email")}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl justify-start">
              <Link to="/platform/telefather"><MessageCircle className="h-4 w-4 me-2" /> {t("إعداد تيليجرام", "Configure Telegram")}</Link>
            </Button>
          </div>
        </div>

        {/* Recent */}
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{t("آخر الأحداث", "Latest events")}</h3>
            <Link to="/platform/notifications" className="text-xs text-primary font-medium hover:underline">
              {t("عرض الكل", "View all")}
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t("لا توجد أحداث بعد", "No events yet")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {recent.map((e) => (
                <li key={e.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-[10px]">{e.app}</Badge>
                      <Badge variant="outline" className="capitalize text-[10px]">{e.channel}</Badge>
                      <p className="text-sm font-medium truncate">{e.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{e.body}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function ServiceCard({ to, icon, title, ready, stat }: { to: string; icon: React.ReactNode; title: string; ready: boolean; stat: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border/60 bg-card p-5 flex items-center gap-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ready ? "bg-green-500/15 text-green-500" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{stat}</p>
      </div>
      {ready
        ? <Badge className="bg-green-500/15 text-green-600 border-green-500/30">{t("جاهز", "Ready")}</Badge>
        : <Badge variant="outline" className="text-yellow-600 border-yellow-500/40">{t("غير مهيأ", "Setup needed")}</Badge>}
    </Link>
  )
}
