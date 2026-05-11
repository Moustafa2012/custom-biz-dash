import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { t } from "@/lib/translations"
import { successGoalsConfig } from "@/data/sections"

export default function SuccessStory() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // Create successGoals dynamically with translations
  const successGoals = successGoalsConfig.map(goal => ({
    icon: goal.icon,
    title: t(goal.arabicTitle, goal.englishTitle),
    desc: t(goal.arabicDesc, goal.englishDesc)
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="about" className="py-24 bg-transparent scroll-chapter-marker relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/4 left-0 w-96 h-72 bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-500/4 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("رحلة النجاح", "Our Journey")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("قصة", "Our Success")}
            </span>{" "}
            {t("نجاحنا", "Story")}
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-3xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t(
              "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام.",
              "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {successGoals.map((goal, i) => (
            <div
              key={i}
              className={`group transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <Card className="h-full bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden relative">
                {/* Hover bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="relative p-7">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 ring-1 ring-primary/10 group-hover:ring-primary/25">
                    <goal.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{goal.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{goal.desc}</p>

                  {/* Number watermark */}
                  <div className="absolute bottom-3 end-4 text-6xl font-black text-foreground/[0.03] select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
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