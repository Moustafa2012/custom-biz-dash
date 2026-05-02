import { useAppConfig } from "@/components/erp/app-config";
import { TrendingUp } from "lucide-react";

interface ProductBenefitsTabProps {
  benefits?: string[];
  benefitsAr?: string[];
}

export function ProductBenefitsTab({ benefits, benefitsAr }: ProductBenefitsTabProps) {
  const { t, language } = useAppConfig();

  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("الفوائد", "Benefits")}
        </p>
      </div>

      <ul className="space-y-2.5">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <span className="shrink-0 w-5 h-5 rounded-full border border-border bg-background flex items-center justify-center text-[10px] font-bold text-muted-foreground mt-0.5">
              {index + 1}
            </span>
            <span className="text-sm text-foreground leading-relaxed">
              {language === "ar" ? benefitsAr?.[index] : benefit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}