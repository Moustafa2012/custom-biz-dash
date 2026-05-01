import { Warehouse } from "lucide-react";
import { EmptyState } from "@/features/banking/components/EmptyState";

export default function WarehouseDashboard() {
  return (
    <EmptyState
      icon={Warehouse}
      titleAr="لوحة المستودع"
      titleEn="Warehouse Dashboard"
      descriptionAr="ستظهر هنا مؤشرات المخزون والحركات عند توصيل الواجهة الخلفية."
      descriptionEn="Stock KPIs and recent movements will appear here once the backend is wired."
    />
  );
}
