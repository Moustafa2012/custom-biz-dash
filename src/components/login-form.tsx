import { useState, useEffect, useRef } from "react"
import {
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight,
  Globe, Check, AlertCircle, User, Sparkles
} from "lucide-react"
import { t } from "@/lib/translations"

// ── helpers ──────────────────────────────────────────────────────────────────

const cn = (...classes: (string | undefined | boolean | null)[]) => classes.filter(Boolean).join(" ")

function getPasswordStrength(pw: string) {
  if (!pw) return { score: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: t("ضعيف", "Weak"),   color: "bg-rose-500"   },
    { label: t("متوسط", "Fair"),   color: "bg-amber-500"  },
    { label: t("جيد", "Good"),   color: "bg-sky-500"    },
    { label: t("قوي", "Strong"), color: "bg-emerald-500"},
  ]
  return { score, ...map[score - 1] ?? { label: "", color: "" } }
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── sub-components ────────────────────────────────────────────────────────────

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl animate-pulse [animation-delay:1.5s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
    </div>
  )
}

function BrandMark() {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/30">
        <Shield className="h-[18px] w-[18px] text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-semibold tracking-tight text-slate-800 dark:text-white">{t("ثريا البلاد", "Thouraya Albilad")}</p>
        <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{t("آمن·موثوق", "Secure·Trusted")}</p>
      </div>
    </div>
  )
}

function TabSwitcher({ activeTab, onChange }: { activeTab: string; onChange: (tab: string) => void }) {
  return (
    <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60">
      {["login", "signup"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-lg py-2 text-[13px] font-medium transition-all duration-200",
            activeTab === tab
              ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          {tab === "login" ? t("تسجيل الدخول", "Sign in") : t("إنشاء حساب", "Create account")}
        </button>
      ))}
    </div>
  )
}

function SocialButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function FieldInput({
  id, label, type = "text", placeholder, value, onChange,
  icon: Icon, rightSlot, hint, error, autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: any;
  rightSlot?: React.ReactNode;
  hint?: string;
  error?: boolean | string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12.5px] font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "h-[42px] w-full rounded-xl border bg-slate-50 pl-9 pr-4 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200",
            "dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500",
            "focus:bg-white focus:ring-2 focus:ring-primary/20 dark:focus:bg-slate-800",
            error
              ? "border-rose-400 focus:border-rose-500 dark:border-rose-500/50"
              : "border-slate-200 focus:border-primary dark:border-slate-700 dark:focus:border-primary/60",
            rightSlot ? "pr-10" : ""
          )}
        />
        {rightSlot && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
      {hint && (
        <p className={cn("font-mono text-[11px]", error ? "text-rose-500" : "text-emerald-500")}>
          {hint}
        </p>
      )}
    </div>
  )
}

function StrengthMeter({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-all duration-300",
              i <= score ? color : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>
      <p className={cn("font-mono text-[11px]", color.replace("bg-", "text-"))}>{label}</p>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="flex animate-in fade-in slide-in-from-top-2 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[13px] text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
      <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
      {message}
    </div>
  )
}

function RememberMe({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-left"
    >
      <span className={cn(
        "flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-md border transition-all duration-200",
        checked
          ? "border-primary bg-primary dark:border-primary dark:bg-primary"
          : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
      )}>
        {checked && <Check className="h-[10px] w-[10px] text-white" strokeWidth={3} />}
      </span>
      <span className="text-[13px] text-slate-500 dark:text-slate-400">
        {t("تذكرني لمدة 30 يومًا", "Keep me signed in for 30 days")}
      </span>
    </button>
  )
}

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 animate-in zoom-in-50 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/30 duration-500">
        <Check className="h-8 w-8 text-white" strokeWidth={2.5} />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{t("تم بنجاح!", "You're in!")}</h2>
        <p className="text-[13.5px] text-slate-500 dark:text-slate-400">{t("جاري التوجيه إلى لوحة التحكم...", "Redirecting to your dashboard…")}</p>
      </div>
      <div className="mt-1 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

