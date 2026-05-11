import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Moon, Sun, Globe, Type, LayoutDashboard, ChevronRight } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title?: string
  icon?: React.ReactNode
}

export function AppHeader({ title }: AppHeaderProps) {
  const { direction, language, toggleLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState(16)

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0])
    document.documentElement.style.fontSize = `${value[0]}px`
  }

  return (
    <header className={cn(
      "flex h-(--header-height) shrink-0 items-center gap-2",
      "border-b border-border/40",
      "bg-background/80 backdrop-blur-xl",
      "transition-all duration-300 ease-out",
      "group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    )}>
      <div className="relative flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-5">

        {/* Sidebar trigger */}
        <SidebarTrigger className={cn(
          "h-8 w-8 rounded-[calc(var(--radius)*0.8)]",
          "text-muted-foreground/60",
          "transition-all duration-150",
          "hover:bg-muted hover:text-foreground hover:scale-105",
          "active:scale-95"
        )} />

        <Separator
          orientation="vertical"
          className="mx-1.5 data-[orientation=vertical]:h-4 opacity-40"
        />

        {/* Breadcrumb title */}
        {title && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <LayoutDashboard className="h-3.5 w-3.5 opacity-50" />
            <ChevronRight className="h-2.5 w-2.5 opacity-30" />
            <span className="text-[13px] font-semibold tracking-tight text-foreground/85">
              {title}
            </span>
            {/* Live status indicator */}
            <span className="relative flex h-1.5 w-1.5 ms-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          </div>
        )}

        {/* Push controls to the end */}
        <div className={cn(
          "flex items-center gap-1",
          direction === "rtl" ? "mr-auto" : "ml-auto"
        )}>

          {/* Font size control */}
          <div className={cn(
            "hidden md:flex items-center gap-2",
            "h-8 px-2.5 rounded-[calc(var(--radius)*0.8)]",
            "border border-border/40 bg-muted/40",
            "transition-colors duration-150 hover:border-border/70"
          )}>
            <Type className="h-3 w-3 text-muted-foreground/70 shrink-0" />
            <Slider
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              min={12}
              max={20}
              step={1}
              className="w-[72px]"
              aria-label={t("حجم الخط", "Font Size")}
            />
            <span className="text-[11px] font-semibold tabular-nums text-muted-foreground min-w-[16px] text-center">
              {fontSize}
            </span>
          </div>

          <div className="w-px h-4 bg-border/40 mx-0.5" />

          {/* Language toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            className={cn(
              "group h-8 rounded-[calc(var(--radius)*0.8)]",
              "text-muted-foreground/60",
              "transition-all duration-150",
              "hover:bg-muted hover:text-foreground hover:scale-[1.03]",
              "active:scale-[0.94]",
              "sm:w-auto sm:px-2.5 sm:gap-1.5"
            )}
          >
            <Globe className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-150">
              {language === "ar" ? "EN" : "AR"}
            </span>
            <span className="sr-only">
              {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            </span>
          </Button>

          <div className="w-px h-4 bg-border/40 mx-0.5" />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "relative h-8 w-8 rounded-[calc(var(--radius)*0.8)]",
              "text-muted-foreground/60 overflow-hidden",
              "transition-all duration-150",
              "hover:bg-muted hover:text-foreground",
              "active:scale-95"
            )}
            aria-label={theme === "dark" ? t("الوضع الفاتح", "Light mode") : t("الوضع الداكن", "Dark mode")}
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}