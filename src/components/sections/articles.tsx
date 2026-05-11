import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, ArrowRight, User, Calendar, BookOpen } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import { articles } from "@/data/articles"

export default function ArticlesSection() {
  const { direction } = useLanguage()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const ReadMoreArrow = direction === "rtl" ? ArrowLeft : ArrowRight

  const handleReadMore = (article: typeof articles[number]) => {
    navigate("/articles/read", { state: { article } })
  }

  return (
    <section ref={ref} id="articles" className="bg-transparent py-24 section-alt scroll-chapter-marker relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {t("آخر الأبحاث", "Latest Research")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("المقالات", "Scientific")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("العلمية", "Articles")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t(
              "أحدث الأبحاث المنشورة في المجلات العلمية المحكمة حول التغذية والصحة",
              "Latest research published in peer-reviewed scientific journals on nutrition and health"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <div
              key={i}
              className={`group transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${i === 0 ? "md:col-span-2" : ""}`}
              style={{ transitionDelay: `${300 + i * 120}ms` }}
            >
              <Card className="h-full bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                {article.heroImage && (
                  <div className={`relative overflow-hidden ${i === 0 ? "md:h-[300px]" : "h-[200px]"}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 end-4 z-20 flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs font-semibold">{article.category}</Badge>
                      {article.featured && (
                        <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                          {t("مميز", "Featured")}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent z-10" />
                  </div>
                )}

                <CardContent className="p-6">
                  <h3
                    className={`font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 ${i === 0 ? "text-xl md:text-2xl" : "text-lg"}`}
                  >
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm line-clamp-2">{article.desc}</p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground line-clamp-1 font-medium">{article.author}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary/60" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary/60" />
                        {article.readTime}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReadMore(article)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-all duration-200 group/btn"
                    >
                      {t("اقرأ المزيد", "Read More")}
                      <ReadMoreArrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}