export function LoginForm({ onSuccess, className }: { onSuccess?: (data: any) => void; className?: string }) {
  const [tab, setTab] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [tab])

  const handleTabChange = (next: string) => {
    setTab(next)
    setError("")
    setForm({ name: "", email: "", password: "" })
    setEmailTouched(false)
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError("")
  }

  const emailValid = validateEmail(form.email)
  const emailHint = emailTouched && form.email
    ? emailValid ? t("✓ بريد إلكتروني صالح", "✓ Valid email address") : t("أدخل بريدًا إلكترونيًا صالحًا", "Enter a valid email")
    : ""
  const emailError = emailTouched && form.email && !emailValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.email) { setError(t("الرجاء إدخال عنوان البريد الإلكتروني.", "Please enter your email address.")); return }
    if (!emailValid) { setError(t("الرجاء إدخال عنوان بريد إلكتروني صالح.", "Please enter a valid email address.")); return }
    if (!form.password) { setError(t("الرجاء إدخال كلمة المرور.", "Please enter your password.")); return }
    if (tab === "signup" && form.password.length < 6) {
      setError(t("يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "Password must be at least 6 characters.")); return
    }
    if (tab === "signup" && !form.name.trim()) {
      setError(t("الرجاء إدخال الاسم الكامل.", "Please enter your full name.")); return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setSuccess(true)
    onSuccess?.({ tab, ...form, remember })
  }

  const eyeIcon = showPw
    ? <EyeOff className="h-4 w-4" strokeWidth={2} />
    : <Eye className="h-4 w-4" strokeWidth={2} />

  return (
    <div className={cn(
      "relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-background shadow-2xl shadow-slate-900/10",
      "dark:border-slate-700/60 dark:bg-background dark:shadow-slate-900/60",
      className
    )}>
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-emerald-500 to-primary" />

      <FloatingOrbs />

      <div className="relative z-10 p-7">
        {success ? (
          <SuccessScreen />
        ) : (
          <>
            <BrandMark />
            <TabSwitcher activeTab={tab} onChange={handleTabChange} />

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-[1.35rem] font-bold tracking-tight text-slate-800 dark:text-white">
                {tab === "login" ? t("مرحباً بعودتك", "Welcome back") : t("إنشاء حساب", "Create account")}
              </h1>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                {tab === "login"
                  ? t("سجل دخولك للوصول إلى حسابك", "Sign in to your account to continue")
                  : t("انضم إلى آلاف العملاء", "Join thousands of customers using Thouraya Albilad")}
              </p>
            </div>

            {/* Social buttons */}
            <div className="mb-4 flex gap-2">
              <SocialButton
                icon={Globe}
                label={t("جوجل", "Google")}
                onClick={() => setError(t("تسجيل الدخول عبر جوجل غير متاح في هذه النسخة التجريبية.", "Google login is not configured in this demo."))}
              />
              <SocialButton
                icon={User}
                label={t("جيت هب", "GitHub")}
                onClick={() => setError(t("تسجيل الدخول عبر جيت هب غير متاح في هذه النسخة التجريبية.", "GitHub login is not configured in this demo."))}
              />
            </div>

            {/* Divider */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/60" />
              <span className="font-mono text-[11px] text-slate-400">{t("أو تابع باستخدام البريد الإلكتروني", "or continue with email")}</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/60" />
            </div>

            {/* Error */}
            <div className="mb-3">
              <ErrorBanner message={error} />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name (signup) */}
              {tab === "signup" && (
                <FieldInput
                  id="name"
                  label={t("الاسم الكامل", "Full name")}
                  placeholder={t("أدخل اسمك الكامل", "Your full name")}
                  value={form.name}
                  onChange={set("name")}
                  icon={User}
                  autoComplete="name"
                  rightSlot={undefined}
                  hint={undefined}
                  error={undefined}
                />
              )}

              {/* Email */}
              <FieldInput
                id="email"
                label={t("البريد الإلكتروني", "Email address")}
                type="email"
                placeholder={t("أدخل بريدك الإلكتروني", "you@example.com")}
                value={form.email}
                onChange={(e) => { set("email")(e); setEmailTouched(true) }}
                icon={Mail}
                hint={emailHint}
                error={emailError}
                autoComplete="email"
                rightSlot={undefined}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[12.5px] font-medium text-slate-600 dark:text-slate-400">
                    {t("كلمة المرور", "Password")}
                  </label>
                  {tab === "login" && (
                    <button
                      type="button"
                      className="text-[12px] text-primary hover:text-primary/80"
                    >
                      {t("نسيت كلمة المرور؟", "Forgot password?")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Lock className="h-[15px] w-[15px]" strokeWidth={2} />
                  </span>
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder={tab === "login" ? t("أدخل كلمة المرور", "Enter your password") : t("اختر كلمة مرور قوية", "Choose a strong password")}
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    className={cn(
                      "h-[42px] w-full rounded-xl border bg-slate-50 pl-9 pr-10 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200",
                      "dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500",
                      "border-slate-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20",
                      "dark:border-slate-700 dark:focus:border-primary/60 dark:focus:bg-slate-800"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors duration-200 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
                  >
                    {eyeIcon}
                  </button>
                </div>
                {tab === "signup" && <StrengthMeter password={form.password} />}
              </div>

              {/* Remember me */}
              {tab === "login" && (
                <RememberMe checked={remember} onChange={() => setRemember((v) => !v)} />
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "group relative mt-1 flex h-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl",
                  "bg-gradient-to-r from-primary to-emerald-600 text-[14px] font-semibold text-white",
                  "shadow-lg shadow-primary/30 transition-all duration-200",
                  "hover:shadow-primary/45 hover:-translate-y-0.5 hover:shadow-xl",
                  "active:translate-y-0 active:shadow-md",
                  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                )}
              >
                {/* shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {tab === "login" ? t("جاري تسجيل الدخول...", "Signing in…") : t("جاري إنشاء الحساب...", "Creating account…")}
                  </>
                ) : (
                  <>
                    {tab === "login" ? t("تسجيل الدخول", "Sign in") : t("إنشاء حساب", "Create account")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-5 text-center text-[12.5px] text-slate-500 dark:text-slate-400">
              {tab === "login" ? t("ليس لديك حساب؟", "Don't have an account?") : t("لديك حساب بالفعل؟", "Already have an account?")} {" "}
              <button
                type="button"
                onClick={() => handleTabChange(tab === "login" ? "signup" : "login")}
                className="font-medium text-primary hover:text-primary/80"
              >
                {tab === "login" ? t("إنشاء حساب مجاني", "Create one free") : t("تسجيل الدخول", "Sign in")}
              </button>
            </p>

            {/* Trust badges */}
            <div className="mt-5 flex items-center justify-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              {[
                { icon: Shield, text: t("تشفير 256-بت", "256-bit SSL") },
                { icon: Sparkles, text: t("معتمد SOC 2 النوع الثاني", "SOC 2 Type II") },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Icon className="h-3 w-3" strokeWidth={2} />
                  {text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}