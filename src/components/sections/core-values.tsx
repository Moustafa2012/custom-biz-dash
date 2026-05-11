import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { t } from "@/lib/translations"
import { coreValues } from "@/data/sections"

export default function CoreValues() {
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
    <section ref={ref} className="py-24 bg-transparent section-alt scroll-chapter-marker relative overflow-hidden">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-emerald-500/4 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("ما يميزنا", "What Drives Us")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("قيمنا", "Our Core")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("الأساسية", "Values")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("هذه المبادئ توجه كل ما نقوم به", "These principles guide everything we do")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + index * 120}ms` }}
            >
              <Card className="h-full bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="relative p-8">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 ring-1 ring-primary/10 group-hover:ring-primary/30">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{value.description}</p>

                  <ul className="space-y-3">
                    {value.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Card number watermark */}
                  <div className="absolute bottom-4 end-5 text-6xl font-black text-foreground/[0.03] select-none pointer-events-none">
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