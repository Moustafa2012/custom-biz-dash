import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Calendar, Clock, User, BookOpen, ExternalLink, Tag, Share2, Bookmark, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import type { Article } from "@/types"

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border/30">
      <div
        className="h-full bg-primary transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 end-8 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}

export default function ArticleReader() {
  const { direction } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookmarked, setBookmarked] = useState(false)

  const article: Article | undefined = location.state?.article

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <BookOpen className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-xl font-bold">{t("المقال غير موجود", "Article not found")}</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          {t("لم يتم تمرير بيانات المقال، يرجى العودة واختيار مقال.", "No article data was provided. Please go back and select an article.")}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("رجوع", "Go Back")}
        </Button>
      </div>
    )
  }

  const BackArrow = direction === "rtl" ? ArrowRight : ArrowLeft

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.desc })
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const paragraphs = (article.fullContent || article.desc || "")
    .split("\n\n")
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <BackToTop />

      {/* Sticky nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <BackArrow className="h-4 w-4" />
            <span className="hidden sm:inline">{t("المقالات", "Articles")}</span>
          </Button>

          <div className="flex-1 min-w-0 hidden md:block">
            <p className="text-sm font-medium truncate text-center text-muted-foreground">
              {article.title}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{t("مشاركة", "Share")}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              className={`gap-1.5 ${bookmarked ? "text-primary" : "text-muted-foreground"}`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline text-xs">
                {bookmarked ? t("محفوظ", "Saved") : t("حفظ", "Save")}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      {article.heroImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        {/* Category & featured */}
        <div className="flex items-center gap-2 flex-wrap pt-8 mb-4">
          <Badge variant="secondary" className="text-xs font-semibold">
            {article.category}
          </Badge>
          {article.featured && (
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
              {t("مميز", "Featured")}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground mb-4">
          {article.title}
        </h1>

        {/* Lead */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary/40 pl-4">
          {article.desc}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-8 border-b border-border/50 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{article.author}</p>
              {article.journal && (
                <p className="text-xs text-muted-foreground">{article.journal}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary/60" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary/60" />
              {article.readTime}
            </span>
          </div>
        </div>

        {/* Article body */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {paragraphs.map((para, i) => {
            const isHeading = para.length < 80 && !para.includes(".") && i !== 0

            if (isHeading) {
              return (
                <h2
                  key={i}
                  className="text-xl font-bold mt-10 mb-4 text-foreground"
                >
                  {para}
                </h2>
              )
            }

            if (para.startsWith("•") || para.includes("\n•")) {
              const lines = para.split("\n").filter(Boolean)
              return (
                <ul key={i} className="space-y-2 my-4 ms-4">
                  {lines.map((line, li) => (
                    <li key={li} className="flex items-start gap-2 text-base text-foreground/90 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{line.replace(/^[•\-]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              )
            }

            return (
              <p key={i} className="text-base leading-relaxed text-foreground/90 mb-5">
                {para}
              </p>
            )
          })}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Citation / DOI */}
        {(article.doi || article.publisher) && (
          <div className="mt-8 p-5 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("مصدر البحث", "Source")}
            </p>
            <div className="space-y-1.5">
              {article.journal && (
                <p className="text-sm text-foreground font-medium">{article.journal}</p>
              )}
              {article.publisher && (
                <p className="text-sm text-muted-foreground">{article.publisher}</p>
              )}
              {article.doi && (
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 font-mono mt-1"
                >
                  DOI: {article.doi}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}