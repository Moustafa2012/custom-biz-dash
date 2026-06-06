import { useMemo, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Bell, Search, Mail, MessageCircle, Inbox, CheckCheck, Trash2, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"
import { t } from "@/lib/translations"
import { useNotifications, useNotificationStats } from "@/lib/notifications/hooks"
import type { AppId, Channel, DeliveryStatus, Severity } from "@/lib/notifications"

const APP_OPTIONS: { value: "all" | AppId; label: string }[] = [
  { value: "all", label: "All apps" },
  { value: "platform", label: "Platform" },
  { value: "site-manager", label: "Site Manager" },
  { value: "synex", label: "Synex" },
]
const CHANNEL_OPTIONS: { value: "all" | Channel; label: string }[] = [
  { value: "all", label: "All channels" },
  { value: "inapp", label: "In-app" },
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
]
const STATUS_OPTIONS: { value: "all" | DeliveryStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "sent", label: "Sent" },
  { value: "queued", label: "Queued" },
  { value: "failed", label: "Failed" },
  { value: "skipped", label: "Skipped" },
]

function StatusBadge({ status }: { status: DeliveryStatus }) {
  const map: Record<DeliveryStatus, { icon: React.ReactNode; cls: string; label: string }> = {
    sent: { icon: <CheckCircle2 className="h-3 w-3" />, cls: "bg-green-500/15 text-green-500", label: t("تم الإرسال", "Sent") },
    queued: { icon: <Clock className="h-3 w-3" />, cls: "bg-blue-500/15 text-blue-500", label: t("في الانتظار", "Queued") },
    failed: { icon: <XCircle className="h-3 w-3" />, cls: "bg-red-500/15 text-red-500", label: t("فشل", "Failed") },
    skipped: { icon: <AlertTriangle className="h-3 w-3" />, cls: "bg-yellow-500/15 text-yellow-600", label: t("تخطي", "Skipped") },
  }
  const m = map[status]
  return <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${m.cls}`}>{m.icon}{m.label}</span>
}

function ChannelIcon({ ch }: { ch: Channel }) {
  if (ch === "email") return <Mail className="h-3.5 w-3.5" />
  if (ch === "telegram") return <MessageCircle className="h-3.5 w-3.5" />
  return <Bell className="h-3.5 w-3.5" />
}

function severityClass(s: Severity) {
  switch (s) {
    case "error": return "bg-red-500/10 text-red-500"
    case "warning": return "bg-yellow-500/10 text-yellow-600"
    case "success": return "bg-green-500/10 text-green-500"
    default: return "bg-primary/10 text-primary"
  }
}

export default function NotificationsAuditPage() {
  const { events, markAllRead, clear } = useNotifications()
  const stats = useNotificationStats()
  const [q, setQ] = useState("")
  const [app, setApp] = useState<"all" | AppId>("all")
  const [channel, setChannel] = useState<"all" | Channel>("all")
  const [status, setStatus] = useState<"all" | DeliveryStatus>("all")

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return events.filter((e) => {
      if (app !== "all" && e.app !== app) return false
      if (channel !== "all" && e.channel !== channel) return false
      if (status !== "all" && e.status !== status) return false
      if (term) {
        const hay = `${e.title} ${e.body} ${e.recipient ?? ""}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
  }, [events, q, app, channel, status])

  return (
    <AppLayout title={t("الإشعارات", "Notifications")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {t("مركز الإشعارات", "Notifications Center")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("سجل موحد لكل الإشعارات عبر التطبيقات", "Unified audit log across every app")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => markAllRead()} disabled={stats.unread === 0}>
              <CheckCheck className="h-4 w-4 me-1.5" /> {t("تعليم الكل", "Mark all read")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => clear()} disabled={events.length === 0}>
              <Trash2 className="h-4 w-4 me-1.5" /> {t("مسح الكل", "Clear all")}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: t("الإجمالي", "Total"), value: stats.total, cls: "bg-primary/15 text-primary" },
            { label: t("غير مقروءة", "Unread"), value: stats.unread, cls: "bg-blue-500/15 text-blue-500" },
            { label: t("آخر 24 ساعة", "Last 24h"), value: stats.last24h, cls: "bg-green-500/15 text-green-500" },
            { label: t("فشل", "Failed"), value: stats.failed, cls: "bg-red-500/15 text-red-500" },
            { label: t("بريد + تيليجرام", "Email + Telegram"), value: stats.byChannel.email + stats.byChannel.telegram, cls: "bg-purple-500/15 text-purple-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-2xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <Tabs value={app} onValueChange={(v) => setApp(v as "all" | AppId)} className="mb-4">
            <TabsList>
              {APP_OPTIONS.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("بحث...", "Search title, body or recipient...")}
                className="pl-9"
              />
            </div>
            <Select value={channel} onValueChange={(v) => setChannel(v as "all" | Channel)}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANNEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as "all" | DeliveryStatus)}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{t("التطبيق", "App")}</TableHead>
                <TableHead className="w-[100px]">{t("القناة", "Channel")}</TableHead>
                <TableHead>{t("الرسالة", "Message")}</TableHead>
                <TableHead className="w-[200px]">{t("المستلم", "Recipient")}</TableHead>
                <TableHead className="w-[110px]">{t("الحالة", "Status")}</TableHead>
                <TableHead className="w-[110px] text-right">{t("الوقت", "Time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">{t("لا توجد سجلات", "No events match these filters")}</p>
                  </TableCell>
                </TableRow>
              ) : filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px]">{e.app}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs"><ChannelIcon ch={e.channel} />{e.channel}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${severityClass(e.severity)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{e.body}</p>
                        {e.error && <p className="text-xs text-red-500 mt-0.5">{e.error}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate">{e.recipient ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                    {new Date(e.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  )
}
