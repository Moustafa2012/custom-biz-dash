import { Button } from "@/components/ui/button";
import { useAppConfig } from "./app-config";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme, t } = useAppConfig();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
      onClick={toggleTheme}
      aria-label={t("تبديل المظهر", "Toggle theme")}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
