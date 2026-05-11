import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import {
  
  IconSend,
  IconUsers,
  IconPlus,
  IconTrash,
  IconEye,
  IconCircleCheck,
  IconCircleDot,
  IconTrendingUp,
  IconClick,
  IconChevronRight,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const mockSubscribers = [
  { id: 1, email: "ahmed@example.com", name: "أحمد محمد", subscribedDate: "2025-12-01", status: "active" },
  { id: 2, email: "fatima@example.com", name: "فاطمة علي", subscribedDate: "2025-12-05", status: "active" },
  { id: 3, email: "khaled@example.com", name: "خالد عبدالله", subscribedDate: "2025-12-10", status: "active" },
  { id: 4, email: "sara@example.com", name: "سارة أحمد", subscribedDate: "2025-12-15", status: "unsubscribed" },
  { id: 5, email: "omar@example.com", name: "عمر الزهراني", subscribedDate: "2025-12-17", status: "active" },
]

const mockNewsletters = [
  {
    id: 1,
    subject: "عروض خاصة على المنتجات العضوية",
    sentDate: "2025-12-15",
    sentTime: "10:00",
    recipients: 150,
    status: "sent",
    openRate: 68,
    clickRate: 24,
  },
  {
    id: 2,
    subject: "تحديثات جديدة في منتجاتنا",
    sentDate: "2025-12-10",
    sentTime: "14:30",
    recipients: 145,
    status: "sent",
    openRate: 72,
    clickRate: 28,
  },
  {
    id: 3,
    subject: "نشرة شهرية - ديسمبر 2025",
    sentDate: "2025-12-01",
    sentTime: "09:00",
    recipients: 140,
    status: "sent",
    openRate: 65,
    clickRate: 22,
  },
]

export default function NewsletterPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState("all")
  const [emailData, setEmailData] = useState({ subject: "", content: "", previewText: "" })
  const [smtpConfig, setSmtpConfig] = useState({
    host: "", port: "587", encryption: "tls", username: "", password: ""
  })
  const [activeTab, setActiveTab] = useState<"subscribers" | "history">("subscribers")

  const activeSubscribers = mockSubscribers.filter((s) => s.status === "active").length
  const avgOpenRate = Math.round(mockNewsletters.reduce((s, n) => s + n.openRate, 0) / mockNewsletters.length)
  const avgClickRate = Math.round(mockNewsletters.reduce((s, n) => s + n.clickRate, 0) / mockNewsletters.length)

  const handleSendNewsletter = () => {
    if (!emailData.subject || !emailData.content) {
      alert(t("يرجى ملء جميع الحقول المطلوبة", "Please fill in all required fields"))
      return
    }
    // Do not log smtpConfig — it contains credentials. In production, send via a server-side endpoint.
    console.log("Send newsletter:", { subject: emailData.subject, recipients: selectedRecipients.length, host: smtpConfig.host })
    alert(t("تم إرسال النشرة البريدية بنجاح!", "Newsletter sent successfully!"))
    setIsComposeOpen(false)
    setEmailData({ subject: "", content: "", previewText: "" })
  }

  const handleDeleteSubscriber = (id: number) => {
    if (confirm(t("هل أنت متأكد من حذف هذا المشترك؟", "Are you sure you want to delete this subscriber?"))) {
      console.log("Delete subscriber:", id)
    }
  }

  return (
    <AppLayout title={t("النشرة البريدية", "Newsletter")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("إدارة النشرة البريدية", "Manage Newsletter")}
            </h1>
            <p className="text-muted-foreground mt-1.5">
              {t(
                "إرسال النشرات البريدية وإدارة المشتركين",
                "Send newsletters and manage subscribers"
              )}
            </p>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0">
                <IconPlus className="h-4 w-4" />
                {t("إنشاء نشرة جديدة", "Create Newsletter")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t("إنشاء نشرة بريدية جديدة", "Create New Newsletter")}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Campaign settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("إعدادات الحملة", "Campaign Settings")}
                  </h3>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label>
                        {t("الموضوع", "Subject")}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Input
                        placeholder={t("موضوع النشرة البريدية", "Newsletter subject")}
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("نص المعاينة", "Preview Text")}</Label>
                      <Input
                        placeholder={t("نص قصير يظهر في صندوق البريد", "Short preview text shown in inbox")}
                        value={emailData.previewText}
                        onChange={(e) => setEmailData({ ...emailData, previewText: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("المستلمون", "Recipients")}</Label>
                      <Select value={selectedRecipients} onValueChange={setSelectedRecipients}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("جميع المشتركين", "All Subscribers")} ({mockSubscribers.length})
                          </SelectItem>
                          <SelectItem value="active">
                            {t("المشتركين النشطين", "Active Subscribers")} ({activeSubscribers})
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>
                        {t("المحتوى", "Content")}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Textarea
                        placeholder={t("اكتب محتوى النشرة البريدية هنا...", "Write newsletter content here...")}
                        rows={8}
                        value={emailData.content}
                        onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SMTP Settings */}
                <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/30">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("إعدادات SMTP", "SMTP Settings")}
                  </h3>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label>{t("خادم SMTP", "SMTP Server")}</Label>
                      <Input
                        value={smtpConfig.host}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                        placeholder="smtp.example.com"
                        className="h-10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>{t("المنفذ", "Port")}</Label>
                        <Input
                          value={smtpConfig.port}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                          placeholder="587"
                          className="h-10"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("التشفير", "Encryption")}</Label>
                        <Select
                          value={smtpConfig.encryption}
                          onValueChange={(v) => setSmtpConfig({ ...smtpConfig, encryption: v })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">{t("بدون", "None")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>{t("اسم المستخدم", "Username")}</Label>
                        <Input
                          value={smtpConfig.username}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                          placeholder="user@example.com"
                          className="h-10"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("كلمة المرور", "Password")}</Label>
                        <Input
                          type="password"
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                          placeholder="••••••••"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button variant="outline" className="gap-2">
                  <IconEye className="h-4 w-4" />
                  {t("معاينة", "Preview")}
                </Button>
                <Button onClick={handleSendNewsletter} className="gap-2">
                  <IconSend className="h-4 w-4" />
                  {t("إرسال", "Send")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("إجمالي المشتركين", "Total Subscribers"), value: mockSubscribers.length, icon: IconUsers, sub: `${activeSubscribers} ${t("نشط", "active")}` },
            { label: t("النشرات المرسلة", "Newsletters Sent"), value: mockNewsletters.length, icon: IconSend, sub: t("هذا الشهر", "This month") },
            { label: t("معدل الفتح", "Avg. Open Rate"), value: `${avgOpenRate}%`, icon: IconTrendingUp, sub: t("متوسط", "Average") },
            { label: t("معدل النقر", "Avg. Click Rate"), value: `${avgClickRate}%`, icon: IconClick, sub: t("متوسط", "Average") },
          ].map((stat, i) => (
            <Card key={i} className="shadow-none border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border/60">
          {[
            { key: "subscribers" as const, label: t("المشتركون", "Subscribers"), count: mockSubscribers.length },
            { key: "history" as const, label: t("سجل النشرات", "History"), count: mockNewsletters.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Subscribers tab */}
        {activeTab === "subscribers" && (
          <div className="space-y-2">
            {mockSubscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {subscriber.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{subscriber.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                        subscriber.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {subscriber.status === "active" ? (
                        <IconCircleCheck className="h-3 w-3" />
                      ) : (
                        <IconCircleDot className="h-3 w-3" />
                      )}
                      {subscriber.status === "active"
                        ? t("نشط", "Active")
                        : t("غير مشترك", "Unsubscribed")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{subscriber.email}</p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {subscriber.subscribedDate}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* History tab */}
        {activeTab === "history" && (
          <div className="space-y-2">
            {mockNewsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm line-clamp-1">{newsletter.subject}</span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 shrink-0">
                        <IconCircleCheck className="h-3 w-3" />
                        {t("مُرسل", "Sent")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {newsletter.sentDate} — {newsletter.sentTime} • {newsletter.recipients} {t("مستلم", "recipients")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs text-muted-foreground">{t("فتح", "Open")}</div>
                        <div className="flex-1 w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${newsletter.openRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{newsletter.openRate}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs text-muted-foreground">{t("نقر", "Click")}</div>
                        <div className="flex-1 w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${newsletter.clickRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{newsletter.clickRate}%</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs shrink-0">
                    {t("عرض", "View")}
                    <IconChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}