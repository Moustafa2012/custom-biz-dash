import { BarChart3 } from "lucide-react";
import { EmptyState } from "../components/EmptyState";

export default function BankingReports() {
  return (
    <EmptyState
      icon={BarChart3}
      titleAr="تقارير الأعمال البنكية"
      titleEn="Banking Reports"
      descriptionAr="ستتوفر التقارير عند توصيل البيانات."
      descriptionEn="Reports become available once data is connected."
    />
  );
}
