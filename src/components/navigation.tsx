import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Moon, Sun, Menu, Globe, X } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import logo from "@/assets/thouraya-logo.png"
import { NavUser } from "@/components/navigation/nav-user"
import { t } from "@/lib/translations"
import { navLinksConfig } from "@/data/navigation"
import { COMPANY_NAME_AR, COMPANY_NAME_EN } from "@/data/constants"

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeHash, setActiveHash] = useState("")

  // Create navLinks dynamically with translations
  const navLinks = navLinksConfig.map(link => ({
    ...link,
    label: t(link.arabicLabel, link.englishLabel)
  }))

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    setScrolled(scrollY > 16)
    const doc = document.documentElement
    const progress = (scrollY / (doc.scrollHeight - doc.clientHeight)) * 100
    setScrollProgress(Math.min(progress, 100))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const onHash = () => setActiveHash(window.location.hash)
    window.addEventListener("hashchange", onHash)
    setActiveHash(window.location.hash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/92 shadow-sm shadow-black/5 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent backdrop-blur-sm"
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-emerald-400 to-primary transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">

          {/* Logo */}
          <a
            href="#hero"
            className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
            aria-label={t(COMPANY_NAME_AR, COMPANY_NAME_EN)}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <img
                src={logo}
                alt=""
                className="relative h-8 w-8 rounded-xl object-contain sm:h-9 sm:w-9 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="max-w-[110px] truncate text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:max-w-none sm:text-lg">
              {t(COMPANY_NAME_AR, COMPANY_NAME_EN)}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <link.icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                    }`}
                  />
                  <span className="hidden xl:inline">{link.label}</span>

                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="hidden sm:block">
              <NavUser />
            </div>

            <div className="hidden sm:block h-5 w-px bg-border/60 mx-0.5" />

            {/* Language toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
              className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground sm:h-9 sm:w-auto sm:px-3 sm:gap-1.5"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs font-bold">
                {language === "ar" ? "EN" : "AR"}
              </span>
              <span className="sr-only">
                {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
              </span>
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
              aria-label={theme === "dark" ? t("الوضع الفاتح", "Light mode") : t("الوضع الداكن", "Dark mode")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side={language === "ar" ? "right" : "left"}
                className="w-[300px] border-border/50 bg-background/98 p-0 backdrop-blur-2xl sm:w-[340px]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                  <a href="#hero" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                    <img src={logo} alt="" className="h-8 w-8 rounded-xl object-contain" />
                    <span className="text-base font-bold text-foreground">{t(COMPANY_NAME_AR, COMPANY_NAME_EN)}</span>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Mobile navigation">
                    {navLinks.map((link) => {
                      const isActive = activeHash === link.href
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                              isActive
                                ? "bg-primary/15 text-primary"
                                : "bg-accent text-muted-foreground"
                            }`}
                          >
                            <link.icon className="h-4 w-4" />
                          </span>
                          <span>{link.label}</span>
                          {isActive && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                        </a>
                      )
                    })}
                  </nav>
                </div>

                {/* User & Actions */}
                <div className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
                  <div className="px-4 py-4">
                    <NavUser />
                  </div>

                  <div className="border-t border-border/40 px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLanguage}
                        className="flex-1 h-9 gap-2 rounded-xl border-border/50 text-xs font-semibold"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {language === "ar" ? "English" : "العربية"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="flex-1 h-9 gap-2 rounded-xl border-border/50 text-xs font-semibold"
                      >
                        {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                        {theme === "dark" ? t("فاتح", "Light") : t("داكن", "Dark")}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}