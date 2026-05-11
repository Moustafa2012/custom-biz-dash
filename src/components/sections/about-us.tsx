import { useEffect, useRef, useState } from "react"
import { t } from "@/lib/translations"
import { Award, Users, Package } from "lucide-react"

const stats = [
  {
    icon: Award,
    value: "10+",
    label: t("سنوات خبرة", "Years of Experience"),
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-500",
    ringColor: "ring-amber-500/20",
  },
  {
    icon: Users,
    value: "1000+",
    label: t("عميل راضٍ", "Satisfied Customers"),
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500",
    ringColor: "ring-emerald-500/20",
  },
  {
    icon: Package,
    value: "50+",
    label: t("منتج متميز", "Quality Products"),
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    ringColor: "ring-primary/20",
  },
]

export function AboutUs() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 bg-transparent relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section label */}
        <div
          className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("تعرف علينا", "Who We Are")}
          </span>
        </div>

        {/* Heading */}
        <div
          className={`text-center mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
            {t("من نحن", "About")}{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                {t("نحن", "Us")}
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </span>
          </h2>
        </div>

        {/* Body text */}
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t(
              "نحن شركة رائدة في مجالنا، ملتزمون بتقديم أفضل الخدمات والمنتجات لعملائنا. بدأنا رحلتنا بهدف إحداث تغيير إيجابي في الصناعة، واليوم نفخر بثقة عملائنا وسمعتنا الممتازة.",
              "We are a leading company in our field, committed to providing the best services and products to our customers. We started our journey with the goal of making a positive change in the industry, and today we are proud of our customers' trust and our excellent reputation."
            )}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 ring-1 ${stat.ringColor} transition-all duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
              </div>

              {/* Value */}
              <div className="relative text-4xl font-black text-foreground mb-2 tracking-tight">
                {stat.value}
              </div>

              {/* Label */}
              <div className="relative text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-2/3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}