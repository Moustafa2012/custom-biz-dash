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
    <div className="space-y-6">
      {origin && (
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">{t("المنشأ", "Origin")}</h3>
            <p className="text-muted-foreground">
              {language === 'ar' ? originAr : origin}
            </p>
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">{t("الشهادات", "Certifications")}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {language === 'ar' ? certificationsAr?.[index] : cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h3 className="font-medium">{t("مدة الصلاحية", "Shelf Life")}</h3>
          <p className="text-muted-foreground">
            {language === 'ar' ? shelfLife.duration_ar : shelfLife.duration}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? shelfLife.note_ar : shelfLife.note}
          </p>
        </div>
      </div>

      {storage && (
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">{t("التخزين", "Storage")}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">{t("درجة الحرارة", "Temperature")}:</span> {storage.temperature}</p>
              <p><span className="font-medium">{t("الرطوبة", "Humidity")}:</span> {language === 'ar' ? storage.humidity_ar : storage.humidity}</p>
              <p>{language === 'ar' ? storage.instructions_ar : storage.instructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}