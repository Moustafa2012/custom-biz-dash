import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { t } from "@/lib/translations"
import { qualityStandards } from "@/data/sections"

export default function QualityStandards() {
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

  return (
    <section ref={ref} id="quality" className="py-24 bg-transparent scroll-chapter-marker relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-500/4 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("التميز في كل خطوة", "Excellence at Every Step")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("معايير", "Our Quality")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("الجودة", "Standards")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t(
              "نحن ملتزمون بالتميز في كل ما نقوم به. معايير الجودة لدينا توجه نهجنا لضمان تجاوز التوقعات باستمرار.",
              "We are committed to excellence in everything we do. Our quality standards guide our approach to ensure expectations are consistently exceeded."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {qualityStandards.map((item, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <Card className="h-full text-center bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative">
                {/* Hover bg */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="relative p-8">
                  {/* Icon ring */}
                  <div className="relative mx-auto mb-6 w-16 h-16">
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 ring-1 ring-primary/10 group-hover:ring-primary/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {/* Rotating ring decoration */}
                    <div className="absolute -inset-2 rounded-3xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_8s_linear_infinite]" />
                  </div>

                  <h3 className="text-base font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                  {/* Index watermark */}
                  <div className="absolute bottom-3 end-4 text-5xl font-black text-foreground/[0.03] select-none pointer-events-none">
                    {String(index + 1).padStart(2, "0")}
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