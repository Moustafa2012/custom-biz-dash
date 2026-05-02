import { useAppConfig } from "@/components/erp/app-config";
import { Lightbulb, List } from "lucide-react";

interface ProductUsageTabProps {
  usage?: {
    primary: string[];
    primary_ar: string[];
    tip: string;
    tip_ar: string;
  };
}

export function ProductUsageTab({ usage }: ProductUsageTabProps) {
  const { t, language } = useAppConfig();

  if (!usage) return null;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2.5 pb-3 border-b border-border mb-3">
          <List className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("الاستخدامات الشائعة", "Common Uses")}
          </p>
        </div>
        <ul className="space-y-2">
          {usage.primary.map((use, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-foreground" />
              <span className="text-muted-foreground leading-relaxed">
                {language === "ar" ? usage.primary_ar[index] : use}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {t("نصيحة", "Pro Tip")}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {language === "ar" ? usage.tip_ar : usage.tip}
          </p>
        </div>
      </div>
    </div>
  );
}