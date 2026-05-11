import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import {
  IconMessage,
  IconMail,
  IconPhone,
  IconClock,
  IconTrash,
  IconCheck,
  IconEye,
  IconMailForward,
  IconSearch,
  IconInbox,
  IconCircleCheck,
  IconCircleDot,
  
  IconChevronDown,
  IconChevronUp,
  IconSend,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const mockMessages = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966551234567",
    subject: "استفسار عن المنتجات",
    message: "السلام عليكم، أرغب في الاستفسار عن منتجات الزيوت العضوية المتوفرة لديكم وأسعارها والكميات المتاحة للشراء بالجملة.",
    date: "2025-12-18",
    time: "10:30",
    status: "new",
    priority: "high",
  },
  {
    id: 2,
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966559876543",
    subject: "طلب عرض سعر",
    message: "مرحباً، أود الحصول على عرض سعر لطلب تجاري بكميات كبيرة من منتجات البهارات والتوابل.",
    date: "2025-12-18",
    time: "09:15",
    status: "read",
    priority: "medium",
  },
  {
    id: 3,
    name: "خالد عبدالله",
    email: "khaled@example.com",
    phone: "+966551112233",
    subject: "شكوى عن التوصيل",
    message: "لم أستلم طلبي في الوقت المحدد، مضى عليه أسبوعان ولم يصلني أي تحديث. أرجو المتابعة العاجلة.",
    date: "2025-12-17",
    time: "16:45",
    status: "replied",
    priority: "high",
  },
  {
    id: 4,
    name: "سارة أحمد",
    email: "sara@example.com",
    phone: "+966554445566",
    subject: "استفسار عام",
    message: "هل لديكم فروع في مدينة الرياض؟ وهل يمكن الشراء مباشرة من الفرع؟",
    date: "2025-12-17",
    time: "14:20",
    status: "new",
    priority: "low",
  },
  {
    id: 5,
    name: "محمد الغامدي",
    email: "mghamdi@example.com",
    phone: "+966557778899",
    subject: "طلب شراكة تجارية",
    message: "نحن شركة توزيع غذائي ونرغب في التباحث حول إمكانية الشراكة التجارية وتوزيع منتجاتكم في المنطقة الشرقية.",
    date: "2025-12-16",
    time: "11:00",
    status: "read",
    priority: "high",
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [viewingMessage, setViewingMessage] = useState<any>(null)
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || message.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || message.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: mockMessages.length,
    new: mockMessages.filter((m) => m.status === "new").length,
    read: mockMessages.filter((m) => m.status === "read").length,
    replied: mockMessages.filter((m) => m.status === "replied").length,
  }

  const handleDelete = (id: number) => {
    if (
      confirm(t("هل أنت متأكد من حذف هذه الرسالة؟", "Are you sure you want to delete this message?"))
    ) {
      console.log("Delete message:", id)
    }
  }

  const handleReply = (message: any) => {
    setReplyingTo(message)
    setReplyText("")
  }

  const handleSendReply = () => {
    console.log("Send reply to:", replyingTo, "text:", replyText)
    setReplyingTo(null)
    setReplyText("")
  }

  const statusConfig: Record<string, { label: string; labelEn: string; icon: any; className: string }> = {
    new: {
      label: "جديد",
      labelEn: "New",
      icon: IconCircleDot,
      className: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    },
    read: {
      label: "مقروء",
      labelEn: "Read",
      icon: IconEye,
      className: "bg-muted text-muted-foreground border-border",
    },
    replied: {
      label: "تم الرد",
      labelEn: "Replied",
      icon: IconCircleCheck,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
    },
  }

  const priorityConfig: Record<string, { label: string; labelEn: string; className: string }> = {
    high: {
      label: "عالي",
      labelEn: "High",
      className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
    },
    medium: {
      label: "متوسط",
      labelEn: "Medium",
      className: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
    },
    low: {
      label: "منخفض",
      labelEn: "Low",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
    },
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status]
    if (!cfg) return null
    const Icon = cfg.icon
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}>
        <Icon className="h-3 w-3" />
        {t(cfg.label, cfg.labelEn)}
      </span>
    )
  }

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const cfg = priorityConfig[priority]
    if (!cfg) return null
    return (
      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}>
        {t(cfg.label, cfg.labelEn)}
      </span>
    )
  }

  return (
    <AppLayout title={t("الرسائل", "Messages")}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("إدارة الرسائل", "Manage Messages")}
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {t(
              "عرض والرد على الرسائل الواردة من الزوار",
              "View and reply to incoming messages from visitors"
            )}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("الكل", "All"), value: stats.total, icon: IconInbox, active: selectedStatus === "all" },
            { label: t("جديد", "New"), value: stats.new, icon: IconCircleDot, active: selectedStatus === "new" },
            { label: t("مقروء", "Read"), value: stats.read, icon: IconEye, active: selectedStatus === "read" },
            { label: t("تم الرد", "Replied"), value: stats.replied, icon: IconCircleCheck, active: selectedStatus === "replied" },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={() => setSelectedStatus(["all", "new", "read", "replied"][i])}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                stat.active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 bg-card hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${stat.active ? "text-primary" : "text-muted-foreground"}`}>
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("بحث في الرسائل...", "Search messages...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-10"
            />
          </div>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-[160px] h-10">
              <SelectValue placeholder={t("الأولوية", "Priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("كل الأولويات", "All Priorities")}</SelectItem>
              <SelectItem value="high">{t("عالي", "High")}</SelectItem>
              <SelectItem value="medium">{t("متوسط", "Medium")}</SelectItem>
              <SelectItem value="low">{t("منخفض", "Low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages list */}
        <div className="space-y-2">
          {filteredMessages.map((message) => {
            const isExpanded = expandedId === message.id
            return (
              <Card
                key={message.id}
                className={`shadow-none transition-all duration-200 border-border/60 ${
                  message.status === "new" ? "border-l-4 border-l-blue-500" :
                  message.status === "replied" ? "border-l-4 border-l-emerald-500" : ""
                } hover:shadow-sm`}
              >
                <CardContent className="p-0">
                  {/* Collapsed header */}
                  <button
                    className="w-full text-left p-4 flex items-start gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : message.id)}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {message.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{message.name}</span>
                        <StatusBadge status={message.status} />
                        <PriorityBadge priority={message.priority} />
                      </div>
                      <p className="font-medium text-sm text-foreground mb-0.5">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{message.message}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {message.date}
                      </span>
                      {isExpanded ? (
                        <IconChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/40">
                      <div className="mt-4 space-y-4">
                        {/* Contact info */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <IconMail className="h-3.5 w-3.5" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1.5">
                              <IconPhone className="h-3.5 w-3.5" />
                              {message.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <IconClock className="h-3.5 w-3.5" />
                            {message.date} — {message.time}
                          </span>
                        </div>

                        {/* Full message */}
                        <div className="p-4 rounded-xl bg-muted/50 text-sm leading-relaxed">
                          {message.message}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {message.status !== "replied" && (
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => handleReply(message)}
                            >
                              <IconMailForward className="h-3.5 w-3.5" />
                              {t("رد على الرسالة", "Reply")}
                            </Button>
                          )}
                          {message.status === "new" && (
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <IconCheck className="h-3.5 w-3.5" />
                              {t("تعليم مقروء", "Mark Read")}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-destructive hover:text-destructive ml-auto"
                            onClick={() => handleDelete(message.id)}
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                            {t("حذف", "Delete")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredMessages.length === 0 && (
          <Card className="p-16 text-center border-dashed border-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <IconMessage className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("لا توجد رسائل", "No messages found")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("لم يتم العثور على رسائل تطابق البحث", "No messages match your search")}
            </p>
          </Card>
        )}
      </div>

      {/* Reply Dialog */}
      {replyingTo && (
        <Dialog open={!!replyingTo} onOpenChange={() => setReplyingTo(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("رد على الرسالة", "Reply to Message")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Original message preview */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border/60">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {t("الرسالة الأصلية من", "Original message from")} {replyingTo.name}
                </p>
                <p className="text-sm line-clamp-3">{replyingTo.message}</p>
              </div>

              <div className="grid gap-2">
                <Label>{t("إلى", "To")}</Label>
                <Input value={replyingTo.email} readOnly className="bg-muted/30" />
              </div>
              <div className="grid gap-2">
                <Label>{t("الموضوع", "Subject")}</Label>
                <Input defaultValue={`RE: ${replyingTo.subject}`} />
              </div>
              <div className="grid gap-2">
                <Label>{t("الرد", "Reply")}</Label>
                <Textarea
                  placeholder={t("اكتب ردك هنا...", "Write your reply here...")}
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1 border-t border-border/40">
                <Button variant="outline" onClick={() => setReplyingTo(null)}>
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button
                  onClick={handleSendReply}
                  className="gap-2"
                  disabled={!replyText.trim()}
                >
                  <IconSend className="h-4 w-4" />
                  {t("إرسال الرد", "Send Reply")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}