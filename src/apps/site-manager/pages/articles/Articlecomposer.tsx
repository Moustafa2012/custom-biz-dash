import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  IconNews,
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconClock,
  IconLink,
  IconTag,
  IconUser,
  IconBook,
  IconBuilding,
  IconPhoto,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

interface ArticleFormData {
  title?: string
  category?: string
  author?: string
  desc?: string
  fullContent?: string
  publisher?: string
  journal?: string
  doi?: string
  publishDate?: string
  readTime?: string
  heroImage?: string
  tags?: string[]
  featured?: boolean
  date?: string
  authorImage?: string
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-sm font-semibold tracking-wide uppercase text-foreground/80">
            {title}
          </span>
        </div>
        <span className="text-muted-foreground">
          {open ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {open && <div className="px-5 pb-5 pt-1 space-y-4 border-t border-border/40">{children}</div>}
    </div>
  )
}

function FieldGroup({ children, cols = 1 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid gap-4 ${cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
      {children}
    </div>
  )
}

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
      </Label>
      {children}
    </div>
  )
}

function CompletionBar({ formData }: { formData: ArticleFormData }) {
  const fields = [
    formData.title,
    formData.category,
    formData.author,
    formData.desc,
    formData.fullContent,
    formData.publisher,
    formData.publishDate,
  ]
  const filled = fields.filter(Boolean).length
  const pct = Math.round((filled / fields.length) * 100)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
        {pct}% {t("مكتمل", "complete")}
      </span>
    </div>
  )
}

