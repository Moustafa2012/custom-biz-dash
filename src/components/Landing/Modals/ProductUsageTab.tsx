import { useAppConfig } from "@/components/erp/app-config";
import { MessageSquare } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t("Usage", "Usage")}</h3>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">{t("Common Uses", "Common Uses")}</h4>
        <ul className="space-y-2">
          {usage.primary.map((use, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-muted-foreground">
                {language === 'ar' ? usage.primary_ar[index] : use}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">{t("Pro Tip", "Pro Tip")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ar' ? usage.tip_ar : usage.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
