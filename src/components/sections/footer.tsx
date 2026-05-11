import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react"
import logo from "@/assets/thouraya-logo.png"
import { t } from "@/lib/translations"
import { quickLinksConfig } from "@/data/navigation"
import { useLanguage } from "@/components/language-provider"
import {
  COMPANY_NAME_AR,
  COMPANY_NAME_EN,
  COMPANY_TAGLINE_AR,
  COMPANY_TAGLINE_EN,
  COMPANY_EMAIL,
  CONTACT_PHONE,
} from "@/data/constants"

export default function Footer() {
  const { direction } = useLanguage()
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight

  return (
    <footer className="relative bg-transparent border-t border-border/40 overflow-hidden">
      {/* Ambient top gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/4 w-80 h-64 bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/2 rounded-full blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.012] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={logo}
                  alt={t(COMPANY_NAME_AR, COMPANY_NAME_EN)}
                  className="relative h-10 w-10 rounded-xl object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">{t(COMPANY_NAME_AR, COMPANY_NAME_EN)}</h3>
                <p className="text-xs font-semibold text-primary">{t(COMPANY_TAGLINE_AR, COMPANY_TAGLINE_EN)}</p>
              </div>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t(
                "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام.",
                "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers."
              )}
            </p>
            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">1000+</span> {t("عميل راضٍ", "happy clients")}
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">{t("روابط سريعة", "Quick Links")}</h4>
            <ul className="space-y-2.5">
              {quickLinksConfig.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                  >
                    <ArrowIcon className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary shrink-0" />
                    {t(link.arabicLabel, link.englishLabel)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">{t("تواصل معنا", "Contact Us")}</h4>
            <ul className="space-y-3">
              {[
                { icon: Phone, content: <span dir="ltr" className="text-sm text-muted-foreground">{CONTACT_PHONE}</span> },
                { icon: Mail, content: <span dir="ltr" className="text-sm text-muted-foreground">{COMPANY_EMAIL}</span> },
                { icon: MapPin, content: <span className="text-sm text-muted-foreground">{t("جدة، حي البترومين", "Jeddah, Petromin District")}</span> },
                { icon: Clock, content: <span className="text-sm text-muted-foreground">{t("الأحد - الخميس: 9 ص - 5 م", "Sun - Thu: 9 AM - 5 PM")}</span> },
              ].map(({ icon: Icon, content }, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {content}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">{t("النشرة البريدية", "Newsletter")}</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t("اشترك للحصول على آخر التحديثات عن منتجاتنا وخدماتنا", "Subscribe to get the latest updates on our products and services")}
            </p>
            <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder={t("بريدك الإلكتروني", "Your email")}
                type="email"
                dir="ltr"
                className="h-10 bg-background/60 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/20 text-sm transition-all duration-200"
              />
              <Button
                size="sm"
                className="w-full h-10 font-semibold shadow-md shadow-primary/15 hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-300"
              >
                {t("اشترك الآن", "Subscribe Now")}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="mb-6 opacity-50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t("© 2026 جميع الحقوق محفوظة لشركة ثريا البلاد للتجارة", "© 2026 All rights reserved to Thuraya Albilad Trading Company")}</p>
          <div className="flex items-center gap-1">
            <a href="#" className="hover:text-primary transition-colors duration-200 px-2 py-1 rounded hover:bg-accent">
              {t("سياسة الخصوصية", "Privacy Policy")}
            </a>
            <span className="text-border">·</span>
            <a href="#" className="hover:text-primary transition-colors duration-200 px-2 py-1 rounded hover:bg-accent">
              {t("الشروط والأحكام", "Terms of Service")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}