import { Landmark } from "lucide-react";
import { EmptyState } from "../components/EmptyState";

export default function BankingDashboard() {
  return (
    <EmptyState
      icon={Landmark}
      titleAr="لوحة المعلومات البنكية"
      titleEn="Banking Dashboard"
      descriptionAr="ستظهر هنا الأرصدة والمعاملات الأخيرة عند توصيل الواجهة الخلفية."
      descriptionEn="Balances and recent activity will appear here once the backend is wired."
    />
  );
}
