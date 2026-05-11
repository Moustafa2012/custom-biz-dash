import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="gap-2"
      title={language === "ar" ? "Switch to English" : "Switch to Arabic"}
    >
      <span className="font-bold">{language === "ar" ? "عربي" : "EN"}</span>
      <span className="text-muted-foreground">/</span>
      <span className="text-muted-foreground">{language === "ar" ? "EN" : "عربي"}</span>
    </Button>
  )
}
