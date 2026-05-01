import type { LucideIcon } from "lucide-react";
import { useAppConfig } from "@/components/erp/app-config";

interface EmptyStateProps {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export function EmptyState({
  icon: Icon,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
}: EmptyStateProps) {
  const { t } = useAppConfig();

  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3 max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-2">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          {t(titleAr, titleEn)}
        </h2>
        {(descriptionAr || descriptionEn) && (
          <p className="text-sm text-muted-foreground">
            {t(descriptionAr ?? "", descriptionEn ?? "")}
          </p>
        )}
      </div>
    </div>
  );
}
