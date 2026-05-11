// ============================================================
// faq-admin.tsx — Enhanced FAQ Management Page
// ============================================================
import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { faqs } from "@/data/faqs"
import {
  IconHelp,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconGripVertical,
  
  IconEye,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingFAQ, setEditingFAQ] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.q?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleDelete = (index: number) => {
    if (
      confirm(
        t("هل أنت متأكد من حذف هذا السؤال؟", "Are you sure you want to delete this question?")
      )
    ) {
      console.log("Delete FAQ at index:", index)
    }
  }

  const handleEdit = (faq: any) => {
    setEditingFAQ(faq)
    setFormData({ ...faq })
  }

  const handleSave = () => {
    console.log("Save FAQ:", formData)
    setEditingFAQ(null)
    setIsAddDialogOpen(false)
    setFormData({})
  }

  const FAQForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>{t("السؤال", "Question")}</Label>
        <Textarea
          value={data.q || ""}
          onChange={(e) => onChange({ ...data, q: e.target.value })}
          placeholder={t("أدخل السؤال", "Enter the question")}
          rows={2}
          className="resize-none"
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("الإجابة", "Answer")}</Label>
        <Textarea
          value={data.a || ""}
          onChange={(e) => onChange({ ...data, a: e.target.value })}
          placeholder={t("أدخل الإجابة", "Enter the answer")}
          rows={5}
          className="resize-none"
        />
      </div>
    </div>
  )

  return (
    <AppLayout title={t("الأسئلة الشائعة", "FAQ")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("إدارة الأسئلة الشائعة", "Manage FAQ")}
            </h1>
            <p className="text-muted-foreground mt-1.5">
              {t(
                "إضافة وتعديل وحذف الأسئلة الشائعة",
                "Add, edit, and delete frequently asked questions"
              )}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0">
                <IconPlus className="h-4 w-4" />
                {t("إضافة سؤال", "Add Question")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t("إضافة سؤال جديد", "Add New Question")}
                </DialogTitle>
              </DialogHeader>
              <FAQForm data={formData} onChange={setFormData} />
              <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => { setIsAddDialogOpen(false); setFormData({}) }}
                >
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <IconHelp className="h-4 w-4" />
                  {t("إضافة السؤال", "Add Question")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: t("إجمالي الأسئلة", "Total Questions"), value: faqs.length, icon: IconHelp },
            { label: t("نتائج البحث", "Search Results"), value: filteredFAQs.length, icon: IconSearch },
            { label: t("معاينة", "Preview"), value: t("3 أسئلة", "3 Questions"), icon: IconEye },
          ].map((stat, i) => (
            <Card key={i} className="shadow-none border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("بحث عن سؤال...", "Search questions...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10"
          />
        </div>

        {/* FAQ list */}
        <div className="space-y-2">
          {filteredFAQs.map((faq, index) => (
            <Card
              key={index}
              className="shadow-none border-border/60 hover:border-primary/30 transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Drag handle + number */}
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <button className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab">
                      <IconGripVertical className="h-4 w-4" />
                    </button>
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1.5 leading-snug">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.a}</p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(faq)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <Card className="p-16 text-center border-dashed border-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <IconHelp className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("لا توجد أسئلة", "No questions found")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("لم يتم العثور على أسئلة تطابق البحث", "No questions match your search")}
            </p>
          </Card>
        )}

        {/* Live preview */}
        <Card className="shadow-none border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IconEye className="h-4 w-4 text-muted-foreground" />
              {t("معاينة الموقع", "Live Preview")}
              <Badge variant="outline" className="text-xs ms-auto">
                {t("أول 3 أسئلة", "First 3 questions")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="space-y-2 border-none">
              {faqs.slice(0, 3).map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-border/50 bg-muted/20 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-4 text-sm font-semibold text-foreground hover:text-primary py-3 text-start hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="ms-8 text-muted-foreground text-sm border-s-2 border-primary/20 ps-3">
                      {faq.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {editingFAQ && (
        <Dialog open={!!editingFAQ} onOpenChange={() => setEditingFAQ(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {t("تعديل السؤال", "Edit Question")}
              </DialogTitle>
            </DialogHeader>
            <FAQForm data={formData} onChange={setFormData} />
            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" onClick={() => setEditingFAQ(null)}>
                {t("إلغاء", "Cancel")}
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <IconEdit className="h-4 w-4" />
                {t("حفظ التعديلات", "Save Changes")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}

export default FAQPage