export default function ArticleComposerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isEdit = !!location.state?.article
  const titleRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ArticleFormData>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (location.state?.article) {
      setFormData(location.state.article)
    }
  }, [location.state])

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const update = (patch: Partial<ArticleFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  const handleSave = () => {
    console.log("Save article:", formData)
    setSaved(true)
    setTimeout(() => {
      navigate("/site-manager/articles")
    }, 800)
  }

  const handleCancel = () => navigate("/site-manager/articles")

  const pageTitle = isEdit
    ? t("تعديل المقال", "Edit Article")
    : t("إنشاء مقال جديد", "New Article")

  return (
    <AppLayout title={pageTitle}>
      <div className="pb-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1.5 mt-0.5">
          <IconArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {t("رجوع", "Back")}
        </Button>
      </div>
      <div className="max-w-3xl mx-auto space-y-5 pb-10">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div>
              <div className="flex items-center gap-2 text-2xl text-muted-foreground mb-0.5 bg-emerald-500 rounded-lg p-2">
                <span className="text-foreground font-medium">
                  {isEdit && formData.title
                    ? formData.title
                    : isEdit
                    ? t("تعديل", "Edit")
                    : t("جديد", "New")}
                </span>
              </div>
              <h1 className="pt-4 text-bold font-bold leading-tight">{pageTitle}</h1>
            </div>
          </div>

          {/* Status pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              formData.featured
                ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            }`}
          >
            {formData.featured ? (
              <IconStarFilled className="h-3 w-3" />
            ) : (
              <IconStar className="h-3 w-3" />
            )}
            {formData.featured
              ? t("مميز", "Featured")
              : t("عادي", "Standard")}
          </div>
        </div>

        {/* ── Completion ── */}
        <CompletionBar formData={formData} />

        {/* ── Hero title strip ── */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          {formData.heroImage && (
            <div className="relative h-36 overflow-hidden bg-muted">
              <img
                src={formData.heroImage}
                alt=""
                className="w-full h-full object-cover opacity-80"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
            </div>
          )}
          <div className="p-5">
            <input
              ref={titleRef}
              value={formData.title || ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder={t("عنوان المقال…", "Article title…")}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground"
            />
            <textarea
              value={formData.desc || ""}
              onChange={(e) => update({ desc: e.target.value })}
              placeholder={t("ملخص قصير…", "Short summary…")}
              rows={2}
              className="w-full mt-2 text-sm text-muted-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 leading-relaxed"
            />
          </div>
        </div>

        {/* ── Sections ── */}
        <CollapsibleSection
          title={t("المحتوى", "Content")}
          icon={<IconBook className="h-4 w-4" />}
        >
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("المحتوى الكامل", "Full Content")}
            </Label>
            <Textarea
              value={formData.fullContent || ""}
              onChange={(e) => update({ fullContent: e.target.value })}
              placeholder={t("اكتب المحتوى هنا…", "Write content here…")}
              rows={10}
              className="resize-none text-sm leading-relaxed font-mono"
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={t("التصنيف والتأليف", "Classification & Authorship")}
          icon={<IconUser className="h-4 w-4" />}
        >
          <FieldGroup cols={2}>
            <Field label={t("الفئة", "Category")} icon={<IconTag className="h-3.5 w-3.5" />}>
              <Input
                value={formData.category || ""}
                onChange={(e) => update({ category: e.target.value })}
                placeholder={t("صحة القلب، التغذية…", "Heart Health, Nutrition…")}
                className="h-9 text-sm"
              />
            </Field>
            <Field label={t("المؤلف", "Author")} icon={<IconUser className="h-3.5 w-3.5" />}>
              <Input
                value={formData.author || ""}
                onChange={(e) => update({ author: e.target.value })}
                placeholder={t("اسم المؤلف", "Author name")}
                className="h-9 text-sm"
              />
            </Field>
          </FieldGroup>
          <FieldGroup cols={2}>
            <Field label={t("الناشر", "Publisher")} icon={<IconBuilding className="h-3.5 w-3.5" />}>
              <Input
                value={formData.publisher || ""}
                onChange={(e) => update({ publisher: e.target.value })}
                placeholder={t("اسم الناشر", "Publisher name")}
                className="h-9 text-sm"
              />
            </Field>
            <Field label={t("المجلة", "Journal")} icon={<IconBook className="h-3.5 w-3.5" />}>
              <Input
                value={formData.journal || ""}
                onChange={(e) => update({ journal: e.target.value })}
                placeholder={t("اسم المجلة", "Journal name")}
                className="h-9 text-sm"
              />
            </Field>
          </FieldGroup>
        </CollapsibleSection>

        <CollapsibleSection
          title={t("النشر والميتاداتا", "Publishing & Metadata")}
          icon={<IconCalendar className="h-4 w-4" />}
        >
          <FieldGroup cols={3}>
            <Field label="DOI" icon={<IconLink className="h-3.5 w-3.5" />}>
              <Input
                value={formData.doi || ""}
                onChange={(e) => update({ doi: e.target.value })}
                placeholder="10.1093/cvr/…"
                className="h-9 text-sm font-mono"
              />
            </Field>
            <Field
              label={t("تاريخ النشر", "Publish Date")}
              icon={<IconCalendar className="h-3.5 w-3.5" />}
            >
              <Input
                type="date"
                value={formData.publishDate || ""}
                onChange={(e) => update({ publishDate: e.target.value })}
                className="h-9 text-sm"
              />
            </Field>
            <Field
              label={t("وقت القراءة", "Read Time")}
              icon={<IconClock className="h-3.5 w-3.5" />}
            >
              <Input
                value={formData.readTime || ""}
                onChange={(e) => update({ readTime: e.target.value })}
                placeholder="8 min"
                className="h-9 text-sm"
              />
            </Field>
          </FieldGroup>
          <Field
            label={t("رابط صورة الغلاف", "Hero Image URL")}
            icon={<IconPhoto className="h-3.5 w-3.5" />}
          >
            <Input
              value={formData.heroImage || ""}
              onChange={(e) => update({ heroImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="h-9 text-sm font-mono"
            />
          </Field>
          <Field
            label={t("العلامات (مفصولة بفاصلة)", "Tags (comma-separated)")}
            icon={<IconTag className="h-3.5 w-3.5" />}
          >
            <div className="space-y-2">
              <Input
                value={formData.tags?.join(", ") || ""}
                onChange={(e) =>
                  update({ tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                }
                placeholder={t("صحة، تغذية، أبحاث", "health, nutrition, research")}
                className="h-9 text-sm"
              />
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) =>
                    tag ? (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        <IconTag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </Field>
        </CollapsibleSection>

        {/* ── Featured toggle ── */}
        <Button
          type="button"
          className={`w-full flex items-center gap-4 p-8 rounded-lg border transition-all text-start cursor-pointer ${
            formData.featured
              ? "border-amber-500/50 bg-amber-500/5"
              : "border-border/60 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex-1">
            <p className="text-foreground text-base font-semibold">
              {t("مقال مميز", "Featured Article")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("يظهر في أعلى قسم المقالات", "Appears at the top of the articles section")}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => update({ featured: checked })}
              size="default"
            />
          </div>
        </Button>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <IconEye className="h-4 w-4" />
            {t("معاينة", "Preview")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              {t("إلغاء", "Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title}
              className="gap-2 min-w-[130px]"
            >
              {saved ? (
                <>
                  <IconCheck className="h-4 w-4" />
                  {t("تم!", "Done!")}
                </>
              ) : isEdit ? (
                <>
                  <IconNews className="h-4 w-4" />
                  {t("حفظ التعديلات", "Save Changes")}
                </>
              ) : (
                <>
                  <IconNews className="h-4 w-4" />
                  {t("نشر المقال", "Publish Article")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}