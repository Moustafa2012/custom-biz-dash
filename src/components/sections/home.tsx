import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  ShieldCheck,
  Star,
  BarChart3,
} from "lucide-react"

import heroBg from "@/assets/hero-bg.jpg"
import heroVideo from "@/assets/hero-video.mp4"

import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"

import { heroStats } from "@/data/hero"
import {
  COMPANY_NAME_AR,
  COMPANY_NAME_EN,
  COMPANY_TAGLINE_AR,
  COMPANY_TAGLINE_EN,
} from "@/data/constants"

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 1800, start = false): number {
  const [value, setValue] = useState<number>(0)
  useEffect(() => {
    if (!start) return
    const end = target
    const startTime = performance.now()
    let raf: number
    const tick = (now: number): void => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased * 10) / 10)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return value
}

/* ─── Mini sparkline ─── */
interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

function Sparkline({ data, color = "#22c55e", height = 40 }: SparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120
  const pts = data.map((v: number, i: number) => {
    const x = (i / (data.length - 1)) * w
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width={w} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${w},${height}`}
        fill="url(#sg)"
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        fill={color}
      />
    </svg>
  )
}

/* ─── Stat card ─── */
interface HeroStat {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label: string
  trend?: number[]
}

interface StatCardProps {
  stat: HeroStat
  visible: boolean
  className?: string
}

function StatCard({ stat, visible, className }: StatCardProps) {
  const rawNum = parseFloat(String(stat.value).replace(/[^0-9.]/g, ""))
  const suffix = String(stat.value).replace(/[0-9.]/g, "")
  const isFloat = String(stat.value).includes(".")
  const count = useCounter(rawNum, 1600, visible)
  const display = isFloat ? count.toFixed(1) : Math.round(count)

  return (
    <div className={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] px-15 py-2 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl hover:shadow-black/30 w-full ${className || ""}`}>
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/25">
          <stat.icon className="h-5 w-5" />
        </div>

        {/* Value */}
        <div className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          {visible ? display : 0}{suffix}
        </div>

        {/* Label */}
        <div className="mt-1.5 text-xs font-medium leading-tight text-white/55 sm:text-sm">
          {stat.label}
        </div>

        {/* Sparkline */}
        {stat.trend && (
          <div className="mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkline data={stat.trend} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Dashboard card (right panel) ─── */
interface DashboardRowProps {
  label: string
  sub: string
  pct: number
  delay: number
}

function DashboardRow({ label, sub, pct, delay }: DashboardRowProps) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setW(pct), 600 + delay)
    return () => clearTimeout(timer)
  }, [pct, delay])

  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4 transition-all duration-300 hover:border-white/15 hover:bg-black/30">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/90">{label}</div>
          <div className="mt-0.5 text-xs text-white/45">{sub}</div>
        </div>
        <div className="shrink-0 rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
          {pct}%
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 transition-all duration-1000 ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  )
}

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const { direction } = useLanguage()

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowVideo(true), 1800),
      setTimeout(() => setIsLoaded(true), 100),
      setTimeout(() => setStatsVisible(true), 900),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const ArrowIcon = useMemo(() =>
    direction === "rtl" ? ArrowLeft : ArrowRight
  , [direction])

  const dashRows = [
    { label: t("القمح والحبوب", "Wheat & Grains"), sub: t("تصدير شهري", "Monthly Export"), pct: 87 },
    { label: t("الزيوت النباتية", "Vegetable Oils"), sub: t("نمو ربع سنوي", "Quarterly Growth"), pct: 74 },
    { label: t("البقوليات", "Legumes & Pulses"), sub: t("توزيع عالمي", "Global Distribution"), pct: 91 },
  ]

  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative isolate min-h-screen overflow-hidden bg-transparent"
    >
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 select-none" aria-hidden>
        {/* Static image */}
        <img
          src={heroBg}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[2000ms] ease-in-out will-change-transform ${
            showVideo ? "scale-105 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {/* Video */}
        {showVideo && (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-[1200ms]"
          />
        )}

        {/* Base overlay — layered for richness */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Accent glow */}
        <div className="absolute top-0 right-0 h-[55vh] w-[55vw] bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.18),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 h-[45vh] w-[45vw] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_55%)]" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* ── AMBIENT BLOBS ── */}
      <div aria-hidden className="pointer-events-none">
        <div className="absolute top-16 left-8 h-64 w-64 rounded-full bg-primary/15 blur-[80px] animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-[60px] animate-[pulse_6s_ease-in-out_1s_infinite]" />
        <div className="absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-[70px] animate-[pulse_5s_ease-in-out_2s_infinite]" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-5 sm:px-6 lg:items-stretch lg:justify-center lg:px-8 text-center lg:text-left">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] xl:gap-20">

          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Badge */}
            <div
              className={`transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-9 opacity-0"
              }`}
            >
              <Badge
                variant="secondary"
                className="mb-5 inline-flex w-fit items-center gap-3 rounded-md border border-white/15 bg-white/8 px-8 py-4 text-lg font-semibold uppercase tracking-widest text-white/90 shadow-lg backdrop-blur-2xl transition-all duration-300 hover:bg-white/15 text-center"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary ring-2 ring-primary/30 animate-pulse" />
                {t("شريكك الموثوق في تجارة المواد الغذائية", "Your Trusted Partner in Global Agricultural Trade")}
              </Badge>
            </div>

            {/* Heading */}
            <div
              className={`transition-all duration-700 delay-[80ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-9 opacity-0"
              }`}
            >
              <h1 className="max-w-3xl text-[clamp(2.6rem,6vw,4rem)] font-bold leading-[1.04] tracking-tight text-white text-center lg:text-start">
                <span>
                  {t(COMPANY_NAME_AR, COMPANY_NAME_EN)}{" "}
                  <span className="bg-gradient-to-r from-primary via-emerald-300 to-emerald-100 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    {t(COMPANY_TAGLINE_AR, COMPANY_TAGLINE_EN)}
                  </span>
                </span>
              </h1>
            </div>

            {/* Divider */}
            <div
              className={`mt-8 flex justify-center transition-all duration-700 delay-[160ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-700 delay-[200ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 text-justify">
                {t(
                  "حلول مبتكرة مصممة خصيصاً لتلبية احتياجاتك. نجمع بين الخبرة والتكنولوجيا المتقدمة لتقديم نتائج استثنائية في تجارة واستيراد المواد الغذائية حول العالم.",
                  "Innovative solutions tailored to your needs. We combine expertise with cutting-edge technology to deliver exceptional results in global food trading and import operations."
                )}
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`mt-9 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-[300ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              } lg:justify-start`}
            >
              <Button
                size="lg"
                asChild
                className="group h-12 rounded-xl px-7 text-sm font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-primary/40 hover:shadow-2xl"
              >
                <a href="#products">
                  {t("تصفح المنتجات", "Browse Products")}
                  <ArrowIcon className="ms-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl border-white/20 bg-white/8 px-7 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:bg-white/15 hover:text-white hover:border-white/30"
              >
                <a href="#contact">
                  {t("تواصل معنا", "Contact Us")}
                </a>
              </Button>

            </div>

            {/* Trust line */}
            <div
              className={`mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 transition-all duration-700 delay-[380ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              } lg:justify-start`}
            >
              {[
                { icon: ShieldCheck, label: t("موثوق به", "ISO Certified") },
                { icon: Globe, label: t("50+ دولة", "50+ Countries") },
                { icon: Star, label: t("4.9 تقييم", "4.9 Rating") },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-white/50 justify-center lg:justify-start">
                  <Icon className="h-3.5 w-3.5 text-primary/80" />
                  {label}
                </span>
              ))}
            </div>

            {/* Stats grid */}
            <div
              ref={statsRef}
              className={`mt-12 gap-3 transition-all duration-700 delay-[500ms] ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.75rem'
              }}
              // Responsive grid using inline styles
              data-grid-responsive="true"
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="sm:hidden lg:hidden">
                <StatCard stat={heroStats[0]} visible={statsVisible} />
                <StatCard stat={heroStats[1]} visible={statsVisible} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="sm:hidden lg:hidden">
                <StatCard stat={heroStats[2]} visible={statsVisible} />
              </div>
             
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN ══════════ */}
          <div
            className={`hidden lg:block transition-all duration-1000 delay-[350ms] ${
              isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Main glass panel */}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                {/* Header */}
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <div className="mt-1.5 text-xl font-bold text-white text-start">
                      {t("نظرة عامة", "Global Overview")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-white/40">{t("مباشر", "Live")}</span>
                  </div>
                </div>

                {/* KPI row */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    { label: t("الإيرادات", "Revenue"), value: "$4.2M", delta: "+12%" },
                    { label: t("الطلبات", "Orders"), value: "1,847", delta: "+8%" },
                    { label: t("العملاء", "Clients"), value: "320+", delta: "+5%" },
                  ].map(({ label, value, delta }) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-center">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">{label}</div>
                      <div className="mt-1 text-base font-black text-white text-center">{value}</div>
                      <div className="mt-0.5 text-[10px] font-semibold text-emerald-400 text-center">{delta}</div>
                    </div>
                  ))}
                </div>

                {/* Progress rows */}
                <div className="space-y-3">
                  {dashRows.map((row, i) => (
                    <DashboardRow key={i} {...row} delay={i * 150} />
                  ))}
                </div>

                {/* Bottom sparkline summary */}
                <div className="mt-5 flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                  <div>
                    <div className="text-xs text-white/45 text-center">{t("النمو السنوي", "Annual Growth")}</div>
                    <div className="mt-0.5 text-2xl font-black text-primary">+48%</div>
                  </div>
                  <Sparkline data={[30, 38, 35, 50, 45, 60, 70, 65, 80, 88, 82, 95]} color="#22c55e" height={44} />
                </div>
              </div>

            
              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-5 -left-5 z-10 rounded-2xl border border-white/15 bg-background/85 px-4 py-3 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <BarChart3 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("رضا العملاء", "Client Satisfaction")}
                    </div>
                    <div className="text-sm font-bold text-foreground text-center">98.4%</div>
                  </div>
                </div>
              </div>

              {/* Decorative ring */}
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] border border-white/[0.04]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLL CTA ── */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <a
          href="#products"
          className="group flex flex-col items-center gap-2 text-white/40 transition-colors duration-300 hover:text-white/80"
          aria-label="Scroll to products"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">Scroll</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <div className="h-1.5 w-1 rounded-full bg-current animate-[bounce_1.5s_ease-in-out_infinite]" />
          </div>
        </a>
      </div>

      {/* ── BOTTOM FADE ── */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" aria-hidden />
    </section>
  )
}