import { useAppConfig } from "@/components/erp/app-config";
import { MapPin, Shield, Award } from "lucide-react";

interface ProductDetailsTabProps {
  origin?: string;
  originAr?: string;
  certifications?: string[];
  certificationsAr?: string[];
  shelfLife: {
    duration: string;
    duration_ar: string;
    note: string;
    note_ar: string;
  };
  storage?: {
    temperature: string;
    humidity: string;
    humidity_ar: string;
    instructions: string;
    instructions_ar: string;
  };
}

export function ProductDetailsTab({
  origin,
  originAr,
  certifications,
  certificationsAr,
  shelfLife,
  storage,
}: ProductDetailsTabProps) {
  const { t, language } = useAppConfig();

  return (
    <div className="space-y-5">
      {origin && (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {t("المنشأ", "Origin")}
            </p>
            <p className="text-sm text-foreground font-medium">
              {language === "ar" ? originAr : origin}
            </p>
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {t("الشهادات", "Certifications")}
            </p>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {language === "ar" ? certificationsAr?.[index] : cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
          <Shield className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {t("مدة الصلاحية", "Shelf Life")}
          </p>
          <p className="text-sm text-foreground font-medium">
            {language === "ar" ? shelfLife.duration_ar : shelfLife.duration}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === "ar" ? shelfLife.note_ar : shelfLife.note}
          </p>
        </div>
      </div>

      {storage && (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
            <Shield className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {t("التخزين", "Storage")}
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-20 shrink-0">
                  {t("الحرارة", "Temp")}
                </span>
                <span className="text-foreground font-medium">{storage.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-20 shrink-0">
                  {t("الرطوبة", "Humidity")}
                </span>
                <span className="text-foreground font-medium">
                  {language === "ar" ? storage.humidity_ar : storage.humidity}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-2 pt-2 border-t border-border">
                {language === "ar" ? storage.instructions_ar : storage.instructions}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}