import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/features/banking/components/EmptyState";

export default function WarehouseReports() {
  return (
    <EmptyState
      icon={BarChart3}
      titleAr="تقارير المستودع"
      titleEn="Warehouse Reports"
      descriptionAr="ستتوفر التقارير عند توصيل البيانات."
      descriptionEn="Reports become available once data is connected."
    />
  );
}
