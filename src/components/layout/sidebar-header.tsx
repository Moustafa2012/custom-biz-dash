import { t } from "@/lib/translations"
import { useLanguage } from "@/components/language-provider"
import { SidebarHeader as ShadcnSidebarHeader } from "@/components/ui/sidebar"
import thourayaLogo from "@/assets/thouraya-logo.png"

export function SidebarHeader() {
  const { direction } = useLanguage()

  return (
    <ShadcnSidebarHeader className="
      bg-muted/20 relative overflow-hidden
    ">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-3 px-4 py-3">
        <div className={`
          relative flex h-10 w-10 items-center justify-center shrink-0
          rounded-md bg-background/80 backdrop-blur-sm
          ring-1 ring-primary/20
          transition-all duration-300
          hover:bg-primary/10 hover:ring-primary/30
          hover:shadow-[0_0_16px_hsl(var(--primary)/0.18)]
          ${direction === "rtl" ? "order-last" : ""}
        `}>
          <img 
            src={thourayaLogo} 
            alt="Thouraya Albilad Logo"
            className="h-7 w-7 object-contain transition-transform duration-300 hover:scale-105"
          />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-background shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
        </div>

        <div className={`min-w-0 flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
          <h2 className="text-sm font-semibold tracking-tight text-foreground leading-tight">
            {t("لوحة التحكم", "Dashboard")}
          </h2>
          <p className="text-[11px] text-muted-foreground/60 leading-tight mt-0.5 truncate">
            {t("نظام إدارة ثريا البلاد", "Thouraya Albilad")}
          </p>
        </div>
      </div>
    </ShadcnSidebarHeader>
  )
}