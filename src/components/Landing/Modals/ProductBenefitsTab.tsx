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
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t("الفوائد", "Benefits")}</h3>
      </div>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span className="text-muted-foreground">
              {language === 'ar' ? benefitsAr?.[index] : benefit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}