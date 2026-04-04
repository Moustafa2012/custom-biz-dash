import { Button } from "@/components/ui/button";
import { useAppConfig } from "./app-config";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useAppConfig();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      aria-label={language === "en" ? "Switch to Arabic" : "التبديل للإنجليزية"}
    >
      <Globe className="h-4 w-4" />
    </Button>
  );
}
